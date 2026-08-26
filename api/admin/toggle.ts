import { parseCookies, verifySessionToken, SESSION_COOKIE_NAME } from '../../lib/auth';
import { getLockdownState, setLockdownState } from '../../lib/kv';

export default async function handler(req: any, res: any) {
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
    const cookies = parseCookies(req.headers.cookie);
    const sessionToken = cookies[SESSION_COOKIE_NAME];
    const isAuthenticated = verifySessionToken(sessionToken);

    if (!isAuthenticated) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

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

    const current = await getLockdownState();
    let newState: boolean;
    if (typeof body?.enabled === 'boolean') {
      newState = body.enabled;
    } else {
      newState = !current;
    }

    await setLockdownState(newState);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: true,
        lockdown: newState,
        message: `Anti-scraper lockdown is now ${newState ? 'ON' : 'OFF'}`,
      })
    );
  } catch (err: any) {
    console.error('Unhandled toggle error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}
