import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw, PenTool, Activity, MessageCircle, ChevronRight, TrendingUp, TrendingDown, Minus, Clock, Flame, Target, XCircle,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }) };

const chartData = [
  { day: 'Mon', score: 72 }, { day: 'Tue', score: 78 }, { day: 'Wed', score: 65 },
  { day: 'Thu', score: 82 }, { day: 'Fri', score: 91 }, { day: 'Sat', score: 76 },
  { day: 'Sun', score: 88 },
];

type Trend = 'up' | 'down' | 'neutral';

const kpis = [
  { label: 'Avg Score', value: 79, change: '+5.2%', trend: 'up' as Trend, icon: Target },
  { label: 'Posts Scored', value: 156, change: '+12', trend: 'up' as Trend, icon: PenTool },
  { label: 'Engagement Rate', value: '4.8%', change: '+0.3%', trend: 'up' as Trend, icon: Activity },
  { label: 'Best Time', value: '9:00 AM', change: 'EST', trend: 'neutral' as Trend, icon: Clock },
];

const recentScores = [
  { id: '1', content: 'The biggest myth in content creation is that consistency beats quality...', score: 92, date: '2h ago', change: '+3' },
  { id: '2', content: 'Here is why most AI tools fail for creators (and what actually works)', score: 88, date: '5h ago', change: '+1' },
  { id: '3', content: 'I analyzed 10,000 viral posts. Here are the 7 patterns they all share', score: 85, date: '8h ago', change: '-2' },
  { id: '4', content: 'The thread format that consistently gets 10x engagement', score: 81, date: '1d ago', change: '+5' },
  { id: '5', content: 'Stop writing hooks like this. A data-driven breakdown', score: 76, date: '1d ago', change: '+2' },
];

const replies = [
  { id: '1', author: 'Alex Chen', handle: '@alexcreates', avatar: 'A', content: 'This scoring feature is incredible. Just got an 89 on my latest thread draft.', time: '2m ago', likes: 12 },
  { id: '2', author: 'Sarah Miller', handle: '@sarahcontent', avatar: 'S', content: 'The timing predictions are spot on. Posted at 9 AM EST yesterday and hit 50K impressions.', time: '15m ago', likes: 24 },
  { id: '3', author: 'David Park', handle: '@davidgrowth', avatar: 'D', content: 'Hook Quality dimension changed how I write. From 62 avg to 84 in two weeks.', time: '1h ago', likes: 8 },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} variants={fadeUp} custom={i} className="glass-card p-5 cursor-pointer hover:border-[rgba(78,141,255,0.2)] transition-all" onClick={() => navigate('/insights')}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#8B95B8] text-xs font-medium">{kpi.label}</span>
              <div className="w-8 h-8 rounded-lg bg-[#4E8DFF]/10 flex items-center justify-center">
                <kpi.icon className="w-4 h-4 text-[#4E8DFF]" />
              </div>
            </div>
            <p className="text-[#E0E4F0] text-2xl font-bold font-display">{kpi.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : kpi.trend === 'down' ? <TrendingDown className="w-3 h-3 text-red-400" /> : <Minus className="w-3 h-3 text-[#5A6480]" />}
              <span className={`text-xs ${kpi.trend === 'up' ? 'text-emerald-400' : kpi.trend === 'down' ? 'text-red-400' : 'text-[#5A6480]'}`}>{kpi.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart + Recent Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={fadeUp} custom={4} className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#E0E4F0] font-semibold text-sm">Score Trend</h3>
            <div className="flex items-center gap-2">
              <select className="bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-1.5 text-xs text-[#E0E4F0] outline-none">
                <option>Last 7 Days</option><option>Last 30 Days</option><option>Last 90 Days</option>
              </select>
              <button className="p-1.5 rounded-lg hover:bg-white/5 text-[#8B95B8]"><RefreshCw className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4E8DFF" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#4E8DFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" stroke="#5A6480" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#5A6480" fontSize={11} tickLine={false} axisLine={false} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{ background: '#1A1D2E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#E0E4F0' }}
                />
                <Area type="monotone" dataKey="score" stroke="#4E8DFF" strokeWidth={2} fill="url(#scoreGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} custom={5} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#E0E4F0] font-semibold text-sm">Recent Scores</h3>
            <button onClick={() => navigate('/drafts')} className="text-[#4E8DFF] text-xs flex items-center gap-0.5 hover:underline">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentScores.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] cursor-pointer transition-all group">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${s.score >= 85 ? 'bg-emerald-500/10 text-emerald-400' : s.score >= 70 ? 'bg-[#4E8DFF]/10 text-[#4E8DFF]' : 'bg-amber-500/10 text-amber-400'}`}>
                  {s.score}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#E0E4F0] text-xs truncate group-hover:text-[#4E8DFF] transition-colors">{s.content}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[#5A6480] text-[10px]">{s.date}</span>
                    <span className={`text-[10px] ${s.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{s.change}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Community Feed + Viral Probability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeUp} custom={6} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#E0E4F0] font-semibold text-sm">Community Feed</h3>
            <button onClick={() => navigate('/replies')} className="text-[#4E8DFF] text-xs flex items-center gap-0.5 hover:underline">
              All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {replies.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }} className="flex gap-3 p-3 rounded-lg bg-white/[0.02]">
                <div className="w-8 h-8 rounded-full bg-[#4E8DFF]/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#4E8DFF]">{r.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[#E0E4F0] text-xs font-medium">{r.author}</span>
                    <span className="text-[#5A6480] text-[10px]">{r.handle}</span>
                    <span className="text-[#5A6480] text-[10px] ml-auto">{r.time}</span>
                  </div>
                  <p className="text-[#8B95B8] text-xs leading-relaxed">{r.content}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-[#5A6480] text-[10px]"><MessageCircle className="w-3 h-3" />{r.likes}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} custom={7} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#E0E4F0] font-semibold text-sm">Viral Probability</h3>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="space-y-4">
            {[
              { label: 'Hook Quality', value: 92, color: '#00E5A0' },
              { label: 'Readability', value: 78, color: '#4E8DFF' },
              { label: 'Emotional Pull', value: 85, color: '#FFD93D' },
              { label: 'Timing Score', value: 64, color: '#A78BFA' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5"><span className="text-[#8B95B8] text-xs">{item.label}</span><span className="text-[#E0E4F0] text-xs font-bold">{item.value}%</span></div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full rounded-full" style={{ backgroundColor: item.color }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-5 p-3 rounded-lg bg-[#FF6B6B]/5 border border-[#FF6B6B]/10">
            <div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-[#FF6B6B]" /><span className="text-[#FF6B6B] text-xs font-medium">Low Viral Risk</span></div>
            <p className="text-[#8B95B8] text-[11px] mt-1">Your recent content shows consistent quality. No red flags detected.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
