import { readLockdownState } from './lib/storage';

// Bot / scraper detection pattern
const BOT_USER_AGENTS =
  /bot|spider|crawl|scraper|curl|wget|python|httpclient|postman|chatgpt|gptbot|anthropic|claude|bytespider|google-extended|cohere|diffbot|facebookexternalhit|ia_archiver|semrush|ahrefs|mj12bot|dotbot|yandexbot|ccbot/i;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api/* (API routes)
     * - /seannkaipanel (Admin panel)
     * - static assets (.js, .css, images, fonts, xlsx, txt)
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

  const { isLockdown } = await readLockdownState();
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
