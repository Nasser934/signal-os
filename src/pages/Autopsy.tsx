import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Target,
  TrendingUp,
  TrendingDown,
  Activity,
  Brain,
  AlertTriangle,
  FileText,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { mockPosts } from '@/lib/mockData';
import type { Post } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

/* ───────────────────────── types ───────────────────────── */

interface MetricRow {
  metric: string;
  predicted: number;
  actual: number;
  delta: number;
  accuracy: number;
}

interface AnalysisNote {
  icon: 'trending-up' | 'trending-down' | 'activity' | 'brain' | 'alert';
  text: string;
}

/* ─────────────────────── constants ─────────────────────── */

const easeOutQuad = [0.4, 0, 0.2, 1] as [number, number, number, number];

/* ─────────────────── helpers ──────────────────── */

function generatePredictionVsActual(post: Post) {
  // Deterministic pseudo-random based on post ID
  const hash = post.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const seed = (s: number) => {
    const x = Math.sin(hash + s) * 10000;
    return x - Math.floor(x);
  };

  const predictedImpressions = Math.round(post.impressions * (0.85 + seed(1) * 0.3));
  const predictedEngagement = parseFloat((post.engagement * (0.8 + seed(2) * 0.4)).toFixed(1));
  const predictedLikes = Math.round(post.likes * (0.85 + seed(3) * 0.3));
  const predictedReplies = Math.round(post.replies * (0.8 + seed(4) * 0.4));
  const predictedReposts = Math.round(post.reposts * (0.85 + seed(5) * 0.3));

  const metrics: MetricRow[] = [
    {
      metric: 'Impressions',
      predicted: predictedImpressions,
      actual: post.impressions,
      delta: post.impressions - predictedImpressions,
      accuracy: Math.round(100 - Math.abs(post.impressions - predictedImpressions) / predictedImpressions * 100),
    },
    {
      metric: 'Engagement Rate',
      predicted: predictedEngagement,
      actual: post.engagement,
      delta: parseFloat((post.engagement - predictedEngagement).toFixed(1)),
      accuracy: Math.round(100 - Math.abs(post.engagement - predictedEngagement) / predictedEngagement * 100),
    },
    {
      metric: 'Likes',
      predicted: predictedLikes,
      actual: post.likes,
      delta: post.likes - predictedLikes,
      accuracy: Math.round(100 - Math.abs(post.likes - predictedLikes) / predictedLikes * 100),
    },
    {
      metric: 'Replies',
      predicted: predictedReplies,
      actual: post.replies,
      delta: post.replies - predictedReplies,
      accuracy: Math.round(100 - Math.abs(post.replies - predictedReplies) / predictedReplies * 100),
    },
    {
      metric: 'Retweets',
      predicted: predictedReposts,
      actual: post.reposts,
      delta: post.reposts - predictedReposts,
      accuracy: Math.round(100 - Math.abs(post.reposts - predictedReposts) / predictedReposts * 100),
    },
  ];

  // Cap accuracy at 0-100
  metrics.forEach(m => {
    m.accuracy = Math.max(0, Math.min(100, m.accuracy));
  });

  const avgAccuracy = Math.round(metrics.reduce((s, m) => s + m.accuracy, 0) / metrics.length);

  return { metrics, avgAccuracy };
}

function generateAnalysisNotes(accuracy: number, metrics: MetricRow[]): AnalysisNote[] {
  const notes: AnalysisNote[] = [];

  notes.push({
    icon: accuracy >= 80 ? 'trending-up' : accuracy >= 60 ? 'activity' : 'trending-down',
    text: `Overall prediction accuracy was ${accuracy}%, which is ${accuracy >= 80 ? 'above average' : accuracy >= 60 ? 'within expected range' : 'below average'}.`,
  });

  // Find most over-predicted
  const overPredicted = metrics.filter(m => m.predicted > m.actual);
  if (overPredicted.length > 0) {
    const worst = overPredicted.reduce((a, b) =>
      Math.abs(a.delta) > Math.abs(b.delta) ? a : b
    );
    notes.push({
      icon: 'alert',
      text: `${worst.metric} were ${Math.abs(worst.delta) >= 1000 ? (Math.abs(worst.delta) / 1000).toFixed(1) + 'K' : Math.abs(worst.delta)} ${worst.delta < 0 ? 'over-predicted' : 'under-predicted'}, likely due to ${worst.metric === 'Impressions' ? 'lower hashtag reach' : worst.metric === 'Engagement Rate' ? 'content resonance factors' : 'timing and audience behavior'}.`,
    });
  }

  // Find best predicted
  const best = [...metrics].sort((a, b) => b.accuracy - a.accuracy)[0];
  notes.push({
    icon: 'brain',
    text: `${best.metric} prediction was most accurate at ${best.accuracy}%, showing strong model calibration for this metric.`,
  });

  return notes;
}

function generateAccuracyTrend(postId: string) {
  // Generate 20 historical accuracy data points
  const base = postId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return Array.from({ length: 20 }, (_, i) => {
    const pseudoRandom = () => {
      const x = Math.sin(base + i * 0.5 + 7) * 10000;
      return x - Math.floor(x);
    };
    return {
      post: `#${i + 1}`,
      accuracy: Math.round(65 + pseudoRandom() * 30),
    };
  });
}

/* ─────────────────── GaugeChart ──────────────────── */

function GaugeChart({ value }: { value: number }) {
  const size = 180;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2 - 10;
  const center = size / 2;

  // Create semi-circle arc path
  const startAngle = Math.PI; // 180 degrees
  const endAngle = 0; // 0 degrees
  const valueAngle = Math.PI * (1 - value / 100); // value mapped to arc

  const describeArc = (cx: number, cy: number, r: number, start: number, end: number) => {
    const startX = cx + r * Math.cos(start);
    const startY = cy + r * Math.sin(start);
    const endX = cx + r * Math.cos(end);
    const endY = cy + r * Math.sin(end);
    const largeArc = end - start <= Math.PI ? 0 : 1;
    return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`;
  };

  const trackPath = describeArc(center, center, radius, startAngle, endAngle);
  const fillPath = describeArc(center, center, radius, startAngle, valueAngle);

  const color = value >= 80 ? '#22C55E' : value >= 60 ? '#4E8DFF' : '#FF4444';

  // Needle position
  const needleAngle = Math.PI * (1 - value / 100);
  const needleLen = radius - 15;
  const needleX = center + needleLen * Math.cos(needleAngle);
  const needleY = center + needleLen * Math.sin(needleAngle);

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF4444" />
            <stop offset="50%" stopColor="#4E8DFF" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Fill */}
        <motion.path
          d={fillPath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: easeOutQuad }}
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: 0,
          }}
        />
        {/* Needle */}
        <motion.line
          x1={center}
          y1={center}
          x2={needleX}
          y2={needleY}
          stroke="#E0E4F0"
          strokeWidth={2}
          strokeLinecap="round"
          initial={{ x2: center - needleLen, y2: center }}
          animate={{ x2: needleX, y2: needleY }}
          transition={{ duration: 1, ease: easeOutQuad, delay: 0.3 }}
        />
        {/* Center dot */}
        <circle cx={center} cy={center} r={5} fill="#E0E4F0" />
      </svg>
      <div className="text-center -mt-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span className="text-3xl font-bold font-mono" style={{ color }}>
            {value}
          </span>
          <span className="text-sm text-[#5A6480] font-mono">%</span>
        </motion.div>
        <p className="text-xs text-[#8B95B8] mt-1">Prediction Accuracy</p>
      </div>
    </div>
  );
}

/* ─────────────────── Custom Tooltip ──────────────────── */

function CustomBarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#202436] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-[#E0E4F0] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-[#8B95B8]">{p.name}:</span>
          <span className="text-[#E0E4F0] font-mono">
            {typeof p.value === 'number' && p.value >= 1000
              ? `${(p.value / 1000).toFixed(1)}K`
              : p.value}
          </span>
        </div>
      ))}
      {payload.length === 2 && (
        <div className="mt-1 pt-1 border-t border-[rgba(255,255,255,0.06)] text-xs text-[#5A6480]">
          Delta:{" "}
          <span
            className={cn(
              'font-mono',
              payload[1].value - payload[0].value >= 0
                ? 'text-[#22C55E]'
                : 'text-[#FF4444]'
            )}
          >
            {payload[1].value - payload[0].value >= 0 ? '+' : ''}
            {(payload[1].value - payload[0].value).toFixed(payload[0].value < 10 ? 1 : 0)}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────── Autopsy Page ──────────────────── */

export default function Autopsy() {
  const [selectedPostId, setSelectedPostId] = useState<string>(mockPosts[0].id);

  const selectedPost = useMemo(
    () => mockPosts.find((p) => p.id === selectedPostId) || mockPosts[0],
    [selectedPostId]
  );

  const { metrics, avgAccuracy } = useMemo(
    () => generatePredictionVsActual(selectedPost),
    [selectedPost]
  );

  const analysisNotes = useMemo(
    () => generateAnalysisNotes(avgAccuracy, metrics),
    [avgAccuracy, metrics]
  );

  const accuracyTrend = useMemo(
    () => generateAccuracyTrend(selectedPostId),
    [selectedPostId]
  );

  // Chart data
  const barChartData = useMemo(
    () =>
      metrics.map((m) => ({
        name: m.metric === 'Engagement Rate' ? 'Eng. Rate' : m.metric,
        Predicted: m.predicted,
        Actual: m.actual,
      })),
    [metrics]
  );

  const predictedScore = selectedPost.score - Math.round((avgAccuracy - 85) * 0.3);

  return (
    <div className="space-y-6 pb-8">
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-display font-bold text-2xl text-[#E0E4F0] tracking-tight">
          Post Autopsy
        </h2>
        <p className="text-[#8B95B8] text-sm mt-1">
          Analyze prediction vs. actual performance
        </p>
      </motion.div>

      {/* ── Post Selector ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <GlassCard>
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4 text-[#5A6480] flex-shrink-0" />
            <Select value={selectedPostId} onValueChange={setSelectedPostId}>
              <SelectTrigger className="flex-1 bg-transparent border-[rgba(255,255,255,0.08)] text-[#E0E4F0]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#202436] border-[rgba(255,255,255,0.1)] max-h-72">
                {mockPosts.map((post) => (
                  <SelectItem key={post.id} value={post.id}>
                    <div className="flex items-center gap-2 truncate max-w-[400px]">
                      <span className="text-xs text-[#5A6480] truncate">
                        {post.content.slice(0, 60)}...
                      </span>
                      <span className="text-xs text-[#8B95B8]">
                        Score: {post.score}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </GlassCard>
      </motion.div>

      {/* ── Post Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        key={selectedPost.id}
      >
        <GlassCard>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4E8DFF] to-[#00C8FF] flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-[#141725]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#E0E4F0] leading-relaxed">
                {selectedPost.content}
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-[#5A6480]">
                <span>
                  {new Date(selectedPost.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[rgba(78,141,255,0.1)] text-[#4E8DFF]">
                  X (Twitter)
                </span>
              </div>
            </div>
          </div>

          {/* Score row */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#5A6480]">Predicted</span>
              <span className="text-lg font-mono font-bold text-[#4E8DFF]">
                {predictedScore}
              </span>
              <span className="text-xs text-[#5A6480]">/100</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#5A6480]">Actual</span>
              <span className="text-lg font-mono font-bold text-[#22C55E]">
                {selectedPost.score}
              </span>
              <span className="text-xs text-[#5A6480]">/100</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#5A6480]">Accuracy</span>
              <span
                className={cn(
                  'text-lg font-mono font-bold',
                  avgAccuracy >= 80
                    ? 'text-[#22C55E]'
                    : avgAccuracy >= 60
                      ? 'text-[#4E8DFF]'
                      : 'text-[#FF4444]'
                )}
              >
                {avgAccuracy}%
              </span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* ── Prediction Accuracy Gauge + Score Comparison ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gauge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          key={`gauge-${selectedPost.id}`}
        >
          <GlassCard className="flex flex-col items-center justify-center py-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-[#4E8DFF]" />
              <h3 className="font-display font-semibold text-[#E0E4F0]">
                Prediction Accuracy
              </h3>
            </div>
            <GaugeChart value={avgAccuracy} />
            <p className="text-xs text-[#8B95B8] mt-2 text-center">
              Predicted within {Math.abs(selectedPost.score - predictedScore)} points of actual
            </p>
          </GlassCard>
        </motion.div>

        {/* Score Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          key={`compare-${selectedPost.id}`}
        >
          <GlassCard className="h-full flex flex-col justify-center py-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart2 className="w-4 h-4 text-[#4E8DFF]" />
              <h3 className="font-display font-semibold text-[#E0E4F0]">
                Score Comparison
              </h3>
            </div>

            <div className="space-y-6">
              {/* Predicted */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#8B95B8]">Predicted</span>
                  <span className="text-xl font-mono font-bold text-[#4E8DFF]">
                    {predictedScore}
                  </span>
                </div>
                <div className="h-3 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-[#4E8DFF]"
                    initial={{ width: 0 }}
                    animate={{ width: `${predictedScore}%` }}
                    transition={{ duration: 0.8, ease: easeOutQuad, delay: 0.3 }}
                  />
                </div>
              </div>

              {/* Actual */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#8B95B8]">Actual</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-mono font-bold text-[#22C55E]">
                      {selectedPost.score}
                    </span>
                    {selectedPost.score > predictedScore ? (
                      <ArrowUpRight className="w-4 h-4 text-[#22C55E]" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-[#FF4444]" />
                    )}
                  </div>
                </div>
                <div className="h-3 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-[#22C55E]"
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedPost.score}%` }}
                    transition={{ duration: 0.8, ease: easeOutQuad, delay: 0.5 }}
                  />
                </div>
              </div>

              {/* Delta */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <span className="text-sm text-[#8B95B8]">Difference:</span>
                <span
                  className={cn(
                    'text-lg font-mono font-bold',
                    selectedPost.score >= predictedScore
                      ? 'text-[#22C55E]'
                      : 'text-[#FF4444]'
                  )}
                >
                  {selectedPost.score >= predictedScore ? '+' : ''}
                  {selectedPost.score - predictedScore}
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* ── Prediction vs Actual Chart ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        key={`chart-${selectedPost.id}`}
      >
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#4E8DFF]" />
            <h3 className="font-display font-semibold text-[#E0E4F0]">
              Prediction vs Actual
            </h3>
          </div>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                barGap={4}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#8B95B8', fontSize: 12, fontFamily: 'Inter' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#5A6480', fontSize: 11, fontFamily: 'Inter' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)
                  }
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend
                  wrapperStyle={{ color: '#8B95B8', fontSize: '12px' }}
                />
                <Bar dataKey="Predicted" fill="#4E8DFF" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {barChartData.map((_, i) => (
                    <Cell key={`p-${i}`} fill="#4E8DFF" fillOpacity={0.8} />
                  ))}
                </Bar>
                <Bar dataKey="Actual" fill="#22C55E" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {barChartData.map((_, i) => (
                    <Cell key={`a-${i}`} fill="#22C55E" fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>

      {/* ── Metric Breakdown + Analysis Notes ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metric Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          key={`table-${selectedPost.id}`}
        >
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="w-4 h-4 text-[#4E8DFF]" />
              <h3 className="font-display font-semibold text-[#E0E4F0]">
                Metric Breakdown
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.08)]">
                    <th className="text-left py-2 px-2 text-xs font-medium text-[#5A6480] uppercase tracking-wider">
                      Metric
                    </th>
                    <th className="text-right py-2 px-2 text-xs font-medium text-[#5A6480] uppercase tracking-wider">
                      Predicted
                    </th>
                    <th className="text-right py-2 px-2 text-xs font-medium text-[#5A6480] uppercase tracking-wider">
                      Actual
                    </th>
                    <th className="text-right py-2 px-2 text-xs font-medium text-[#5A6480] uppercase tracking-wider">
                      Delta
                    </th>
                    <th className="text-right py-2 px-2 text-xs font-medium text-[#5A6480] uppercase tracking-wider">
                      Acc.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((m, i) => (
                    <motion.tr
                      key={m.metric}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.03 }}
                      className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)]"
                    >
                      <td className="py-2.5 px-2 text-[#E0E4F0]">{m.metric}</td>
                      <td className="py-2.5 px-2 text-right font-mono text-[#4E8DFF]">
                        {m.predicted >= 1000
                          ? `${(m.predicted / 1000).toFixed(1)}K`
                          : m.predicted}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-[#22C55E]">
                        {m.actual >= 1000
                          ? `${(m.actual / 1000).toFixed(1)}K`
                          : m.actual}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono">
                        <span
                          className={cn(
                            m.delta >= 0 ? 'text-[#22C55E]' : 'text-[#FF4444]'
                          )}
                        >
                          {m.delta >= 0 ? '+' : ''}
                          {Math.abs(m.delta) >= 1000
                            ? `${(m.delta / 1000).toFixed(1)}K`
                            : m.delta}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <span
                          className={cn(
                            'text-xs font-mono font-semibold px-2 py-0.5 rounded',
                            m.accuracy >= 85
                              ? 'text-[#22C55E] bg-[rgba(34,197,94,0.12)]'
                              : m.accuracy >= 70
                                ? 'text-[#4E8DFF] bg-[rgba(78,141,255,0.12)]'
                                : 'text-[#FFB347] bg-[rgba(255,179,71,0.12)]'
                          )}
                        >
                          {m.accuracy}%
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>

        {/* Analysis Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          key={`notes-${selectedPost.id}`}
        >
          <GlassCard className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-[#9F7AEA]" />
              <h3 className="font-display font-semibold text-[#E0E4F0]">
                AI Analysis
              </h3>
            </div>

            <div className="space-y-3">
              {analysisNotes.map((note, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.02)]"
                >
                  {note.icon === 'trending-up' && (
                    <TrendingUp className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
                  )}
                  {note.icon === 'trending-down' && (
                    <TrendingDown className="w-4 h-4 text-[#FF4444] mt-0.5 flex-shrink-0" />
                  )}
                  {note.icon === 'activity' && (
                    <Activity className="w-4 h-4 text-[#4E8DFF] mt-0.5 flex-shrink-0" />
                  )}
                  {note.icon === 'brain' && (
                    <Brain className="w-4 h-4 text-[#9F7AEA] mt-0.5 flex-shrink-0" />
                  )}
                  {note.icon === 'alert' && (
                    <AlertTriangle className="w-4 h-4 text-[#FFB347] mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-sm text-[#8B95B8] leading-relaxed">
                    {note.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* ── Historical Accuracy Trend ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        key={`trend-${selectedPostId}`}
      >
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#4E8DFF]" />
            <h3 className="font-display font-semibold text-[#E0E4F0]">
              Historical Accuracy Trend
            </h3>
          </div>
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={accuracyTrend}
                margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="post"
                  tick={{ fill: '#5A6480', fontSize: 11, fontFamily: 'Inter' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#5A6480', fontSize: 11, fontFamily: 'Inter' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-[#202436] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 shadow-lg">
                        <p className="text-xs text-[#5A6480]">{payload[0].payload.post}</p>
                        <p className="text-sm font-mono text-[#4E8DFF]">
                          {payload[0].value}%
                        </p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine
                  y={85}
                  stroke="#22C55E"
                  strokeDasharray="6 4"
                  strokeWidth={1}
                  label={{
                    value: 'Target 85%',
                    position: 'right',
                    fill: '#22C55E',
                    fontSize: 11,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#4E8DFF"
                  strokeWidth={2}
                  dot={{ fill: '#4E8DFF', r: 3, stroke: 'transparent' }}
                  activeDot={{ fill: '#00C8FF', r: 5, stroke: '#4E8DFF', strokeWidth: 2 }}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
