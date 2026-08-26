import type { IncomingMessage, ServerResponse } from 'http';
import { parseCookies, verifySessionToken, SESSION_COOKIE_NAME } from '../../lib/auth';
import { getLockdownState } from '../../lib/kv';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const cookies = parseCookies(req.headers.cookie);
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
}
