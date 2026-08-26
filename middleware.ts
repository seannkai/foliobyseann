import { Redis } from '@upstash/redis';

const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;
if (redisUrl && redisToken) {
  redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });
}

// Bot / scraper detection pattern
const BOT_USER_AGENTS =
  /bot|spider|crawl|scraper|curl|wget|python|httpclient|postman|chatgpt|gptbot|anthropic|claude|bytespider|google-extended|cohere|diffbot|facebookexternalhit|ia_archiver|semrush|ahrefs|mj12bot|dotbot|yandexbot|ccbot/i;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api/* (API routes)
     * - /seannkaipanel (Admin panel)
     * - static assets (.js, .css, images, fonts, xlsx)
     */
    '/((?!api|_next|static|assets|favicon|.*\\.(?:jpg|jpeg|png|svg|ico|css|js|map|json|xlsx|txt|woff|woff2)).*)',
  ],
};

export default async function middleware(request: Request) {
  const url = new URL(request.url);

  // Never intercept API routes or admin panel
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/seannkaipanel')) {
    return;
  }

  let isLockdown = true; // Default state

  if (redis) {
    try {
      const val = await redis.get<boolean | string>('site_lockdown_enabled');
      if (val !== null && val !== undefined) {
        isLockdown = val === true || val === 'true' || val === '1';
      }
    } catch {
      // If redis check fails, preserve default lockdown
    }
  }

  const userAgent = request.headers.get('user-agent') || '';

  if (isLockdown) {
    // If a scraper / automated crawler visits while lockdown is ON, block with 403
    if (BOT_USER_AGENTS.test(userAgent)) {
      return new Response('Access denied: Site is currently protected by anti-scraper lockdown protocol.', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
          'X-Lockdown-Status': 'active',
        },
      });
    }
  }

  // Allow standard requests to pass through cleanly
  return;
}
