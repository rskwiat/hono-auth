import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { users, auth } from './routes';
import connectDB from '../lib/database'
import { logger } from 'hono/logger'
import dotenv from 'dotenv';
import { authCookie } from './middlewares/authCookie';

const PORT = process.env.PORT!
const app = new Hono()

dotenv.config();

connectDB();
app.use(logger());
app.route('/users', users);
app.use('/auth/*', authCookie);
app.route('/auth', auth);
app.get('/*', (c) => {
  return c.notFound()
});

console.log(`Server is running on port ${PORT}`)

serve({
  fetch: app.fetch,
  port: Number(PORT),
});
