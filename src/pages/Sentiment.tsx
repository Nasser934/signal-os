import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const sentimentData = [
  { name: 'Positive', value: 58, color: '#00E5A0' },
  { name: 'Neutral', value: 31, color: '#4E8DFF' },
  { name: 'Negative', value: 11, color: '#FF6B6B' },
];

const recentComments = [
  { text: 'This tool completely changed how I approach content creation. Game changer!', sentiment: 'Positive', score: 0.92 },
  { text: 'Interesting perspective but I think the timing could be better.', sentiment: 'Neutral', score: 0.45 },
  { text: 'Love the thread format suggestions. Really helpful breakdown.', sentiment: 'Positive', score: 0.88 },
  { text: 'Not sure I agree with the hook analysis on this one.', sentiment: 'Neutral', score: 0.38 },
  { text: 'The 8-dimension scoring is brilliant. Much better than other tools.', sentiment: 'Positive', score: 0.95 },
];

export default function Sentiment() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between"><div><h2 className="text-[#E0E4F0] font-semibold text-lg">Sentiment Analysis</h2><p className="text-[#8B95B8] text-xs mt-0.5">How audiences feel about your content</p></div></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-[#E0E4F0] font-semibold text-sm mb-4">Overall Sentiment</h3>
          <div className="h-[250px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={sentimentData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">{sentimentData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ background: '#1A1D2E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px' }} /></PieChart></ResponsiveContainer></div>
          <div className="flex items-center justify-center gap-6 mt-2">
            {sentimentData.map(s => <div key={s.name} className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} /><span className="text-[#8B95B8] text-xs">{s.name} {s.value}%</span></div>)}
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-[#E0E4F0] font-semibold text-sm mb-4">Recent Sentiment</h3>
          <div className="space-y-3">
            {recentComments.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="p-3 rounded-lg bg-white/[0.02]">
                <p className="text-[#E0E4F0] text-xs mb-2">{c.text}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.sentiment === 'Positive' ? 'bg-emerald-500/10 text-emerald-400' : c.sentiment === 'Neutral' ? 'bg-[#4E8DFF]/10 text-[#4E8DFF]' : 'bg-red-500/10 text-red-400'}`}>{c.sentiment}</span>
                  <span className="text-[#5A6480] text-[10px]">{(c.score * 100).toFixed(0)}% confidence</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
