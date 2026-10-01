import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import studentRoutes from './routes/studentRoutes';
import courseRoutes from './routes/courseRoutes';

const app = express();

// CORS allows the React Vite app (different port) to call this API.
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'API is healthy', data: { status: 'ok' } });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);

app.use(errorHandler);

export default app;
