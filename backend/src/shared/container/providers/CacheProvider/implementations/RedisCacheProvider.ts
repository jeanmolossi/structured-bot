import Redis, { Redis as RedisClient } from 'ioredis';

import cacheConfig from '@config/cache';

import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save<T>(key: string, value: T): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(key, `SAVE KEY ${key}`);
    this.client.set(key, JSON.stringify(value), 'EX', 900); // 10 SECONDS // 15 minutos -> 900
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    const parsedData = JSON.parse(data) as T;
    // eslint-disable-next-line no-console
    console.log(parsedData, `RECOVER DATA key ${key}`);
    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);

    const pipeline = this.client.pipeline();

    keys.forEach(key => pipeline.del(key));

    await pipeline.exec();
  }

  public async clearCache(): Promise<void> {
    await this.client.flushall();
    console.log('Cache cleared');
  }
}
