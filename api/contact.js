import nodemailer from 'nodemailer'

const SMTP_USER = 'graphicianstudios@gmail.com'
const TO_EMAIL = 'Graphicianstudios@gmail.com'

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

async function readRequestBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') return JSON.parse(req.body)

  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }

  const rawBody = Buffer.concat(chunks).toString('utf8')
  return rawBody ? JSON.parse(rawBody) : {}
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return sendJson(res, 405, { error: 'Method not allowed' })
  }

  const smtpPassword = process.env.GMAIL_SMTP_PASS

  if (!smtpPassword) {
    return sendJson(res, 500, { error: 'Gmail SMTP password is not configured' })
  }

  try {
    const { name = '', email = '', subject = '', message = '' } = await readRequestBody(req)

    if (!name || !email || !subject || !message) {
      return sendJson(res, 400, { error: 'Name, email, subject, and message are required' })
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: smtpPassword,
      },
    })

    await transporter.verify()

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeSubject = escapeHtml(subject)
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${safeSubject}</title>
  </head>
  <body style="margin:0; padding:0; background:#050505; font-family:Arial, Helvetica, sans-serif; color:#ffffff;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050505; padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; background:#111111; border:1px solid rgba(255,255,255,0.16); border-radius:20px; overflow:hidden;">
            <tr>
              <td style="padding:28px 30px; background:linear-gradient(135deg,#ed1d24 0%,#111111 58%,#000000 100%);">
                <div style="display:inline-block; padding:8px 12px; background:#ed1d24; color:#ffffff; font-size:20px; line-height:1; font-weight:800; letter-spacing:-0.02em;">GRAPHICIAN</div>
                <div style="display:inline-block; padding:8px 0 8px 8px; color:#ffffff; font-size:20px; line-height:1; font-weight:800;">STUDIOS</div>
                <p style="margin:14px 0 0; color:rgba(255,255,255,0.82); font-size:13px; letter-spacing:0.12em; text-transform:uppercase;">New Website Enquiry</p>
                <h1 style="margin:12px 0 0; color:#ffffff; font-size:28px; line-height:1.18; font-weight:700;">Contact Form Submission</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 30px 8px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding:16px 0; border-bottom:1px solid rgba(255,255,255,0.12);">
                      <div style="color:#ed1d24; font-size:12px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase;">Name</div>
                      <div style="margin-top:7px; color:#ffffff; font-size:18px; line-height:1.45; font-weight:700;">${safeName}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 0; border-bottom:1px solid rgba(255,255,255,0.12);">
                      <div style="color:#ed1d24; font-size:12px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase;">Email</div>
                      <div style="margin-top:7px; color:#ffffff; font-size:16px; line-height:1.45;"><a href="mailto:${safeEmail}" style="color:#ffffff; text-decoration:none;">${safeEmail}</a></div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 0; border-bottom:1px solid rgba(255,255,255,0.12);">
                      <div style="color:#ed1d24; font-size:12px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase;">Subject</div>
                      <div style="margin-top:7px; color:#ffffff; font-size:18px; line-height:1.45; font-weight:700;">${safeSubject}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 0 8px;">
                      <div style="color:#ed1d24; font-size:12px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase;">Message</div>
                      <div style="margin-top:10px; padding:18px; background:#050505; border:1px solid rgba(255,255,255,0.12); border-radius:14px; color:rgba(255,255,255,0.9); font-size:15px; line-height:1.65;">${safeMessage}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 30px 30px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:rgba(237,29,36,0.12); border:1px solid rgba(237,29,36,0.3); border-radius:14px;">
                  <tr>
                    <td style="padding:16px 18px; color:rgba(255,255,255,0.78); font-size:13px; line-height:1.55;">
                      Reply directly to this email to respond to <strong style="color:#ffffff;">${safeName}</strong>.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

    await transporter.sendMail({
      from: `"Graphician Studios Website" <${SMTP_USER}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject,
      html,
      text: [
        'New Website Enquiry',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        '',
        'Message:',
        message,
      ].join('\n'),
    })

    return sendJson(res, 200, { ok: true })
  } catch (error) {
    console.error('Gmail SMTP send failed', {
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response,
    })
    return sendJson(res, 500, { error: 'Email could not be sent' })
  }
}
