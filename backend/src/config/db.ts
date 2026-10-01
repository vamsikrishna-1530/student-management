import mongoose from 'mongoose';
import { env } from './env';

// Database connection is isolated in config so the rest of the app
// never hard-codes the MongoDB URI. Switching environments only
// requires changing .env — no code changes.
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    console.error(
      'Check Render env var MONGODB_URI: Atlas username/password, URL-encode special characters in the password, and allow network access 0.0.0.0/0.'
    );
    process.exit(1);
  }
};
