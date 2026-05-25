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
  Tag,
  TrendingUp,
  TrendingDown,
  Smile,
  Meh,
  Frown,
  Network,
  Search,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/GlassCard';
import { mockTopics } from '@/lib/mockData';

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                   */
/* ------------------------------------------------------------------ */

interface Topic {
  name: string;
  posts: number;
  engagement: number;
  sentiment: number;
  trend: string;
  related: string[];
}

const easing = [0.22, 1, 0.36, 1] as [number, number, number, number];

const timeframeOptions = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days'];

const clusterOptions = [
  'All Clusters',
  'Technology',
  'Business',
  'Creative',
  'Lifestyle',
];

/* ------------------------------------------------------------------ */
/*  Sentiment helpers                                                   */
/* ------------------------------------------------------------------ */

function getSentimentLevel(score: number): 'positive' | 'neutral' | 'negative' {
  if (score >= 65) return 'positive';
  if (score >= 50) return 'neutral';
  return 'negative';
}

function getSentimentConfig(level: 'positive' | 'neutral' | 'negative') {
  const configs = {
    positive: { color: '#22C55E', icon: Smile, label: 'Positive' },
    neutral: { color: '#4E8DFF', icon: Meh, label: 'Neutral' },
    negative: { color: '#FF4444', icon: Frown, label: 'Negative' },
  };
  return configs[level];
}

function getTrendSparkline(topic: Topic): number[] {
  const seed = topic.name.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  return Array.from({ length: 7 }, (_, i) => {
    const base = topic.engagement;
    const variance = Math.sin(seed + i * 1.7) * 1.2;
    return Math.max(1, base + variance);
  });
}

/* ------------------------------------------------------------------ */
/*  Topic Performance Sparkline                                         */
/* ------------------------------------------------------------------ */

function TopicMiniSparkline({ data, color = '#4E8DFF' }: { data: number[]; color?: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 60;
  const h = 24;
  const pad = 2;

  const points = data.map((val, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: pad + h - pad * 2 - ((val - min) / range) * (h - pad * 2),
  }));

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x} ${points[i].y}`;
  }

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Custom Tooltip                                                      */
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
/*  Bubble Chart (simplified with Scatter)                              */
/* ------------------------------------------------------------------ */

function TopicBubbleChart({ topics }: { topics: Topic[] }) {
  const data = useMemo(
    () =>
      topics.map((t, i) => {
        const sentiment = getSentimentLevel(t.sentiment);
        const colors = { positive: '#22C55E', neutral: '#4E8DFF', negative: '#FF4444' };
        return {
          x: i * 1.2 + Math.sin(i * 2.1) * 0.5,
          y: t.engagement,
          z: t.posts / 10,
          name: t.name,
          posts: t.posts,
          sentiment: t.sentiment,
          color: colors[sentiment],
        };
      }),
    [topics]
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          type="number"
          dataKey="x"
          hide
          domain={[-2, data.length + 2]}
        />
        <YAxis
          type="number"
          dataKey="y"
          tick={{ fill: '#5A6480', fontSize: 11 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
          tickLine={false}
          label={{ value: 'Engagement %', angle: -90, position: 'insideLeft', fill: '#5A6480', fontSize: 11 }}
        />
        <ZAxis type="number" dataKey="z" range={[50, 300]} />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div
                className="rounded-lg px-3 py-2 text-xs"
                style={{
                  backgroundColor: 'rgba(32, 36, 54, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}
              >
                <div className="font-semibold text-[#E0E4F0] mb-1">{d.name}</div>
                <div className="text-[#8B95B8]">
                  Posts: <span className="text-[#E0E4F0] font-data">{d.posts.toLocaleString()}</span>
                </div>
                <div className="text-[#8B95B8]">
                  Sentiment: <span className="text-[#E0E4F0] font-data">{d.sentiment}%</span>
                </div>
              </div>
            );
          }}
        />
        <Scatter data={data}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} fillOpacity={0.65} stroke={entry.color} strokeOpacity={0.9} strokeWidth={1.5} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/*  Related Topics Network                                              */
/* ------------------------------------------------------------------ */

function RelatedTopicsNetwork({ topics }: { topics: Topic[] }) {
  const nodes = useMemo(() => {
    return topics.slice(0, 6).map((t, i) => {
      const sentiment = getSentimentLevel(t.sentiment);
      const colors = { positive: '#22C55E', neutral: '#4E8DFF', negative: '#FF4444' };
      const angle = (i / 6) * Math.PI * 2;
      return {
        x: 50 + Math.cos(angle) * 30,
        y: 50 + Math.sin(angle) * 30,
        r: 6 + (t.posts / 2000),
        name: t.name,
        color: colors[sentiment],
        related: t.related,
      };
    });
  }, [topics]);

  const edges = useMemo(() => {
    const e: Array<{ x1: number; y1: number; x2: number; y2: number; strength: number }> = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const shared = nodes[i].related.filter((r) => nodes[j].related.includes(r)).length;
        if (shared > 0) {
          e.push({
            x1: nodes[i].x,
            y1: nodes[i].y,
            x2: nodes[j].x,
            y2: nodes[j].y,
            strength: shared,
          });
        }
      }
    }
    return e;
  }, [nodes]);

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      {/* Edges */}
      {edges.map((edge, i) => (
        <line
          key={i}
          x1={edge.x1}
          y1={edge.y1}
          x2={edge.x2}
          y2={edge.y2}
          stroke="rgba(78,141,255,0.2)"
          strokeWidth={edge.strength * 0.8}
          strokeLinecap="round"
        />
      ))}
      {/* Nodes */}
      {nodes.map((node, i) => (
        <g key={i}>
          <circle
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill={node.color}
            fillOpacity={0.6}
            stroke={node.color}
            strokeWidth={0.8}
            strokeOpacity={0.9}
          />
          <text
            x={node.x}
            y={node.y + node.r + 5}
            textAnchor="middle"
            fill="#8B95B8"
            fontSize="4"
            fontFamily="Inter, sans-serif"
          >
            {node.name.length > 14 ? node.name.slice(0, 14) + '...' : node.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Topics Page                                                    */
/* ------------------------------------------------------------------ */

export default function Topics() {
  const [timeframe, setTimeframe] = useState('Last 7 Days');
  const [clusterFilter, setClusterFilter] = useState('All Clusters');
  const [searchQuery, setSearchQuery] = useState('');

  /* Filter topics */
  const filteredTopics = useMemo(() => {
    let topics = [...mockTopics];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      topics = topics.filter((t) => t.name.toLowerCase().includes(q));
    }

    return topics;
  }, [searchQuery]);

  /* Sort for trending (up first) */
  const trendingTopics = useMemo(() => {
    return [...filteredTopics]
      .filter((t) => t.trend === 'up')
      .sort((a, b) => b.posts - a.posts)
      .slice(0, 10);
  }, [filteredTopics]);

  /* Performance bar chart data */
  const performanceData = useMemo(
    () =>
      [...filteredTopics]
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, 10)
        .map((t) => ({
          name: t.name.length > 16 ? t.name.slice(0, 16) + '...' : t.name,
          engagement: t.engagement,
        })),
    [filteredTopics]
  );

  /* Network topics */
  const networkTopics = useMemo(() => filteredTopics.slice(0, 8), [filteredTopics]);

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
          Topics
        </h1>
        <p className="text-sm text-[#8B95B8]">
          Topic clustering and trend analysis
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

          <div className="relative">
            <select
              value={clusterFilter}
              onChange={(e) => setClusterFilter(e.target.value)}
              className="form-input appearance-none pr-8 text-sm py-2 cursor-pointer"
            >
              {clusterOptions.map((opt) => (
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
              placeholder="Search topics..."
              className="form-input w-full pl-9 text-sm py-2"
            />
          </div>
        </div>
      </motion.div>

      {/* Bubble Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: easing }}
      >
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#E0E4F0] font-display">
                Topic Cluster Map
              </h3>
              <p className="text-xs text-[#5A6480] mt-0.5">
                Bubble size = volume, Color = sentiment
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-[#22C55E]">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                Positive
              </span>
              <span className="flex items-center gap-1 text-[#4E8DFF]">
                <span className="w-2 h-2 rounded-full bg-[#4E8DFF]" />
                Neutral
              </span>
              <span className="flex items-center gap-1 text-[#FF4444]">
                <span className="w-2 h-2 rounded-full bg-[#FF4444]" />
                Negative
              </span>
            </div>
          </div>
          <div className="h-80">
            <TopicBubbleChart topics={filteredTopics} />
          </div>
        </GlassCard>
      </motion.div>

      {/* Trending + Performance Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: easing }}
        >
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-[#22C55E]" />
              <h3 className="text-sm font-semibold text-[#E0E4F0] font-display">
                Trending Topics
              </h3>
            </div>
            <div className="space-y-0">
              {trendingTopics.map((topic, i) => {
                const growth = Math.round((topic.sentiment / 100) * 50 + 10);
                return (
                  <motion.div
                    key={topic.name}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.04, ease: easing }}
                    className={cn(
                      'flex items-center gap-3 py-3',
                      i < trendingTopics.length - 1 && 'border-b border-[rgba(255,255,255,0.04)]'
                    )}
                  >
                    <span className="text-xs font-data text-[#5A6480] w-5 text-right">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[#E0E4F0] font-medium truncate">
                        {topic.name}
                      </div>
                      <div className="text-xs text-[#5A6480]">
                        {topic.posts.toLocaleString()} mentions this week
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-data text-[#22C55E] flex-shrink-0">
                      <TrendingUp size={12} />
                      +{growth}%
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Topic Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: easing }}
        >
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <BarChart2Icon size={16} className="text-[#00C8FF]" />
              <h3 className="text-sm font-semibold text-[#E0E4F0] font-display">
                Topic Performance
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
                  layout="vertical"
                  barSize={14}
                  margin={{ left: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    type="number"
                    tick={{ fill: '#5A6480', fontSize: 11 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: '#8B95B8', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={110}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="engagement" radius={[0, 4, 4, 0]} fill="#00C8FF" fillOpacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Topic Details Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: easing }}
      >
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#E0E4F0] font-display">
              Topic Details
            </h3>
            <Tag size={16} className="text-[#5A6480]" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.08)]">
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">
                    Topic
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">
                    Mentions
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">
                    Avg Engagement
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">
                    Sentiment
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">
                    Trend
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">
                    Related Hashtags
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTopics.map((topic, i) => {
                  const sentimentLevel = getSentimentLevel(topic.sentiment);
                  const sentConfig = getSentimentConfig(sentimentLevel);
                  const SentIcon = sentConfig.icon;
                  return (
                    <motion.tr
                      key={topic.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.03, ease: easing }}
                      className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(78,141,255,0.04)] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-[#E0E4F0]">{topic.name}</span>
                      </td>
                      <td className="py-3 px-4 text-sm font-data text-[#E0E4F0]">
                        {topic.posts.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-data text-[#E0E4F0]">{topic.engagement}%</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: `${sentConfig.color}18`,
                            color: sentConfig.color,
                          }}
                        >
                          <SentIcon size={12} />
                          {sentConfig.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {topic.trend === 'up' && (
                            <span className="inline-flex items-center gap-1 text-xs font-data text-[#22C55E]">
                              <TrendingUp size={12} />
                              +{Math.round(topic.sentiment * 0.6)}%
                            </span>
                          )}
                          {topic.trend === 'down' && (
                            <span className="inline-flex items-center gap-1 text-xs font-data text-[#FF4444]">
                              <TrendingDown size={12} />
                              -{Math.round((100 - topic.sentiment) * 0.3)}%
                            </span>
                          )}
                          {topic.trend === 'stable' && (
                            <span className="inline-flex items-center gap-1 text-xs font-data text-[#8B95B8]">
                              <span className="w-3 h-px bg-[#8B95B8]" />
                              Stable
                            </span>
                          )}
                          <TopicMiniSparkline
                            data={getTrendSparkline(topic)}
                            color={
                              topic.trend === 'up'
                                ? '#22C55E'
                                : topic.trend === 'down'
                                  ? '#FF4444'
                                  : '#4E8DFF'
                            }
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          {topic.related.slice(0, 3).map((r, j) => (
                            <span
                              key={j}
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-[rgba(78,141,255,0.1)] text-[#4E8DFF]"
                            >
                              #{r}
                            </span>
                          ))}
                          {topic.related.length > 3 && (
                            <span className="text-[10px] text-[#5A6480]">
                              +{topic.related.length - 3}
                            </span>
                          )}
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

      {/* Related Topics Network */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: easing }}
      >
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#E0E4F0] font-display">
                Related Topics Network
              </h3>
              <p className="text-xs text-[#5A6480] mt-0.5">
                Node size = volume, Edge = relatedness, Color = sentiment
              </p>
            </div>
            <Network size={16} className="text-[#5A6480]" />
          </div>
          <div className="h-64">
            <RelatedTopicsNetwork topics={networkTopics} />
          </div>
        </GlassCard>
      </motion.div>

      {/* Empty state */}
      {filteredTopics.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Tag size={48} className="text-[#5A6480] mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-[#8B95B8] mb-1">
            No topics found
          </h3>
          <p className="text-sm text-[#5A6480]">
            Try adjusting your search to find more topics
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

/* Simple bar chart icon since we already import TrendingUp */
function BarChart2Icon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
