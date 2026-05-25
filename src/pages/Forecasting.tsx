import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  Settings,
  Activity,
  Target,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { forecastData } from '@/lib/mockData';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const childFadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
};

/* ------------------------------------------------------------------ */
/*  Scenario config                                                    */
/* ------------------------------------------------------------------ */
type Scenario = 'bull' | 'base' | 'bear';

const scenarioConfig: Record<Scenario, { label: string; color: string; icon: typeof TrendingUp; desc: string }> = {
  bull: { label: 'Bull', color: '#22C55E', icon: TrendingUp, desc: '+20% variance' },
  base: { label: 'Base', color: '#4E8DFF', icon: Minus, desc: 'Baseline' },
  bear: { label: 'Bear', color: '#FF4444', icon: TrendingDown, desc: '-20% variance' },
};

/* ------------------------------------------------------------------ */
/*  Chart data generator                                               */
/* ------------------------------------------------------------------ */
function generateForecastChartData(days: number) {
  const baseEngagement = 4500;
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(2024, 0, 16 + i);
    const trend = 1 + i * 0.02;
    const noise = Math.sin(i * 0.8) * 0.1;
    return {
      date: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      bull: Math.round(baseEngagement * trend * 1.2 * (1 + noise)),
      base: Math.round(baseEngagement * trend * (1 + noise * 0.5)),
      bear: Math.round(baseEngagement * trend * 0.8 * (1 + noise * 0.3)),
    };
  });
}

const forecastChartData = generateForecastChartData(30);

/* ------------------------------------------------------------------ */
/*  Forecast metrics                                                   */
/* ------------------------------------------------------------------ */
const forecastMetrics = [
  { label: 'Follower Growth', bull: '+450', base: '+180', bear: '-50', suffix: '', unit: 'followers' },
  { label: 'Impressions', bull: '58.2K', base: '42.1K', bear: '28.4K', suffix: '', unit: 'total' },
  { label: 'Engagement Rate', bull: '5.8%', base: '4.2%', bear: '2.9%', suffix: '', unit: 'percentage' },
  { label: 'AI Content Score', bull: '92', base: '85', bear: '78', suffix: '', unit: 'score' },
];

/* ------------------------------------------------------------------ */
/*  Scenario comparison table                                          */
/* ------------------------------------------------------------------ */
const comparisonRows = [
  { label: 'Follower Growth', bull: '+450', base: '+180', bear: '-50' },
  { label: 'Impressions', bull: '58.2K', base: '42.1K', bear: '28.4K' },
  { label: 'Engagement Rate', bull: '5.8%', base: '4.2%', bear: '2.9%' },
  { label: 'Posts per Week', bull: '7', base: '5', bear: '3' },
  { label: 'Avg Score', bull: '92', base: '85', bear: '78' },
  { label: 'Confidence', bull: '72%', base: '89%', bear: '68%' },
];

/* ------------------------------------------------------------------ */
/*  Assumptions                                                        */
/* ------------------------------------------------------------------ */
interface Assumption {
  label: string;
  value: number | string | boolean;
  type: 'slider' | 'select' | 'toggle';
  min?: number;
  max?: number;
  options?: string[];
}

const defaultAssumptions: Assumption[] = [
  { label: 'Posts per week', value: 5, type: 'slider', min: 1, max: 14 },
  { label: 'Include media', value: true, type: 'toggle' },
  { label: 'Content quality', value: 'Good', type: 'select', options: ['Excellent', 'Good', 'Average', 'Below Average'] },
  { label: 'Market conditions', value: 'Stable', type: 'select', options: ['Booming', 'Stable', 'Uncertain', 'Downturn'] },
];

/* ------------------------------------------------------------------ */
/*  Custom chart tooltip                                               */
/* ------------------------------------------------------------------ */
function ForecastTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[rgba(32,36,54,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 shadow-xl">
      <p className="text-[#5A6480] text-xs mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[#8B95B8] capitalize">{p.dataKey}:</span>
          <span className="text-[#E0E4F0] font-data font-semibold">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */
function AnimatedValue({ value, color }: { value: string; color: string }) {
  const numericMatch = value.match(/[\d.]+/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : 0;
  const prefix = value.startsWith('+') ? '+' : value.startsWith('-') ? '-' : '';
  const suffix = value.includes('%') ? '%' : value.includes('K') ? 'K' : '';

  return (
    <motion.span
      className="text-lg font-bold font-data tracking-tight"
      style={{ color }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {prefix}{numericValue}{suffix}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Forecasting Component                                         */
/* ------------------------------------------------------------------ */
export default function Forecasting() {
  const [activeScenario, setActiveScenario] = useState<Scenario>('base');
  const [assumptions, setAssumptions] = useState<Assumption[]>(defaultAssumptions);

  const handleAssumptionChange = (index: number, newValue: number | string | boolean) => {
    setAssumptions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], value: newValue };
      return next;
    });
  };

  /* ---- Dynamic line opacity based on active scenario ---- */
  const getLineOpacity = (scenario: Scenario) => {
    if (activeScenario === scenario) return 1;
    return 0.3;
  };

  const getStrokeWidth = (scenario: Scenario) => {
    if (activeScenario === scenario) return 3;
    return 2;
  };

  return (
    <motion.div
      className="space-y-6 pb-8"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* ======== SECTION 1: Page Header ======== */}
      <motion.div variants={childFadeUp}>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold font-display text-[#E0E4F0] tracking-tight">Forecasting</h1>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgba(78,141,255,0.1)] text-[#4E8DFF] text-xs font-medium">
            <Brain className="w-3 h-3" />
            Predictive Model v2.1
          </span>
        </div>
        <p className="text-sm text-[#8B95B8]">AI-powered performance predictions</p>
      </motion.div>

      {/* ======== SECTION 2: Scenario Selector ======== */}
      <motion.div variants={childFadeUp} className="flex justify-center">
        <div className="inline-flex items-center bg-[rgba(255,255,255,0.04)] rounded-full p-1 border border-[rgba(255,255,255,0.08)]">
          {(Object.keys(scenarioConfig) as Scenario[]).map((scenario) => {
            const config = scenarioConfig[scenario];
            const Icon = config.icon;
            const isActive = activeScenario === scenario;
            return (
              <button
                key={scenario}
                onClick={() => setActiveScenario(scenario)}
                className={cn(
                  'relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  isActive ? 'text-white' : 'text-[#8B95B8] hover:text-[#E0E4F0]'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="scenarioPill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: config.color }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{config.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ======== SECTION 3: Forecast Chart ======== */}
      <motion.div variants={childFadeUp}>
        <GlassCard className="h-[420px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#E0E4F0] font-display">30-Day Forecast</h3>
              <p className="text-xs text-[#5A6480] mt-0.5">Projected engagement across three scenarios</p>
            </div>
            <div className="flex items-center gap-4">
              {(Object.keys(scenarioConfig) as Scenario[]).map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: scenarioConfig[s].color, opacity: getLineOpacity(s) }}
                  />
                  <span className="text-[10px] text-[#8B95B8]">{scenarioConfig[s].label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={forecastChartData}>
              <defs>
                <linearGradient id="gradBull" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradBase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4E8DFF" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#4E8DFF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradBear" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF4444" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#FF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5A6480' }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: '#5A6480' }} tickLine={false} axisLine={false} width={45} />
              <Tooltip content={<ForecastTooltip />} />
              <Area
                type="monotone"
                dataKey="bull"
                stroke="#22C55E"
                strokeWidth={getStrokeWidth('bull')}
                strokeOpacity={getLineOpacity('bull')}
                fill="url(#gradBull)"
                fillOpacity={getLineOpacity('bull')}
              />
              <Area
                type="monotone"
                dataKey="base"
                stroke="#4E8DFF"
                strokeWidth={getStrokeWidth('base')}
                strokeOpacity={getLineOpacity('base')}
                strokeDasharray="4 4"
                fill="url(#gradBase)"
                fillOpacity={getLineOpacity('base')}
              />
              <Area
                type="monotone"
                dataKey="bear"
                stroke="#FF4444"
                strokeWidth={getStrokeWidth('bear')}
                strokeOpacity={getLineOpacity('bear')}
                fill="url(#gradBear)"
                fillOpacity={getLineOpacity('bear')}
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </motion.div>

      {/* ======== SECTION 4: Key Metrics Forecast ======== */}
      <motion.div variants={childFadeUp}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {forecastMetrics.map((metric) => (
            <motion.div
              key={metric.label}
              variants={childFadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <GlassCard>
                <h4 className="text-xs text-[#8B95B8] mb-3">{metric.label}</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <AnimatedValue value={metric.bull} color="#22C55E" />
                    <span className="text-[10px] text-[#5A6480] block mt-0.5">Bull</span>
                  </div>
                  <div className="text-center">
                    <AnimatedValue value={metric.base} color="#4E8DFF" />
                    <span className="text-[10px] text-[#5A6480] block mt-0.5">Base</span>
                  </div>
                  <div className="text-center">
                    <AnimatedValue value={metric.bear} color="#FF4444" />
                    <span className="text-[10px] text-[#5A6480] block mt-0.5">Bear</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ======== SECTION 5 & 6: Scenario Comparison + Assumptions ======== */}
      <motion.div variants={childFadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenario Comparison Table */}
        <GlassCard>
          <h3 className="text-sm font-semibold text-[#E0E4F0] font-display mb-4">Scenario Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.08)]">
                  <th className="py-2.5 px-3 text-left text-[10px] text-[#5A6480] uppercase tracking-wider font-medium">Metric</th>
                  <th className="py-2.5 px-3 text-center text-[10px] text-[#22C55E] uppercase tracking-wider font-medium">Bull</th>
                  <th className="py-2.5 px-3 text-center text-[10px] text-[#4E8DFF] uppercase tracking-wider font-medium">Base</th>
                  <th className="py-2.5 px-3 text-center text-[10px] text-[#FF4444] uppercase tracking-wider font-medium">Bear</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <motion.tr
                    key={row.label}
                    className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(78,141,255,0.04)] transition-colors"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td className="py-2.5 px-3 text-xs text-[#E0E4F0]">{row.label}</td>
                    <td className="py-2.5 px-3 text-center text-xs font-data font-semibold text-[#22C55E]">{row.bull}</td>
                    <td className="py-2.5 px-3 text-center text-xs font-data font-semibold text-[#4E8DFF]">{row.base}</td>
                    <td className="py-2.5 px-3 text-center text-xs font-data font-semibold text-[#FF4444]">{row.bear}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Forecast Assumptions */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-4 h-4 text-[#4E8DFF]" />
            <h3 className="text-sm font-semibold text-[#E0E4F0] font-display">Forecast Assumptions</h3>
          </div>
          <div className="space-y-5">
            {assumptions.map((assumption, i) => (
              <motion.div
                key={assumption.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-[#8B95B8]">{assumption.label}</label>
                  <span className="text-xs font-data text-[#4E8DFF]">
                    {typeof assumption.value === 'boolean'
                      ? assumption.value ? 'On' : 'Off'
                      : String(assumption.value)}
                  </span>
                </div>
                {assumption.type === 'slider' && (
                  <input
                    type="range"
                    min={assumption.min}
                    max={assumption.max}
                    value={assumption.value as number}
                    onChange={(e) => handleAssumptionChange(i, Number(e.target.value))}
                    className="w-full h-1.5 bg-[rgba(255,255,255,0.08)] rounded-full appearance-none cursor-pointer accent-[#4E8DFF]"
                    style={{ accentColor: '#4E8DFF' }}
                  />
                )}
                {assumption.type === 'select' && (
                  <select
                    value={assumption.value as string}
                    onChange={(e) => handleAssumptionChange(i, e.target.value)}
                    className="w-full bg-[rgba(26,29,46,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-xs text-[#E0E4F0] outline-none focus:border-[rgba(78,141,255,0.5)]"
                  >
                    {assumption.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
                {assumption.type === 'toggle' && (
                  <button
                    onClick={() => handleAssumptionChange(i, !(assumption.value as boolean))}
                    className={cn(
                      'w-9 h-5 rounded-full relative transition-colors',
                      assumption.value ? 'bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF]' : 'bg-[rgba(255,255,255,0.1)]'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 w-4 h-4 bg-[#E0E4F0] rounded-full transition-transform',
                        assumption.value ? 'left-[18px]' : 'left-0.5'
                      )}
                    />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.08)]">
            <p className="text-[10px] text-[#5A6480] leading-relaxed">
              Adjusting these parameters will recalculate forecast projections in real-time. The AI model weights recent performance more heavily.
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* ======== SECTION 7: Confidence Intervals ======== */}
      <motion.div variants={childFadeUp}>
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#4E8DFF]" />
            <h3 className="text-sm font-semibold text-[#E0E4F0] font-display">Confidence Intervals</h3>
          </div>
          <p className="text-xs text-[#8B95B8] mb-6">
            We are <span className="text-[#4E8DFF] font-semibold">{forecastData.confidence}%</span> confident projections will fall within this range
          </p>

          <div className="relative h-24 flex items-center justify-center">
            {/* 95% band */}
            <motion.div
              className="absolute h-16 rounded-full"
              style={{
                width: '95%',
                background: 'linear-gradient(90deg, rgba(78,141,255,0.03), rgba(78,141,255,0.08), rgba(78,141,255,0.03))',
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            />
            {/* 75% band */}
            <motion.div
              className="absolute h-12 rounded-full"
              style={{
                width: '75%',
                background: 'linear-gradient(90deg, rgba(78,141,255,0.05), rgba(78,141,255,0.12), rgba(78,141,255,0.05))',
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            />
            {/* 50% band */}
            <motion.div
              className="absolute h-8 rounded-full"
              style={{
                width: '50%',
                background: 'linear-gradient(90deg, rgba(78,141,255,0.08), rgba(78,141,255,0.18), rgba(78,141,255,0.08))',
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            />
            {/* Center line */}
            <motion.div
              className="absolute w-0.5 h-10 bg-[#4E8DFF] rounded-full"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            />
            <motion.div
              className="absolute w-3 h-3 bg-[#4E8DFF] rounded-full shadow-lg shadow-[rgba(78,141,255,0.4)]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 400 }}
            />
          </div>

          <div className="flex items-center justify-center gap-8 mt-4">
            <div className="text-center">
              <span className="text-[10px] text-[#5A6480]">95% Range</span>
              <p className="text-xs font-data text-[#8B95B8] mt-0.5">98K - 185K</p>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-[#5A6480]">75% Range</span>
              <p className="text-xs font-data text-[#8B95B8] mt-0.5">115K - 168K</p>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-[#5A6480]">50% Range</span>
              <p className="text-xs font-data text-[#8B95B8] mt-0.5">135K - 156K</p>
            </div>
          </div>

          {/* Factors */}
          <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.08)]">
            <h4 className="text-xs font-semibold text-[#E0E4F0] mb-2">Key Factors</h4>
            <div className="flex flex-wrap gap-2">
              {forecastData.factors.map((factor) => (
                <span
                  key={factor}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[rgba(78,141,255,0.08)] text-[#4E8DFF] text-[10px]"
                >
                  <Target className="w-3 h-3" />
                  {factor}
                </span>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
