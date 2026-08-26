import { Redis } from '@upstash/redis';

export const config = {
  runtime: 'edge',
};

export default async function handler() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  let isLockdown = true;

  if (url && token) {
    try {
      const redis = new Redis({ url, token });
      const val = await redis.get<boolean | string>('site_lockdown_enabled');
      if (val !== null && val !== undefined) {
        isLockdown = val === true || val === 'true' || val === '1';
      }
    } catch (e) {
      console.error('Error fetching lockdown state for robots.txt:', e);
    }
  }

  const content = isLockdown
    ? 'User-agent: *\nDisallow: /\n'
    : 'User-agent: *\nAllow: /\n';

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'CDN-Cache-Control': 'no-store',
      'Vercel-CDN-Cache-Control': 'no-store',
    },
  });
}
