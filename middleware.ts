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
     * - /seannkaipanel (Admin panel page)
     * - /_next/*, /static/*, /assets/* (asset paths)
     * - favicon, images, fonts, xlsx, svg
     */
    '/((?!api|_next|static|assets|foliobyseann-favicon|seannomac-avatar|icons\\.svg|.*\\.xlsx|.*\\.jpg|.*\\.png|.*\\.svg|.*\\.css|.*\\.js).*)',
  ],
};

export default async function middleware(request: Request) {
  const url = new URL(request.url);

  // Allow admin panel and API unconditionally
  if (url.pathname.startsWith('/seannkaipanel') || url.pathname.startsWith('/api/')) {
    return;
  }

  let isLockdown = true; // Default state

  if (redis) {
    try {
      const val = await redis.get<boolean | string>('site_lockdown_enabled');
      if (val !== null && val !== undefined) {
        isLockdown = val === true || val === 'true' || val === '1';
      }
    } catch (err) {
      console.error('Error fetching lockdown state in middleware:', err);
    }
  }

  const userAgent = request.headers.get('user-agent') || '';

  if (isLockdown) {
    // If a scraper/bot tries to access when lockdown is active, block it
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

    // For standard traffic, enforce noindex/lockdown headers
    const response = new Response(null, {
      headers: {
        'x-middleware-next': '1',
        'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
        'X-Lockdown-Status': 'active',
      },
    });
    return response;
  }

  // When lockdown is OFF, allow scraping and clear strict bot tags
  const response = new Response(null, {
    headers: {
      'x-middleware-next': '1',
      'X-Robots-Tag': 'all',
      'X-Lockdown-Status': 'disabled',
    },
  });
  return response;
}
