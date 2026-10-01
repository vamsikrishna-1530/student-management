import dotenv from 'dotenv';

// Load environment variables once at startup so every module
// can read process.env without importing dotenv individually.
dotenv.config();

// CLIENT_URL may be a single origin or comma-separated list for prod + local.
// Default includes GitHub Pages origin used by the Actions publish workflow.
const rawClientUrl =
  process.env.CLIENT_URL ||
  'http://localhost:5173,https://vamsikrishna-1530.github.io';

export const env = {
  port: Number(process.env.PORT) || 5001,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_management',
  jwtSecret: process.env.JWT_SECRET || 'fallback_dev_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: rawClientUrl,
  clientOrigins: rawClientUrl.split(',').map((o) => o.trim()).filter(Boolean),
};
