import { readLockdownState } from '../lib/storage.ts';

export const config = {
  runtime: 'edge',
};

export default async function handler() {
  const { isLockdown } = await readLockdownState();

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
