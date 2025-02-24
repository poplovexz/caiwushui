import Redis from 'ioredis';
import { logger } from './logger';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined');
}

const redis = new Redis(process.env.REDIS_URL);

redis.on('error', (error) => {
  logger.error('Redis connection error:', error);
});

redis.on('connect', () => {
  logger.info('Redis connected successfully');
});

// 缓存键前缀
export const CACHE_KEYS = {
  ENTERPRISE: 'enterprise:',
  ENTERPRISE_LIST: 'enterprise:list',
} as const;

// 缓存过期时间（秒）
export const CACHE_TTL = {
  ENTERPRISE: 3600, // 1小时
  ENTERPRISE_LIST: 1800, // 30分钟
} as const;

// 获取带前缀的缓存键
export const getCacheKey = (prefix: string, key: string) => `${prefix}${key}`;

export { redis };
