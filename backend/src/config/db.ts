import mongoose from 'mongoose';
import { env } from './env';

/**
 * Connects to MongoDB via Mongoose. Exits the process on failure so the
 * server never starts in a half-broken state.
 */
export async function connectDB(): Promise<void> {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.MONGO_URI);
    console.log('✅  MongoDB connected');
  } catch (error) {
    console.error('❌  MongoDB connection failed:', error);
    process.exit(1);
  }
}
