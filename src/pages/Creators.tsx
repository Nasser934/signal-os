import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

const topCreators = [
  { rank: 1, name: 'Alex Chen', handle: '@alexcreates', followers: '245K', avgScore: 92, engagement: '5.8%', niche: 'Tech / AI', avatar: 'A' },
  { rank: 2, name: 'Sarah Miller', handle: '@sarahcontent', followers: '189K', avgScore: 89, engagement: '4.9%', niche: 'Marketing', avatar: 'S' },
  { rank: 3, name: 'David Park', handle: '@davidgrowth', followers: '156K', avgScore: 87, engagement: '6.2%', niche: 'Growth', avatar: 'D' },
  { rank: 4, name: 'Emma Wilson', handle: '@emmawrites', followers: '134K', avgScore: 85, engagement: '5.1%', niche: 'Writing', avatar: 'E' },
  { rank: 5, name: 'James Lee', handle: '@jamesbiz', followers: '112K', avgScore: 83, engagement: '4.4%', niche: 'Business', avatar: 'J' },
  { rank: 6, name: 'Mia Taylor', handle: '@miadesign', followers: '98K', avgScore: 81, engagement: '5.5%', niche: 'Design', avatar: 'M' },
  { rank: 7, name: 'Ryan Garcia', handle: '@ryaneng', followers: '87K', avgScore: 79, engagement: '4.7%', niche: 'Engineering', avatar: 'R' },
  { rank: 8, name: 'Lisa Wang', handle: '@lisastartup', followers: '76K', avgScore: 78, engagement: '5.9%', niche: 'Startups', avatar: 'L' },
];

export default function Creators() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-[#E0E4F0] font-semibold text-lg">Top Creators</h2><p className="text-[#8B95B8] text-xs mt-0.5">Benchmark against the best in your niche</p></div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                <th className="text-left px-4 py-3 text-[#5A6480] text-[10px] font-semibold uppercase tracking-wider">Rank</th>
                <th className="text-left px-4 py-3 text-[#5A6480] text-[10px] font-semibold uppercase tracking-wider">Creator</th>
                <th className="text-left px-4 py-3 text-[#5A6480] text-[10px] font-semibold uppercase tracking-wider">Followers</th>
                <th className="text-left px-4 py-3 text-[#5A6480] text-[10px] font-semibold uppercase tracking-wider">Avg Score</th>
                <th className="text-left px-4 py-3 text-[#5A6480] text-[10px] font-semibold uppercase tracking-wider">Engagement</th>
                <th className="text-left px-4 py-3 text-[#5A6480] text-[10px] font-semibold uppercase tracking-wider">Niche</th>
              </tr>
            </thead>
            <tbody>
              {topCreators.map((c, i) => (
                <motion.tr
                  key={c.handle}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-[rgba(255,255,255,0.04)] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3">
                    {c.rank <= 3 ? (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        c.rank === 1 ? 'bg-[#FFD93D]/15 text-[#FFD93D]' : c.rank === 2 ? 'bg-[#C0C0C0]/15 text-[#C0C0C0]' : 'bg-[#CD7F32]/15 text-[#CD7F32]'
                      }`}>
                        {c.rank}
                      </div>
                    ) : (
                      <span className="text-[#5A6480] text-xs ml-1.5">{c.rank}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#4E8DFF]/15 flex items-center justify-center text-xs font-bold text-[#4E8DFF]">{c.avatar}</div>
                      <div>
                        <p className="text-[#E0E4F0] text-xs font-medium">{c.name}</p>
                        <p className="text-[#5A6480] text-[10px]">{c.handle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#E0E4F0] text-xs">{c.followers}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold ${c.avgScore >= 85 ? 'text-emerald-400' : c.avgScore >= 75 ? 'text-[#4E8DFF]' : 'text-amber-400'}`}>{c.avgScore}</span>
                  </td>
                  <td className="px-4 py-3 text-emerald-400 text-xs">{c.engagement}</td>
                  <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-[#8B95B8]">{c.niche}</span></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3"><Award className="w-4 h-4 text-[#FFD93D]" /><h3 className="text-[#E0E4F0] font-semibold text-sm">Your Ranking</h3></div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-[#4E8DFF]">#42</p>
              <p className="text-[#5A6480] text-[10px]">out of 12,847</p>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-xs"><span className="text-[#8B95B8]">Score</span><span className="text-[#E0E4F0] font-bold">79</span></div>
              <div className="flex items-center justify-between text-xs"><span className="text-[#8B95B8]">Engagement</span><span className="text-emerald-400 font-bold">4.8%</span></div>
              <div className="flex items-center justify-between text-xs"><span className="text-[#8B95B8]">Growth</span><span className="text-emerald-400 font-bold">+12.3%</span></div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="text-[#E0E4F0] font-semibold text-sm mb-3">Benchmark Insight</h3>
          <p className="text-[#8B95B8] text-xs leading-relaxed">
            Top creators in your niche average <span className="text-[#4E8DFF] font-medium">87 points</span> with
            <span className="text-emerald-400 font-medium"> 5.4% engagement</span>. Your hook quality is above average
            but timing scores lag by <span className="text-red-400 font-medium">14 points</span>.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
