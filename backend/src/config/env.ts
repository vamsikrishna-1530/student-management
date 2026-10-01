import dotenv from 'dotenv';

// Load environment variables once at startup so every module
// can read process.env without importing dotenv individually.
dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5001,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_management',
  jwtSecret: process.env.JWT_SECRET || 'fallback_dev_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
