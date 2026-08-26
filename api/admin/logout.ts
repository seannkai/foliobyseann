export const config = {
  runtime: 'edge',
};

const SESSION_COOKIE_NAME = 'panel_session';

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  const isProd = process.env.NODE_ENV === 'production' || request.url.startsWith('https:');
  const clearCookie = `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; ${
    isProd ? 'Secure;' : ''
  } SameSite=Strict`;

  return new Response(
    JSON.stringify({ success: true, message: 'Logged out successfully' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': clearCookie,
      },
    }
  );
}
