import { Redis } from '@upstash/redis';

// Support both Vercel KV and Upstash Redis environment variables
const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;

if (redisUrl && redisToken) {
  redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });
}

// In-memory fallback for local dev / unconfigured environments
const memoryStore = new Map<string, { value: any; expiry?: number }>();

const LOCKDOWN_KEY = 'site_lockdown_enabled';

export async function getLockdownState(): Promise<boolean> {
  if (redis) {
    try {
      const val = await redis.get<boolean | string>(LOCKDOWN_KEY);
      if (val === null || val === undefined) {
        // Default to true (locked down) if never configured
        return true;
      }
      return val === true || val === 'true' || val === '1';
    } catch (err) {
      console.error('Failed to get lockdown state from Redis, falling back to memory/default:', err);
    }
  }

  const mem = memoryStore.get(LOCKDOWN_KEY);
  if (mem !== undefined) {
    return Boolean(mem.value);
  }
  return true; // Default to locked down
}

export async function setLockdownState(enabled: boolean): Promise<boolean> {
  if (redis) {
    try {
      await redis.set(LOCKDOWN_KEY, enabled);
      return true;
    } catch (err) {
      console.error('Failed to set lockdown state in Redis:', err);
    }
  }

  memoryStore.set(LOCKDOWN_KEY, { value: enabled });
  return true;
}

export async function checkRateLimit(
  ip: string,
  maxAttempts: number = 5,
  windowSeconds: number = 900 // 15 minutes
): Promise<{ allowed: boolean; remaining: number; resetSeconds: number }> {
  const key = `ratelimit:login:${ip || 'unknown'}`;
  const now = Date.now();

  if (redis) {
    try {
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, windowSeconds);
      }
      const ttl = await redis.ttl(key);
      const remaining = Math.max(0, maxAttempts - current);
      return {
        allowed: current <= maxAttempts,
        remaining,
        resetSeconds: ttl > 0 ? ttl : windowSeconds,
      };
    } catch (err) {
      console.error('Redis rate limit check failed, using fallback:', err);
    }
  }

  // In-memory rate limiting fallback
  const entry = memoryStore.get(key);
  if (!entry || (entry.expiry && entry.expiry < now)) {
    memoryStore.set(key, { value: 1, expiry: now + windowSeconds * 1000 });
    return { allowed: true, remaining: maxAttempts - 1, resetSeconds: windowSeconds };
  }

  entry.value += 1;
  const resetSeconds = Math.ceil(((entry.expiry || now) - now) / 1000);
  const remaining = Math.max(0, maxAttempts - entry.value);
  return {
    allowed: entry.value <= maxAttempts,
    remaining,
    resetSeconds: Math.max(0, resetSeconds),
  };
}
