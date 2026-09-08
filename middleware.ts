import { readLockdownState, readAllowlist } from './lib/storage';

// Known good social preview bots that should always be allowed through for link previews
const ALLOWED_PREVIEW_BOTS = [
  'slackbot',
  'twitterbot',
  'facebookexternalhit',
  'linkedinbot',
  'discordbot',
  'applebot', // iMessage
  'skypeuripreview',
];

// Bot / scraper detection pattern (excluding preview bots and claude which is handled by allowlist)
const BOT_USER_AGENTS =
  /bot|spider|crawl|scraper|curl|wget|python|httpclient|postman|chatgpt|gptbot|bytespider|google-extended|cohere|diffbot|ia_archiver|semrush|ahrefs|mj12bot|dotbot|yandexbot|ccbot/i;

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

  const userAgent = request.headers.get('user-agent') || '';
  const userAgentLower = userAgent.toLowerCase();

  // 1. Check if it's a social preview bot - let pass immediately without blocking
  const isPreviewBot = ALLOWED_PREVIEW_BOTS.some((bot) => userAgentLower.includes(bot));
  if (isPreviewBot) {
    return;
  }

  const { isLockdown } = await readLockdownState();

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
