import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import { mockPosts, sentimentTimeline } from '@/lib/mockData';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';
import {
  Smile, Meh, Frown, ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Mock keyword sentiment data                                       */
/* ------------------------------------------------------------------ */
const keywordData = [
  { keyword: 'amazing', sentiment: 'Positive', score: 87, mentions: 23, context: 'Used in 12 posts' },
  { keyword: 'breakthrough', sentiment: 'Positive', score: 92, mentions: 18, context: 'Used in 9 posts' },
  { keyword: 'terrible', sentiment: 'Negative', score: -72, mentions: 8, context: 'Used in 5 posts' },
  { keyword: 'frustrating', sentiment: 'Negative', score: -58, mentions: 12, context: 'Used in 7 posts' },
  { keyword: 'average', sentiment: 'Neutral', score: 5, mentions: 15, context: 'Used in 10 posts' },
  { keyword: 'helpful', sentiment: 'Positive', score: 78, mentions: 31, context: 'Used in 18 posts' },
  { keyword: 'confusing', sentiment: 'Negative', score: -45, mentions: 9, context: 'Used in 6 posts' },
  { keyword: 'solid', sentiment: 'Positive', score: 62, mentions: 20, context: 'Used in 14 posts' },
  { keyword: 'boring', sentiment: 'Negative', score: -63, mentions: 7, context: 'Used in 4 posts' },
  { keyword: 'neutral', sentiment: 'Neutral', score: 2, mentions: 11, context: 'Used in 8 posts' },
  { keyword: 'excellent', sentiment: 'Positive', score: 95, mentions: 14, context: 'Used in 7 posts' },
  { keyword: 'disappointing', sentiment: 'Negative', score: -68, mentions: 6, context: 'Used in 4 posts' },
];

/* ------------------------------------------------------------------ */
/*  Sentiment distribution data                                       */
/* ------------------------------------------------------------------ */
const distributionData = [
  { name: 'Positive', value: 68, color: '#22C55E' },
  { name: 'Neutral', value: 18, color: '#4E8DFF' },
  { name: 'Negative', value: 14, color: '#FF4444' },
];

/* ------------------------------------------------------------------ */
/*  Content type sentiment data                                       */
/* ------------------------------------------------------------------ */
const contentTypeData = [
  { type: 'Posts', positive: 62, neutral: 22, negative: 16 },
  { type: 'Replies', positive: 71, neutral: 15, negative: 14 },
  { type: 'Media', positive: 75, neutral: 12, negative: 13 },
];

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                 */
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
/*  Semi-circular gauge component                                     */
/* ------------------------------------------------------------------ */
function SentimentGauge({ score }: { score: number }) {
  const radius = 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * Math.PI; // Half circle
  const strokeDashoffset = circumference - ((score + 100) / 200) * circumference;

  const getColor = (s: number) => {
    if (s >= 30) return '#22C55E';
    if (s >= -10) return '#FFB347';
    return '#FF4444';
  };

  const getLabel = (s: number) => {
    if (s >= 50) return 'Very Positive';
    if (s >= 10) return 'Positive';
    if (s >= -10) return 'Neutral';
    if (s >= -50) return 'Negative';
    return 'Very Negative';
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={radius * 2.5} height={radius * 1.4} viewBox={`0 0 ${radius * 2.5} ${radius * 1.4}`}>
        {/* Background arc */}
        <path
          d={`M ${strokeWidth / 2 + 20} ${radius * 1.2} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2.5 - strokeWidth / 2 - 20} ${radius * 1.2}`}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Foreground arc */}
        <motion.path
          d={`M ${strokeWidth / 2 + 20} ${radius * 1.2} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2.5 - strokeWidth / 2 - 20} ${radius * 1.2}`}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.3 }}
        />
        {/* Center text */}
        <text x={radius * 1.25} y={radius * 0.9} textAnchor="middle" fill="#E0E4F0" fontSize="28" fontWeight="700" fontFamily="JetBrains Mono, monospace">
          {score > 0 ? `+${score}` : score}
        </text>
        <text x={radius * 1.25} y={radius * 1.15} textAnchor="middle" fill="#8B95B8" fontSize="12" fontFamily="Inter, sans-serif">
          {getLabel(score)}
        </text>
      </svg>
      <div className="flex items-center gap-6 mt-2">
        <div className="text-center">
          <div className="text-lg font-bold font-data text-[#22C55E]">68%</div>
          <div className="text-xs text-[#5A6480]">Positive</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold font-data text-[#4E8DFF]">18%</div>
          <div className="text-xs text-[#5A6480]">Neutral</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold font-data text-[#FF4444]">14%</div>
          <div className="text-xs text-[#5A6480]">Negative</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Custom tooltip for charts                                         */
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
/*  Main Sentiment Page                                               */
/* ------------------------------------------------------------------ */
export default function Sentiment() {
  const [timeframe, setTimeframe] = useState('7d');
  const [contentType, setContentType] = useState('all');
  const [activeSlice, setActiveSlice] = useState<number | null>(null);

  /* Derive top positive and negative posts from mockPosts */
  const topPositive = useMemo(() =>
    [...mockPosts]
      .filter(p => p.sentiment === 'positive')
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5),
    [],
  );

  const topNegative = useMemo(() =>
    [...mockPosts]
      .filter(p => p.sentiment !== 'positive')
      .sort((a, b) => b.replies - a.likes)
      .slice(0, 5),
    [],
  );

  /* Overall sentiment score */
  const overallScore = 42;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div>
        <motion.h1
          className="font-display font-bold text-2xl text-[#E0E4F0] tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          Sentiment
        </motion.h1>
        <motion.p
          className="text-[#8B95B8] text-sm mt-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          Emotional tone analysis and audience mood tracking
        </motion.p>
      </div>

      {/* Filter Bar */}
      <motion.div
        className="flex flex-wrap items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <div className="relative">
          <select
            value={timeframe}
            onChange={e => setTimeframe(e.target.value)}
            className="appearance-none bg-[rgba(26,29,46,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg pl-3 pr-8 py-2 text-sm text-[#E0E4F0] focus:outline-none focus:border-[rgba(78,141,255,0.5)] cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#5A6480] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={contentType}
            onChange={e => setContentType(e.target.value)}
            className="appearance-none bg-[rgba(26,29,46,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg pl-3 pr-8 py-2 text-sm text-[#E0E4F0] focus:outline-none focus:border-[rgba(78,141,255,0.5)] cursor-pointer"
          >
            <option value="all">All Content</option>
            <option value="posts">Posts</option>
            <option value="replies">Replies</option>
            <option value="media">Media</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#5A6480] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </motion.div>

      {/* Sentiment Overview Row: Gauge + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Sentiment Gauge */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard>
            <h3 className="font-display font-semibold text-lg text-[#E0E4F0] mb-1">Overall Sentiment</h3>
            <p className="text-xs text-[#5A6480] mb-5">Aggregated emotional tone from all content</p>
            <SentimentGauge score={overallScore} />
          </GlassCard>
        </motion.div>

        {/* Sentiment Trend */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard>
            <h3 className="font-display font-semibold text-lg text-[#E0E4F0] mb-1">Sentiment Trend</h3>
            <p className="text-xs text-[#5A6480] mb-5">7-day emotional tone trajectory</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={sentimentTimeline}>
                <defs>
                  <linearGradient id="sentimentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: '#5A6480', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#5A6480', fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="positive"
                  stroke="#22C55E"
                  strokeWidth={2}
                  fill="url(#sentimentGrad)"
                  name="Positive %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>
      </div>

      {/* Sentiment Distribution */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
        <GlassCard>
          <h3 className="font-display font-semibold text-lg text-[#E0E4F0] mb-1">Sentiment Distribution</h3>
          <p className="text-xs text-[#5A6480] mb-5">Breakdown of emotional responses</p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ResponsiveContainer width={280} height={220}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveSlice(index)}
                  onMouseLeave={() => setActiveSlice(null)}
                >
                  {distributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={activeSlice === null || activeSlice === index ? 1 : 0.4}
                      style={{ transition: 'opacity 0.2s, transform 0.2s', transform: activeSlice === index ? 'scale(1.05)' : 'scale(1)', transformOrigin: 'center' }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3">
              {distributionData.map((item, i) => (
                <motion.div
                  key={item.name}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-[#E0E4F0] w-20">{item.name}</span>
                  <span className="text-sm font-bold font-data" style={{ color: item.color }}>{item.value}%</span>
                  <span className="text-xs text-[#5A6480]">
                    {Math.round((item.value / 100) * mockPosts.length)} posts
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Sentiment by Content Type */}
      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
        <GlassCard>
          <h3 className="font-display font-semibold text-lg text-[#E0E4F0] mb-1">Sentiment by Content Type</h3>
          <p className="text-xs text-[#5A6480] mb-5">How sentiment varies across content formats</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={contentTypeData} barGap={4} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="type" tick={{ fill: '#8B95B8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5A6480', fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#8B95B8' }} />
              <Bar dataKey="positive" name="Positive" fill="#22C55E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="neutral" name="Neutral" fill="#4E8DFF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="negative" name="Negative" fill="#FF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </motion.div>

      {/* Top Posts by Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Positive */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Smile className="w-5 h-5 text-[#22C55E]" />
              <h3 className="font-display font-semibold text-[#E0E4F0]">Most Positive Reception</h3>
            </div>
            <div className="space-y-3">
              {topPositive.map((post, i) => (
                <motion.div
                  key={post.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-[rgba(34,197,94,0.06)] border border-[rgba(34,197,94,0.1)]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.04, duration: 0.4 }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#E0E4F0] line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-bold font-data text-[#22C55E]">+{post.score}</span>
                      <span className="text-xs text-[#5A6480]">{post.likes.toLocaleString()} likes</span>
                      <span className="text-xs text-[#5A6480]">{post.replies} replies</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Top Negative */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Frown className="w-5 h-5 text-[#FF4444]" />
              <h3 className="font-display font-semibold text-[#E0E4F0]">Most Negative Reception</h3>
            </div>
            <div className="space-y-3">
              {topNegative.map((post, i) => (
                <motion.div
                  key={post.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-[rgba(255,68,68,0.06)] border border-[rgba(255,68,68,0.1)]"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.04, duration: 0.4 }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#E0E4F0] line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-bold font-data text-[#FF4444]">{post.score > 50 ? '+' : '-'}{post.score - 50}</span>
                      <span className="text-xs text-[#5A6480]">{post.likes.toLocaleString()} likes</span>
                      <span className="text-xs text-[#5A6480]">{post.replies} replies</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Keyword Sentiment Table */}
      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
        <GlassCard>
          <h3 className="font-display font-semibold text-lg text-[#E0E4F0] mb-1">Keyword Sentiment</h3>
          <p className="text-xs text-[#5A6480] mb-5">Emotional associations of key terms</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.08)]">
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Keyword</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Sentiment</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Score</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Mentions</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Context</th>
                </tr>
              </thead>
              <tbody>
                {keywordData.map((kw, i) => (
                  <motion.tr
                    key={kw.keyword}
                    className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(78,141,255,0.04)] transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.03 }}
                  >
                    <td className="py-3 px-4 text-sm text-[#E0E4F0] font-medium">{kw.keyword}</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md',
                        kw.sentiment === 'Positive' && 'text-[#22C55E] bg-[rgba(34,197,94,0.12)]',
                        kw.sentiment === 'Neutral' && 'text-[#4E8DFF] bg-[rgba(78,141,255,0.12)]',
                        kw.sentiment === 'Negative' && 'text-[#FF4444] bg-[rgba(255,68,68,0.12)]',
                      )}>
                        {kw.sentiment === 'Positive' && <Smile className="w-3 h-3" />}
                        {kw.sentiment === 'Neutral' && <Meh className="w-3 h-3" />}
                        {kw.sentiment === 'Negative' && <Frown className="w-3 h-3" />}
                        {kw.sentiment}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-data font-semibold" style={{ color: kw.score > 0 ? '#22C55E' : kw.score < 0 ? '#FF4444' : '#4E8DFF' }}>
                      {kw.score > 0 ? `+${kw.score}` : kw.score}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#E0E4F0]">{kw.mentions}</td>
                    <td className="py-3 px-4 text-sm text-[#8B95B8]">{kw.context}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
