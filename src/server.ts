import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';

import { pool } from './config/database';
import { env } from './config/env';
import profileRoutes from './routes/profile.routes';

pool.connect();
const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/profiles', profileRoutes);

// errors
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
});

const server = app.listen(env.PORT, () => {
  console.log(`Server running on https://localhost:${env.PORT}`);
});

const shutdown = async () => {
  console.log('\nShutting down gracefully...');
  await pool.end();
  server.close();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
