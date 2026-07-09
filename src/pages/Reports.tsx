import { motion } from 'framer-motion';
import { FileBarChart, Download, TrendingUp, Users, Zap, Shield } from 'lucide-react';

const reports = [
  { title: 'Weekly Performance', desc: '7-day summary of posts, scores, and engagement trends', icon: TrendingUp, color: '#4E8DFF', type: 'PDF' },
  { title: 'Audience Analysis', desc: 'Follower demographics, activity patterns, and growth insights', icon: Users, color: '#00E5A0', type: 'PDF' },
  { title: 'Content Audit', desc: 'Full breakdown of all scored content with improvement suggestions', icon: Zap, color: '#FFD93D', type: 'CSV' },
  { title: 'Competitor Benchmark', desc: 'Compare your metrics against top creators in your niche', icon: TrendingUp, color: '#A78BFA', type: 'PDF' },
  { title: 'Security & Compliance', desc: 'Data privacy audit and integration health check', icon: Shield, color: '#FF6B6B', type: 'PDF' },
];

export default function Reports() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileBarChart className="w-5 h-5 text-[#4E8DFF]" />
          <div><h2 className="text-[#E0E4F0] font-semibold text-lg">Reports</h2><p className="text-[#8B95B8] text-xs">Download detailed analytics reports</p></div>
        </div>
      </div>

      <div className="space-y-3">
        {reports.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4 flex items-center gap-4 hover:border-[rgba(78,141,255,0.2)] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${r.color}15` }}>
              <r.icon className="w-5 h-5" style={{ color: r.color }} />
            </div>
            <div className="flex-1">
              <p className="text-[#E0E4F0] text-sm font-medium group-hover:text-[#4E8DFF] transition-colors">{r.title}</p>
              <p className="text-[#5A6480] text-xs mt-0.5">{r.desc}</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-[#8B95B8] flex-shrink-0">{r.type}</span>
            <button className="p-2 rounded-lg hover:bg-white/5 text-[#8B95B8] hover:text-[#4E8DFF] transition-all flex-shrink-0">
              <Download className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
