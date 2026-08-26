import { readLockdownState, readAllowlist } from '../lib/storage';

export const config = {
  runtime: 'edge',
};

export default async function handler() {
  const { isLockdown } = await readLockdownState();
  const allowlist = await readAllowlist();

  let content: string;
  if (!isLockdown) {
    // When lockdown is OFF, allow all crawling
    content = 'User-agent: *\nAllow: /\n';
  } else {
    // When lockdown is ON, specifically allow allowlisted bots and disallow all others
    let allowedBlocks = '';
    const hasClaude = allowlist.some((item) => item.toLowerCase().includes('claude'));
    if (hasClaude) {
      allowedBlocks += 'User-agent: ClaudeBot\nAllow: /\n\nUser-agent: Claude-Web\nAllow: /\n\nUser-agent: anthropic-ai\nAllow: /\n\n';
    }
    for (const agent of allowlist) {
      if (!agent.toLowerCase().includes('claude')) {
        allowedBlocks += `User-agent: ${agent}\nAllow: /\n\n`;
      }
    }
    content = `${allowedBlocks}User-agent: *\nDisallow: /\n`;
  }

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
