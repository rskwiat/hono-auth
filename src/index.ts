import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import users from './routes/users'
import connectDB from '../lib/database'
import { logger } from 'hono/logger'
import dotenv from 'dotenv';
import { getCookie } from 'hono/cookie';
import { bearerAuth, BearerAuthOptions } from 'hono/bearer-auth';
import { Context } from "hono";

const app = new Hono()

dotenv.config();


connectDB();
const extractToken = (c: Context): string | undefined => {
  const { auth } = getCookie(c);
  return auth;
};



const authMiddleware = async (c: Context, next: () => Promise<void>) => {
  const token = extractToken(c);
  if (token) {
    c.req.raw.headers.set('Authorization', `Bearer ${token}`)
  }
  await next();
};

const bearerAuthOptions: BearerAuthOptions = {
  token: (c: Context): string => c.req.raw.headers.get('Authorization')?.replace('Bearer ', '') || ''
};

app.use(logger());
app.route('/users', users);
app.use('/auth/*', authMiddleware);
app.use('/auth/*', bearerAuth(bearerAuthOptions));
app.get('/auth/page', (c) => {
  return c.json({ message: 'You are authorized' })
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
});
