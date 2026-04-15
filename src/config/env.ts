import 'dotenv/config';

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env variable: ${key}`);
  return value;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parseInt(process.env.PORT ?? '5000'),

  // Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432'),
  DB_NAME: requireEnv('DB_NAME'),
  DB_USER: requireEnv('DB_USER'),
  DB_PASSWORD: requireEnv('DB_PASSWORD'),

  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS ?? '12'),
} as const;
