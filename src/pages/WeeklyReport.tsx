import { motion } from 'framer-motion';
import { FileBarChart, Target, PenTool, Activity, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const weeklyData = [
  { day: 'Mon', posts: 3, score: 72, engagement: 4.2 },
  { day: 'Tue', posts: 4, score: 78, engagement: 4.8 },
  { day: 'Wed', posts: 2, score: 65, engagement: 3.9 },
  { day: 'Thu', posts: 5, score: 82, engagement: 5.1 },
  { day: 'Fri', posts: 3, score: 91, engagement: 6.2 },
  { day: 'Sat', posts: 2, score: 76, engagement: 4.5 },
  { day: 'Sun', posts: 3, score: 88, engagement: 5.8 },
];

const summary = [
  { label: 'Total Posts', value: '22', icon: PenTool, color: '#4E8DFF' },
  { label: 'Avg Score', value: '79', icon: Target, color: '#00E5A0' },
  { label: 'Avg Engagement', value: '4.9%', icon: Activity, color: '#FFD93D' },
  { label: 'Best Post', value: '91', icon: Award, color: '#FF6B6B' },
];

export default function WeeklyReport() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileBarChart className="w-5 h-5 text-[#4E8DFF]" />
          <div>
            <h2 className="text-[#E0E4F0] font-semibold text-lg">Weekly Report</h2>
            <p className="text-[#8B95B8] text-xs">July 1-7, 2026</p>
          </div>
        </div>
        <button className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-[rgba(255,255,255,0.08)] text-[#8B95B8] text-xs hover:bg-white/5 transition-all">
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {summary.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
              <span className="text-[#5A6480] text-[10px]">{s.label}</span>
            </div>
            <p className="text-[#E0E4F0] text-xl font-bold font-display">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h3 className="text-[#E0E4F0] font-semibold text-sm mb-4">Weekly Performance</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" stroke="#5A6480" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#5A6480" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#1A1D2E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="score" fill="#4E8DFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
