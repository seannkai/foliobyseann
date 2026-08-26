import { generateClearCookieHeader } from '../../lib/auth.ts';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

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
