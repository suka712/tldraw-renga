import { IRequest } from 'itty-router';
import { config } from './config';

export const requireAuth = async (request: IRequest, _env: Env, _ctx?: ExecutionContext) => {
  const cookie = request.headers.get('cookie')
  const sessionToken = cookie?.match(/session_token=([^;]+)/)?.[1]

  if (!sessionToken) {
    return Response.redirect(config.LOGIN_URL, 302)
  }

  const res = await fetch(`${config.API_URL}/auth/session`, {
    headers: { 'Cookie': `session_token=${sessionToken}` },
  })

  if (!res.ok) {
    return Response.redirect(config.LOGIN_URL, 302)
  }

  const { email } = await res.json() as { email: string }
  request.email = email
}
