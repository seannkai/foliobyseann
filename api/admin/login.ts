import type { IncomingMessage, ServerResponse } from 'http';
import { verifyPassword, createSessionToken, generateSessionCookieHeader } from '../../lib/auth';
import { checkRateLimit } from '../../lib/kv';

interface ExtendedRequest extends IncomingMessage {
  body?: any;
  headers: Record<string, string | string[] | undefined>;
}

export default async function handler(req: ExtendedRequest, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  // Extract client IP for rate limiting
  const forwarded = req.headers['x-forwarded-for'];
  const rawIp = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const clientIp = rawIp ? rawIp.split(',')[0].trim() : (req.socket as any)?.remoteAddress || '127.0.0.1';

  // 5 attempts per 15 minutes
  const rateLimit = await checkRateLimit(clientIp, 5, 900);
  if (!rateLimit.allowed) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'Too many failed login attempts. Please try again in 15 minutes.',
        retryAfter: rateLimit.resetSeconds,
      })
    );
    return;
  }

  // Parse body if not already parsed
  let body = req.body;
  if (!body) {
    body = await new Promise((resolve) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        try {
          resolve(JSON.parse(data || '{}'));
        } catch {
          resolve({});
        }
      });
    });
  }

  const { password } = body || {};

  if (!password || typeof password !== 'string') {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Password is required' }));
    return;
  }

  const isValid = await verifyPassword(password);
  if (!isValid) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'Invalid password',
        remainingAttempts: rateLimit.remaining,
      })
    );
    return;
  }

  // Create session
  const token = createSessionToken();
  const cookieHeader = generateSessionCookieHeader(token);

  res.statusCode = 200;
  res.setHeader('Set-Cookie', cookieHeader);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ success: true, message: 'Authenticated successfully' }));
}
