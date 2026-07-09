import { motion } from 'framer-motion';
// Icons available for future use: Trophy, Target, TrendingUp, Star

const dimensions = [
  { name: 'Hook Quality', score: 88, weight: 25, trend: '+5', best: 94 },
  { name: 'Readability', score: 82, weight: 15, trend: '+2', best: 88 },
  { name: 'Structure', score: 76, weight: 10, trend: '-1', best: 85 },
  { name: 'Emotional Pull', score: 91, weight: 20, trend: '+8', best: 96 },
  { name: 'Timing', score: 68, weight: 10, trend: '+12', best: 78 },
  { name: 'Engagement', score: 79, weight: 10, trend: '+3', best: 88 },
  { name: 'Audience Match', score: 74, weight: 5, trend: '+1', best: 82 },
  { name: 'Clarity', score: 85, weight: 5, trend: '+4', best: 92 },
];

const overallScore = Math.round(dimensions.reduce((s, d) => s + d.score * (d.weight / 100), 0));

export default function Scorecard() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-[#E0E4F0] font-semibold text-lg">Scorecard</h2><p className="text-[#8B95B8] text-xs mt-0.5">Your content quality assessment</p></div>
      </div>

      <div className="glass-card p-8 text-center">
        <svg className="w-36 h-36 mx-auto" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <motion.circle cx="70" cy="70" r="60" fill="none" stroke={overallScore >= 80 ? '#00E5A0' : overallScore >= 60 ? '#FFD93D' : '#FF6B6B'} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(overallScore / 100) * 377} 377`} transform="rotate(-90 70 70)" initial={{ strokeDasharray: '0 377' }} animate={{ strokeDasharray: `${(overallScore / 100) * 377} 377` }} transition={{ duration: 1.5, ease: 'easeOut' }} />
          <text x="70" y="65" textAnchor="middle" fill="#E0E4F0" fontSize="36" fontWeight="bold" fontFamily="Orbitron">{overallScore}</text>
          <text x="70" y="85" textAnchor="middle" fill="#5A6480" fontSize="12">/ 100</text>
        </svg>
        <p className={`text-lg font-bold mt-3 ${overallScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{overallScore >= 85 ? 'Exceptional' : overallScore >= 80 ? 'Excellent' : overallScore >= 70 ? 'Very Good' : 'Good'}</p>
        <p className="text-[#5A6480] text-xs mt-1">Weighted across 8 dimensions</p>
      </div>

      <div className="space-y-3">
        {dimensions.map((d, i) => (
          <motion.div key={d.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><span className="text-[#E0E4F0] text-sm font-medium">{d.name}</span><span className="text-[#5A6480] text-[10px]">({d.weight}%)</span></div>
              <div className="flex items-center gap-3"><span className="text-[#5A6480] text-[10px]">Best: {d.best}</span><span className={`text-xs font-bold ${d.score >= 80 ? 'text-emerald-400' : d.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{d.score}</span><span className={`text-[10px] ${d.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{d.trend}</span></div>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${d.score}%` }} transition={{ duration: 0.8, delay: i * 0.05 }} className="h-full rounded-full" style={{ backgroundColor: d.score >= 80 ? '#00E5A0' : d.score >= 60 ? '#FFD93D' : '#FF6B6B' }} /></div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
