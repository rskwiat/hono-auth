import { Hono } from 'hono';
import { checkAuth } from '../handlers/auth';
const auth = new Hono();

//Check authentication status
auth.get('/status', checkAuth);

export default auth;
