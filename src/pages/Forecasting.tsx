import { motion } from 'framer-motion';
import { TrendingUp, Flame, Target, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = Array.from({ length: 30 }, (_, i) => ({ day: i + 1, predicted: 65 + Math.sin(i * 0.5) * 15 + Math.random() * 8, baseline: 60 + Math.sin(i * 0.3) * 10 }));

const predictions = [
  { title: 'Engagement Spike', desc: 'Predicted 3.2x boost on July 12', icon: Flame, color: '#FF6B6B' },
  { title: 'Optimal Window', desc: 'July 14-16 ideal for launch', icon: Target, color: '#4E8DFF' },
  { title: 'Trend Alignment', desc: 'AI topic trend peaks July 18', icon: TrendingUp, color: '#00E5A0' },
  { title: 'Viral Probability', desc: '87% chance with score 85+', icon: Zap, color: '#FFD93D' },
];

export default function Forecasting() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between"><div><h2 className="text-[#E0E4F0] font-semibold text-lg">Trend Forecasting</h2><p className="text-[#8B95B8] text-xs mt-0.5">AI-powered 30-day engagement prediction</p></div></div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#E0E4F0] font-semibold text-sm">Engagement Forecast</h3>
          <div className="flex items-center gap-4 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#4E8DFF]" />Predicted</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#5A6480]" />Baseline</span>
          </div>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4E8DFF" stopOpacity={0.3} /><stop offset="100%" stopColor="#4E8DFF" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" stroke="#5A6480" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#5A6480" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#1A1D2E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="baseline" stroke="#5A6480" strokeWidth={1} strokeDasharray="4 4" fill="none" />
              <Area type="monotone" dataKey="predicted" stroke="#4E8DFF" strokeWidth={2} fill="url(#predGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {predictions.map((p, i) => (
          <motion.div key={p.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${p.color}15` }}>
              <p.icon className="w-4 h-4" style={{ color: p.color }} />
            </div>
            <p className="text-[#E0E4F0] text-xs font-semibold mb-0.5">{p.title}</p>
            <p className="text-[#5A6480] text-[10px]">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
