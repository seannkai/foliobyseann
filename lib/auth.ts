import { compareSync } from 'bcrypt-ts';

export const SESSION_COOKIE_NAME = 'panel_session';

/**
 * Verify plaintext password against the stored bcrypt hash in process.env.ADMIN_PASSWORD_HASH
 */
export function verifyPassword(password: string): boolean {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    console.error('ADMIN_PASSWORD_HASH environment variable is not configured in Vercel.');
    return false;
  }
  try {
    return compareSync(password, hash);
  } catch (err) {
    console.error('Password verification error:', err);
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
