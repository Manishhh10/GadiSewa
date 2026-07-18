import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralised, typed access to environment variables.
 * Everything has a sensible local-development default.
 */
export const env = {
  PORT: Number(process.env.PORT ?? 5001),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  MONGO_URI: process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/gadisewa',
  JWT_SECRET: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  JWT_EXPIRES_IN_SECONDS: Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 60 * 60 * 24 * 7),
  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:3000',
  // The backend's own publicly-reachable base URL — eSewa redirects the browser here.
  API_BASE_URL: process.env.API_BASE_URL ?? `http://localhost:${Number(process.env.PORT ?? 5001)}`,

  // eSewa ePay v2 — UAT/sandbox test merchant by default (safe, no real money).
  ESEWA_MERCHANT_CODE: process.env.ESEWA_MERCHANT_CODE ?? 'EPAYTEST',
  ESEWA_SECRET_KEY: process.env.ESEWA_SECRET_KEY ?? '8gBm/:&EnhH.1/q',
  ESEWA_FORM_URL:
    process.env.ESEWA_FORM_URL ?? 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',

  // SMTP — used for password-reset / OTP emails.
  SMTP_HOST: process.env.SMTP_HOST ?? '',
  SMTP_PORT: Number(process.env.SMTP_PORT ?? 587),
  SMTP_USER: process.env.SMTP_USER ?? '',
  SMTP_PASS: process.env.SMTP_PASS ?? '',
  SMTP_FROM: process.env.SMTP_FROM ?? '',
} as const;
