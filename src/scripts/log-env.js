import 'dotenv/config';

const config = {
  timestamp: new Date().toISOString(),
  level: 'info',
  message: 'Enviorment variables loaded',
  env: {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 3000),
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
  },
};

console.log(JSON.stringify(config, null, 2));