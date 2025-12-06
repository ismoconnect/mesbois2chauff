const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try {
    const { orderId, status, customer } = req.body || {};
    const toEmail = (customer && customer.email) || '';
    if (!toEmail) return res.status(400).json({ error: 'Missing customer email' });

    // Read and trim env
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
      host,
      port,
      secure,
      auth: { user: smtpUser, pass: smtpPass },
      tls: { servername: host }
    });

    try {
      await transporter.verify();
    } catch (err) {
      return res.status(500).json({ error: 'SMTP verify failed', detail: String(err && err.message || '') });
    }

    const toName = [customer?.firstName, customer?.lastName].filter(Boolean).join(' ').trim() || 'Client';
    const brand = (process.env.FROM_NAME || 'Jeferco').trim();
    const shortId = (orderId || '').toString().replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8);
    let statusText = 'En cours';
    switch (status) {
      case 'pending': statusText = 'En attente'; break;
      case 'processing': statusText = 'En cours de préparation'; break;
      case 'shipped': statusText = 'Expédiée'; break;
      case 'delivered': statusText = 'Livrée'; break;
      case 'cancelled': statusText = 'Annulée'; break;
      default: statusText = status || 'Mis à jour';
    }

    // Sujet et paragraphes dédiés selon le statut
    const shownId = shortId ? `#${shortId}` : (orderId ? `#${orderId}` : '');
    let subject = `${brand} — Mise à jour de votre commande ${shortId ? `#${shortId}` : ''}`;
    let leadLine = `Le statut de votre commande ${shownId} a été mis à jour : ${statusText}.`;
    let detailLine = 'Nous vous tiendrons informé des prochaines étapes.';

    if (status === 'processing') {
      subject = `${brand} — Confirmation de paiement ${shortId ? `#${shortId}` : ''}`;
      leadLine = `Nous avons bien reçu votre paiement pour la commande ${shownId}.`;
      detailLine = 'Votre colis est en cours de préparation et sera expédié prochainement. Délais de livraison estimés : 2 à 5 jours selon l’adresse de livraison. Nous livrons partout en France. Vous pouvez suivre l’évolution de la livraison de votre achat depuis votre espace client.';
    } else if (status === 'shipped') {
      subject = `${brand} — Confirmation d'expédition ${shortId ? `#${shortId}` : ''}`;
      leadLine = `Votre colis lié à la commande ${shownId} a été expédié.`;
      detailLine = 'Il est en cours d’acheminement vers l’adresse de livraison indiquée. Délais de livraison estimés : 2 à 5 jours selon l’adresse de livraison. Vous pouvez suivre l’évolution de la livraison de votre achat depuis votre espace client.';
    } else if (status === 'delivered') {
      subject = `${brand} — Confirmation de livraison ${shortId ? `#${shortId}` : ''}`;
      leadLine = `Nous vous informons que la commande ${shownId} a été livrée.`;
      detailLine = 'Nous espérons que tout est conforme à vos attentes.';
    } else if (status === 'cancelled') {
      subject = `${brand} — Confirmation d'annulation ${shortId ? `#${shortId}` : ''}`;
      leadLine = `Votre commande ${shownId} a été annulée.`;
      detailLine = 'Si vous n’êtes pas à l’origine de cette demande, merci de nous contacter.';
    }

    const text = [
      `Bonjour ${toName},`,
      '',
      leadLine,
      detailLine,
      '',
      'Pour toute question, vous pouvez répondre à cet e-mail.',
      '',
      'Cordialement,',
      `Service ${brand}`
    ].join('\n');

    const html = `
      <div style="font-family: Inter, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; background:#f6f7f9; padding:24px;">
        <table role="presentation" style="max-width:620px; margin:0 auto; width:100%; background:#ffffff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.05); overflow:hidden;">
          <tr>
            <td style="padding:20px 24px; border-bottom:1px solid #eef1f4;">
              <div style="font-weight:800; font-size:18px; color:#2c5530;">${brand}</div>
              <div style="font-size:12px; color:#6b7280; margin-top:4px;">${subject}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 12px 0; color:#101828; font-size:16px;">Bonjour <strong>${toName}</strong>,</p>
              <p style="margin:0 0 12px 0; color:#344054; font-size:14px; line-height:1.6;">${leadLine.replace(shownId, `<span style=\"font-weight:700;\">${shownId}</span>`)}</p>
              <div style="margin:16px 0 20px 0; display:inline-block; padding:10px 14px; border-radius:999px; background:#eef8f0; color:#14532d; font-weight:700; font-size:13px;">${statusText}</div>
              <p style="margin:0 0 16px 0; color:#344054; font-size:14px; line-height:1.6;">${detailLine}</p>
              <p style="margin:20px 0 0 0; color:#101828; font-size:14px; font-weight:700;">Cordialement,<br/>Service ${brand}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px; background:#f9fafb; border-top:1px solid #eef1f4;">
              <div style="font-size:12px; color:#6b7280;">Vous recevez cet e-mail car vous avez une commande en cours chez ${brand}.</div>
            </td>
          </tr>
        </table>
      </div>`;

    await transporter.sendMail({
      from: `${brand} <${process.env.FROM_EMAIL || smtpUser}>`,
      to: toEmail,
      bcc: process.env.NOTIFY_EMAIL || undefined,
      subject,
      text,
      html
    });

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'send failed', detail: String(e && e.message || '') });
  }
}
