import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';
import { createToken } from '../middleware/auth';

export async function registerUser(email: string, password: string, name?: string) {
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing[0]) throw new Error('Email already registered');

  const passwordHash = await bcrypt.hash(password, 12);
  const result = await db.insert(users).values({
    email, passwordHash,
    name: name || email.split('@')[0],
    plan: 'free',
  }).returning();

  const user = result[0];
  const token = await createToken(user.id, user.email);
  return { token, user: { id: user.id, email: user.email, name: user.name, plan: user.plan } };
}

export async function loginUser(email: string, password: string) {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const user = result[0];
  if (!user) throw new Error('Invalid email or password');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Invalid email or password');

  const token = await createToken(user.id, user.email);
  return { token, user: { id: user.id, email: user.email, name: user.name, plan: user.plan } };
}
