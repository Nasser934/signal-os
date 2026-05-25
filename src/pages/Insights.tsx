import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Eye,
  XCircle,
  Check,
  Brain,
  TrendingUp,
  Clock,
  Users,
  Hash,
  Smile,
  Shield,
  BarChart2,
  X,
  Search,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const childFadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
};

const cardSlideIn = {
  hidden: { opacity: 0, x: 30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  }),
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type Decision = 'ACT' | 'MONITOR' | 'IGNORE';
type Category = 'Engagement' | 'Timing' | 'Content Type' | 'Audience' | 'Hashtag' | 'Topic' | 'Sentiment' | 'Competitor';

interface Insight {
  id: number;
  decision: Decision;
  category: Category;
  text: string;
  confidence: number;
  time: string;
  evidence: string;
  acted?: boolean;
  dismissed?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Category icon map                                                  */
/* ------------------------------------------------------------------ */
const categoryIcons: Record<Category, typeof Zap> = {
  Engagement: BarChart2,
  Timing: Clock,
  'Content Type': Zap,
  Audience: Users,
  Hashtag: Hash,
  Topic: Brain,
  Sentiment: Smile,
  Competitor: Shield,
};

/* ------------------------------------------------------------------ */
/*  Initial insights data                                              */
/* ------------------------------------------------------------------ */
const initialInsights: Insight[] = [
  { id: 1, decision: 'ACT', category: 'Engagement', text: 'Engagement rate dropped 15% on posts without media. Consider adding images or videos to your text posts for better reach.', confidence: 87, time: '2 hours ago', evidence: '23% drop' },
  { id: 2, decision: 'ACT', category: 'Content Type', text: 'Threads with 5+ tweets get 2.3x more profile clicks than single tweets. Consider breaking long posts into threads.', confidence: 91, time: '5 hours ago', evidence: '2.3x clicks' },
  { id: 3, decision: 'MONITOR', category: 'Timing', text: 'Your Tuesday 10AM posts are performing 34% better than average. Maintain this schedule for optimal reach.', confidence: 72, time: '8 hours ago', evidence: '+34% boost' },
  { id: 4, decision: 'MONITOR', category: 'Audience', text: 'Follower growth rate is slowing. Expected seasonal dip — monitor for 2 weeks before taking action.', confidence: 68, time: '1 day ago', evidence: '-8% growth' },
  { id: 5, decision: 'IGNORE', category: 'Hashtag', text: '#TechNews usage is declining in your niche. No action needed yet as it does not affect your core content.', confidence: 45, time: '2 days ago', evidence: '-12% usage' },
  { id: 6, decision: 'ACT', category: 'Topic', text: 'AI tool reviews are trending up 45% in your network. Capitalize by sharing your AI workflow and tool recommendations.', confidence: 83, time: '2 days ago', evidence: '+45% trend' },
  { id: 7, decision: 'MONITOR', category: 'Sentiment', text: 'Sentiment on tech industry posts is shifting neutral-to-negative. Watch your tone in industry commentary.', confidence: 61, time: '3 days ago', evidence: 'Sentiment -12' },
  { id: 8, decision: 'IGNORE', category: 'Competitor', text: 'Three competitors posted similar content this week. Your engagement remains higher — no response needed.', confidence: 38, time: '3 days ago', evidence: '+18% vs comp' },
  { id: 9, decision: 'ACT', category: 'Engagement', text: 'Replying to comments within 30 minutes increases reply-to-rate by 3.5x. Set up reply notifications for your top posts.', confidence: 89, time: '4 days ago', evidence: '3.5x reply rate' },
  { id: 10, decision: 'MONITOR', category: 'Timing', text: 'Weekend posting shows 22% lower reach but 15% higher engagement per impression. Test Saturday morning posts.', confidence: 65, time: '5 days ago', evidence: '+15% engagement' },
  { id: 11, decision: 'ACT', category: 'Content Type', text: 'Video posts under 60 seconds are outperforming image posts by 56% in engagement. Prioritize short-form video.', confidence: 78, time: '5 days ago', evidence: '+56% engagement' },
  { id: 12, decision: 'IGNORE', category: 'Audience', text: 'Geographic distribution of followers shifted slightly toward Asia-Pacific. Normal fluctuation — no action needed.', confidence: 32, time: '6 days ago', evidence: '+3% APAC' },
  { id: 13, decision: 'ACT', category: 'Hashtag', text: '#BuildInPublic and #IndieHackers are surging with 62% more engagement this week. Add these to relevant posts.', confidence: 85, time: '6 days ago', evidence: '+62% engagement' },
  { id: 14, decision: 'MONITOR', category: 'Topic', text: 'Remote work discussions are declining in reach. Your audience may be shifting focus — monitor for 2 more weeks.', confidence: 58, time: '1 week ago', evidence: '-18% reach' },
  { id: 15, decision: 'ACT', category: 'Sentiment', text: 'Positive sentiment on your personal story posts is 92% — your highest. Share more behind-the-scenes and journey content.', confidence: 92, time: '1 week ago', evidence: '92% positive' },
];

/* ------------------------------------------------------------------ */
/*  Decision badge component                                           */
/* ------------------------------------------------------------------ */
function DecisionBadge({ decision, acted }: { decision: Decision; acted?: boolean }) {
  const config: Record<Decision | 'ACTED', { color: string; bg: string; icon: typeof Zap; label: string }> = {
    ACT: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)', icon: Zap, label: 'ACT' },
    MONITOR: { color: '#FFB347', bg: 'rgba(255,179,71,0.12)', icon: Eye, label: 'MONITOR' },
    IGNORE: { color: '#5A6480', bg: 'rgba(90,100,128,0.12)', icon: XCircle, label: 'IGNORE' },
    ACTED: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)', icon: Check, label: 'ACTED' },
  };

  const key = acted && decision === 'ACT' ? 'ACTED' : decision;
  const c = config[key];
  const Icon = c.icon;

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ color: c.color, background: c.bg }}
    >
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat counter                                                       */
/* ------------------------------------------------------------------ */
function AnimatedCounter({ value, color }: { value: number; color: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useMemo(() => {
    const duration = 800;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);

  return (
    <span className="text-3xl font-bold font-data tracking-tight" style={{ color }}>
      {displayValue}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Insights Component                                            */
/* ------------------------------------------------------------------ */
export default function Insights() {
  const [insights, setInsights] = useState<Insight[]>(initialInsights);
  const [decisionFilter, setDecisionFilter] = useState<'ALL' | Decision>('ALL');
  const [confidenceFilter, setConfidenceFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailInsight, setDetailInsight] = useState<Insight | null>(null);

  /* ---- Filtered insights ---- */
  const filteredInsights = useMemo(() => {
    return insights.filter((ins) => {
      if (ins.dismissed) return false;
      if (decisionFilter !== 'ALL' && ins.decision !== decisionFilter) return false;
      if (confidenceFilter === 'HIGH' && ins.confidence <= 80) return false;
      if (confidenceFilter === 'MEDIUM' && (ins.confidence < 50 || ins.confidence > 80)) return false;
      if (confidenceFilter === 'LOW' && ins.confidence >= 50) return false;
      if (searchQuery && !ins.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [insights, decisionFilter, confidenceFilter, searchQuery]);

  /* ---- Stats ---- */
  const stats = useMemo(() => {
    const act = insights.filter((i) => i.decision === 'ACT' && !i.dismissed).length;
    const monitor = insights.filter((i) => i.decision === 'MONITOR' && !i.dismissed).length;
    const ignore = insights.filter((i) => i.decision === 'IGNORE' && !i.dismissed).length;
    return { act, monitor, ignore };
  }, [insights]);

  /* ---- Actions ---- */
  const handleDismiss = (id: number) => {
    setInsights((prev) => prev.map((i) => (i.id === id ? { ...i, dismissed: true } : i)));
  };

  const handleActed = (id: number) => {
    setInsights((prev) => prev.map((i) => (i.id === id ? { ...i, acted: true } : i)));
  };

  const handleRestore = (id: number) => {
    setInsights((prev) => prev.map((i) => (i.id === id ? { ...i, dismissed: false } : i)));
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
          <h1 className="text-2xl font-bold font-display text-[#E0E4F0] tracking-tight">AI Insights</h1>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgba(78,141,255,0.1)] text-[#4E8DFF] text-xs font-medium">
            <Brain className="w-3 h-3" />
            AI-Powered Analysis
          </span>
        </div>
        <p className="text-sm text-[#8B95B8]">AI-curated intelligence to guide your content strategy decisions</p>
      </motion.div>

      {/* ======== SECTION 2: Filter Bar ======== */}
      <motion.div variants={childFadeUp} className="flex flex-wrap items-center gap-3">
        <select
          value={decisionFilter}
          onChange={(e) => setDecisionFilter(e.target.value as 'ALL' | Decision)}
          className="bg-[rgba(26,29,46,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-xs text-[#E0E4F0] outline-none focus:border-[rgba(78,141,255,0.5)]"
        >
          <option value="ALL">All Decisions</option>
          <option value="ACT">Act</option>
          <option value="MONITOR">Monitor</option>
          <option value="IGNORE">Ignore</option>
        </select>
        <select
          value={confidenceFilter}
          onChange={(e) => setConfidenceFilter(e.target.value as 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW')}
          className="bg-[rgba(26,29,46,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-xs text-[#E0E4F0] outline-none focus:border-[rgba(78,141,255,0.5)]"
        >
          <option value="ALL">All Confidence</option>
          <option value="HIGH">High (&gt;80%)</option>
          <option value="MEDIUM">Medium (50-80%)</option>
          <option value="LOW">Low (&lt;50%)</option>
        </select>
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5A6480]" />
          <input
            type="text"
            placeholder="Search insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[rgba(26,29,46,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg pl-8 pr-3 py-2 text-xs text-[#E0E4F0] placeholder-[#5A6480] outline-none focus:border-[rgba(78,141,255,0.5)]"
          />
        </div>
      </motion.div>

      {/* ======== SECTION 3: Decision Stats ======== */}
      <motion.div variants={childFadeUp}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <GlassCard className="relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-[#22C55E]" />
              <span className="text-xs text-[#8B95B8]">Act on</span>
            </div>
            <AnimatedCounter value={stats.act} color="#22C55E" />
            <p className="text-xs text-[#5A6480] mt-2">Require immediate action</p>
          </GlassCard>

          <GlassCard className="relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-[#FFB347]" />
              <span className="text-xs text-[#8B95B8]">Monitor</span>
            </div>
            <AnimatedCounter value={stats.monitor} color="#FFB347" />
            <p className="text-xs text-[#5A6480] mt-2">Watch closely over time</p>
          </GlassCard>

          <GlassCard className="relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-4 h-4 text-[#5A6480]" />
              <span className="text-xs text-[#8B95B8]">Ignore</span>
            </div>
            <AnimatedCounter value={stats.ignore} color="#5A6480" />
            <p className="text-xs text-[#5A6480] mt-2">Low priority or irrelevant</p>
          </GlassCard>
        </div>
      </motion.div>

      {/* ======== SECTION 4: Insight Feed ======== */}
      <motion.div variants={childFadeUp}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#E0E4F0] font-display">
            Insight Feed
            <span className="ml-2 text-xs text-[#5A6480] font-normal">({filteredInsights.length} insights)</span>
          </h2>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredInsights.map((insight, i) => {
              const CatIcon = categoryIcons[insight.category];
              return (
                <motion.div
                  key={insight.id}
                  custom={i}
                  variants={cardSlideIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-20px' }}
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                  layout
                >
                  <GlassCard
                    hover
                    className={cn(
                      'transition-all',
                      insight.decision === 'ACT' && 'border-l-2 border-l-[#22C55E]',
                      insight.decision === 'MONITOR' && 'border-l-2 border-l-[#FFB347]',
                    )}
                  >
                    <div className="flex items-start gap-4">
                      {/* Decision icon */}
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background:
                            insight.decision === 'ACT'
                              ? 'rgba(34,197,94,0.12)'
                              : insight.decision === 'MONITOR'
                              ? 'rgba(255,179,71,0.12)'
                              : 'rgba(90,100,128,0.12)',
                        }}
                      >
                        {insight.decision === 'ACT' && <Zap className="w-5 h-5 text-[#22C55E]" />}
                        {insight.decision === 'MONITOR' && <Eye className="w-5 h-5 text-[#FFB347]" />}
                        {insight.decision === 'IGNORE' && <XCircle className="w-5 h-5 text-[#5A6480]" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <DecisionBadge decision={insight.decision} acted={insight.acted} />
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#8B95B8] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.05)]">
                            <CatIcon className="w-3 h-3" />
                            {insight.category}
                          </span>
                          <span className="text-[10px] text-[#5A6480] ml-auto">{insight.time}</span>
                        </div>
                        <p className="text-sm text-[#E0E4F0] leading-relaxed">{insight.text}</p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="text-xs text-[#00C8FF] font-data font-medium">{insight.evidence}</span>
                          <div className="flex items-center gap-1">
                            <div className="w-16 h-1.5 bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${insight.confidence}%`,
                                  background:
                                    insight.confidence > 80
                                      ? '#22C55E'
                                      : insight.confidence > 50
                                      ? '#FFB347'
                                      : '#5A6480',
                                }}
                              />
                            </div>
                            <span className="text-[10px] text-[#5A6480]">{insight.confidence}%</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => setDetailInsight(insight)}
                            className="btn-secondary text-xs py-1.5 px-3"
                          >
                            Learn More
                          </button>
                          {insight.decision === 'ACT' && !insight.acted && (
                            <button
                              onClick={() => handleActed(insight.id)}
                              className="btn-primary text-xs py-1.5 px-3"
                            >
                              Mark as Acted
                            </button>
                          )}
                          {insight.decision === 'MONITOR' && (
                            <button
                              onClick={() => handleActed(insight.id)}
                              className="btn-secondary text-xs py-1.5 px-3"
                            >
                              Watch Closely
                            </button>
                          )}
                          {insight.decision === 'IGNORE' && (
                            <button
                              onClick={() => handleRestore(insight.id)}
                              className="btn-secondary text-xs py-1.5 px-3"
                            >
                              Restore
                            </button>
                          )}
                          <button
                            onClick={() => handleDismiss(insight.id)}
                            className="ml-auto text-[10px] text-[#5A6480] hover:text-[#FF4444] transition-colors px-2 py-1"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredInsights.length === 0 && (
            <GlassCard className="text-center py-12">
              <Brain className="w-12 h-12 text-[#5A6480] mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-[#8B95B8] mb-1">No insights match your filters</h3>
              <p className="text-xs text-[#5A6480]">Try adjusting your filters or search query</p>
            </GlassCard>
          )}
        </div>

        {filteredInsights.length > 0 && (
          <button className="btn-secondary w-full mt-4 text-xs py-2.5 justify-center">
            Load More Insights
          </button>
        )}
      </motion.div>

      {/* ======== SECTION 5: Insight Detail Modal ======== */}
      <AnimatePresence>
        {detailInsight && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDetailInsight(null)}
            />

            {/* Modal */}
            <motion.div
              className="relative w-full max-w-xl bg-[#1A1D2E] border border-[rgba(78,141,255,0.2)] rounded-xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {/* Header */}
              <div className="p-5 border-b border-[rgba(255,255,255,0.08)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DecisionBadge decision={detailInsight.decision} acted={detailInsight.acted} />
                    <span className="text-xs text-[#8B95B8]">{detailInsight.category}</span>
                    <span className="text-xs text-[#5A6480]">{detailInsight.time}</span>
                  </div>
                  <button
                    onClick={() => setDetailInsight(null)}
                    className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-colors"
                  >
                    <X className="w-4 h-4 text-[#5A6480]" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-5">
                <p className="text-sm text-[#E0E4F0] leading-relaxed">{detailInsight.text}</p>

                {/* Evidence bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#8B95B8]">Confidence Level</span>
                    <span className="text-xs font-data font-semibold text-[#4E8DFF]">{detailInsight.confidence}%</span>
                  </div>
                  <div className="w-full h-2 bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background:
                          detailInsight.confidence > 80
                            ? '#22C55E'
                            : detailInsight.confidence > 50
                            ? '#FFB347'
                            : '#5A6480',
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${detailInsight.confidence}%` }}
                      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                    />
                  </div>
                </div>

                {/* Related metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[rgba(255,255,255,0.03)] rounded-lg p-3 text-center">
                    <TrendingUp className="w-4 h-4 text-[#22C55E] mx-auto mb-1" />
                    <div className="text-xs font-data font-semibold text-[#E0E4F0]">{detailInsight.evidence}</div>
                    <div className="text-[10px] text-[#5A6480]">Impact</div>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.03)] rounded-lg p-3 text-center">
                    <BarChart2 className="w-4 h-4 text-[#4E8DFF] mx-auto mb-1" />
                    <div className="text-xs font-data font-semibold text-[#E0E4F0]">{detailInsight.confidence}%</div>
                    <div className="text-[10px] text-[#5A6480]">Confidence</div>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.03)] rounded-lg p-3 text-center">
                    <Clock className="w-4 h-4 text-[#00C8FF] mx-auto mb-1" />
                    <div className="text-xs font-data font-semibold text-[#E0E4F0]">{detailInsight.time}</div>
                    <div className="text-[10px] text-[#5A6480]">Detected</div>
                  </div>
                </div>

                {/* Suggested actions */}
                <div>
                  <h4 className="text-xs font-semibold text-[#E0E4F0] mb-2">Suggested Actions</h4>
                  <ul className="space-y-1.5">
                    {detailInsight.decision === 'ACT' && (
                      <>
                        <li className="flex items-center gap-2 text-xs text-[#8B95B8]">
                          <Check className="w-3 h-3 text-[#22C55E]" /> Implement the recommended change in your next post
                        </li>
                        <li className="flex items-center gap-2 text-xs text-[#8B95B8]">
                          <Check className="w-3 h-3 text-[#22C55E]" /> Track metrics for 3-5 posts to measure impact
                        </li>
                      </>
                    )}
                    {detailInsight.decision === 'MONITOR' && (
                      <>
                        <li className="flex items-center gap-2 text-xs text-[#8B95B8]">
                          <Eye className="w-3 h-3 text-[#FFB347]" /> Add this metric to your weekly tracking
                        </li>
                        <li className="flex items-center gap-2 text-xs text-[#8B95B8]">
                          <Eye className="w-3 h-3 text-[#FFB347]" /> Set a reminder to review in 1 week
                        </li>
                      </>
                    )}
                    {detailInsight.decision === 'IGNORE' && (
                      <>
                        <li className="flex items-center gap-2 text-xs text-[#8B95B8]">
                          <XCircle className="w-3 h-3 text-[#5A6480]" /> No action needed at this time
                        </li>
                        <li className="flex items-center gap-2 text-xs text-[#8B95B8]">
                          <Eye className="w-3 h-3 text-[#5A6480]" /> Revisit if trend changes significantly
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[rgba(255,255,255,0.08)] flex items-center gap-2">
                {detailInsight.decision === 'ACT' && !detailInsight.acted && (
                  <button onClick={() => { handleActed(detailInsight.id); setDetailInsight(null); }} className="btn-primary text-xs py-2 px-4">
                    Mark as Acted
                  </button>
                )}
                <button onClick={() => { handleDismiss(detailInsight.id); setDetailInsight(null); }} className="btn-secondary text-xs py-2 px-4">
                  Dismiss
                </button>
                <button onClick={() => setDetailInsight(null)} className="btn-secondary text-xs py-2 px-4 ml-auto">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
