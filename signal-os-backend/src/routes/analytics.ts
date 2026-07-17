import { Hono } from 'hono';
import { eq, sql, desc } from 'drizzle-orm';
import { db } from '../db';
import { scores, drafts, publishedPosts } from '../db/schema';
import { authMiddleware } from '../middleware/auth';

const router = new Hono();
router.use('*', authMiddleware);

router.get('/dashboard', async (c) => {
  const user = c.get('user');
  const scoreStats = await db.select({ avgScore: sql<number>`COALESCE(AVG(${scores.overallScore}), 0)`, totalScores: sql<number>`COUNT(*)`, bestScore: sql<number>`COALESCE(MAX(${scores.overallScore}), 0)` }).from(scores).where(eq(scores.userId, user.id));
  const draftCount = await db.select({ count: sql<number>`COUNT(*)` }).from(drafts).where(eq(drafts.userId, user.id));
  const publishedCount = await db.select({ count: sql<number>`COUNT(*)` }).from(publishedPosts).where(eq(publishedPosts.userId, user.id));
  const recentScores = await db.select({ overallScore: scores.overallScore, createdAt: scores.createdAt }).from(scores).where(eq(scores.userId, user.id)).orderBy(desc(scores.createdAt)).limit(30);
  return c.json({ avgScore: Math.round(scoreStats[0]?.avgScore || 0), totalScores: Number(scoreStats[0]?.totalScores || 0), bestScore: scoreStats[0]?.bestScore || 0, totalDrafts: Number(draftCount[0]?.count || 0), totalPublished: Number(publishedCount[0]?.count || 0), recentScores, plan: user.plan });
});

router.get('/trends', async (c) => {
  return c.json({
    hashtags: [
      { tag: '#ContentStrategy', posts: '1.2M', engagement: '4.8%', trend: '+23%', hot: true },
      { tag: '#AICreators', posts: '890K', engagement: '5.2%', trend: '+156%', hot: true },
      { tag: '#ViralHooks', posts: '2.1M', engagement: '3.9%', trend: '+45%', hot: true },
      { tag: '#GrowthHacking', posts: '780K', engagement: '4.5%', trend: '+67%', hot: true },
    ],
    topics: [
      { name: 'AI Content Tools', score: 94, trend: '+156%', volume: 'High', posts: '45K/day' },
      { name: 'Viral Hook Formulas', score: 91, trend: '+89%', volume: 'High', posts: '32K/day' },
      { name: 'Audience Building', score: 88, trend: '+67%', volume: 'High', posts: '28K/day' },
    ],
    creators: [
      { rank: 1, name: 'Alex Chen', handle: '@alexcreates', followers: '245K', avgScore: 92, engagement: '5.8%', niche: 'Tech / AI', avatar: 'A' },
      { rank: 2, name: 'Sarah Miller', handle: '@sarahcontent', followers: '189K', avgScore: 89, engagement: '4.9%', niche: 'Marketing', avatar: 'S' },
    ],
  });
});

export default router;
