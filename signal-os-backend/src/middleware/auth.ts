import { createMiddleware } from 'hono/factory';
import { jwtVerify, SignJWT } from 'jose';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'signal-os-dev-secret-change-in-production');

export async function createToken(userId: number, email: string): Promise<string> {
  return new SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    return payload as { userId: number; email: string };
  } catch { return null; }
}

export const authMiddleware = createMiddleware(async (c, next) => {
  const auth = c.req.header('Authorization');
  if (!auth?.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401);
  const payload = await verifyToken(auth.slice(7));
  if (!payload) return c.json({ error: 'Invalid token' }, 401);
  const user = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);
  if (!user[0]) return c.json({ error: 'User not found' }, 401);
  c.set('user', user[0]);
  await next();
});

declare module 'hono' {
  interface ContextVariableMap { user: typeof users.$inferSelect; }
}
