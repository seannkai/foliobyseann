import { Redis } from '@upstash/redis';
import { compareSync } from 'bcrypt-ts';

export const config = {
  runtime: 'edge',
};

const SESSION_COOKIE_NAME = 'panel_session';
const SESSION_MAX_AGE_SECONDS = 86400; // 24 hours

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD_HASH || 'fallback-secret';
}

async function signHMAC(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function createSessionToken(): Promise<string> {
  const timestamp = Date.now().toString();
  const nonce = crypto.randomUUID ? crypto.randomUUID().replace(/-/g, '') : Math.random().toString(36).substring(2);
  const payload = `${timestamp}.${nonce}`;
  const secret = getSessionSecret();
  const signature = await signHMAC(payload, secret);
  return `${payload}.${signature}`;
}

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return new Redis({ url, token });
  }
  return null;
}

const memoryStore = new Map<string, { count: number; expiry: number }>();

async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const key = `ratelimit:login:${ip}`;
  const redis = getRedis();
  if (redis) {
    try {
      const count = await redis.incr(key);
      if (count === 1) {
        await redis.expire(key, 900);
      }
      const ttl = await redis.ttl(key);
      return {
        allowed: count <= 5,
        remaining: Math.max(0, 5 - count),
        reset: ttl > 0 ? ttl : 900,
      };
    } catch (e) {
      console.error('Redis rate limit error:', e);
    }
  }

  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || entry.expiry < now) {
    memoryStore.set(key, { count: 1, expiry: now + 900000 });
    return { allowed: true, remaining: 4, reset: 900 };
  }
  entry.count += 1;
  const reset = Math.ceil((entry.expiry - now) / 1000);
  return {
    allowed: entry.count <= 5,
    remaining: Math.max(0, 5 - entry.count),
    reset: Math.max(0, reset),
  };
}

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const forwarded = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    const rateLimit = await checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Too many failed login attempts. Please wait 15 minutes before trying again.',
          retryAfter: rateLimit.reset,
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const { password } = body;
    if (!password || typeof password !== 'string') {
      return new Response(JSON.stringify({ error: 'Password is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const storedHash = process.env.ADMIN_PASSWORD_HASH;
    if (!storedHash) {
      console.error('ADMIN_PASSWORD_HASH environment variable is not configured');
      return new Response(
        JSON.stringify({ error: 'Server configuration error: ADMIN_PASSWORD_HASH is missing in Vercel.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Compare with Edge-native bcrypt-ts
    const isValid = compareSync(password, storedHash);
    if (!isValid) {
      return new Response(
        JSON.stringify({
          error: `Invalid password. (${rateLimit.remaining} attempts remaining)`,
          remainingAttempts: rateLimit.remaining,
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const token = await createSessionToken();
    const isProd = process.env.NODE_ENV === 'production' || request.url.startsWith('https:');
    const cookieHeader = `${SESSION_COOKIE_NAME}=${token}; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; HttpOnly; ${
      isProd ? 'Secure;' : ''
    } SameSite=Strict`;

    return new Response(
      JSON.stringify({ success: true, message: 'Authenticated successfully' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookieHeader,
        },
      }
    );
  } catch (err: any) {
    console.error('Login error:', err);
    return new Response(
      JSON.stringify({ error: err?.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
