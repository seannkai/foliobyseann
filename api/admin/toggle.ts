import type { IncomingMessage, ServerResponse } from 'http';
import { parseCookies, verifySessionToken, SESSION_COOKIE_NAME } from '../../lib/auth';
import { getLockdownState, setLockdownState } from '../../lib/kv';

interface ExtendedRequest extends IncomingMessage {
  body?: any;
}

export default async function handler(req: ExtendedRequest, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const cookies = parseCookies(req.headers.cookie);
  const sessionToken = cookies[SESSION_COOKIE_NAME];
  const isAuthenticated = verifySessionToken(sessionToken);

  if (!isAuthenticated) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Unauthorized' }));
    return;
  }

  // Parse body if supplied
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
}
