import { readLockdownState, readAllowlist } from './lib/storage';

// Bot / scraper detection pattern (excluding claude which is handled by allowlist)
const BOT_USER_AGENTS =
  /bot|spider|crawl|scraper|curl|wget|python|httpclient|postman|chatgpt|gptbot|bytespider|google-extended|cohere|diffbot|facebookexternalhit|ia_archiver|semrush|ahrefs|mj12bot|dotbot|yandexbot|ccbot/i;

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
  const userAgentLower = userAgent.toLowerCase();

  if (isLockdown) {
    const allowlist = await readAllowlist();
    const isAllowlisted = allowlist.some((item) => userAgentLower.includes(item.toLowerCase()));

    // If request matches allowlist, let through even during lockdown
    if (isAllowlisted) {
      return;
    }

    // If bot / crawler and not allowlisted, block with 403
    if (BOT_USER_AGENTS.test(userAgent)) {
      return new Response('Access denied: Site is currently protected by anti-scraper lockdown protocol.', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
          'X-Lockdown-Status': 'active',
        },
      });
    }
  }

  // Allow standard requests through
  return;
}
