import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import ScoreBadge from '@/components/ScoreBadge';
import { mockPosts } from '@/lib/mockData';
import {
  AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';
import {
  ChevronLeft, ChevronRight, RefreshCw, Download, Share2, Calendar, Mail,
  TrendingUp, Award, Brain, Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Mock 7-day data                                                    */
/* ------------------------------------------------------------------ */
const sevenDayData = [
  { day: 'Mon', impressions: 42000, engagement: 4.2, posts: 2 },
  { day: 'Tue', impressions: 58000, engagement: 5.1, posts: 3 },
  { day: 'Wed', impressions: 35000, engagement: 3.8, posts: 1 },
  { day: 'Thu', impressions: 12400, engagement: 6.8, posts: 2 },
  { day: 'Fri', impressions: 48000, engagement: 4.9, posts: 2 },
  { day: 'Sat', impressions: 22000, engagement: 3.5, posts: 1 },
  { day: 'Sun', impressions: 31000, engagement: 4.6, posts: 1 },
];

/* ------------------------------------------------------------------ */
/*  Content breakdown data                                            */
/* ------------------------------------------------------------------ */
const contentBreakdown = [
  { name: 'Posts', value: 8, color: '#4E8DFF' },
  { name: 'Replies', value: 24, color: '#00C8FF' },
  { name: 'Media', value: 5, color: '#FFB347' },
  { name: 'Threads', value: 3, color: '#9F7AEA' },
];

/* ------------------------------------------------------------------ */
/*  Engagement analysis data                                          */
/* ------------------------------------------------------------------ */
const engagementByType = [
  { type: 'Posts', likes: 4200, replies: 380, retweets: 1200 },
  { type: 'Replies', likes: 1800, replies: 560, retweets: 340 },
  { type: 'Media', likes: 3100, replies: 210, retweets: 980 },
  { type: 'Threads', likes: 2500, replies: 450, retweets: 890 },
];

/* ------------------------------------------------------------------ */
/*  Week-over-week comparison data                                    */
/* ------------------------------------------------------------------ */
const weekOverWeekData = [
  { label: 'Followers', current: '+234', prev: '+198', delta: 12, icon: TrendingUp },
  { label: 'Impressions', current: '48.2K', prev: '44.1K', delta: 8, icon: TrendingUp },
  { label: 'Engagement', current: '4.8%', prev: '4.2%', delta: 0.6, icon: TrendingUp },
  { label: 'Score', current: '84', prev: '80', delta: 4, icon: TrendingUp },
];

/* ------------------------------------------------------------------ */
/*  AI Recommendations                                                */
/* ------------------------------------------------------------------ */
const aiRecommendations = [
  { id: 'r1', priority: 'High', text: 'Post 2 more times on Thursday — your engagement peaks this day' },
  { id: 'r2', priority: 'Medium', text: 'Threads are outperforming single posts. Create more long-form content.' },
  { id: 'r3', priority: 'High', text: 'Your AI topic content is trending. Double down on AI-related posts.' },
  { id: 'r4', priority: 'Low', text: 'Weekend posting is underperforming. Consider scheduling for weekdays.' },
  { id: 'r5', priority: 'Medium', text: 'Reply engagement is strong. Spend 15 min daily replying to top accounts.' },
];

/* ------------------------------------------------------------------ */
/*  AI insights summary                                               */
/* ------------------------------------------------------------------ */
const aiInsightsSummary = [
  { label: 'ACT', count: 3, color: '#22C55E' },
  { label: 'MONITOR', count: 5, color: '#FFB347' },
  { label: 'IGNORE', count: 2, color: '#5A6480' },
];

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  }),
};

/* ------------------------------------------------------------------ */
/*  Custom tooltip                                                     */
/* ------------------------------------------------------------------ */
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[rgba(32,36,54,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs text-[#5A6480] mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs font-medium" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Weekly Report Page                                           */
/* ------------------------------------------------------------------ */
export default function WeeklyReport() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  /* Week label */
  const weekLabel = weekOffset === 0
    ? 'January 13-19, 2026'
    : weekOffset === -1
      ? 'January 6-12, 2026'
      : `Week of ${new Date(2026, 0, 13 + weekOffset * 7).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;

  /* Top 5 posts by score */
  const topPosts = useMemo(() =>
    [...mockPosts].sort((a, b) => b.score - a.score).slice(0, 5),
    [],
  );

  /* Top post of the week */
  const topPost = topPosts[0];

  /* Handle generate */
  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <motion.h1
            className="font-display font-bold text-2xl text-[#E0E4F0] tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Weekly Report
          </motion.h1>
          <motion.p
            className="text-[#8B95B8] text-sm mt-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            7-day performance digest
          </motion.p>
        </div>

        {/* Week Navigation */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setWeekOffset(prev => prev - 1)}
            className="p-2 rounded-lg border border-[rgba(255,255,255,0.12)] text-[#8B95B8] hover:text-[#E0E4F0] hover:border-[rgba(78,141,255,0.4)] transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-[#E0E4F0] font-display min-w-[160px] text-center">
            {weekLabel}
          </span>
          <button
            onClick={() => setWeekOffset(prev => Math.min(prev + 1, 0))}
            disabled={weekOffset === 0}
            className={cn(
              'p-2 rounded-lg border transition-all',
              weekOffset === 0
                ? 'border-[rgba(255,255,255,0.05)] text-[#5A6480] cursor-not-allowed'
                : 'border-[rgba(255,255,255,0.12)] text-[#8B95B8] hover:text-[#E0E4F0] hover:border-[rgba(78,141,255,0.4)]'
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="ml-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF] text-[#1A1D2E] text-sm font-semibold hover:shadow-[0_4px_20px_rgba(78,141,255,0.4)] transition-all"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-[#1A1D2E] border-t-transparent rounded-full animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Generate
          </button>
        </motion.div>
      </div>

      {/* Executive Summary */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
        <GlassCard glow>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl font-bold font-data text-[#E0E4F0] letterpress">84</span>
                <span className="text-lg text-[#5A6480]">/ 100</span>
                <span className="px-2.5 py-1 rounded-md bg-[rgba(34,197,94,0.12)] text-[#22C55E] text-xs font-semibold border border-[rgba(34,197,94,0.25)]">
                  Excellent
                </span>
              </div>
              <p className="text-sm text-[#8B95B8] max-w-xl">
                This was a strong week with above-average engagement across all content types.
                Your AI Content Score improved by 4 points. Best performing day was Thursday with 12.4K impressions.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
              <div className="text-lg font-bold font-data text-[#22C55E]">+234</div>
              <div className="text-[10px] text-[#5A6480] uppercase tracking-wider">Followers</div>
            </div>
            <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
              <div className="text-lg font-bold font-data text-[#4E8DFF]">48.2K</div>
              <div className="text-[10px] text-[#5A6480] uppercase tracking-wider">Impressions</div>
            </div>
            <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
              <div className="text-lg font-bold font-data text-[#FFB347]">4.8%</div>
              <div className="text-[10px] text-[#5A6480] uppercase tracking-wider">Eng. Rate</div>
            </div>
            <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
              <div className="text-lg font-bold font-data text-[#E0E4F0]">12</div>
              <div className="text-[10px] text-[#5A6480] uppercase tracking-wider">Posts</div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Week-over-Week */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard>
            <h3 className="font-display font-semibold text-[#E0E4F0] mb-4">Week-over-Week</h3>
            <div className="space-y-3">
              {weekOverWeekData.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[rgba(255,255,255,0.03)]"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  <div>
                    <div className="text-xs text-[#5A6480]">{item.label}</div>
                    <div className="text-sm font-bold font-data text-[#E0E4F0]">{item.current}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-[#22C55E]">
                    <TrendingUp className="w-3 h-3" />
                    +{item.delta}{item.label === 'Engagement' ? 'pp' : item.label === 'Score' ? ' pts' : '%'}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Top Post Spotlight */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard>
            <h3 className="font-display font-semibold text-[#E0E4F0] mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FFB347]" />
              Top Post of the Week
            </h3>
            {topPost && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <img src={topPost.avatar} alt={topPost.author} className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#E0E4F0]">{topPost.author}</p>
                    <p className="text-xs text-[#5A6480]">{topPost.handle}</p>
                  </div>
                </div>
                <p className="text-sm text-[#8B95B8] line-clamp-3">{topPost.content}</p>
                <div className="flex items-center gap-4">
                  <div className="text-xs text-[#5A6480]">
                    <span className="text-[#E0E4F0] font-data font-semibold">{(topPost.impressions / 1000).toFixed(1)}K</span> impressions
                  </div>
                  <div className="text-xs text-[#5A6480]">
                    <span className="text-[#E0E4F0] font-data font-semibold">{topPost.engagement}%</span> engagement
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ScoreBadge score={topPost.score} size="sm" />
                </div>
                <button className="text-xs text-[#4E8DFF] hover:underline mt-1">
                  View Post Autopsy
                </button>
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* AI Insights Summary */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard>
            <h3 className="font-display font-semibold text-[#E0E4F0] mb-4 flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#9F7AEA]" />
              This Week&apos;s Insights
            </h3>
            <div className="flex items-center justify-center gap-4 mb-4">
              {aiInsightsSummary.map(item => (
                <div key={item.label} className="text-center">
                  <div className="text-2xl font-bold font-data" style={{ color: item.color }}>{item.count}</div>
                  <div className="text-[10px] text-[#5A6480] uppercase tracking-wider">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-xs text-[#8B95B8] line-clamp-2">
                Your AI topic posts are trending. 3 insights require action — focus on timing and content format.
              </p>
              <p className="text-xs text-[#8B95B8] line-clamp-2">
                Engagement is highest on Tuesday-Thursday. Consider increasing posting frequency mid-week.
              </p>
              <p className="text-xs text-[#8B95B8] line-clamp-2">
                Thread format is outperforming single posts by 23% on average.
              </p>
            </div>
            <button className="text-xs text-[#4E8DFF] hover:underline mt-3">
              View All Insights
            </button>
          </GlassCard>
        </motion.div>
      </div>

      {/* 7-Day Performance Chart */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
        <GlassCard>
          <h3 className="font-display font-semibold text-lg text-[#E0E4F0] mb-1">7-Day Performance</h3>
          <p className="text-xs text-[#5A6480] mb-5">Impressions and engagement rate by day</p>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={sevenDayData}>
              <defs>
                <linearGradient id="weeklyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4E8DFF" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4E8DFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#8B95B8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: '#5A6480', fontSize: 11 }} axisLine={false} tickLine={false} width={45} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#5A6480', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="impressions"
                stroke="#4E8DFF"
                strokeWidth={2}
                fill="url(#weeklyAreaGrad)"
                name="Impressions"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="engagement"
                stroke="#FFB347"
                strokeWidth={2}
                dot={{ r: 4, fill: '#FFB347', stroke: '#1A1D2E', strokeWidth: 2 }}
                name="Engagement %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </motion.div>

      {/* Content Breakdown + Engagement Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Breakdown */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard>
            <h3 className="font-display font-semibold text-lg text-[#E0E4F0] mb-1">Content Breakdown</h3>
            <p className="text-xs text-[#5A6480] mb-5">Types of content published this week</p>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width={220} height={200}>
                <PieChart>
                  <Pie
                    data={contentBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {contentBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center -mt-1 mb-3">
                <div className="text-xl font-bold font-data text-[#E0E4F0]">
                  {contentBreakdown.reduce((a, b) => a + b.value, 0)}
                </div>
                <div className="text-xs text-[#5A6480]">Total Content</div>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {contentBreakdown.map(item => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-[#8B95B8]">{item.name}</span>
                    <span className="text-xs font-data font-semibold text-[#E0E4F0]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Engagement Analysis */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard>
            <h3 className="font-display font-semibold text-lg text-[#E0E4F0] mb-1">Engagement Analysis</h3>
            <p className="text-xs text-[#5A6480] mb-5">Engagement by content type</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={engagementByType} barGap={4} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="type" tick={{ fill: '#8B95B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#5A6480', fontSize: 11 }} axisLine={false} tickLine={false} width={45} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#8B95B8' }} />
                <Bar dataKey="likes" name="Likes" fill="#4E8DFF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="replies" name="Replies" fill="#00C8FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="retweets" name="Retweets" fill="#FFB347" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>
      </div>

      {/* Top Performing Posts Table */}
      <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
        <GlassCard>
          <h3 className="font-display font-semibold text-lg text-[#E0E4F0] mb-1">Top Performing Posts</h3>
          <p className="text-xs text-[#5A6480] mb-5">Best content from this week ranked by performance</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.08)]">
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Post</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Day</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Impressions</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Engagement</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">AI Score</th>
                </tr>
              </thead>
              <tbody>
                {topPosts.map((post, i) => {
                  const days = ['Thursday', 'Tuesday', 'Monday', 'Friday', 'Wednesday'];
                  return (
                    <motion.tr
                      key={post.id}
                      className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(78,141,255,0.04)] transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.04 }}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-start gap-2.5 max-w-xs">
                          <img src={post.avatar} alt="" className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-[#E0E4F0] line-clamp-2">{post.content}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#8B95B8]">{days[i] ?? 'Monday'}</td>
                      <td className="py-3 px-4 text-sm font-data text-[#E0E4F0]">{(post.impressions / 1000).toFixed(1)}K</td>
                      <td className="py-3 px-4 text-sm font-data text-[#FFB347]">{post.engagement}%</td>
                      <td className="py-3 px-4">
                        <ScoreBadge score={post.score} size="sm" />
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
        <GlassCard>
          <h3 className="font-display font-semibold text-lg text-[#E0E4F0] mb-1 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FFB347]" />
            AI Recommendations for Next Week
          </h3>
          <p className="text-xs text-[#5A6480] mb-5">Actionable insights to improve performance</p>
          <div className="space-y-3">
            {aiRecommendations.map((rec, i) => (
              <motion.div
                key={rec.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
              >
                <span className={cn(
                  'flex-shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mt-0.5',
                  rec.priority === 'High' && 'bg-[rgba(255,68,68,0.12)] text-[#FF4444] border border-[rgba(255,68,68,0.25)]',
                  rec.priority === 'Medium' && 'bg-[rgba(255,179,71,0.12)] text-[#FFB347] border border-[rgba(255,179,71,0.25)]',
                  rec.priority === 'Low' && 'bg-[rgba(78,141,255,0.12)] text-[#4E8DFF] border border-[rgba(78,141,255,0.25)]',
                )}>
                  {rec.priority}
                </span>
                <p className="text-sm text-[#E0E4F0]">{rec.text}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Export Actions */}
      <motion.div
        custom={9}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap items-center justify-center gap-3 pb-6"
      >
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF] text-[#1A1D2E] text-sm font-semibold shadow-[0_2px_12px_rgba(78,141,255,0.3)] hover:shadow-[0_4px_20px_rgba(78,141,255,0.4)] transition-all">
          <Download className="w-4 h-4" />
          Export PDF
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[rgba(255,255,255,0.12)] text-[#8B95B8] text-sm font-medium hover:border-[rgba(78,141,255,0.4)] hover:text-[#E0E4F0] hover:bg-[rgba(78,141,255,0.08)] transition-all">
          <Share2 className="w-4 h-4" />
          Share Link
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[rgba(255,255,255,0.12)] text-[#8B95B8] text-sm font-medium hover:border-[rgba(78,141,255,0.4)] hover:text-[#E0E4F0] hover:bg-[rgba(78,141,255,0.08)] transition-all">
          <Calendar className="w-4 h-4" />
          Schedule Weekly
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[rgba(255,255,255,0.12)] text-[#8B95B8] text-sm font-medium hover:border-[rgba(78,141,255,0.4)] hover:text-[#E0E4F0] hover:bg-[rgba(78,141,255,0.08)] transition-all">
          <Mail className="w-4 h-4" />
          Email Report
        </button>
      </motion.div>
    </motion.div>
  );
}
