const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

let appInited = false;
function initAdmin() {
  if (appInited) return;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin env vars');
  }
  // Vercel stores private keys with escaped newlines sometimes
  privateKey = privateKey.replace(/\\n/g, '\n');
  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey })
  });
  appInited = true;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    initAdmin();

    const db = admin.firestore();
    const now = Date.now();
    const sixHoursMs = 6 * 60 * 60 * 1000;
    const cutoff = new Date(now - sixHoursMs);

    // Query orders awaiting payment or pending created before cutoff
    const statuses = ['awaiting_payment', 'pending'];

    const toRemind = [];
    for (const st of statuses) {
      const snap = await db.collection('orders')
        .where('status', '==', st)
        .where('createdAt', '<=', admin.firestore.Timestamp.fromDate(cutoff))
        .limit(100)
        .get();
      snap.forEach(doc => {
        const data = doc.data() || {};
        // skip if reminded recently (<6h)
        const last = data.lastReminderAt?.toDate?.() || null;
        if (!last || (now - last.getTime()) >= sixHoursMs) {
          toRemind.push({ id: doc.id, data });
        }
      });
    }

    if (toRemind.length === 0) {
      return res.status(200).json({ ok: true, reminded: 0 });
    }

    // Prepare SMTP transporter
    const host = (process.env.SMTP_HOST || '').trim();
    const port = Number((process.env.SMTP_PORT || '587').toString().trim());
    const secure = Boolean(
      String(process.env.SMTP_SECURE).trim() === 'true' ||
      process.env.SMTP_SECURE === true ||
      String(process.env.SMTP_PORT || '').trim() === '465' ||
      port === 465
    );
    const smtpUser = (process.env.SMTP_USER || '').trim();
    const smtpPass = (process.env.SMTP_PASS || '').trim();
    if (!host || !smtpUser || !smtpPass) {
      return res.status(500).json({ error: 'SMTP env missing' });
    }
    const transporter = nodemailer.createTransport({
      host, port, secure, auth: { user: smtpUser, pass: smtpPass }, tls: { servername: host }
    });
    await transporter.verify();

    const brand = (process.env.FROM_NAME || 'Jeferco').trim();

    let count = 0;
    for (const { id, data } of toRemind) {
      const ci = data.customerInfo || {};
      const toEmail = (ci.email || '').trim();
      if (!toEmail) continue;

      const shortId = id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8);
      const toName = [ci.firstName, ci.lastName].filter(Boolean).join(' ').trim() || 'Client';

      const subject = `${brand} — Rappel: paiement en attente ${shortId ? `#${shortId}` : ''}`;
      const text = [
        `Bonjour ${toName},`,
        '',
        `Votre commande ${shortId ? `#${shortId}` : ''} est en attente de paiement.`,
        'Merci d’effectuer le règlement afin que nous puissions lancer la préparation et l’expédition.',
        'Délais de livraison estimés : 2 à 5 jours selon l’adresse de livraison (livraison partout en France).',
        'Vous pouvez suivre l’évolution depuis votre espace client.',
        '',
        'Cordialement,',
        `Service ${brand}`
      ].join('\n');

      const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f7f9;padding:24px;">
        <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.06);overflow:hidden;">
          <div style="padding:20px 24px;border-bottom:1px solid #eef1f4;">
            <div style="font-weight:800;font-size:18px;color:#2c5530;">${brand}</div>
            <div style="font-size:12px;color:#6b7280;margin-top:4px;">${subject}</div>
          </div>
          <div style="padding:24px;">
            <p style="margin:0 0 12px 0;color:#101828;font-size:16px;">Bonjour <strong>${toName}</strong>,</p>
            <p style="margin:0 0 12px 0;color:#344054;font-size:14px;">Votre commande <strong>#${shortId}</strong> est en attente de paiement.</p>
            <p style="margin:0 0 12px 0;color:#344054;font-size:14px;">Merci d’effectuer le règlement afin que nous puissions lancer la préparation et l’expédition.</p>
            <p style="margin:0 0 12px 0;color:#344054;font-size:14px;">Délais de livraison estimés : 2 à 5 jours selon l’adresse de livraison (livraison partout en France).</p>
            <p style="margin:0 0 0 0;color:#344054;font-size:14px;">Vous pouvez suivre l’évolution depuis votre espace client.</p>
            <p style="margin:20px 0 0 0;color:#101828;font-size:14px;font-weight:700;">Cordialement,<br/>Service ${brand}</p>
          </div>
          <div style="padding:16px 24px;background:#fafbfc;border-top:1px solid #eef1f4;font-size:12px;color:#6b7280;">
            <div>Vous recevez ce rappel car votre commande est en attente de paiement.</div>
          </div>
        </div>
      </div>`;

      try {
        await transporter.sendMail({
          from: `${brand} <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
          to: toEmail,
          bcc: process.env.NOTIFY_EMAIL || undefined,
          subject,
          text,
          html,
        });
        count++;
        await db.collection('orders').doc(id).set({
          lastReminderAt: admin.firestore.FieldValue.serverTimestamp(),
          reminderCount: (data.reminderCount || 0) + 1,
        }, { merge: true });
      } catch (e) {
        // continue with next
      }
    }

    return res.status(200).json({ ok: true, reminded: count });
  } catch (e) {
    return res.status(500).json({ error: 'cron failed', detail: String(e && e.message || '') });
  }
}
