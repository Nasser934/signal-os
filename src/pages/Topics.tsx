import { motion } from 'framer-motion';
import { FileText, TrendingUp } from 'lucide-react';

const topics = [
  { name: 'AI Content Tools', score: 94, trend: '+156%', volume: 'High', posts: '45K/day' },
  { name: 'Viral Hook Formulas', score: 91, trend: '+89%', volume: 'High', posts: '32K/day' },
  { name: 'Audience Building', score: 88, trend: '+67%', volume: 'High', posts: '28K/day' },
  { name: 'X Algorithm Changes', score: 86, trend: '+134%', volume: 'Medium', posts: '18K/day' },
  { name: 'Creator Monetization', score: 84, trend: '+45%', volume: 'Medium', posts: '15K/day' },
  { name: 'Storytelling Techniques', score: 82, trend: '+34%', volume: 'Medium', posts: '12K/day' },
  { name: 'Thread Writing', score: 80, trend: '+23%', volume: 'Medium', posts: '10K/day' },
  { name: 'Content Repurposing', score: 77, trend: '+18%', volume: 'Low', posts: '6K/day' },
];

export default function Topics() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-[#E0E4F0] font-semibold text-lg">Trending Topics</h2><p className="text-[#8B95B8] text-xs mt-0.5">Hot topics and content opportunities</p></div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                <th className="text-left px-4 py-3 text-[#5A6480] text-[10px] font-semibold uppercase tracking-wider">Topic</th>
                <th className="text-left px-4 py-3 text-[#5A6480] text-[10px] font-semibold uppercase tracking-wider">Opportunity Score</th>
                <th className="text-left px-4 py-3 text-[#5A6480] text-[10px] font-semibold uppercase tracking-wider">Trend</th>
                <th className="text-left px-4 py-3 text-[#5A6480] text-[10px] font-semibold uppercase tracking-wider">Volume</th>
                <th className="text-left px-4 py-3 text-[#5A6480] text-[10px] font-semibold uppercase tracking-wider">Posts/Day</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((t, i) => (
                <motion.tr
                  key={t.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-[rgba(255,255,255,0.04)] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#4E8DFF]" />
                      <span className="text-[#E0E4F0] text-xs font-medium">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full bg-[#4E8DFF]" style={{ width: `${t.score}%` }} />
                      </div>
                      <span className={`text-xs font-bold ${t.score >= 90 ? 'text-emerald-400' : t.score >= 80 ? 'text-[#4E8DFF]' : 'text-amber-400'}`}>{t.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-emerald-400 text-xs">
                      <TrendingUp className="w-3 h-3" />{t.trend}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${t.volume === 'High' ? 'bg-emerald-500/10 text-emerald-400' : t.volume === 'Medium' ? 'bg-[#4E8DFF]/10 text-[#4E8DFF]' : 'bg-amber-500/10 text-amber-400'}`}>{t.volume}</span>
                  </td>
                  <td className="px-4 py-3 text-[#8B95B8] text-xs">{t.posts}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
