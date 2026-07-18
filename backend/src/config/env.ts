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
} as const;
