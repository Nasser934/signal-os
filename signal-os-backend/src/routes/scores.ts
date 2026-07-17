import { Hono } from 'hono';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { scores } from '../db/schema';
import { scoreContent } from '../services/aiScoring';
import { authMiddleware } from '../middleware/auth';

const router = new Hono();
const scoreSchema = z.object({ content: z.string().min(1).max(280), dimensions: z.array(z.string()).optional() });

router.post('/', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const parsed = scoreSchema.parse(body);
    const user = c.get('user');
    const startTime = Date.now();
    const result = await scoreContent(parsed.content);
    const processingTime = `${Date.now() - startTime}ms`;
    const saved = await db.insert(scores).values({
      userId: user.id, content: parsed.content, overallScore: result.overallScore,
      dimensions: result.dimensions, feedback: result.feedback,
      estimatedEngagement: result.estimatedEngagement, processingTime,
    }).returning();
    return c.json({ id: saved[0].id, ...result, processingTime, timestamp: saved[0].createdAt });
  } catch (err: any) { return c.json({ error: err.message || 'Scoring failed' }, 500); }
});

router.get('/', authMiddleware, async (c) => {
  const user = c.get('user');
  const limit = Number(c.req.query('limit')) || 50;
  const result = await db.select().from(scores).where(eq(scores.userId, user.id)).orderBy(desc(scores.createdAt)).limit(limit);
  return c.json(result);
});

router.get('/:id', authMiddleware, async (c) => {
  const id = Number(c.req.param('id'));
  const user = c.get('user');
  const result = await db.select().from(scores).where(eq(scores.id, id)).limit(1);
  if (!result[0] || result[0].userId !== user.id) return c.json({ error: 'Score not found' }, 404);
  return c.json(result[0]);
});

export default router;
