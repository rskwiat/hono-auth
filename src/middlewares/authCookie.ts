import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";

export const authCookie = createMiddleware(async (c, next) => {
  const { auth } = getCookie(c);
  if (auth) {
    c.header('Authorization', auth);
    await next()
  }

  return c.json({ 'message': 'you are not authorized' }, 401);
});