import { motion } from 'framer-motion';
import { Hash, TrendingUp, Flame } from 'lucide-react';

const hashtags = [
  { tag: '#ContentStrategy', posts: '1.2M', engagement: '4.8%', trend: '+23%', hot: true },
  { tag: '#AICreators', posts: '890K', engagement: '5.2%', trend: '+156%', hot: true },
  { tag: '#ViralHooks', posts: '2.1M', engagement: '3.9%', trend: '+45%', hot: true },
  { tag: '#CreatorTips', posts: '3.4M', engagement: '3.1%', trend: '+12%', hot: false },
  { tag: '#GrowthHacking', posts: '780K', engagement: '4.5%', trend: '+67%', hot: true },
  { tag: '#Storytelling', posts: '1.5M', engagement: '4.2%', trend: '+34%', hot: false },
  { tag: '#Engagement', posts: '2.8M', engagement: '2.8%', trend: '+8%', hot: false },
  { tag: '#XAlgorithm', posts: '450K', engagement: '6.1%', trend: '+89%', hot: true },
];

export default function Hashtags() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-[#E0E4F0] font-semibold text-lg">Trending Hashtags</h2><p className="text-[#8B95B8] text-xs mt-0.5">Discover high-performing hashtags in your niche</p></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {hashtags.map((h, i) => (
          <motion.div
            key={h.tag}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4 cursor-pointer hover:border-[rgba(78,141,255,0.2)] transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#4E8DFF]" />
                <span className="text-[#E0E4F0] text-sm font-medium group-hover:text-[#4E8DFF] transition-colors">{h.tag}</span>
              </div>
              {h.hot && <Flame className="w-3.5 h-3.5 text-orange-400" />}
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-lg bg-white/[0.02]">
                <p className="text-[#E0E4F0] text-xs font-bold">{h.posts}</p>
                <p className="text-[#5A6480] text-[9px]">Posts</p>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02]">
                <p className="text-emerald-400 text-xs font-bold">{h.engagement}</p>
                <p className="text-[#5A6480] text-[9px]">Engagement</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2.5">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 text-[10px] font-medium">{h.trend} this week</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
