import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { syncOrgShowcase } from './ensureSeed';

/**
 * Usage:
 *   npm run seed           → upsert official org data, remove stray test users
 *   npm run seed:reset     → wipe DB and install only official org showcase
 */
const main = async () => {
  const reset = process.argv.includes('--reset');
  await connectDB();
  const result = await syncOrgShowcase({ reset });
  console.log(JSON.stringify(result, null, 2));
  await mongoose.disconnect();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
