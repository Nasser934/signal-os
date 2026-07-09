import { motion } from 'framer-motion';
import { Brain, Lightbulb, TrendingUp, Zap, Target, Eye, Clock } from 'lucide-react';

const insights = [
  { category: 'Hook Analysis', icon: Target, color: '#4E8DFF', items: ['Your hooks perform 34% better when they start with a number or question.', 'Opening with "Here is why" gets 2.1x more engagement than statements.', 'Contrarian takes in the first 8 words increase scroll-stop rate by 47%.'] },
  { category: 'Structure', icon: Zap, color: '#00E5A0', items: ['Line breaks every 15-20 words improve readability by 28%.', 'Lists and bullet points get 1.8x more saves than paragraphs.', 'Threads with 5-8 tweets see the highest completion rates.'] },
  { category: 'Timing', icon: Clock, color: '#FFD93D', items: ['Tuesday 9-11 AM EST is your optimal posting window.', 'Posting within 30 mins of trending topics boosts reach by 3.2x.', 'Weekend posts get 18% fewer impressions but 12% higher engagement rates.'] },
  { category: 'Emotional Pull', icon: Eye, color: '#FF6B6B', items: ['Content with strong emotional words gets 2.4x more replies.', 'Curiosity gaps in the first line increase CTR by 56%.', 'Personal stories with a lesson outperform generic advice by 89%.'] },
  { category: 'Audience Match', icon: Brain, color: '#A78BFA', items: ['Tech-focused content resonates best with your current audience.', 'AI/tool topics get 3.1x more engagement than lifestyle content.', 'Your followers are most active during US East Coast business hours.'] },
  { category: 'Trends', icon: TrendingUp, color: '#00C8FF', items: ['AI content tools are trending +156% this month.', '"Viral hook formulas" searches up 89% in your niche.', 'Storytelling threads showing 67% growth in engagement.'] },
];

export default function Insights() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#E0E4F0] font-semibold text-lg">AI Insights</h2>
          <p className="text-[#8B95B8] text-xs mt-0.5">Data-driven recommendations for your content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insights.map((cat, i) => (
          <motion.div
            key={cat.category}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}15` }}>
                <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
              </div>
              <h3 className="text-[#E0E4F0] font-semibold text-sm">{cat.category}</h3>
            </div>
            <div className="space-y-2.5">
              {cat.items.map((item, j) => (
                <div key={j} className="flex items-start gap-2.5">
                  <Lightbulb className="w-3.5 h-3.5 text-[#5A6480] mt-0.5 flex-shrink-0" />
                  <p className="text-[#8B95B8] text-xs leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
