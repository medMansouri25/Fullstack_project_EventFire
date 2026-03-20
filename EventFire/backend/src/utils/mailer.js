const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendConfirmationEmail(toEmail, toName, event, places) {
  const prixTotal = (event.prix * places).toLocaleString('fr-FR');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
      <div style="background:#22c55e;padding:24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;">🎟️ Réservation confirmée !</h1>
      </div>
      <div style="padding:28px;">
        <p style="font-size:15px;">Bonjour <strong>${toName || toEmail}</strong>,</p>
        <p>Votre réservation a bien été enregistrée. Voici le récapitulatif :</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tr style="background:#f9fafb;">
            <td style="padding:10px 14px;font-weight:bold;border:1px solid #e5e7eb;">Événement</td>
            <td style="padding:10px 14px;border:1px solid #e5e7eb;">${event.titre}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;font-weight:bold;border:1px solid #e5e7eb;">Date</td>
            <td style="padding:10px 14px;border:1px solid #e5e7eb;">${event.date} à ${event.heure}</td>
          </tr>
          <tr style="background:#f9fafb;">
            <td style="padding:10px 14px;font-weight:bold;border:1px solid #e5e7eb;">Lieu</td>
            <td style="padding:10px 14px;border:1px solid #e5e7eb;">${event.lieu}, ${event.ville}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;font-weight:bold;border:1px solid #e5e7eb;">Places réservées</td>
            <td style="padding:10px 14px;border:1px solid #e5e7eb;">${places}</td>
          </tr>
          <tr style="background:#f9fafb;">
            <td style="padding:10px 14px;font-weight:bold;border:1px solid #e5e7eb;">Prix total</td>
            <td style="padding:10px 14px;border:1px solid #e5e7eb;color:#22c55e;font-weight:bold;">${prixTotal} €</td>
          </tr>
        </table>
        <p style="color:#6b7280;font-size:13px;">Merci de présenter cet email à l'entrée.</p>
        <p style="color:#6b7280;font-size:13px;">— L'équipe EventFire</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"EventFire" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `✅ Confirmation — ${event.titre}`,
    html,
  });
}

module.exports = { sendConfirmationEmail };
