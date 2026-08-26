import { parseCookies, verifySessionToken, SESSION_COOKIE_NAME } from '../../lib/auth.ts';
import { getLockdownState } from '../../lib/kv.ts';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const cookies = parseCookies(req.headers?.cookie);
    const sessionToken = cookies[SESSION_COOKIE_NAME];
    const isAuthenticated = verifySessionToken(sessionToken);

    if (!isAuthenticated) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ authenticated: false, lockdown: null }));
      return;
    }

    const lockdownState = await getLockdownState();

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        authenticated: true,
        lockdown: lockdownState,
      })
    );
  } catch (err: any) {
    console.error('Unhandled session error:', err);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ authenticated: false, lockdown: null }));
  }
}
