import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import studentRoutes from './routes/studentRoutes';
import courseRoutes from './routes/courseRoutes';

const app = express();

// CORS allows the React app (local Vite and/or Render UI) to call this API.
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (Postman, server health checks) with no Origin.
      if (!origin || env.clientOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'API is healthy', data: { status: 'ok' } });
});

// Friendly root so Render/browser checks on "/" are not a bare 404.
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'CampusLedger Student Management API',
    data: {
      health: '/api/health',
      auth: '/api/auth',
      students: '/api/students',
      courses: '/api/courses',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);

app.use(errorHandler);

export default app;
