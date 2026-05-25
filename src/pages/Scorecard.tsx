import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Link,
  Share2,
  Code,
  Palette,
  Image,
  Copy,
  CheckCircle,
  Award,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

/* ───────────────────────── types ───────────────────────── */

interface ScorecardConfig {
  id: string;
  theme: 'dark' | 'light';
  accentColor: string;
  showRadar: boolean;
  showDimensions: boolean;
  showMetrics: boolean;
  showHandle: boolean;
  handle: string;
  period: string;
  layout: 'compact' | 'detailed' | 'minimal';
  createdAt: string;
}

/* ─────────────────────── constants ─────────────────────── */

const ACCENT_COLORS = [
  '#4E8DFF',
  '#00C8FF',
  '#22C55E',
  '#FFB347',
  '#9F7AEA',
  '#FF6B6B',
  '#FF8E53',
  '#00D9C0',
];

const DEMO_DIMENSIONS = [
  { dimension: 'Structure', score: 78, fullMark: 100 },
  { dimension: 'Hook', score: 85, fullMark: 100 },
  { dimension: 'Engagement', score: 72, fullMark: 100 },
  { dimension: 'Readability', score: 90, fullMark: 100 },
  { dimension: 'Value', score: 80, fullMark: 100 },
];

const easeOutQuad = [0.4, 0, 0.2, 1] as [number, number, number, number];

const STORAGE_KEY = 'sos_scorecards';

/* ─────────────────── helpers ──────────────────── */

function loadSavedScorecards(): ScorecardConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveScorecardList(list: ScorecardConfig[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/* ─────────────────── MiniScoreRing ──────────────────── */

function MiniScoreRing({
  score,
  color,
  size = 60,
  strokeWidth = 4,
}: {
  score: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-sm font-bold font-mono"
          style={{ color }}
        >
          {score}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────── ScorecardPreview ──────────────────── */

function ScorecardPreview({
  config,
  previewRef,
}: {
  config: ScorecardConfig;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const isDark = config.theme === 'dark';
  const bgClass = isDark ? 'bg-[#141725]' : 'bg-[#F0F2FA]';
  const textClass = isDark ? 'text-[#E0E4F0]' : 'text-[#1A1D2E]';
  const mutedClass = isDark ? 'text-[#5A6480]' : 'text-[#8B95B8]';
  const cardBg = isDark ? 'bg-[#1A1D2E]' : 'bg-white';
  const overallScore = 82;

  return (
    <div
      ref={previewRef}
      className={cn(
        'rounded-xl border p-6 flex flex-col items-center gap-4',
        bgClass,
        isDark ? 'border-[rgba(78,141,255,0.15)]' : 'border-[rgba(0,0,0,0.08)]'
      )}
    >
      {/* Handle */}
      {config.showHandle && config.handle && (
        <span className={cn('text-sm font-medium', mutedClass)}>
          {config.handle}
        </span>
      )}

      {/* Title */}
      <span className={cn('text-xs font-medium', mutedClass)}>
        AI Content Score
      </span>

      {/* Score Ring */}
      <MiniScoreRing
        score={overallScore}
        color={config.accentColor}
        size={config.layout === 'minimal' ? 50 : 80}
        strokeWidth={config.layout === 'minimal' ? 3 : 6}
      />

      {/* Radar */}
      {config.showRadar && config.layout !== 'minimal' && (
        <div className="w-full max-w-[220px] h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="65%"
              data={DEMO_DIMENSIONS}
            >
              <PolarGrid
                stroke={isDark ? 'rgba(78,141,255,0.12)' : 'rgba(0,0,0,0.08)'}
                radialLines={true}
              />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{
                  fill: isDark ? '#8B95B8' : '#5A6480',
                  fontSize: 10,
                }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke={config.accentColor}
                fill={config.accentColor}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Dimensions */}
      {config.showDimensions && (
        <div className={cn('w-full space-y-1.5', config.layout === 'compact' && 'max-w-[200px]')}>
          {DEMO_DIMENSIONS.map((dim) => (
            <div
              key={dim.dimension}
              className={cn(
                'flex items-center justify-between text-xs',
                textClass
              )}
            >
              <span className={mutedClass}>{dim.dimension}</span>
              <div className="flex items-center gap-2 flex-1 mx-2">
                <div
                  className={cn(
                    'h-1.5 flex-1 rounded-full overflow-hidden',
                    isDark ? 'bg-[rgba(255,255,255,0.06)]' : 'bg-[rgba(0,0,0,0.06)]'
                  )}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${dim.score}%`,
                      backgroundColor: config.accentColor,
                    }}
                  />
                </div>
              </div>
              <span className="font-mono font-semibold">{dim.score}</span>
            </div>
          ))}
        </div>
      )}

      {/* Metrics */}
      {config.showMetrics && config.layout === 'detailed' && (
        <div
          className={cn(
            'w-full grid grid-cols-3 gap-2 mt-1',
            cardBg,
            'rounded-lg p-3'
          )}
        >
          {[
            { label: 'Posts', value: '24' },
            { label: 'Engagement', value: '5.4%' },
            { label: 'Impressions', value: '156K' },
          ].map((m) => (
            <div key={m.label} className="text-center">
              <div
                className="text-sm font-bold font-mono"
                style={{ color: config.accentColor }}
              >
                {m.value}
              </div>
              <div className={cn('text-[10px]', mutedClass)}>{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Branding */}
      <div className="flex items-center gap-1.5 mt-1">
        <Award className="w-3 h-3" style={{ color: config.accentColor }} />
        <span className={cn('text-[10px]', mutedClass)}>
          Powered by Signal OS
        </span>
      </div>
    </div>
  );
}

/* ─────────────────── Scorecard Page ──────────────────── */

export default function Scorecard() {
  const [config, setConfig] = useState<ScorecardConfig>({
    id: `sc_${Date.now()}`,
    theme: 'dark',
    accentColor: '#4E8DFF',
    showRadar: true,
    showDimensions: true,
    showMetrics: true,
    showHandle: true,
    handle: '@username',
    period: 'This Week',
    layout: 'detailed',
    createdAt: new Date().toISOString(),
  });

  const [savedScorecards, setSavedScorecards] = useState<ScorecardConfig[]>(
    loadSavedScorecards
  );
  const [shareOpen, setShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const updateConfig = useCallback(
    (partial: Partial<ScorecardConfig>) => {
      setConfig((prev) => ({ ...prev, ...partial }));
    },
    []
  );

  const handleSave = useCallback(() => {
    const newConfig = { ...config, id: `sc_${Date.now()}`, createdAt: new Date().toISOString() };
    setSavedScorecards((prev) => {
      const updated = [newConfig, ...prev].slice(0, 20);
      saveScorecardList(updated);
      return updated;
    });
  }, [config]);

  const handleDelete = useCallback((id: string) => {
    setSavedScorecards((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveScorecardList(updated);
      return updated;
    });
  }, []);

  const handleDuplicate = useCallback((sc: ScorecardConfig) => {
    const dup = { ...sc, id: `sc_${Date.now()}`, createdAt: new Date().toISOString() };
    setSavedScorecards((prev) => {
      const updated = [dup, ...prev].slice(0, 20);
      saveScorecardList(updated);
      return updated;
    });
  }, []);

  const handleLoad = useCallback((sc: ScorecardConfig) => {
    setConfig({ ...sc, id: `sc_${Date.now()}` });
  }, []);

  const handleCopyLink = useCallback(async () => {
    const url = `${window.location.origin}${window.location.pathname}#scorecard=${config.id}`;
    await navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }, [config.id]);

  const handleCopyHtml = useCallback(async () => {
    const html = `<!-- Signal OS Scorecard -->
<div style="background:#141725;border-radius:12px;padding:24px;text-align:center;font-family:Inter,sans-serif;max-width:320px;">
  <div style="color:#5A6480;font-size:12px;margin-bottom:8px;">${config.handle} &middot; ${config.period}</div>
  <div style="color:${config.accentColor};font-size:48px;font-weight:bold;font-family:monospace;">82<span style="font-size:16px;color:#5A6480;">/100</span></div>
  <div style="color:#22C55E;font-size:14px;margin-top:4px;">Good</div>
</div>`;
    await navigator.clipboard.writeText(html);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  }, [config.handle, config.period, config.accentColor]);

  const handleDownloadImage = useCallback(() => {
    // Placeholder: in production, use html2canvas
    alert('In production, this would download the scorecard as a PNG image using html2canvas.');
  }, []);

  const handleShareX = useCallback(() => {
    const text = `My AI Content Score: 82/100\nStructure: 78 | Hook: 85 | Engagement: 72 | Readability: 90 | Value: 80\n\nPowered by Signal OS`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  }, []);

  return (
    <div className="space-y-6 pb-8">
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-display font-bold text-2xl text-[#E0E4F0] tracking-tight">
          Scorecard
        </h2>
        <p className="text-[#8B95B8] text-sm mt-1">
          Create and share your performance scorecard
        </p>
      </motion.div>

      {/* ── Editor + Preview ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6">
        {/* Editor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: easeOutQuad }}
        >
          <GlassCard className="h-full space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Palette className="w-4 h-4 text-[#4E8DFF]" />
              <h3 className="font-display font-semibold text-[#E0E4F0]">
                Customization
              </h3>
            </div>

            {/* Theme */}
            <div className="space-y-2">
              <Label className="text-xs text-[#8B95B8]">Theme</Label>
              <div className="flex gap-2">
                {(['dark', 'light'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => updateConfig({ theme: t })}
                    className={cn(
                      'flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-colors border',
                      config.theme === t
                        ? 'border-[#4E8DFF] bg-[rgba(78,141,255,0.12)] text-[#4E8DFF]'
                        : 'border-[rgba(255,255,255,0.08)] text-[#8B95B8] hover:border-[rgba(255,255,255,0.15)]'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-2">
              <Label className="text-xs text-[#8B95B8]">Accent Color</Label>
              <div className="flex flex-wrap gap-2">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateConfig({ accentColor: c })}
                    className={cn(
                      'w-7 h-7 rounded-full border-2 transition-transform',
                      config.accentColor === c
                        ? 'border-white scale-110'
                        : 'border-transparent hover:scale-105'
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              {[
                { key: 'showRadar' as const, label: 'Show Radar Chart' },
                { key: 'showDimensions' as const, label: 'Show Dimensions' },
                { key: 'showMetrics' as const, label: 'Show Metrics' },
                { key: 'showHandle' as const, label: 'Show Handle' },
              ].map((toggle) => (
                <div
                  key={toggle.key}
                  className="flex items-center justify-between"
                >
                  <Label className="text-xs text-[#E0E4F0]">
                    {toggle.label}
                  </Label>
                  <Switch
                    checked={config[toggle.key]}
                    onCheckedChange={(v) => updateConfig({ [toggle.key]: v })}
                  />
                </div>
              ))}
            </div>

            {/* Handle */}
            {config.showHandle && (
              <div className="space-y-2">
                <Label className="text-xs text-[#8B95B8]">Handle</Label>
                <Input
                  value={config.handle}
                  onChange={(e) => updateConfig({ handle: e.target.value })}
                  placeholder="@username"
                  className="bg-[#141725] border-[rgba(255,255,255,0.08)] text-[#E0E4F0] text-sm h-9"
                />
              </div>
            )}

            {/* Period */}
            <div className="space-y-2">
              <Label className="text-xs text-[#8B95B8]">Period</Label>
              <Select
                value={config.period}
                onValueChange={(v) => updateConfig({ period: v })}
              >
                <SelectTrigger className="bg-[#141725] border-[rgba(255,255,255,0.08)] text-[#E0E4F0] text-sm h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#202436] border-[rgba(255,255,255,0.1)]">
                  <SelectItem value="This Week">This Week</SelectItem>
                  <SelectItem value="This Month">This Month</SelectItem>
                  <SelectItem value="All Time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Layout */}
            <div className="space-y-2">
              <Label className="text-xs text-[#8B95B8]">Layout</Label>
              <Select
                value={config.layout}
                onValueChange={(v: 'compact' | 'detailed' | 'minimal') =>
                  updateConfig({ layout: v })
                }
              >
                <SelectTrigger className="bg-[#141725] border-[rgba(255,255,255,0.08)] text-[#E0E4F0] text-sm h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#202436] border-[rgba(255,255,255,0.1)]">
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Save button */}
            <Button
              className="w-full gap-2 bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF] text-[#141725] font-semibold hover:opacity-90"
              onClick={handleSave}
            >
              <Image className="w-4 h-4" />
              Save Scorecard
            </Button>
          </GlassCard>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: easeOutQuad }}
        >
          <GlassCard className="h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-[#E0E4F0]">
                Live Preview
              </h3>
              <span className="text-[10px] text-[#5A6480] bg-[rgba(255,255,255,0.06)] px-2 py-0.5 rounded-full uppercase tracking-wider">
                {config.layout}
              </span>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-[320px]">
                <ScorecardPreview config={config} previewRef={previewRef} />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* ── Saved Scorecards ── */}
      {savedScorecards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <GlassCard>
            <h3 className="font-display font-semibold text-[#E0E4F0] mb-4">
              Saved Scorecards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedScorecards.map((sc, i) => (
                <motion.div
                  key={sc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(78,141,255,0.2)] hover:bg-[rgba(78,141,255,0.04)] transition-all group"
                >
                  <button
                    onClick={() => handleLoad(sc)}
                    className="w-full p-4 flex flex-col items-center gap-2"
                  >
                    <div className="scale-75 origin-center">
                      <ScorecardPreview config={sc} />
                    </div>
                  </button>
                  <div className="px-4 pb-3 flex items-center justify-between">
                    <span className="text-xs text-[#5A6480]">
                      {new Date(sc.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDuplicate(sc)}
                        className="p-1 rounded text-[#8B95B8] hover:text-[#4E8DFF]"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(sc.id)}
                        className="p-1 rounded text-[#8B95B8] hover:text-[#FF4444]"
                        title="Delete"
                      >
                        <Image className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* ── Share Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        <Button
          className="gap-2 bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF] text-[#141725] font-semibold hover:opacity-90"
          onClick={handleDownloadImage}
        >
          <Download className="w-4 h-4" />
          Download Image
        </Button>
        <Button
          variant="outline"
          onClick={handleCopyLink}
          className={cn(
            'gap-2 transition-colors',
            copiedLink
              ? 'border-[rgba(34,197,94,0.3)] text-[#22C55E]'
              : 'border-[rgba(255,255,255,0.12)] text-[#8B95B8] hover:text-[#E0E4F0]'
          )}
        >
          {copiedLink ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Link className="w-4 h-4" />
          )}
          {copiedLink ? 'Copied!' : 'Copy Link'}
        </Button>
        <Button
          variant="outline"
          onClick={() => setShareOpen(true)}
          className="gap-2 border-[rgba(255,255,255,0.12)] text-[#8B95B8] hover:text-[#E0E4F0]"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button
          variant="outline"
          onClick={handleCopyHtml}
          className={cn(
            'gap-2 transition-colors',
            copiedHtml
              ? 'border-[rgba(34,197,94,0.3)] text-[#22C55E]'
              : 'border-[rgba(255,255,255,0.12)] text-[#8B95B8] hover:text-[#E0E4F0]'
          )}
        >
          {copiedHtml ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Code className="w-4 h-4" />
          )}
          {copiedHtml ? 'Copied!' : 'Copy HTML'}
        </Button>
      </motion.div>

      {/* ── Share Dialog ── */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="bg-[#1A1D2E] border border-[rgba(78,141,255,0.2)] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#E0E4F0] font-display">
              Share Scorecard
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="flex justify-center">
              <div className="w-full max-w-[260px]">
                <ScorecardPreview config={config} />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1 gap-2 bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF] text-[#141725] font-semibold"
                onClick={handleShareX}
              >
                <Share2 className="w-4 h-4" />
                Share to X
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2 border-[rgba(255,255,255,0.12)] text-[#8B95B8]"
                onClick={handleDownloadImage}
              >
                <Download className="w-4 h-4" />
                Image
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
