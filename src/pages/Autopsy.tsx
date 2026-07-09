import { motion } from 'framer-motion';
import { AlertTriangle, Lightbulb, CheckCircle2, XCircle } from 'lucide-react';

const autopsies = [
  {
    id: '1',
    content: 'Here are my top 10 tips for going viral on X. (Thread)',
    postedAt: 'Jul 5, 2:00 PM',
    score: 42,
    engagement: '0.8%',
    diagnosis: 'Low Performance',
    findings: [
      'Hook is generic and lacks specificity — "top 10 tips" is overused',
      'No emotional trigger or curiosity gap in the opening',
      'Posted at 2 PM — below-average audience activity window',
      'Missing numbers/stats that would add credibility',
    ],
    recommendations: [
      'Lead with a specific, contrarian insight instead',
      'Add a time-bound promise (e.g., "in 30 days")',
      'Post between 8-10 AM EST for your audience',
      'Include at least one surprising statistic in the hook',
    ],
  },
  {
    id: '2',
    content: 'Why I stopped posting daily and my engagement went up 300%',
    postedAt: 'Jul 3, 11:00 AM',
    score: 68,
    engagement: '2.1%',
    diagnosis: 'Moderate — Could Improve',
    findings: [
      'Good hook structure with a curiosity gap',
      'Strong emotional element ("stopped posting daily")',
      'Timing was optimal but thread format was not used',
      'Missing a clear CTA at the end for replies',
    ],
    recommendations: [
      'Use the thread format for storytelling posts',
      'Add a question at the end to drive replies',
      'Break long points into separate tweets',
      'Pin the best-performing tweet to your profile',
    ],
  },
];

export default function Autopsy() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-[#E0E4F0] font-semibold text-lg">Content Autopsy</h2><p className="text-[#8B95B8] text-xs mt-0.5">Deep-dive analysis of underperforming posts</p></div>
      </div>

      <div className="space-y-4">
        {autopsies.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[#E0E4F0] text-sm font-medium">{a.content}</p>
                <p className="text-[#5A6480] text-[10px] mt-1">{a.postedAt}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs font-bold ${a.score >= 70 ? 'text-[#4E8DFF]' : a.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{a.score}/100</span>
                <span className="text-[#5A6480] text-xs">{a.engagement}</span>
              </div>
            </div>

            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium mb-4 ${
              a.diagnosis === 'Low Performance' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
            }`}>
              <AlertTriangle className="w-3 h-3" />
              {a.diagnosis}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-3.5 h-3.5 text-red-400" />
                  <h4 className="text-[#E0E4F0] text-xs font-semibold">Findings</h4>
                </div>
                <div className="space-y-1.5">
                  {a.findings.map((f, j) => (
                    <div key={j} className="flex items-start gap-2 text-xs">
                      <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      <span className="text-[#8B95B8]">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <h4 className="text-[#E0E4F0] text-xs font-semibold">Recommendations</h4>
                </div>
                <div className="space-y-1.5">
                  {a.recommendations.map((r, j) => (
                    <div key={j} className="flex items-start gap-2 text-xs">
                      <Lightbulb className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-[#8B95B8]">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
