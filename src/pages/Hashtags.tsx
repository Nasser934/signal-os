import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
} from 'recharts';
import {
  Hash,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  PlusCircle,
  BarChart2,
  Target,
  Search,
  ChevronDown,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import Sparkline from '@/components/Sparkline';
import { mockHashtags } from '@/lib/mockData';

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                   */
/* ------------------------------------------------------------------ */

interface Hashtag {
  tag: string;
  posts: number;
  engagement: number;
  trending: boolean;
  velocity: number;
}

const easing = [0.22, 1, 0.36, 1] as [number, number, number, number];

const sortOptions = [
  { value: 'posts', label: 'Usage Count' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'velocity', label: 'Trending' },
];

const timeframeOptions = ['All Time', 'Last 7 Days', 'Last 30 Days'];

/* ------------------------------------------------------------------ */
/*  Saturation helpers                                                  */
/* ------------------------------------------------------------------ */

type SaturationLevel = 'oversaturated' | 'balanced' | 'underutilized';

function getSaturationLevel(tag: Hashtag): SaturationLevel {
  if (tag.posts > 50000) return 'oversaturated';
  if (tag.posts > 20000 && tag.engagement > 4.5) return 'balanced';
  if (tag.engagement > 5.5) return 'underutilized';
  return 'balanced';
}

function getSaturationConfig(level: SaturationLevel) {
  const configs = {
    oversaturated: {
      label: 'Oversaturated',
      color: '#FF4444',
      icon: AlertCircle,
      description: 'Tags used too frequently, diminishing returns',
    },
    balanced: {
      label: 'Balanced',
      color: '#22C55E',
      icon: CheckCircle,
      description: 'Tags with optimal usage and performance',
    },
    underutilized: {
      label: 'Underutilized',
      color: '#FFB347',
      icon: PlusCircle,
      description: 'High-performing tags not used enough',
    },
  };
  return configs[level];
}

function getTrendSparkline(tag: Hashtag): number[] {
  // Deterministic pseudo-random sparkline from tag data
  const seed = tag.tag.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  return Array.from({ length: 7 }, (_, i) => {
    const base = tag.engagement;
    const variance = Math.sin(seed + i * 1.3) * 1.5;
    return Math.max(1, base + variance);
  });
}

/* ------------------------------------------------------------------ */
/*  Custom Chart Tooltip                                                */
/* ------------------------------------------------------------------ */

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: unknown; name: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs"
      style={{
        backgroundColor: 'rgba(32, 36, 54, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      <div className="font-semibold text-[#E0E4F0] mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="text-[#8B95B8]">
          {p.name}: <span className="text-[#E0E4F0] font-data">{String(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scatter Tooltip                                                     */
/* ------------------------------------------------------------------ */

function ScatterTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { tag: string; posts: number; engagement: number } }> }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs"
      style={{
        backgroundColor: 'rgba(32, 36, 54, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      <div className="font-semibold text-[#E0E4F0] mb-1">{data.tag}</div>
      <div className="text-[#8B95B8]">
        Posts: <span className="text-[#E0E4F0] font-data">{data.posts.toLocaleString()}</span>
      </div>
      <div className="text-[#8B95B8]">
        Engagement: <span className="text-[#E0E4F0] font-data">{data.engagement}%</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Hashtags Page                                                  */
/* ------------------------------------------------------------------ */

export default function Hashtags() {
  const [sortBy, setSortBy] = useState('posts');
  const [timeframe, setTimeframe] = useState('All Time');
  const [searchQuery, setSearchQuery] = useState('');

  /* Filter & sort */
  const filteredHashtags = useMemo(() => {
    let tags = [...mockHashtags];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      tags = tags.filter((t) => t.tag.toLowerCase().includes(q));
    }

    tags.sort((a, b) => {
      if (sortBy === 'posts') return b.posts - a.posts;
      if (sortBy === 'engagement') return b.engagement - a.engagement;
      if (sortBy === 'velocity') return b.velocity - a.velocity;
      return 0;
    });

    return tags;
  }, [sortBy, searchQuery]);

  /* Top 10 for charts */
  const topTags = useMemo(() => filteredHashtags.slice(0, 10), [filteredHashtags]);

  /* Chart data */
  const barData = useMemo(
    () =>
      topTags.map((t) => ({
        name: t.tag.replace('#', ''),
        count: Math.round(t.posts / 1000),
      })),
    [topTags]
  );

  const scatterData = useMemo(
    () =>
      filteredHashtags.map((t) => ({
        tag: t.tag,
        posts: Math.round(t.posts / 1000),
        engagement: t.engagement,
        impressions: t.velocity,
      })),
    [filteredHashtags]
  );

  /* Saturation counts */
  const saturationCounts = useMemo(() => {
    const counts: Record<SaturationLevel, number> = {
      oversaturated: 0,
      balanced: 0,
      underutilized: 0,
    };
    filteredHashtags.forEach((t) => {
      counts[getSaturationLevel(t)]++;
    });
    return counts;
  }, [filteredHashtags]);

  /* Trending cards */
  const trendingTags = useMemo(() => {
    return [...filteredHashtags]
      .filter((t) => t.trending)
      .sort((a, b) => b.velocity - a.velocity)
      .slice(0, 4);
  }, [filteredHashtags]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easing }}
      >
        <h1 className="font-display font-bold text-2xl text-[#E0E4F0] tracking-tight mb-1">
          Hashtags
        </h1>
        <p className="text-sm text-[#8B95B8]">
          Tag saturation and performance analysis
        </p>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: easing }}
        className="glass-card"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input appearance-none pr-8 text-sm py-2 cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6480] pointer-events-none"
            />
          </div>

          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="form-input appearance-none pr-8 text-sm py-2 cursor-pointer"
            >
              {timeframeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6480] pointer-events-none"
            />
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A6480]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hashtags..."
              className="form-input w-full pl-9 text-sm py-2"
            />
          </div>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tag Usage Frequency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: easing }}
        >
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={16} className="text-[#4E8DFF]" />
              <h3 className="text-sm font-semibold text-[#E0E4F0] font-display">
                Tag Usage Frequency
              </h3>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#8B95B8', fontSize: 11 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                    tickLine={false}
                    angle={-30}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    tick={{ fill: '#5A6480', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    label={{ value: 'K posts', angle: -90, position: 'insideLeft', fill: '#5A6480', fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#4E8DFF" fillOpacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tag Performance Scatter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: easing }}
        >
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Target size={16} className="text-[#00C8FF]" />
              <h3 className="text-sm font-semibold text-[#E0E4F0] font-display">
                Tag Performance
              </h3>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    type="number"
                    dataKey="posts"
                    name="Usage"
                    tick={{ fill: '#5A6480', fontSize: 11 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                    tickLine={false}
                    label={{ value: 'Usage (K)', position: 'bottom', fill: '#5A6480', fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="engagement"
                    name="Engagement"
                    tick={{ fill: '#5A6480', fontSize: 11 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                    tickLine={false}
                    label={{ value: 'Eng. %', angle: -90, position: 'insideLeft', fill: '#5A6480', fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="impressions" range={[40, 200]} />
                  <Tooltip content={<ScatterTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                  <Scatter data={scatterData} fill="#00C8FF" fillOpacity={0.6}>
                    {scatterData.map((_, i) => (
                      <Cell key={i} fill="#00C8FF" fillOpacity={0.6} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Saturation Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: easing }}
      >
        <GlassCard>
          <h3 className="text-sm font-semibold text-[#E0E4F0] font-display mb-4">
            Saturation Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['oversaturated', 'balanced', 'underutilized'] as SaturationLevel[]).map(
              (level, i) => {
                const config = getSaturationConfig(level);
                const Icon = config.icon;
                return (
                  <motion.div
                    key={level}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.06, ease: easing }}
                    className="rounded-lg p-4"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      borderLeft: `4px solid ${config.color}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={18} style={{ color: config.color }} />
                      <span className="text-sm font-semibold text-[#E0E4F0]">
                        {config.label}
                      </span>
                    </div>
                    <div
                      className="text-2xl font-bold font-data mb-1"
                      style={{ color: config.color }}
                    >
                      {saturationCounts[level]} tags
                    </div>
                    <p className="text-xs text-[#5A6480]">{config.description}</p>
                  </motion.div>
                );
              }
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Top Hashtags Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: easing }}
      >
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#E0E4F0] font-display">
              Top Hashtags
            </h3>
            <Hash size={16} className="text-[#5A6480]" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.08)]">
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">
                    Hashtag
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">
                    Usage Count
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">
                    Avg Impressions
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">
                    Avg Engagement
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">
                    Saturation
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">
                    Trend
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredHashtags.map((tag, i) => {
                  const saturation = getSaturationLevel(tag);
                  const satConfig = getSaturationConfig(saturation);
                  return (
                    <motion.tr
                      key={tag.tag}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.03, ease: easing }}
                      className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(78,141,255,0.04)] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-[#4E8DFF]">{tag.tag}</span>
                      </td>
                      <td className="py-3 px-4 text-sm font-data text-[#E0E4F0]">
                        {Math.round(tag.posts / 1000)}K
                      </td>
                      <td className="py-3 px-4 text-sm font-data text-[#E0E4F0]">
                        {(tag.posts * 12.5).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-data text-[#E0E4F0]">{tag.engagement}%</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: `${satConfig.color}18`,
                            color: satConfig.color,
                          }}
                        >
                          {satConfig.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Sparkline
                          data={getTrendSparkline(tag)}
                          width={80}
                          height={28}
                          color={tag.trending ? '#22C55E' : '#8B95B8'}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button className="p-1.5 rounded-md hover:bg-[rgba(78,141,255,0.08)] text-[#5A6480] hover:text-[#4E8DFF] transition-colors">
                            <BarChart2 size={14} />
                          </button>
                          <button className="p-1.5 rounded-md hover:bg-[rgba(78,141,255,0.08)] text-[#5A6480] hover:text-[#00C8FF] transition-colors">
                            <Target size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>

      {/* Trending Tag Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: easing }}
      >
        <h3 className="text-sm font-semibold text-[#E0E4F0] font-display mb-3">
          Trending Opportunities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingTags.map((tag, i) => (
            <motion.div
              key={tag.tag}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.35 + i * 0.08, ease: easing }}
            >
              <GlassCard className="h-full">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold font-data text-[#E0E4F0]">
                      {tag.tag}
                    </span>
                    <TrendingUp size={16} className="text-[#22C55E]" />
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#22C55E]">
                    <TrendingUp size={12} />
                    <span className="font-semibold font-data">+{tag.velocity}%</span>
                    <span className="text-[#5A6480]">this week</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#8B95B8]">Avg Engagement</span>
                      <span className="font-data text-[#E0E4F0]">{tag.engagement}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#8B95B8]">Posts / day</span>
                      <span className="font-data text-[#E0E4F0]">
                        {Math.round(tag.posts / 365).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button className="btn-primary w-full text-xs py-2 justify-center mt-2">
                    Use in next draft
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Empty state */}
      {filteredHashtags.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Hash size={48} className="text-[#5A6480] mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-[#8B95B8] mb-1">
            No hashtags found
          </h3>
          <p className="text-sm text-[#5A6480]">
            Try adjusting your search to find more tags
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
