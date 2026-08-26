import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const SESSION_COOKIE_NAME = 'panel_session';
const SESSION_MAX_AGE_SECONDS = 86400; // 24 hours

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD_HASH || 'default-dev-secret-change-in-production';
}

/**
 * Verify plaintext password against the stored bcrypt hash in process.env.ADMIN_PASSWORD_HASH
 */
export async function verifyPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    console.error('ADMIN_PASSWORD_HASH environment variable is not configured in Vercel.');
    return false;
  }
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}

/**
 * Create a cryptographically signed session token: timestamp.nonce.signature
 */
export function createSessionToken(): string {
  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = `${timestamp}.${nonce}`;
  const secret = getSessionSecret();
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

/**
 * Verify whether a session token is genuine and unexpired
 */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [timestampStr, nonce, receivedSig] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check expiration (24h)
  const ageSeconds = (Date.now() - timestamp) / 1000;
  if (ageSeconds < 0 || ageSeconds > SESSION_MAX_AGE_SECONDS) {
    return false;
  }

  const payload = `${timestampStr}.${nonce}`;
  const secret = getSessionSecret();
  const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  if (receivedSig.length !== 64 || !/^[0-9a-f]{64}$/i.test(receivedSig)) {
    return false;
  }

  try {
    const receivedBuf = Buffer.from(receivedSig, 'hex');
    const expectedBuf = Buffer.from(expectedSig, 'hex');
    if (receivedBuf.length !== expectedBuf.length) return false;
    return crypto.timingSafeEqual(receivedBuf, expectedBuf);
  } catch {
    return false;
  }
}

/**
 * Helper to parse cookies from Cookie header string
 */
export function parseCookies(cookieHeader: string | undefined | null): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name) {
      cookies[name] = rest.join('=');
    }
  });
  return cookies;
}

/**
 * Generate Set-Cookie header string for creating the session
 */
export function generateSessionCookieHeader(token: string): string {
  const isProd = process.env.NODE_ENV === 'production';
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; HttpOnly; ${
    isProd ? 'Secure;' : ''
  } SameSite=Strict`;
}

/**
 * Generate Set-Cookie header string for destroying the session
 */
export function generateClearCookieHeader(): string {
  const isProd = process.env.NODE_ENV === 'production';
  return `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; ${
    isProd ? 'Secure;' : ''
  } SameSite=Strict`;
}
