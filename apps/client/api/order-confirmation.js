const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try {
    const { orderId, total, items, customer, newUser } = req.body || {};
    if (!customer?.email) {
      res.status(400).json({ error: 'Missing customer email' });
      return;
    }

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
      return res.status(500).json({ error: 'SMTP env missing', detail: { host: !!host, user: !!process.env.SMTP_USER, pass: !!process.env.SMTP_PASS } });
    }
    let transporter;
    try {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user: smtpUser, pass: smtpPass },
        tls: { servername: host }
      });
      await transporter.verify();
    } catch (err) {
      const msg = String(err && err.message || 'verify failed');
      console.error('SMTP verify failed (env host):', host, msg);
      return res.status(500).json({ error: 'SMTP verify failed', detail: msg, host });
    }

    const toName = [customer.firstName, customer.lastName].filter(Boolean).join(' ').trim() || 'Client';
    const brand = (process.env.FROM_NAME || 'Jeferco').trim();
    const shortId = (orderId || '').toString().replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8);
    const subject = `${brand} — Confirmation de commande ${shortId ? `#${shortId}` : ''}`.trim();

    const itemLines = Array.isArray(items)
      ? items.map((it) => `- ${it.name || 'Article'} x${it.quantity || 1} — ${(Number(it.price) || 0).toFixed(2)}€`).join('\n')
      : '';

    const addrParts = [customer.address, customer.postalCode, customer.city, customer.country].filter(Boolean);
    const phone = customer.phone ? `Téléphone: ${customer.phone}` : '';

    const intro = newUser
      ? `Merci pour votre commande et bienvenue chez ${brand}.`
      : `Merci pour votre commande et votre fidélité.`;

    const text = [
      `Bonjour ${toName},`,
      '',
      intro,
      shortId ? `Numéro de commande: #${shortId}` : '',
      '',
      itemLines ? 'Détails de votre commande :' : '',
      itemLines,
      '',
      `Total TTC: ${(Number(total) || 0).toFixed(2)}€`,
      addrParts.length ? '' : '',
      addrParts.length ? 'Adresse de livraison :' : '',
      addrParts.length ? addrParts.join(', ') : '',
      phone,
      '',
      `Nous vous enverrons un e-mail dès que votre colis sera expédié. Délais de livraison estimés : 2 à 5 jours selon l’adresse de livraison. Nous livrons partout en France. Vous pouvez suivre l’évolution de la livraison de votre achat depuis votre espace client. Pour toute question, répondez à cet e-mail.`,
      '',
      'Cordialement,',
      `Service ${brand}`
    ].filter(Boolean).join('\n');

    const rowsHtml = Array.isArray(items)
      ? items.map((it) => {
          const q = Number(it.quantity) || 1;
          const p = Number(it.price) || 0;
          return `
            <tr>
              <td style="padding:8px 12px;border-bottom:1px solid #eee;">${(it.name || 'Article')}</td>
              <td style=\"padding:8px 12px;border-bottom:1px solid #eee;text-align:center;\">${q}</td>
              <td style=\"padding:8px 12px;border-bottom:1px solid #eee;text-align:right;\">${p.toFixed(2)}€</td>
            </tr>`;
        }).join('')
      : '';

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#111;background:#f6f7f9;padding:24px;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.06);overflow:hidden;">
          <div style="padding:24px 24px 12px;border-bottom:1px solid #f0f0f0;background:#fafbfc;">
            <div style="font-weight:800; font-size:18px; color:#2c5530;">${brand}</div>
            <h1 style="margin:6px 0 0;font-size:18px;color:#2c5530;">Confirmation de commande ${shortId ? `#${shortId}` : ''}</h1>
            <p style="margin:6px 0 0;color:#555;font-size:14px;">${intro}</p>
          </div>
          <div style="padding:20px 24px;">
            <h2 style="margin:0 0 12px 0;font-size:16px;color:#2c5530;">Récapitulatif</h2>
            <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;font-size:14px;">
              <thead>
                <tr>
                  <th align="left" style="padding:8px 12px;border-bottom:2px solid #e5e7eb;color:#333;font-weight:600;">Article</th>
                  <th align="center" style="padding:8px 12px;border-bottom:2px solid #e5e7eb;color:#333;font-weight:600;">Qté</th>
                  <th align="right" style="padding:8px 12px;border-bottom:2px solid #e5e7eb;color:#333;font-weight:600;">Prix</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
                <tr>
                  <td colspan="2" style="padding:12px 12px;text-align:right;font-weight:700;color:#2c5530;">Total TTC</td>
                  <td style="padding:12px 12px;text-align:right;font-weight:700;color:#2c5530;">${(Number(total) || 0).toFixed(2)}€</td>
                </tr>
              </tbody>
            </table>

            ${(addrParts.length || phone) ? `
              <div style=\"margin-top:16px;padding:12px;border:1px solid #eef2f7;border-radius:8px;background:#fafbfd;\">
                <div style=\"font-size:14px;color:#2c5530;font-weight:700;margin-bottom:6px;\">Adresse de livraison</div>
                <div style=\"font-size:14px;color:#333;\">${addrParts.join(', ')}</div>
                ${phone ? `<div style=\\"font-size:14px;color:#333;margin-top:4px;\\">${phone}</div>` : ''}
              </div>` : ''}

            <p style="font-size:14px;color:#444;margin:18px 0 0;">
              Nous vous informerons par e-mail dès l'expédition. Délais de livraison estimés : 2 à 5 jours selon l’adresse de livraison. Nous livrons partout en France. Vous pouvez suivre l’évolution de la livraison de votre achat depuis votre espace client. Pour toute question, il suffit de répondre à ce message.
            </p>
          </div>

          <div style="padding:16px 24px;background:#fafbfc;border-top:1px solid #f0f0f0;font-size:12px;color:#6b7280;">
            <div>${brand} — Service Client</div>
          </div>
        </div>
      </div>`;

    await transporter.sendMail({
      from: `${brand} <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: customer.email,
      bcc: process.env.NOTIFY_EMAIL || undefined,
      subject,
      text,
      html,
    });

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error('order-confirmation error:', e && e.message);
    res.status(500).json({ error: 'Email send failed', detail: e && e.message });
  }
}
