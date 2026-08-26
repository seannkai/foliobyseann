import { readLockdownState } from '../../lib/storage.ts';

export const config = {
  runtime: 'edge',
};

const SESSION_COOKIE_NAME = 'panel_session';
const SESSION_MAX_AGE_SECONDS = 86400;

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

async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [timestampStr, nonce, receivedSig] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;
  const age = (Date.now() - timestamp) / 1000;
  if (age < 0 || age > SESSION_MAX_AGE_SECONDS) return false;

  const payload = `${timestampStr}.${nonce}`;
  const secret = getSessionSecret();
  const expectedSig = await signHMAC(payload, secret);
  return receivedSig === expectedSig;
}

function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name) cookies[name] = rest.join('=');
  });
  return cookies;
}

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  const cookies = parseCookies(request.headers.get('cookie'));
  const sessionToken = cookies[SESSION_COOKIE_NAME];
  const isAuthenticated = await verifyToken(sessionToken);

  if (!isAuthenticated) {
    return new Response(JSON.stringify({ authenticated: false, lockdown: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { isLockdown, hasStorage } = await readLockdownState();

  return new Response(
    JSON.stringify({
      authenticated: true,
      lockdown: isLockdown,
      hasStorage,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
