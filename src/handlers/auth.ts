// authenticated routes
import { Context } from "hono";

export const checkAuth = async (c: Context) => {
  return await c.json({ 'success': 'you are authorized' });
};