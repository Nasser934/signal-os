import { Hono } from 'hono';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { getXUserProfile, getXUserTweets, publishTweet, deleteTweet, searchRecentTweets } from '../services/nangoProxy';

const router = new Hono();
router.use('*', authMiddleware);

router.get('/profile', async (c) => {
  try { const connectionId = c.req.query('connectionId'); if (!connectionId) return c.json({ error: 'connectionId required' }, 400); const profile = await getXUserProfile(connectionId); return c.json(profile); }
  catch (err: any) { return c.json({ error: err.message }, 500); }
});

router.get('/posts', async (c) => {
  try { const connectionId = c.req.query('connectionId'); const maxResults = Number(c.req.query('max')) || 50; if (!connectionId) return c.json({ error: 'connectionId required' }, 400); const posts = await getXUserTweets(connectionId, maxResults); return c.json(posts); }
  catch (err: any) { return c.json({ error: err.message }, 500); }
});

router.post('/publish', async (c) => {
  try { const body = await c.req.json(); const schema = z.object({ connectionId: z.string(), text: z.string().min(1).max(280) }); const parsed = schema.parse(body); const result = await publishTweet(parsed.connectionId, parsed.text); return c.json(result); }
  catch (err: any) { return c.json({ error: err.message }, 500); }
});

router.delete('/posts/:id', async (c) => {
  try { const tweetId = c.req.param('id'); const connectionId = c.req.query('connectionId'); if (!connectionId) return c.json({ error: 'connectionId required' }, 400); await deleteTweet(connectionId, tweetId); return c.json({ success: true }); }
  catch (err: any) { return c.json({ error: err.message }, 500); }
});

router.get('/search', async (c) => {
  try { const connectionId = c.req.query('connectionId'); const query = c.req.query('q'); if (!connectionId) return c.json({ error: 'connectionId required' }, 400); if (!query) return c.json({ error: 'q required' }, 400); const results = await searchRecentTweets(connectionId, query); return c.json(results); }
  catch (err: any) { return c.json({ error: err.message }, 500); }
});

export default router;
