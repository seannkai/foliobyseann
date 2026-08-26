import { verifyPassword, createSessionToken, generateSessionCookieHeader } from '../../lib/auth.ts';
import { checkRateLimit } from '../../lib/kv.ts';

export default async function handler(req: any, res: any) {
  // Handle CORS / preflight if necessary
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    // Extract client IP
    const forwarded = req.headers ? (req.headers['x-forwarded-for'] || req.headers['x-real-ip']) : null;
    const rawIp = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    const clientIp = (rawIp ? rawIp.split(',')[0].trim() : req.socket?.remoteAddress) || '127.0.0.1';

    // Rate limiter: 5 attempts per 15 min
    const rateLimit = await checkRateLimit(clientIp, 5, 900);
    if (!rateLimit.allowed) {
      res.statusCode = 429;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: 'Too many failed login attempts. Please wait 15 minutes before trying again.',
          retryAfter: rateLimit.resetSeconds,
        })
      );
      return;
    }

    // Safely parse body
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    } else if (!body) {
      body = {};
    }

    const password = body.password;
    if (!password || typeof password !== 'string') {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Password is required' }));
      return;
    }

    // Check password against ADMIN_PASSWORD_HASH env var
    const isValid = await verifyPassword(password);
    if (!isValid) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: `Invalid password. (${rateLimit.remaining} attempts remaining)`,
          remainingAttempts: rateLimit.remaining,
        })
      );
      return;
    }

    // Generate authenticated session token & cookie
    const token = createSessionToken();
    const cookieHeader = generateSessionCookieHeader(token);

    res.statusCode = 200;
    res.setHeader('Set-Cookie', cookieHeader);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, message: 'Authenticated successfully' }));
  } catch (err: any) {
    console.error('Unhandled login error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal server error during authentication' }));
  }
}
