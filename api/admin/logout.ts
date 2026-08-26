import type { IncomingMessage, ServerResponse } from 'http';
import { generateClearCookieHeader } from '../../lib/auth';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const cookieHeader = generateClearCookieHeader();
  res.statusCode = 200;
  res.setHeader('Set-Cookie', cookieHeader);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ success: true, message: 'Logged out successfully' }));
}
