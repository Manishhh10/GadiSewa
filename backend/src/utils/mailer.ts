import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    })
  : null;

/** Send an email. If SMTP isn't configured, logs to the console instead (dev fallback). */
export async function sendMail(to: string, subject: string, html: string): Promise<void> {
  if (!transporter) {
    console.log(`\n📧  [dev mode — no SMTP configured] Email to ${to}\nSubject: ${subject}\n${html}\n`);
    return;
  }

  try {
    await transporter.sendMail({
      from: env.SMTP_FROM || env.SMTP_USER,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err);
    throw err;
  }
}
