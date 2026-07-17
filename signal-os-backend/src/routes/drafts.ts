import { Hono } from 'hono';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { drafts } from '../db/schema';
import { authMiddleware } from '../middleware/auth';

const router = new Hono();
const draftSchema = z.object({ content: z.string().min(1).max(280), scoreId: z.number().optional() });

router.post('/', authMiddleware, async (c) => {
  try { const body = await c.req.json(); const parsed = draftSchema.parse(body); const user = c.get('user'); const result = await db.insert(drafts).values({ userId: user.id, content: parsed.content, scoreId: parsed.scoreId }).returning(); return c.json(result[0], 201); }
  catch (err: any) { return c.json({ error: err.message }, 400); }
});

router.get('/', authMiddleware, async (c) => {
  const user = c.get('user');
  const result = await db.select().from(drafts).where(eq(drafts.userId, user.id)).orderBy(desc(drafts.createdAt));
  return c.json(result);
});

router.delete('/:id', authMiddleware, async (c) => {
  const id = Number(c.req.param('id'));
  await db.delete(drafts).where(eq(drafts.id, id));
  return c.json({ success: true });
});

export default router;
