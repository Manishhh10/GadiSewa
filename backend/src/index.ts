import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { connectDB } from './config/db';
import routes from './routes';
import { errorHandler, notFound } from './middlewares/error.middleware';

const app = express();

// --- Global middleware ---
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes (mounted under /api) ---
app.use('/api', routes);

// --- Error handling ---
app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`🚀  GadiSewa API running on http://localhost:${env.PORT}`);
  });
}

start();
