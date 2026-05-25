import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Copy,
  Bookmark,
  ChevronDown,
  Sparkles,
  CheckCircle,
  Lightbulb,
  AlertCircle,
  AlertTriangle,
  Info,
  Zap,
  Share2,
  FileText,
} from 'lucide-react';
import { analyzeDraft } from '@/lib/scoringEngine';
import type { ScoringResult } from '@/lib/scoringEngine';
import { draftsStore } from '@/lib/store';
import type { Draft } from '@/lib/store';
import GlassCard from '@/components/GlassCard';
import ScoreBadge from '@/components/ScoreBadge';
import { cn } from '@/lib/utils';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

/* ───────────────────────── types ───────────────────────── */

interface DimensionRow {
  key: string;
  label: string;
  color: string;
  score: number;
  feedback: string;
}

interface SuggestionItem {
  text: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  applied: boolean;
}

/* ─────────────────────── constants ─────────────────────── */

const DIMENSIONS: { key: string; label: string; color: string }[] = [
  { key: 'structure', label: 'Structure', color: '#4E8DFF' },
  { key: 'hook', label: 'Hook', color: '#FFB347' },
  { key: 'engagement', label: 'Engagement', color: '#22C55E' },
  { key: 'readability', label: 'Readability', color: '#00C8FF' },
  { key: 'sentiment', label: 'Value', color: '#9F7AEA' },
];

const TEMPLATES: Record<string, string> = {
  'Hook Variants': 'The one thing nobody tells you about [topic]:\n\nIt is not what you think.',
  'Thread Starter': 'I spent 100 hours researching [topic].\n\nHere are the 7 most surprising findings:',
  'Reply': 'Great point! I would add that [your perspective].\n\nThe nuance most people miss is...',
  'Announcement': 'Shipped!\n\n[Feature name] is now live. Here is what it does and why we built it:',
};

const easeOutQuad = [0.4, 0, 0.2, 1] as [number, number, number, number];

/* ─────────────────── helpers ──────────────────── */

function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const h = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(h);
  }, [value, delay]);
  return debounced;
}

function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Excellent', color: '#22C55E' };
  if (score >= 75) return { label: 'Good', color: '#00C8FF' };
  if (score >= 60) return { label: 'Fair', color: '#FFB347' };
  return { label: 'Needs Work', color: '#FF4444' };
}

function charCountColor(count: number): string {
  if (count >= 280) return 'text-[#FF4444]';
  if (count >= 250) return 'text-[#FFB347]';
  if (count >= 200) return 'text-[#8B95B8]';
  return 'text-[#5A6480]';
}

/* ─────────────────── ScoreRing ──────────────────── */

function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  animating = false,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  animating?: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="scoreRingGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4E8DFF" />
            <stop offset="100%" stopColor="#00C8FF" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreRingGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: offset,
            opacity: animating ? [0.5, 1, 0.5] : 1,
          }}
          transition={
            animating
              ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 1, ease: easeOutQuad }
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {animating ? (
            <motion.span
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-[#5A6480] font-mono"
            >
              Analyzing...
            </motion.span>
          ) : (
            <motion.div
              key="score"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <span className="text-4xl font-bold font-mono text-[#E0E4F0] tracking-tight">
                {score}
              </span>
              <span className="text-xs text-[#5A6480] font-mono">/100</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────── ProgressBar ──────────────────── */

function ProgressBar({
  value,
  color,
  delay = 0,
}: {
  value: number;
  color: string;
  delay?: number;
}) {
  return (
    <div className="h-2 w-full bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: easeOutQuad, delay }}
      />
    </div>
  );
}

/* ─────────────────── DraftScorer Page ──────────────────── */

export default function DraftScorer() {
  const [draftText, setDraftText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScoringResult | null>(null);
  const [expandedDim, setExpandedDim] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [history, setHistory] = useState<Draft[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debouncedText = useDebounce(draftText, 500);

  // Load history on mount
  useEffect(() => {
    setHistory(draftsStore.getAll());
  }, []);

  // Run scoring when debounced text changes
  useEffect(() => {
    if (!debouncedText.trim() || debouncedText.length < 5) {
      setResult(null);
      setSuggestions([]);
      setIsAnalyzing(false);
      return;
    }

    setIsAnalyzing(true);

    // Simulate a brief processing delay for the AI feel
    const timer = setTimeout(() => {
      const scoringResult = analyzeDraft(debouncedText);
      setResult(scoringResult);

      // Build suggestions from scoring result
      const newSuggestions: SuggestionItem[] = scoringResult.suggestions.map(
        (text, i) => ({
          text,
          category:
            i === 0
              ? 'Hook Enhancement'
              : i === 1
                ? 'Structure Optimization'
                : i === 2
                  ? 'Engagement Boost'
                  : i === 3
                    ? 'Readability Improvement'
                    : 'Value Addition',
          priority:
            i < 2 ? 'high' : i < 3 ? 'medium' : ('low' as 'high' | 'medium' | 'low'),
          applied: false,
        })
      );
      setSuggestions(newSuggestions);
      setIsAnalyzing(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [debouncedText]);

  const charCount = draftText.length;
  const scoreLabel = result ? getScoreLabel(result.scores.overall) : null;

  const radarData = useMemo(() => {
    if (!result) return [];
    return DIMENSIONS.map((d) => ({
      dimension: d.label,
      score: result.scores[d.key as keyof typeof result.scores] as number,
      fullMark: 100,
    }));
  }, [result]);

  const dimensionRows: DimensionRow[] = useMemo(() => {
    if (!result) return [];
    return DIMENSIONS.map((d) => ({
      key: d.key,
      label: d.label,
      color: d.color,
      score: result.scores[d.key as keyof typeof result.scores] as number,
      feedback: result.breakdown[d.key]?.feedback || '',
    }));
  }, [result]);

  const handleClear = useCallback(() => {
    setDraftText('');
    setResult(null);
    setSuggestions([]);
    setSaved(false);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!draftText) return;
    await navigator.clipboard.writeText(draftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [draftText]);

  const handleApplyTemplate = useCallback((key: string) => {
    setDraftText(TEMPLATES[key] || '');
  }, []);

  const handleSaveDraft = useCallback(() => {
    if (!draftText.trim() || !result) return;

    const draft: Draft = {
      id: `draft_${Date.now()}`,
      content: draftText,
      scores: {
        structure: result.scores.structure,
        hook: result.scores.hook,
        engagement: result.scores.engagement,
        readability: result.scores.readability,
        sentiment: result.scores.sentiment,
      },
      overallScore: result.scores.overall,
      verdict: result.verdict,
      suggestions: result.suggestions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    draftsStore.save(draft);
    setHistory((prev) => [draft, ...prev]);
    setSaved(true);
  }, [draftText, result]);

  const handleLoadDraft = useCallback((draft: Draft) => {
    setDraftText(draft.content);
    setSaved(false);
    setShowHistory(false);
  }, []);

  const handleDeleteDraft = useCallback((id: string) => {
    draftsStore.remove(id);
    setHistory((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const handleApplySuggestion = useCallback((index: number) => {
    setSuggestions((prev) =>
      prev.map((s, i) => (i === index ? { ...s, applied: true } : s))
    );
  }, []);

  const handleDismissSuggestion = useCallback((index: number) => {
    setSuggestions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleCopyScore = useCallback(async () => {
    if (!result) return;
    const summary = `Draft Score: ${result.scores.overall}/100 (${scoreLabel?.label})\nStructure: ${result.scores.structure} | Hook: ${result.scores.hook} | Engagement: ${result.scores.engagement} | Readability: ${result.scores.readability} | Value: ${result.scores.sentiment}`;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result, scoreLabel]);

  return (
    <div className="space-y-6 pb-8">
      {/* ── Top row: Editor + Score Panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6">
        {/* ── Draft Editor ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: easeOutQuad }}
        >
          <GlassCard padding="none" className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClear}
                  className="p-2 rounded-lg text-[#8B95B8] hover:text-[#E0E4F0] hover:bg-[rgba(78,141,255,0.08)] transition-colors"
                  title="Clear"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Template dropdown */}
                <select
                  className="bg-[rgba(26,29,46,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-1.5 text-xs text-[#8B95B8] outline-none focus:border-[rgba(78,141,255,0.5)] cursor-pointer"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleApplyTemplate(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  value=""
                >
                  <option value="" disabled>
                    Templates
                  </option>
                  {Object.keys(TEMPLATES).map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-xs font-mono transition-colors',
                    charCountColor(charCount)
                  )}
                >
                  {charCount} / 280
                </span>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg text-[#8B95B8] hover:text-[#E0E4F0] hover:bg-[rgba(78,141,255,0.08)] transition-colors"
                  title="Copy"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Textarea */}
            <div className="flex-1 p-5">
              <Textarea
                ref={textareaRef}
                value={draftText}
                onChange={(e) => {
                  setDraftText(e.target.value);
                  setSaved(false);
                }}
                placeholder="Type or paste your X post draft here to analyze its attention potential..."
                className="w-full min-h-[200px] bg-[#141725] border border-[rgba(255,255,255,0.08)] rounded-lg text-[#E0E4F0] placeholder:text-[#5A6480] resize-none focus:border-[#4E8DFF] focus:ring-[3px] focus:ring-[rgba(78,141,255,0.15)] text-sm leading-relaxed"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* ── Score Panel ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: easeOutQuad }}
        >
          <GlassCard className="h-full flex flex-col items-center justify-center gap-6 py-8">
            {!result ? (
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[rgba(78,141,255,0.1)] flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-[#4E8DFF]" />
                </div>
                <p className="text-[#5A6480] text-sm">
                  Start typing to get your AI score
                </p>
              </div>
            ) : (
              <>
                {/* Score Ring */}
                <div className="flex flex-col items-center gap-3">
                  <ScoreRing
                    score={result.scores.overall}
                    animating={isAnalyzing}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                    className="text-center"
                  >
                    <span
                      className="text-lg font-semibold font-display"
                      style={{ color: scoreLabel?.color }}
                    >
                      {scoreLabel?.label}
                    </span>
                  </motion.div>
                </div>

                {/* Radar Chart */}
                <div className="w-full max-w-[280px] h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid
                        stroke="rgba(78,141,255,0.12)"
                        radialLines={true}
                      />
                      <PolarAngleAxis
                        dataKey="dimension"
                        tick={{ fill: '#8B95B8', fontSize: 11, fontFamily: 'Inter' }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                      />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#4E8DFF"
                        fill="#4E8DFF"
                        fillOpacity={0.2}
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#4E8DFF' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* ── Dimension Breakdown ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <GlassCard>
          <h3 className="font-display font-semibold text-[#E0E4F0] mb-4">
            Dimension Breakdown
          </h3>

          {!result ? (
            <div className="text-center py-8 text-[#5A6480] text-sm">
              Scores will appear here after you start typing
            </div>
          ) : (
            <div className="space-y-1">
              {dimensionRows.map((dim, i) => (
                <div key={dim.key} className="rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      setExpandedDim(
                        expandedDim === dim.key ? null : dim.key
                      )
                    }
                    className="w-full flex items-center gap-4 px-3 py-3 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    {/* Color dot */}
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: dim.color }}
                    />

                    {/* Label */}
                    <span className="text-sm font-medium text-[#E0E4F0] w-24 text-left flex-shrink-0">
                      {dim.label}
                    </span>

                    {/* Progress bar */}
                    <div className="flex-1 min-w-0">
                      <ProgressBar
                        value={dim.score}
                        color={dim.color}
                        delay={i * 0.08}
                      />
                    </div>

                    {/* Score */}
                    <span
                      className="text-sm font-mono font-semibold w-10 text-right flex-shrink-0"
                      style={{ color: dim.color }}
                    >
                      {dim.score}
                    </span>

                    {/* Chevron */}
                    <motion.div
                      animate={{ rotate: expandedDim === dim.key ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-[#5A6480]" />
                    </motion.div>
                  </button>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {expandedDim === dim.key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: easeOutQuad }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 pl-[52px]">
                          <div className="flex items-start gap-2 text-sm text-[#8B95B8]">
                            <CheckCircle className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
                            <span>{dim.feedback}</span>
                          </div>
                          {dim.score < 70 && (
                            <div className="flex items-start gap-2 text-sm text-[#8B95B8] mt-2">
                              <Lightbulb className="w-4 h-4 text-[#FFB347] mt-0.5 flex-shrink-0" />
                              <span>
                                {dim.key === 'hook' &&
                                  'Try starting with a question, number, or bold claim.'}
                                {dim.key === 'structure' &&
                                  'Add line breaks and use formatting for readability.'}
                                {dim.key === 'engagement' &&
                                  'Include a call-to-action or question to spark replies.'}
                                {dim.key === 'readability' &&
                                  'Shorter sentences and simpler words perform better.'}
                                {dim.key === 'sentiment' &&
                                  'A more positive or balanced tone resonates well.'}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* ── AI Suggestions ── */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <GlassCard>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#4E8DFF]" />
              <h3 className="font-display font-semibold text-[#E0E4F0]">
                AI Suggestions
              </h3>
              <span className="text-xs text-[#5A6480] ml-2">
                {suggestions.filter((s) => !s.applied).length} suggestions
              </span>
            </div>

            <div className="space-y-3 mt-4">
              <AnimatePresence>
                {suggestions.map((s, i) => (
                  <motion.div
                    key={`${s.text}-${i}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className={cn(
                      'rounded-lg p-4 border transition-opacity',
                      s.applied
                        ? 'border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.05)] opacity-60'
                        : 'border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]'
                    )}
                  >
                    {/* Priority badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded',
                          s.priority === 'high' &&
                            'text-[#FF4444] bg-[rgba(255,68,68,0.12)]',
                          s.priority === 'medium' &&
                            'text-[#FFB347] bg-[rgba(255,179,71,0.12)]',
                          s.priority === 'low' &&
                            'text-[#4E8DFF] bg-[rgba(78,141,255,0.12)]'
                        )}
                      >
                        {s.priority === 'high' && (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {s.priority === 'medium' && (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {s.priority === 'low' && <Info className="w-3 h-3" />}
                        {s.priority}
                      </span>
                      <span className="text-[10px] text-[#5A6480] uppercase tracking-wider">
                        {s.category}
                      </span>
                    </div>

                    <p className="text-sm text-[#8B95B8] leading-relaxed mb-3">
                      {s.text}
                    </p>

                    {!s.applied && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApplySuggestion(i)}
                          className="text-xs h-8 border-[rgba(78,141,255,0.25)] text-[#4E8DFF] hover:bg-[rgba(78,141,255,0.08)]"
                        >
                          Apply
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDismissSuggestion(i)}
                          className="text-xs h-8 text-[#5A6480] hover:text-[#E0E4F0]"
                        >
                          Dismiss
                        </Button>
                      </div>
                    )}
                    {s.applied && (
                      <span className="inline-flex items-center gap-1 text-xs text-[#22C55E] font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Applied
                      </span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* ── Draft History ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <GlassCard>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-[#E0E4F0]">
                Draft History
              </h3>
              {history.length > 0 && (
                <span className="text-xs text-[#5A6480] bg-[rgba(255,255,255,0.06)] px-2 py-0.5 rounded-full">
                  {history.length}
                </span>
              )}
            </div>
            <motion.div
              animate={{ rotate: showHistory ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-[#5A6480]" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-2">
                  {history.length === 0 ? (
                    <div className="text-center py-6 text-[#5A6480] text-sm">
                      No saved drafts yet. Score a draft to save it here.
                    </div>
                  ) : (
                    history.slice(0, 10).map((draft, i) => (
                      <motion.div
                        key={draft.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        className="flex items-center gap-4 p-3 rounded-lg bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(78,141,255,0.05)] border border-transparent hover:border-[rgba(78,141,255,0.15)] transition-all group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#E0E4F0] truncate">
                            {draft.content.slice(0, 60)}
                            {draft.content.length > 60 ? '...' : ''}
                          </p>
                          <p className="text-xs text-[#5A6480] mt-1">
                            {new Date(draft.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {draft.overallScore !== null && (
                          <ScoreBadge score={draft.overallScore} size="sm" />
                        )}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleLoadDraft(draft)}
                            className="p-1.5 rounded text-[#8B95B8] hover:text-[#4E8DFF] transition-colors"
                            title="Load"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDraft(draft.id)}
                            className="p-1.5 rounded text-[#8B95B8] hover:text-[#FF4444] transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>

      {/* ── Verdict & Share Actions ── */}
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {/* Verdict Badge */}
          <div
            className="flex items-center gap-2 px-5 py-3 rounded-xl border"
            style={{
              borderColor:
                scoreLabel?.color === '#22C55E'
                  ? 'rgba(34,197,94,0.3)'
                  : scoreLabel?.color === '#00C8FF'
                    ? 'rgba(0,200,255,0.3)'
                    : scoreLabel?.color === '#FFB347'
                      ? 'rgba(255,179,71,0.3)'
                      : 'rgba(255,68,68,0.3)',
              backgroundColor:
                scoreLabel?.color === '#22C55E'
                  ? 'rgba(34,197,94,0.08)'
                  : scoreLabel?.color === '#00C8FF'
                    ? 'rgba(0,200,255,0.08)'
                    : scoreLabel?.color === '#FFB347'
                      ? 'rgba(255,179,71,0.08)'
                      : 'rgba(255,68,68,0.08)',
            }}
          >
            <Zap
              className="w-5 h-5"
              style={{ color: scoreLabel?.color }}
            />
            <span
              className="text-base font-semibold font-display"
              style={{ color: scoreLabel?.color }}
            >
              {scoreLabel?.label} — {result.scores.overall}/100
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleCopyScore}
              className="gap-2 border-[rgba(255,255,255,0.12)] text-[#8B95B8] hover:text-[#E0E4F0] hover:border-[rgba(78,141,255,0.4)]"
            >
              <Copy className="w-4 h-4" />
              Copy Score
            </Button>
            <Button
              variant="outline"
              onClick={() => setShareOpen(true)}
              className="gap-2 border-[rgba(255,255,255,0.12)] text-[#8B95B8] hover:text-[#E0E4F0] hover:border-[rgba(78,141,255,0.4)]"
            >
              <Share2 className="w-4 h-4" />
              Share Scorecard
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={saved}
              className={cn(
                'gap-2 transition-colors',
                saved
                  ? 'border-[rgba(34,197,94,0.3)] text-[#22C55E]'
                  : 'border-[rgba(255,255,255,0.12)] text-[#8B95B8] hover:text-[#E0E4F0]'
              )}
            >
              <Bookmark className="w-4 h-4" />
              {saved ? 'Saved' : 'Save Draft'}
            </Button>
          </div>
        </motion.div>
      )}

      {/* ── Share Dialog ── */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="bg-[#1A1D2E] border border-[rgba(78,141,255,0.2)] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#E0E4F0] font-display">
              Share Scorecard
            </DialogTitle>
            <DialogDescription className="text-[#8B95B8]">
              Share your content score with your audience
            </DialogDescription>
          </DialogHeader>

          {result && (
            <div className="space-y-4 mt-4">
              {/* Mini scorecard preview */}
              <div className="rounded-xl border border-[rgba(78,141,255,0.15)] bg-[#141725] p-6 flex flex-col items-center gap-4">
                <span className="text-sm text-[#5A6480]">
                  @username
                </span>
                <span className="text-xs text-[#8B95B8]">
                  AI Content Score
                </span>

                <div className="w-20 h-20">
                  <ScoreRing score={result.scores.overall} size={80} strokeWidth={6} />
                </div>

                <div className="w-full space-y-2 mt-2">
                  {dimensionRows.map((dim) => (
                    <div
                      key={dim.key}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-[#8B95B8]">{dim.label}</span>
                      <div className="flex items-center gap-2 flex-1 mx-3">
                        <div className="h-1.5 flex-1 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${dim.score}%`,
                              backgroundColor: dim.color,
                            }}
                          />
                        </div>
                      </div>
                      <span
                        className="font-mono font-semibold w-6 text-right"
                        style={{ color: dim.color }}
                      >
                        {dim.score}
                      </span>
                    </div>
                  ))}
                </div>

                <span className="text-[10px] text-[#5A6480] mt-2">
                  Powered by Signal OS
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 gap-2 bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF] text-[#141725] font-semibold hover:opacity-90"
                  onClick={handleCopyScore}
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2 border-[rgba(255,255,255,0.12)] text-[#8B95B8]"
                  onClick={() => {
                    const summary = `My draft scored ${result.scores.overall}/100 on Signal OS! Structure: ${result.scores.structure} | Hook: ${result.scores.hook} | Engagement: ${result.scores.engagement}`;
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(summary)}`,
                      '_blank'
                    );
                  }}
                >
                  Share to X
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
