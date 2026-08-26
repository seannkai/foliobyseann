import { Redis } from '@upstash/redis';

export function getRedisClient(): Redis | null {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.VERCEL_KV_REST_API_URL;

  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.VERCEL_KV_REST_API_TOKEN;

  if (url && token) {
    return new Redis({ url, token });
  }
  return null;
}

const LOCKDOWN_KEY = 'site_lockdown_enabled';

export async function readLockdownState(): Promise<{ isLockdown: boolean; hasStorage: boolean }> {
  const redis = getRedisClient();
  if (redis) {
    try {
      const val = await redis.get<any>(LOCKDOWN_KEY);
      if (val !== null && val !== undefined) {
        const isEnabled = val === true || val === 'true' || val === '1' || val === 1;
        return { isLockdown: isEnabled, hasStorage: true };
      }
      // If key does not exist yet in Redis, default to true
      return { isLockdown: true, hasStorage: true };
    } catch (err) {
      console.error('Redis read error:', err);
    }
  }
  return { isLockdown: true, hasStorage: false };
}

export async function writeLockdownState(enabled: boolean): Promise<{ success: boolean; hasStorage: boolean }> {
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set(LOCKDOWN_KEY, enabled ? 'true' : 'false');
      return { success: true, hasStorage: true };
    } catch (err) {
      console.error('Redis write error:', err);
      return { success: false, hasStorage: true };
    }
  }
  return { success: true, hasStorage: false };
}
