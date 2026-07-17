import { Hono } from 'hono';
import { z } from 'zod';
import { registerUser, loginUser } from '../services/auth';
import { authMiddleware } from '../middleware/auth';

const router = new Hono();
const registerSchema = z.object({ email: z.string().email(), password: z.string().min(6).max(100), name: z.string().min(1).max(100).optional() });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

router.post('/register', async (c) => {
  try { const body = await c.req.json(); const parsed = registerSchema.parse(body); const result = await registerUser(parsed.email, parsed.password, parsed.name); return c.json(result, 201); }
  catch (err: any) { return c.json({ error: err.message || 'Registration failed' }, 400); }
});

router.post('/login', async (c) => {
  try { const body = await c.req.json(); const parsed = loginSchema.parse(body); const result = await loginUser(parsed.email, parsed.password); return c.json(result); }
  catch (err: any) { return c.json({ error: err.message || 'Login failed' }, 401); }
});

router.get('/me', authMiddleware, (c) => {
  const user = c.get('user');
  return c.json({ id: user.id, email: user.email, name: user.name, plan: user.plan });
});

export default router;
