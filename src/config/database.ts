import { Pool } from 'pg';
import 'dotenv/config';
import { env } from './env';

export const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});
pool.on('error', (err) => {
  console.error('Database error:', err);
});
