import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { ensureSeedData } from './utils/ensureSeed';

const start = async () => {
  await connectDB();
  // First deploy against an empty Atlas DB gets demo users automatically.
  await ensureSeedData();
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
};

start();
