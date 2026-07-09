import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, TrendingDown, Target, Flame, Star } from 'lucide-react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 24 }, (_, i) => i);

const heatmapData: Record<string, number[]> = {
  Mon: [20,15,12,10,15,25,45,65,85,78,72,68,75,80,82,75,70,65,60,55,50,45,35,25],
  Tue: [18,14,11,10,18,30,50,70,88,82,75,70,72,78,85,80,75,68,62,58,52,42,32,22],
  Wed: [22,16,13,11,20,35,55,72,90,85,78,74,76,82,88,84,78,70,65,60,55,48,38,28],
  Thu: [19,15,12,10,16,28,48,68,86,80,74,70,73,79,84,81,76,69,63,58,52,44,34,24],
  Fri: [25,18,14,12,22,38,58,75,92,88,80,76,78,85,90,86,80,72,66,62,58,50,42,32],
  Sat: [30,22,18,15,20,28,42,55,65,70,72,75,78,80,82,78,72,65,58,52,48,42,35,28],
  Sun: [28,20,16,14,18,25,40,52,62,68,70,73,76,78,80,76,70,63,56,50,45,40,32,26],
};

function getColor(value: number): string {
  if (value >= 85) return '#00E5A0';
  if (value >= 70) return '#4E8DFF';
  if (value >= 55) return '#FFD93D';
  if (value >= 40) return '#A78BFA';
  return 'rgba(255,255,255,0.08)';
}

export default function Timeline() {
  const [hoveredCell, setHoveredCell] = useState<{ day: string; hour: number; value: number } | null>(null);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-[#E0E4F0] font-semibold text-lg">Timing Intelligence</h2><p className="text-[#8B95B8] text-xs mt-0.5">Optimal posting times heatmap</p></div>
        <div className="flex items-center gap-4 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded" style={{ background: '#00E5A0' }} />Best</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded" style={{ background: '#4E8DFF' }} />Good</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded" style={{ background: '#FFD93D' }} />Fair</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded" style={{ background: '#A78BFA' }} />Low</span>
        </div>
      </div>

      <div className="glass-card p-5 overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid gap-1" style={{ gridTemplateColumns: `40px repeat(${hours.length}, 1fr)` }}>
            <div />
            {hours.map(h => (
              <div key={h} className="text-center text-[#5A6480] text-[9px] py-1">{h}</div>
            ))}
            {days.map(day => (
              <div key={day} className="contents">
                <div className="text-[#8B95B8] text-[10px] flex items-center font-medium">{day}</div>
                {heatmapData[day].map((value, h) => (
                  <motion.div
                    key={`${day}-${h}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (days.indexOf(day) * 24 + h) * 0.002 }}
                    className="h-6 rounded-sm cursor-pointer transition-all hover:scale-110 hover:z-10 relative"
                    style={{ backgroundColor: getColor(value) }}
                    onMouseEnter={() => setHoveredCell({ day, hour: h, value })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {hoveredCell?.day === day && hoveredCell?.hour === h && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-[#1A1D2E] border border-[rgba(255,255,255,0.1)] text-[10px] text-[#E0E4F0] whitespace-nowrap z-20">
                        {day} {h}:00 — Score: {value}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Flame, label: 'Best Day', value: 'Friday', sub: 'Average: 82/100', color: 'text-orange-400' },
          { icon: Clock, label: 'Best Hour', value: '9:00 AM', sub: 'EST timezone', color: 'text-[#4E8DFF]' },
          { icon: TrendingUp, label: 'Peak Engagement', value: '+47%', sub: 'vs average post', color: 'text-emerald-400' },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center">
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-[#5A6480] text-[10px]">{item.label}</p>
              <p className="text-[#E0E4F0] text-sm font-bold">{item.value}</p>
              <p className="text-[#5A6480] text-[10px]">{item.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3"><Star className="w-4 h-4 text-[#FFD93D]" /><h3 className="text-[#E0E4F0] font-semibold text-sm">Recommendations</h3></div>
        <div className="space-y-2">
          {['Post between 8-10 AM EST on weekdays for maximum reach', 'Friday mornings show 23% higher engagement than other days', 'Avoid posting between 2-4 AM EST — lowest audience activity', 'Weekend afternoons (2-4 PM) work well for storytelling content'].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-xs"><span className="w-1 h-1 rounded-full bg-[#FFD93D] mt-1.5 flex-shrink-0" /><span className="text-[#8B95B8]">{tip}</span></div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
