import { motion } from 'framer-motion';

interface Props { count?: number; }

const shimmer = (
  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-[shimmer_2s_infinite]" />
);

export function SkeletonKpi({ count = 4 }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
          className="relative overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#1A1D2E]/60 p-5">
          {shimmer}
          <div className="flex items-center justify-between mb-3"><div className="h-3 w-20 rounded bg-white/[0.06]" /><div className="w-8 h-8 rounded-lg bg-white/[0.04]" /></div>
          <div className="h-8 w-16 rounded bg-white/[0.08] mb-2" /><div className="h-3 w-12 rounded bg-white/[0.04]" />
        </motion.div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#1A1D2E]/60 p-6">
      {shimmer}<div className="h-4 w-24 rounded bg-white/[0.06] mb-4" />
      <div className="h-[200px] flex items-end gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-1 rounded-t bg-white/[0.04]" style={{ height: `${30 + Math.random() * 50}%` }} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonList({ count = 5 }: Props) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
          className="relative overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#1A1D2E]/60 p-4">
          {shimmer}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/[0.06] flex-shrink-0" />
            <div className="flex-1"><div className="h-3 w-3/4 rounded bg-white/[0.06] mb-2" /><div className="h-2.5 w-1/2 rounded bg-white/[0.04]" /></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function SkeletonScoreRing() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#1A1D2E]/60 p-8 text-center">
      {shimmer}<div className="w-28 h-28 rounded-full border-8 border-white/[0.06] mx-auto mb-4" />
      <div className="h-5 w-24 rounded bg-white/[0.06] mx-auto mb-2" /><div className="h-3 w-32 rounded bg-white/[0.04] mx-auto" />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="min-h-screen bg-[#0B0D17] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4E8DFF] to-[#00C8FF] flex items-center justify-center animate-pulse">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
      </div>
      <p className="text-[#5A6480] text-sm">Loading Signal OS...</p>
    </div>
  );
}
