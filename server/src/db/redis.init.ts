import Redis from "ioredis"

const redisConfig = {
  port: Number(process.env.REDIS_PORT) || 6379,
  host: process.env.REDIS_HOST || '127.0.0.1',
  maxRetriesPerRequest: null,
};

export const redisConnection = new Redis(redisConfig);

