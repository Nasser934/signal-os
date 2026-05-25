import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw,
  Settings,
  Zap,
  PenTool,
  Brain,
  Activity,
  MessageCircle,
  Search,
  Calendar,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  XCircle,
  Twitter,
  Shield,
} from 'lucide-react';
import KPICard from '@/components/KPICard';
import GlassCard from '@/components/GlassCard';
import ScoreBadge from '@/components/ScoreBadge';
import DataTable from '@/components/DataTable';
import NangoConnect from '@/components/NangoConnect';
import XPostsFeed from '@/components/XPostsFeed';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
} from 'recharts';
import {
  mockPosts,
  mockCreators,
  mockHashtags,
  mockTopics,
  sparklineData,
  scoreHistory,
  forecastData,
} from '@/lib/mockData';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const childFadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
};

/* ------------------------------------------------------------------ */
/*  Chart data generators                                              */
/* ------------------------------------------------------------------ */
function generateDailyChartData(base: number, count: number, variance: number) {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(2024, 0, i + 1);
    const value = Math.round(base + Math.sin(i * 0.5) * variance + Math.random() * variance * 0.5);
    return {
      date: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      value: Math.max(0, value),
    };
  });
}

const postActivityData = generateDailyChartData(3, 30, 2);
const engagementRateData = generateDailyChartData(4.5, 30, 2);
const impressionsData = generateDailyChartData(150000, 30, 50000);
const scoreTrendData = scoreHistory.map((h) => ({
  date: new Date(h.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
  value: h.score,
}));

const radarData = [
  { subject: 'Structure', score: 88, fullMark: 100 },
  { subject: 'Hook', score: 82, fullMark: 100 },
  { subject: 'Engagement', score: 91, fullMark: 100 },
  { subject: 'Readability', score: 85, fullMark: 100 },
  { subject: 'Value', score: 79, fullMark: 100 },
];

const topTagsData = [...mockHashtags]
  .sort((a, b) => b.posts - a.posts)
  .slice(0, 5)
  .map((h) => ({ name: h.tag, value: h.posts, engagement: h.engagement }));

const topTopicsData = [...mockTopics]
  .sort((a, b) => b.posts - a.posts)
  .slice(0, 5)
  .map((t) => ({ name: t.name, value: t.posts, engagement: t.engagement }));

/* ------------------------------------------------------------------ */
/*  Feature card data                                                  */
/* ------------------------------------------------------------------ */
const featureCards = [
  { icon: PenTool, title: 'Draft Scorer', desc: 'Score your drafts before posting with 5-dimension AI analysis', route: '/drafts' },
  { icon: Brain, title: 'AI Insights', desc: 'AI-curated insights to act on now', route: '/insights' },
  { icon: Activity, title: 'Command Center', desc: 'Real-time first-hour performance monitoring', route: '/command' },
  { icon: MessageCircle, title: 'Reply Assistant', desc: 'Rank and prioritize reply opportunities', route: '/replies' },
  { icon: Search, title: 'Post Autopsy', desc: 'Compare predictions to actual performance', route: '/autopsy' },
  { icon: Calendar, title: 'Weekly Report', desc: 'Generate comprehensive weekly reports', route: '/weekly' },
];

/* ------------------------------------------------------------------ */
/*  Heatmap helpers                                                    */
/* ------------------------------------------------------------------ */
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
const heatmapData = [
  [2, 3, 4, 5, 6, 7, 6, 5, 3],
  [3, 4, 5, 6, 7, 8, 7, 6, 4],
  [2, 3, 4, 5, 6, 6, 5, 4, 3],
  [3, 4, 5, 7, 8, 7, 6, 5, 4],
  [2, 3, 4, 5, 6, 6, 5, 4, 3],
  [3, 4, 4, 5, 5, 5, 4, 3, 2],
  [2, 3, 3, 4, 4, 4, 3, 2, 2],
];

function getHeatColor(val: number) {
  const opacity = 0.1 + (val / 8) * 0.7;
  return `rgba(78, 141, 255, ${opacity})`;
}

/* ------------------------------------------------------------------ */
/*  Insight feed data                                                  */
/* ------------------------------------------------------------------ */
const recentInsights = [
  { id: 1, decision: 'ACT' as const, category: 'Engagement', text: 'Engagement rate dropped 15% on posts without media. Consider adding images or videos.', confidence: 87, time: '2 hours ago', evidence: '23% drop' },
  { id: 2, decision: 'MONITOR' as const, category: 'Timing', text: 'Your Tuesday 10AM posts are performing 34% better than average. Maintain this schedule.', confidence: 72, time: '5 hours ago', evidence: '+34% boost' },
  { id: 3, decision: 'ACT' as const, category: 'Content Type', text: 'Threads with 5+ tweets get 2.3x more profile clicks than single tweets.', confidence: 91, time: '1 day ago', evidence: '2.3x clicks' },
  { id: 4, decision: 'IGNORE' as const, category: 'Hashtag', text: '#TechNews usage is declining in your niche. No action needed yet.', confidence: 45, time: '2 days ago', evidence: '-12% usage' },
  { id: 5, decision: 'MONITOR' as const, category: 'Audience', text: 'Follower growth rate is slowing. Expected seasonal dip — monitor for 2 weeks.', confidence: 68, time: '3 days ago', evidence: '-8% growth' },
];

/* ------------------------------------------------------------------ */
/*  Decision badge                                                       */
/* ------------------------------------------------------------------ */
function DecisionBadge({ decision }: { decision: 'ACT' | 'MONITOR' | 'IGNORE' }) {
  const config = {
    ACT: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)', icon: Zap },
    MONITOR: { color: '#FFB347', bg: 'rgba(255,179,71,0.12)', icon: Eye },
    IGNORE: { color: '#5A6480', bg: 'rgba(90,100,128,0.12)', icon: XCircle },
  };
  const c = config[decision];
  const Icon = c.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ color: c.color, background: c.bg }}
    >
      <Icon className="w-3 h-3" />
      {decision}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Custom chart tooltip                                               */
/* ------------------------------------------------------------------ */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[rgba(32,36,54,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 shadow-xl">
      <p className="text-[#5A6480] text-xs mb-1">{label}</p>
      <p className="text-[#E0E4F0] text-sm font-data font-semibold">{payload[0].value.toLocaleString()}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Dashboard Component                                           */
/* ------------------------------------------------------------------ */
export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTableTab, setActiveTableTab] = useState<'posts' | 'replies' | 'media'>('posts');
  const [refreshSpin, setRefreshSpin] = useState(false);

  const handleRefresh = () => {
    setRefreshSpin(true);
    setTimeout(() => setRefreshSpin(false), 500);
  };

  /* --- Performance table data --- */
  const postsTableData = useMemo(
    () =>
      mockPosts.slice(0, 10).map((p) => ({
        id: p.id,
        content: p.content.length > 80 ? p.content.slice(0, 80) + '...' : p.content,
        date: new Date(p.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }),
        impressions: p.impressions,
        engagement: p.engagement,
        score: p.score,
      })),
    []
  );

  const repliesTableData = useMemo(
    () =>
      mockPosts.slice(0, 8).map((p) => ({
        id: p.id,
        content: `Reply to ${p.handle}: Great insights about ${p.topics[0] || 'this topic'}...`,
        replyTo: p.handle,
        date: new Date(p.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        impressions: Math.round(p.impressions * 0.15),
        likes: Math.round(p.likes * 0.1),
      })),
    []
  );

  const mediaTableData = useMemo(
    () =>
      mockPosts
        .filter((_, i) => i % 3 === 0)
        .slice(0, 6)
        .map((p) => ({
          id: p.id,
          media: `Media ${p.id}`,
          type: Math.random() > 0.5 ? 'Image' : 'Video',
          date: new Date(p.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
          impressions: p.impressions,
          engagement: p.engagement,
        })),
    []
  );

  /* --- Forecast mini chart data --- */
  const forecastMiniData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(2024, 0, 16 + i);
      return {
        date: date.toLocaleDateString('en', { weekday: 'short' }),
        bull: Math.round(forecastData.nextWeek.bull * (1 + i * 0.05)),
        base: Math.round(forecastData.nextWeek.base * (1 + i * 0.03)),
        bear: Math.round(forecastData.nextWeek.bear * (1 + i * 0.01)),
      };
    });
  }, []);

  return (
    <motion.div
      className="space-y-6 pb-8"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* ======== SECTION 1: Filter & Action Bar ======== */}
      <motion.div variants={childFadeUp} className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#5A6480]">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-[rgba(26,29,46,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-1.5 text-xs text-[#E0E4F0] outline-none focus:border-[rgba(78,141,255,0.5)]">
            <option>Last 7 Days</option>
            <option>Last 14 Days</option>
            <option>Last 30 Days</option>
          </select>
          <button
            onClick={handleRefresh}
            className="btn-secondary p-2"
          >
            <RefreshCw className={cn('w-4 h-4', refreshSpin && 'animate-spin')} />
          </button>
          <button onClick={() => navigate('/settings')} className="btn-secondary p-2">
            <Settings className="w-4 h-4" />
          </button>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[rgba(0,200,255,0.1)] text-[#00C8FF] text-xs font-medium">
            <Zap className="w-3 h-3" />
            AI-Powered
          </span>
        </div>
      </motion.div>

      {/* ======== SECTION 2: KPI Grid ======== */}
      <motion.div variants={childFadeUp}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KPICard
            title="Total Followers"
            value={12450}
            prefix=""
            delta={1.9}
            deltaLabel="+234 this period"
            sparklineData={sparklineData.followers}
            sparklineColor="#4E8DFF"
          />
          <KPICard
            title="Impressions"
            value={48.2}
            suffix="K"
            delta={12.3}
            deltaLabel="Avg 3.2K/day"
            sparklineData={sparklineData.impressions}
            sparklineColor="#00C8FF"
          />
          <KPICard
            title="Engagement Rate"
            value={4.8}
            suffix="%"
            delta={0.6}
            deltaLabel="vs 3.2% avg"
            sparklineData={sparklineData.engagement}
            sparklineColor="#FFB347"
          />
          <KPICard
            title="AI Content Score"
            value={87}
            suffix="/100"
            delta={3}
            deltaLabel="Excellent"
            sparklineData={sparklineData.score}
            sparklineColor="#4E8DFF"
          />
        </div>
      </motion.div>

      {/* ======== SECTION 3: Charts Row (2x2) ======== */}
      <motion.div variants={childFadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Post Activity */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#E0E4F0] font-display">Post Activity</h3>
              <p className="text-xs text-[#5A6480] mt-0.5">Posts published over time</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={postActivityData}>
              <defs>
                <linearGradient id="gradPosts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4E8DFF" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#4E8DFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5A6480' }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: '#5A6480' }} tickLine={false} axisLine={false} width={30} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#4E8DFF" strokeWidth={2} fill="url(#gradPosts)" />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-[#5A6480] mt-2">Peak: 3 posts on Tue</p>
        </GlassCard>

        {/* Engagement Rate */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#E0E4F0] font-display">Engagement Rate</h3>
              <p className="text-xs text-[#5A6480] mt-0.5">Avg engagement per post</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={engagementRateData}>
              <defs>
                <linearGradient id="gradEng" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFB347" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#FFB347" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5A6480' }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: '#5A6480' }} tickLine={false} axisLine={false} width={30} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#FFB347" strokeWidth={2} fill="url(#gradEng)" />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-[#5A6480] mt-2">Peak: 8.2% on Friday</p>
        </GlassCard>

        {/* Impressions */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#E0E4F0] font-display">Impressions</h3>
              <p className="text-xs text-[#5A6480] mt-0.5">Total impressions trend</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={impressionsData}>
              <defs>
                <linearGradient id="gradImp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C8FF" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#00C8FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5A6480' }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: '#5A6480' }} tickLine={false} axisLine={false} width={45} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#00C8FF" strokeWidth={2} fill="url(#gradImp)" />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-[#5A6480] mt-2">Peak: 12.4K impressions</p>
        </GlassCard>

        {/* AI Content Score */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#E0E4F0] font-display">AI Content Score</h3>
              <p className="text-xs text-[#5A6480] mt-0.5">Score trend over time</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={scoreTrendData}>
              <defs>
                <linearGradient id="gradScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4E8DFF" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#00C8FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5A6480' }} tickLine={false} axisLine={false} interval={1} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#5A6480' }} tickLine={false} axisLine={false} width={30} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#4E8DFF" strokeWidth={2} fill="url(#gradScore)" />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-[#5A6480] mt-2">Best: 92/100 on Wed</p>
        </GlassCard>
      </motion.div>

      {/* ======== SECTION 3.5: Nango X Integration ======== */}
      <motion.div variants={childFadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* X Account Status */}
        <div className="lg:col-span-1">
          <NangoConnect variant="card" showSync />
        </div>

        {/* X Posts Feed via Nango */}
        <div className="lg:col-span-2">
          <GlassCard className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Twitter className="w-4 h-4 text-[#4E8DFF]" />
                <h3 className="text-[#E0E4F0] font-semibold text-sm">X Posts via Nango</h3>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#5A6480]">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Nango OAuth</span>
              </div>
            </div>
            <XPostsFeed />
          </GlassCard>
        </div>
      </motion.div>

      {/* ======== SECTION 4: Performance Tables ======== */}
      <motion.div variants={childFadeUp}>
        <GlassCard>
          {/* Tabs */}
          <div className="flex gap-0 border-b border-[rgba(255,255,255,0.08)] mb-4">
            {(['posts', 'replies', 'media'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTableTab(tab)}
                className={cn(
                  'px-4 py-2 text-sm font-medium capitalize transition-colors relative',
                  activeTableTab === tab ? 'text-[#4E8DFF]' : 'text-[#8B95B8] hover:text-[#E0E4F0]'
                )}
              >
                {tab}
                {activeTableTab === tab && (
                  <motion.div
                    layoutId="tableTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4E8DFF]"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTableTab === 'posts' && (
              <motion.div
                key="posts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DataTable
                  data={postsTableData as unknown as Record<string, unknown>[]}
                  columns={[
                    { key: 'content', header: 'Content', width: 'w-[45%]' },
                    { key: 'date', header: 'Date' },
                    { key: 'impressions', header: 'Impressions', sortable: true, render: (row) => (row as Record<string, unknown>).impressions?.toLocaleString() },
                    { key: 'engagement', header: 'Eng. Rate', sortable: true, render: (row) => `${(row as Record<string, unknown>).engagement}%` },
                    {
                      key: 'score',
                      header: 'AI Score',
                      render: (row) => <ScoreBadge score={Number((row as Record<string, unknown>).score)} size="sm" />,
                    },
                  ]}
                />
              </motion.div>
            )}
            {activeTableTab === 'replies' && (
              <motion.div
                key="replies"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DataTable
                  data={repliesTableData as unknown as Record<string, unknown>[]}
                  columns={[
                    { key: 'content', header: 'Content', width: 'w-[45%]' },
                    { key: 'replyTo', header: 'Reply To' },
                    { key: 'date', header: 'Date' },
                    { key: 'impressions', header: 'Impressions', sortable: true, render: (row) => (row as Record<string, unknown>).impressions?.toLocaleString() },
                    { key: 'likes', header: 'Likes', sortable: true, render: (row) => (row as Record<string, unknown>).likes?.toLocaleString() },
                  ]}
                />
              </motion.div>
            )}
            {activeTableTab === 'media' && (
              <motion.div
                key="media"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DataTable
                  data={mediaTableData as unknown as Record<string, unknown>[]}
                  columns={[
                    { key: 'media', header: 'Media' },
                    {
                      key: 'type',
                      header: 'Type',
                      render: (row) => (
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          (row as Record<string, unknown>).type === 'Image'
                            ? 'text-[#00C8FF] bg-[rgba(0,200,255,0.1)]'
                            : 'text-[#9F7AEA] bg-[rgba(159,122,234,0.1)]'
                        )}>
                          {(row as Record<string, unknown>).type as string}
                        </span>
                      ),
                    },
                    { key: 'date', header: 'Date' },
                    { key: 'impressions', header: 'Impressions', sortable: true, render: (row) => (row as Record<string, unknown>).impressions?.toLocaleString() },
                    { key: 'engagement', header: 'Eng. Rate', render: (row) => `${(row as Record<string, unknown>).engagement}%` },
                  ]}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[rgba(255,255,255,0.08)]">
            <span className="text-xs text-[#5A6480]">Showing 1-10 of {mockPosts.length}</span>
            <div className="flex gap-2">
              <button className="btn-secondary px-3 py-1 text-xs">Previous</button>
              <button className="btn-secondary px-3 py-1 text-xs">Next</button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* ======== SECTION 5: AI Feature Grid ======== */}
      <motion.div variants={childFadeUp}>
        <h2 className="text-lg font-semibold font-display text-[#E0E4F0] mb-4">AI Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <GlassCard
                  className="cursor-pointer group h-full"
                  onClick={() => navigate(feat.route)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[rgba(78,141,255,0.1)] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-[#4E8DFF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#E0E4F0] font-display">{feat.title}</h3>
                      <p className="text-xs text-[#8B95B8] mt-1 leading-relaxed">{feat.desc}</p>
                      <div className="flex items-center gap-1 mt-3 text-[#4E8DFF] opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-medium">Navigate</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ======== SECTION 6 & 7: Best Times + Weekly Scorecard ======== */}
      <motion.div variants={childFadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Times to Post */}
        <GlassCard>
          <h3 className="text-sm font-semibold text-[#E0E4F0] font-display mb-4">Best Times to Post</h3>
          <div className="space-y-1.5">
            {/* Header row */}
            <div className="flex gap-1">
              <div className="w-10 flex-shrink-0" />
              {hours.map((h) => (
                <div key={h} className="flex-1 text-center text-[10px] text-[#5A6480]">{h}</div>
              ))}
            </div>
            {days.map((day, di) => (
              <div key={day} className="flex gap-1 items-center">
                <div className="w-10 text-[10px] text-[#5A6480] flex-shrink-0">{day}</div>
                {hours.map((_, hi) => (
                  <motion.div
                    key={hi}
                    className="flex-1 h-5 rounded-sm"
                    style={{ background: getHeatColor(heatmapData[di][hi]) }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: di * 9 * 0.005 + hi * 0.005, duration: 0.3 }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-[10px] text-[#5A6480]">Low</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5, 6, 7].map((v) => (
                <div key={v} className="w-4 h-3 rounded-sm" style={{ background: getHeatColor(v) }} />
              ))}
            </div>
            <span className="text-[10px] text-[#5A6480]">Optimal</span>
          </div>
          <p className="text-xs text-[#8B95B8] mt-3">
            Top 3: <span className="text-[#4E8DFF]">1. Tuesday 10AM</span> | <span className="text-[#4E8DFF]">2. Thursday 2PM</span> | <span className="text-[#4E8DFF]">3. Saturday 9AM</span>
          </p>
        </GlassCard>

        {/* Weekly Scorecard */}
        <GlassCard>
          <h3 className="text-sm font-semibold text-[#E0E4F0] font-display mb-4">Weekly Scorecard</h3>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold font-data text-[#E0E4F0] letterpress">84</span>
                <span className="text-sm text-[#5A6480] font-data">/100</span>
              </div>
              <div className="mt-2">
                <ScoreBadge score={84} size="sm" />
              </div>
              <p className="text-xs text-[#8B95B8] mt-3">Up 4 points from last week</p>
              <button onClick={() => navigate('/scorecard')} className="btn-secondary mt-4 text-xs py-2 px-4">
                View Full Scorecard
              </button>
            </div>
            <div className="flex-shrink-0">
              <ResponsiveContainer width={120} height={120}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#5A6480' }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#4E8DFF"
                    fill="#4E8DFF"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* ======== SECTION 8: Top Tags & Topics ======== */}
      <motion.div variants={childFadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-sm font-semibold text-[#E0E4F0] font-display mb-4">Top Performing Tags</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topTagsData} layout="vertical" barSize={20}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#5A6480' }} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#8B95B8' }} tickLine={false} axisLine={false} width={70} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" fill="#4E8DFF" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-semibold text-[#E0E4F0] font-display mb-4">Top Performing Topics</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topTopicsData} layout="vertical" barSize={20}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#5A6480' }} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#8B95B8' }} tickLine={false} axisLine={false} width={100} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" fill="#00C8FF" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </motion.div>

      {/* ======== SECTION 9: Quality Matrix ======== */}
      <motion.div variants={childFadeUp}>
        <GlassCard>
          <h3 className="text-sm font-semibold text-[#E0E4F0] font-display mb-1">Creator Quality Matrix</h3>
          <p className="text-xs text-[#5A6480] mb-4">Quality scores for accounts you follow</p>
          <DataTable
            data={mockCreators.slice(0, 8) as unknown as Record<string, unknown>[]}
            columns={[
              {
                key: 'name',
                header: 'Creator',
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <img src={(row as Record<string, unknown>).avatar as string} alt="" className="w-6 h-6 rounded-full" />
                    <div>
                      <div className="text-sm text-[#E0E4F0]">{(row as Record<string, unknown>).name as string}</div>
                      <div className="text-xs text-[#5A6480]">{(row as Record<string, unknown>).handle as string}</div>
                    </div>
                  </div>
                ),
              },
              { key: 'qualityScore', header: 'Score', sortable: true, render: (row) => <span className="font-data text-[#4E8DFF]">{(row as Record<string, unknown>).qualityScore as number}</span> },
              {
                key: 'qualityScore',
                header: 'Grade',
                render: (row) => {
                  const s = Number((row as Record<string, unknown>).qualityScore);
                  let grade = 'C';
                  let color = '#FF4444';
                  if (s >= 90) { grade = 'A+'; color = '#22C55E'; }
                  else if (s >= 80) { grade = 'A'; color = '#00C8FF'; }
                  else if (s >= 70) { grade = 'B+'; color = '#4E8DFF'; }
                  else if (s >= 60) { grade = 'B'; color = '#FFB347'; }
                  return <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ color, background: `${color}18` }}>{grade}</span>;
                },
              },
              { key: 'engagement', header: 'Engagement', render: (row) => `${(row as Record<string, unknown>).engagement}%` },
              { key: 'niche', header: 'Niche' },
            ]}
          />
        </GlassCard>
      </motion.div>

      {/* ======== SECTION 10: Recent Insights ======== */}
      <motion.div variants={childFadeUp}>
        <GlassCard>
          <h3 className="text-sm font-semibold text-[#E0E4F0] font-display mb-4">Recent AI Insights</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {recentInsights.map((insight) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.06, duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                className="p-3 rounded-lg border border-[rgba(255,255,255,0.06)] hover:border-[rgba(78,141,255,0.2)] transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <DecisionBadge decision={insight.decision} />
                  <span className="text-[10px] text-[#5A6480] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.05)]">{insight.category}</span>
                  <span className="text-[10px] text-[#5A6480] ml-auto">{insight.time}</span>
                </div>
                <p className="text-xs text-[#E0E4F0] leading-relaxed">{insight.text}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-[#00C8FF] font-data">Evidence: {insight.evidence}</span>
                  <span className="text-[10px] text-[#5A6480]">{insight.confidence}% confidence</span>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* ======== SECTION 11 & 12: Topic Clusters + Tag Performance ======== */}
      <motion.div variants={childFadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-sm font-semibold text-[#E0E4F0] font-display mb-4">Topic Clusters</h3>
          <div className="flex flex-wrap gap-2">
            {mockTopics.map((topic, i) => {
              const sizes = [80, 100, 70, 60, 90, 65, 75, 85];
              const colors = ['#4E8DFF', '#00C8FF', '#FFB347', '#22C55E', '#9F7AEA'];
              return (
                <motion.div
                  key={topic.name}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                  className="inline-flex items-center justify-center rounded-full cursor-pointer hover:scale-110 transition-transform border"
                  style={{
                    width: sizes[i % sizes.length],
                    height: sizes[i % sizes.length],
                    background: `${colors[i % colors.length]}15`,
                    borderColor: `${colors[i % colors.length]}30`,
                  }}
                  title={`${topic.name}: ${topic.posts} posts, ${topic.engagement}% engagement`}
                >
                  <span className="text-[10px] text-center px-2 leading-tight" style={{ color: colors[i % colors.length] }}>
                    {topic.name.split(' ')[0]}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-semibold text-[#E0E4F0] font-display mb-4">Tag Performance</h3>
          <p className="text-xs text-[#5A6480] mb-3">Top-right = high frequency + high engagement</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockHashtags.slice(0, 8).map((h) => ({ name: h.tag, frequency: h.posts / 1000, engagement: h.engagement }))}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#5A6480' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#5A6480' }} tickLine={false} axisLine={false} width={30} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="engagement" stroke="#00C8FF" strokeWidth={2} fill="url(#sparklineGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </motion.div>

      {/* ======== SECTION 13: Forecast Summary ======== */}
      <motion.div variants={childFadeUp}>
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#E0E4F0] font-display">7-Day Forecast</h3>
              <p className="text-xs text-[#5A6480] mt-0.5">Bull / Base / Bear scenario summary</p>
            </div>
            <button onClick={() => navigate('/forecasting')} className="btn-secondary text-xs py-2 px-4">
              View Full Forecast
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={forecastMiniData}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5A6480' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#5A6480' }} tickLine={false} axisLine={false} width={45} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="bull" stroke="#22C55E" strokeWidth={2} fill="#22C55E" fillOpacity={0.08} />
              <Area type="monotone" dataKey="base" stroke="#4E8DFF" strokeWidth={2} strokeDasharray="4 4" fill="#4E8DFF" fillOpacity={0.12} />
              <Area type="monotone" dataKey="bear" stroke="#FF4444" strokeWidth={2} fill="#FF4444" fillOpacity={0.08} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#22C55E]" />
              <span className="text-xs text-[#8B95B8]">Best case:</span>
              <span className="text-xs font-semibold text-[#22C55E] font-data">+450 followers</span>
            </div>
            <div className="flex items-center gap-2">
              <Minus className="w-4 h-4 text-[#4E8DFF]" />
              <span className="text-xs text-[#8B95B8]">Base:</span>
              <span className="text-xs font-semibold text-[#4E8DFF] font-data">+180</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-[#FF4444]" />
              <span className="text-xs text-[#8B95B8]">Worst:</span>
              <span className="text-xs font-semibold text-[#FF4444] font-data">-50</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
