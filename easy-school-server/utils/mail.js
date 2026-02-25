import nodemailer from 'nodemailer';

function isTestMode() {
  return String(process.env.EMAIL_TEST_MODE || '').toLowerCase() === 'true';
}

function hasEmailConfig() {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
}

export async function sendVerificationEmail(email, code) {
  try {
    if (isTestMode() || !hasEmailConfig()) {
      console.log(`[TEST EMAIL] Verification code for ${email}: ${code}`);
      return { ok: true, mode: 'test' };
    }

    const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const port = Number(process.env.EMAIL_PORT || 587);
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Twoj kod weryfikacyjny Easy School',
      html: `<p>Twoj kod weryfikacyjny: <strong>${code}</strong></p>`
    });

    return { ok: true, mode: 'smtp' };
  } catch (error) {
    console.error('Email send error:', error);
    console.log(`[FALLBACK CODE] Verification code for ${email}: ${code}`);
    return { ok: false, error, fallbackCodeLogged: true };
  }
}