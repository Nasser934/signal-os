import { motion } from 'framer-motion';
import { Zap, Activity, TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

const alerts = [
  { type: 'warning', message: 'Hook Quality dropped 12% in last 3 posts', time: '2h ago', icon: AlertTriangle },
  { type: 'success', message: 'Engagement rate hit new high: 6.2%', time: '5h ago', icon: CheckCircle2 },
  { type: 'info', message: 'Optimal posting window starts in 30 mins', time: '30m ago', icon: Clock },
  { type: 'warning', message: 'Readability score below average on latest draft', time: '1d ago', icon: AlertTriangle },
  { type: 'success', message: 'Viral prediction: 87% for tomorrow post', time: '1d ago', icon: TrendingUp },
];

const metrics = [
  { label: 'System Status', value: 'Operational', color: 'text-emerald-400', icon: Activity },
  { label: 'API Latency', value: '<200ms', color: 'text-emerald-400', icon: Zap },
  { label: 'Scans Today', value: '47', color: 'text-[#4E8DFF]', icon: TrendingUp },
  { label: 'Active Alerts', value: '2', color: 'text-amber-400', icon: AlertTriangle },
];

export default function CommandCenter() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-[#E0E4F0] font-semibold text-lg">Command Center</h2><p className="text-[#8B95B8] text-xs mt-0.5">Real-time monitoring and alerts</p></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <m.icon className="w-4 h-4 text-[#5A6480]" />
              <span className="text-[#5A6480] text-[10px]">{m.label}</span>
            </div>
            <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-5">
        <h3 className="text-[#E0E4F0] font-semibold text-sm mb-4">Recent Alerts</h3>
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                a.type === 'warning' ? 'bg-amber-500/5 border border-amber-500/10' :
                a.type === 'success' ? 'bg-emerald-500/5 border border-emerald-500/10' :
                'bg-[#4E8DFF]/5 border border-[#4E8DFF]/10'
              }`}
            >
              <a.icon className={`w-4 h-4 flex-shrink-0 ${
                a.type === 'warning' ? 'text-amber-400' :
                a.type === 'success' ? 'text-emerald-400' :
                'text-[#4E8DFF]'
              }`} />
              <div className="flex-1">
                <p className="text-[#E0E4F0] text-xs">{a.message}</p>
                <p className="text-[#5A6480] text-[10px] mt-0.5">{a.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
