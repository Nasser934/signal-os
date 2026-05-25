import { useState, useEffect, useMemo } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import { mockPosts, commandMetrics } from '@/lib/mockData';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  Activity, Eye, Heart, MessageCircle,
  TrendingUp, Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Mock minute-by-minute data generator                              */
/* ------------------------------------------------------------------ */
function generateMinuteData() {
  const data = [];
  for (let i = 0; i <= 60; i++) {
    data.push({
      minute: i,
      impressions: Math.round(20 + i * 8.5 + Math.sin(i * 0.3) * 15 + Math.random() * 10),
      likes: Math.round(2 + i * 1.2 + Math.random() * 4),
      replies: Math.round(0.5 + i * 0.15 + Math.random() * 2),
      retweets: Math.round(1 + i * 0.4 + Math.random() * 2),
    });
  }
  return data;
}

const minuteData = generateMinuteData();

/* ------------------------------------------------------------------ */
/*  Engagement breakdown data                                         */
/* ------------------------------------------------------------------ */
const engagementBreakdown = [
  { name: 'Likes', value: commandMetrics.firstHour.likes, color: '#4E8DFF' },
  { name: 'Replies', value: commandMetrics.firstHour.replies, color: '#00C8FF' },
  { name: 'Retweets', value: commandMetrics.firstHour.reposts, color: '#FFB347' },
  { name: 'Profile Clicks', value: commandMetrics.firstHour.profileClicks, color: '#9F7AEA' },
];

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  }),
};

/* ------------------------------------------------------------------ */
/*  Live pulse dot (isolated, memoized)                                */
/* ------------------------------------------------------------------ */
const LivePulseDot = React.memo(function LivePulseDot() {
  return (
    <span className="relative flex h-2.5 w-2.5 mr-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4444] opacity-75" style={{ animationDuration: '2s' }} />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF4444]" />
    </span>
  );
});

/* ------------------------------------------------------------------ */
/*  Circular gauge for live rate                                      */
/* ------------------------------------------------------------------ */
function LiveRateGauge({ value, max }: { value: number; max: number }) {
  const radius = 50;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const strokeDashoffset = circumference - progress * circumference;

  const color = value >= max * 0.8 ? '#22C55E' : value >= max * 0.4 ? '#4E8DFF' : '#FF4444';

  return (
    <div className="flex flex-col items-center">
      <svg width={radius * 2.2} height={radius * 2.2} viewBox={`0 0 ${radius * 2.2} ${radius * 2.2}`}>
        <circle
          cx={radius * 1.1}
          cy={radius * 1.1}
          r={normalizedRadius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={radius * 1.1}
          cy={radius * 1.1}
          r={normalizedRadius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] as [number, number, number, number], delay: 0.5 }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        />
        <text x={radius * 1.1} y={radius * 1.05} textAnchor="middle" fill="#E0E4F0" fontSize="18" fontWeight="700" fontFamily="JetBrains Mono, monospace">
          {value}
        </text>
        <text x={radius * 1.1} y={radius * 1.35} textAnchor="middle" fill="#5A6480" fontSize="9" fontFamily="Inter, sans-serif">
          / min
        </text>
      </svg>
      <p className="text-xs text-[#5A6480] mt-1">Target: {max}/min</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Custom tooltip                                                      */
/* ------------------------------------------------------------------ */
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[rgba(32,36,54,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs text-[#5A6480] mb-1">Minute {label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs font-medium" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Command Center Page                                            */
/* ------------------------------------------------------------------ */
export default function CommandCenter() {
  const [selectedPostId, setSelectedPostId] = useState(mockPosts[0].id);
  const [elapsedMinutes, setElapsedMinutes] = useState(23);
  const [liveRate, setLiveRate] = useState(42);

  /* Active posts: 4 most recent */
  const activePosts = useMemo(() => mockPosts.slice(0, 4), []);
  const selectedPost = activePosts.find(p => p.id === selectedPostId) ?? activePosts[0];

  /* Simulate live counter ticking */
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedMinutes(prev => Math.min(prev + 1, 60));
      setLiveRate(prev => Math.max(30, Math.min(60, prev + Math.round((Math.random() - 0.5) * 6))));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  /* Bull / Base / Bear projections */
  const projected = {
    bull: Math.round(selectedPost.impressions * 1.5),
    base: selectedPost.impressions,
    bear: Math.round(selectedPost.impressions * 0.6),
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
            Command Center
          </motion.h1>
          <motion.p
            className="text-[#8B95B8] text-sm mt-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Real-time first-hour performance
          </motion.p>
        </div>
        {/* Live Indicator */}
        <motion.div
          className="flex items-center px-4 py-2 rounded-lg bg-[rgba(255,68,68,0.08)] border border-[rgba(255,68,68,0.2)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <LivePulseDot />
          <span className="text-xs font-mono font-semibold text-[#FF4444] uppercase tracking-wider">Live</span>
        </motion.div>
      </div>

      {/* Active Posts Row */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {activePosts.map((post, i) => {
          const isActive = post.id === selectedPostId;
          const minsAgo = [23, 45, 12, 58][i] ?? i * 15;
          return (
            <motion.button
              key={post.id}
              onClick={() => setSelectedPostId(post.id)}
              className={cn(
                'flex-shrink-0 w-56 p-4 rounded-xl border text-left transition-all duration-200',
                'bg-[rgba(26,29,46,0.7)] backdrop-blur-xl',
                isActive
                  ? 'border-[#4E8DFF] shadow-[0_0_20px_rgba(78,141,255,0.2)]'
                  : 'border-[rgba(78,141,255,0.15)] hover:border-[rgba(78,141,255,0.3)]'
              )}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <p className="text-sm text-[#E0E4F0] line-clamp-2 mb-2">{post.content}</p>
              <p className="text-xs text-[#5A6480] mb-3">Posted {minsAgo} min ago</p>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-xs font-bold font-data text-[#E0E4F0]">{(post.impressions / 1000).toFixed(1)}K</div>
                  <div className="text-[10px] text-[#5A6480]">Views</div>
                </div>
                <div className="w-px h-6 bg-[rgba(255,255,255,0.08)]" />
                <div className="text-center">
                  <div className="text-xs font-bold font-data text-[#E0E4F0]">{post.likes}</div>
                  <div className="text-[10px] text-[#5A6480]">Likes</div>
                </div>
                <div className="w-px h-6 bg-[rgba(255,255,255,0.08)]" />
                <div className="text-center">
                  <div className="text-xs font-bold font-data text-[#E0E4F0]">{post.replies}</div>
                  <div className="text-[10px] text-[#5A6480]">Reply</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="flex items-center gap-1 text-[10px] text-[#22C55E]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  Active
                </span>
                <span className="text-[10px] text-[#4E8DFF]">View Detail</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Three metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* First-Hour KPIs */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard>
            <h3 className="font-display font-semibold text-[#E0E4F0] mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FFB347]" />
              First-Hour Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
                <div className="flex items-center gap-1.5 mb-1">
                  <Eye className="w-3 h-3 text-[#4E8DFF]" />
                  <span className="text-[10px] text-[#5A6480] uppercase tracking-wider">Impressions</span>
                </div>
                <div className="text-lg font-bold font-data text-[#E0E4F0]">{commandMetrics.firstHour.impressions.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
                <div className="flex items-center gap-1.5 mb-1">
                  <Activity className="w-3 h-3 text-[#22C55E]" />
                  <span className="text-[10px] text-[#5A6480] uppercase tracking-wider">Eng. Rate</span>
                </div>
                <div className="text-lg font-bold font-data text-[#E0E4F0]">{commandMetrics.firstHour.engagement}%</div>
              </div>
              <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
                <div className="flex items-center gap-1.5 mb-1">
                  <Heart className="w-3 h-3 text-[#FF4444]" />
                  <span className="text-[10px] text-[#5A6480] uppercase tracking-wider">Likes</span>
                </div>
                <div className="text-lg font-bold font-data text-[#E0E4F0]">{commandMetrics.firstHour.likes}</div>
              </div>
              <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
                <div className="flex items-center gap-1.5 mb-1">
                  <MessageCircle className="w-3 h-3 text-[#00C8FF]" />
                  <span className="text-[10px] text-[#5A6480] uppercase tracking-wider">Replies</span>
                </div>
                <div className="text-lg font-bold font-data text-[#E0E4F0]">{commandMetrics.firstHour.replies}</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Live Rate Gauge */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard className="flex flex-col items-center justify-center h-full">
            <h3 className="font-display font-semibold text-[#E0E4F0] mb-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#4E8DFF]" />
              Live Rate
            </h3>
            <p className="text-xs text-[#5A6480] mb-3">Impressions per minute</p>
            <LiveRateGauge value={liveRate} max={50} />
          </GlassCard>
        </motion.div>

        {/* Projected Final */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard>
            <h3 className="font-display font-semibold text-[#E0E4F0] mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#9F7AEA]" />
              Projected (24h)
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.15)]">
                <span className="text-xs text-[#22C55E] font-semibold">Bull</span>
                <span className="text-sm font-bold font-data text-[#22C55E]">{projected.bull.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[rgba(78,141,255,0.08)] border border-[rgba(78,141,255,0.15)]">
                <span className="text-xs text-[#4E8DFF] font-semibold">Base</span>
                <span className="text-sm font-bold font-data text-[#4E8DFF]">{projected.base.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[rgba(255,68,68,0.08)] border border-[rgba(255,68,68,0.15)]">
                <span className="text-xs text-[#FF4444] font-semibold">Bear</span>
                <span className="text-sm font-bold font-data text-[#FF4444]">{projected.bear.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-center pt-1">
                <span className="text-[10px] text-[#5A6480]">72% confidence interval</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Real-Time Chart */}
      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-[#E0E4F0]">Real-Time Impressions</h3>
              <p className="text-xs text-[#5A6480] mt-0.5">Impressions per minute since posting</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#5A6480]">
              <span className="w-2 h-2 rounded-full bg-[#4E8DFF]" />
              Live
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={minuteData.slice(0, elapsedMinutes + 1)}>
              <defs>
                <linearGradient id="liveLineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4E8DFF" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4E8DFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="minute" tick={{ fill: '#5A6480', fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Minutes', position: 'insideBottom', offset: -2, fill: '#5A6480', fontSize: 10 }} />
              <YAxis tick={{ fill: '#5A6480', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="impressions"
                stroke="#4E8DFF"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#4E8DFF', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </motion.div>

      {/* Bottom Row: Minute-by-Minute Table + Engagement Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Minute-by-Minute Table */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard>
            <h3 className="font-display font-semibold text-[#E0E4F0] mb-4">Minute-by-Minute</h3>
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-[#1A1D2E] z-10">
                  <tr className="border-b border-[rgba(255,255,255,0.08)]">
                    <th className="py-2 px-3 text-left text-[10px] font-medium text-[#5A6480] uppercase tracking-wider">Min</th>
                    <th className="py-2 px-3 text-left text-[10px] font-medium text-[#5A6480] uppercase tracking-wider">Impressions</th>
                    <th className="py-2 px-3 text-left text-[10px] font-medium text-[#5A6480] uppercase tracking-wider">Likes</th>
                    <th className="py-2 px-3 text-left text-[10px] font-medium text-[#5A6480] uppercase tracking-wider">Replies</th>
                    <th className="py-2 px-3 text-left text-[10px] font-medium text-[#5A6480] uppercase tracking-wider">RTs</th>
                    <th className="py-2 px-3 text-left text-[10px] font-medium text-[#5A6480] uppercase tracking-wider">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {minuteData.slice(0, elapsedMinutes + 1).reverse().map((row, i) => (
                    <motion.tr
                      key={row.minute}
                      className={cn(
                        'border-b border-[rgba(255,255,255,0.04)]',
                        i === 0 && 'bg-[rgba(78,141,255,0.04)]'
                      )}
                      initial={i === 0 ? { opacity: 0, y: -10 } : false}
                      animate={i === 0 ? { opacity: 1, y: 0 } : undefined}
                    >
                      <td className="py-2 px-3 text-xs font-data text-[#E0E4F0]">{row.minute}m</td>
                      <td className="py-2 px-3 text-xs font-data text-[#4E8DFF]">+{row.impressions}</td>
                      <td className="py-2 px-3 text-xs font-data text-[#22C55E]">+{row.likes}</td>
                      <td className="py-2 px-3 text-xs font-data text-[#00C8FF]">+{row.replies}</td>
                      <td className="py-2 px-3 text-xs font-data text-[#FFB347]">+{row.retweets}</td>
                      <td className="py-2 px-3 text-xs font-data text-[#E0E4F0]">{row.impressions}/min</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>

        {/* Engagement Breakdown */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard>
            <h3 className="font-display font-semibold text-[#E0E4F0] mb-4">Engagement Breakdown</h3>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width={240} height={220}>
                <PieChart>
                  <Pie
                    data={engagementBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {engagementBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center -mt-2 mb-3">
                <div className="text-lg font-bold font-data text-[#E0E4F0]">
                  {engagementBreakdown.reduce((a, b) => a + b.value, 0).toLocaleString()}
                </div>
                <div className="text-xs text-[#5A6480]">Total Engagements</div>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {engagementBreakdown.map(item => (
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
      </div>
    </motion.div>
  );
}
