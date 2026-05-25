import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Database,
  SlidersHorizontal,
  Brain,
  Bell,
  Palette,
  Shield,
  CreditCard,
  Settings as SettingsIcon,
  Upload,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Zap,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type SettingsCategory =
  | 'account'
  | 'data'
  | 'scoring'
  | 'ai_engine'
  | 'notifications'
  | 'appearance'
  | 'privacy'
  | 'billing'
  | 'advanced';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const categories: { id: SettingsCategory; label: string; icon: typeof User }[] = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'data', label: 'Data', icon: Database },
  { id: 'scoring', label: 'Scoring', icon: SlidersHorizontal },
  { id: 'ai_engine', label: 'AI Engine', icon: Brain },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'advanced', label: 'Advanced', icon: SettingsIcon },
];

const accentColors = [
  { name: 'Blue', value: '#4E8DFF' },
  { name: 'Cyan', value: '#00C8FF' },
  { name: 'Purple', value: '#9F7AEA' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Amber', value: '#FFB347' },
  { name: 'Pink', value: '#F472B6' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

/* ------------------------------------------------------------------ */
/*  Toggle Switch Component                                            */
/* ------------------------------------------------------------------ */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0',
        checked ? 'bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF]' : 'bg-[rgba(255,255,255,0.12)]'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-[#E0E4F0] transition-transform duration-200 shadow-sm',
          checked && 'translate-x-4'
        )}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Slider Component                                                   */
/* ------------------------------------------------------------------ */
function Slider({ value, onChange, min = 0, max = 100 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-[rgba(255,255,255,0.1)] rounded-full appearance-none cursor-pointer accent-[#4E8DFF]"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Section Wrapper                                                    */
/* ------------------------------------------------------------------ */
function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <motion.div variants={fadeUp}>
      <GlassCard>
        <h3 className="font-display font-semibold text-[#E0E4F0] text-lg mb-1">{title}</h3>
        {description && <p className="text-xs text-[#8B95B8] mb-5">{description}</p>}
        <div className="space-y-5">{children}</div>
      </GlassCard>
    </motion.div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#E0E4F0]">{label}</p>
        {description && <p className="text-xs text-[#5A6480] mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Account Section                                                    */
/* ------------------------------------------------------------------ */
function AccountSection() {
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
      <Section title="Profile" description="Manage your public profile information">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4E8DFF] to-[#00C8FF] flex items-center justify-center text-2xl font-bold text-[#141725] flex-shrink-0">
            U
          </div>
          <div className="flex-1">
            <button className="btn-secondary text-xs">
              <Upload className="w-3.5 h-3.5" /> Change Avatar
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#8B95B8] mb-1.5 block">Display Name</label>
            <input type="text" defaultValue="User" className="form-input w-full" />
          </div>
          <div>
            <label className="text-xs text-[#8B95B8] mb-1.5 block">Handle</label>
            <input type="text" defaultValue="@username" className="form-input w-full" disabled />
          </div>
        </div>
        <div>
          <label className="text-xs text-[#8B95B8] mb-1.5 block">Bio</label>
          <textarea defaultValue="AI-powered content creator." className="form-input w-full h-20 resize-none" />
        </div>
      </Section>

      <Section title="Connected Accounts">
        <SettingRow label="X (Twitter)" description="Post and analyze your X content">
          <span className="inline-flex items-center gap-1.5 text-xs text-[#22C55E] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Connected
          </span>
        </SettingRow>
        <div className="border-t border-[rgba(255,255,255,0.06)] pt-4">
          <SettingRow label="LinkedIn" description="Cross-post to your professional network">
            <button className="btn-secondary text-xs py-1.5">Connect</button>
          </SettingRow>
        </div>
        <div className="border-t border-[rgba(255,255,255,0.06)] pt-4">
          <SettingRow label="Threads" description="Share to Meta's text platform">
            <button className="btn-secondary text-xs py-1.5">Connect</button>
          </SettingRow>
        </div>
      </Section>

      <Section title="Security">
        <SettingRow label="Two-Factor Authentication" description="Add an extra layer of security">
          <Toggle checked={twoFactor} onChange={setTwoFactor} />
        </SettingRow>
        <div className="border-t border-[rgba(255,255,255,0.06)] pt-4">
          <SettingRow label="Password" description="Last changed 30 days ago">
            <button className="btn-secondary text-xs py-1.5">Change</button>
          </SettingRow>
        </div>
      </Section>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Data Section                                                       */
/* ------------------------------------------------------------------ */
function DataSection() {
  const [scheduledExports, setScheduledExports] = useState(false);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
      <Section title="Data Import">
        <div className="flex items-center gap-3">
          <button className="btn-secondary text-xs">
            <Upload className="w-3.5 h-3.5" /> Import from X
          </button>
          <button className="btn-secondary text-xs">
            <Upload className="w-3.5 h-3.5" /> Import CSV
          </button>
        </div>
      </Section>

      <Section title="Data Export">
        <SettingRow label="Export Format">
          <select className="form-input text-sm py-1.5">
            <option>JSON</option>
            <option>CSV</option>
          </select>
        </SettingRow>
        <div className="border-t border-[rgba(255,255,255,0.06)] pt-4">
          <SettingRow label="Scheduled Exports" description="Automatically export your data weekly">
            <Toggle checked={scheduledExports} onChange={setScheduledExports} />
          </SettingRow>
        </div>
        <div className="pt-2">
          <button className="btn-secondary text-xs">
            <Download className="w-3.5 h-3.5" /> Export All Data
          </button>
        </div>
      </Section>

      <Section title="Storage">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8B95B8]">Used 234 MB of 1 GB</span>
            <span className="text-[#5A6480]">23%</span>
          </div>
          <div className="w-full h-2 bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden">
            <div className="h-full w-[23%] bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF] rounded-full" />
          </div>
        </div>
      </Section>

      <Section title="Danger Zone">
        <div className="flex items-center gap-3">
          <button className="text-xs text-[#FF4444] border border-[#FF4444]/30 hover:bg-[rgba(255,68,68,0.1)] px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5" /> Clear All Data
          </button>
        </div>
      </Section>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scoring Section                                                    */
/* ------------------------------------------------------------------ */
function ScoringSection() {
  const [weights, setWeights] = useState({
    structure: 25,
    hook: 25,
    engagement: 20,
    readability: 15,
    value: 15,
  });
  const [strictness, setStrictness] = useState('balanced');

  const updateWeight = (key: keyof typeof weights, value: number) => {
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
      <Section title="Dimension Weights" description="Adjust how much each dimension affects your overall score">
        {(
          [
            ['structure', 'Structure', 'Organization and formatting of content'],
            ['hook', 'Hook', 'Opening line strength and attention capture'],
            ['engagement', 'Engagement', 'Call-to-action and interaction potential'],
            ['readability', 'Readability', 'Clarity and ease of reading'],
            ['value', 'Value', 'Information density and usefulness'],
          ] as [keyof typeof weights, string, string][]
        ).map(([key, label, desc]) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#E0E4F0]">{label}</p>
                <p className="text-xs text-[#5A6480]">{desc}</p>
              </div>
              <span className="text-sm font-mono font-bold text-[#4E8DFF]">{weights[key]}%</span>
            </div>
            <Slider value={weights[key]} onChange={(v) => updateWeight(key, v)} />
          </div>
        ))}
        <div className="pt-2 flex items-center justify-between text-xs">
          <span className="text-[#5A6480]">Total: {Object.values(weights).reduce((a, b) => a + b, 0)}%</span>
          {Object.values(weights).reduce((a, b) => a + b, 0) !== 100 && (
            <span className="text-[#FFB347]">Should equal 100%</span>
          )}
        </div>
      </Section>

      <Section title="Scoring Strictness">
        <div className="grid grid-cols-3 gap-2">
          {(['lenient', 'balanced', 'strict'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStrictness(s)}
              className={cn(
                'px-3 py-2.5 rounded-lg text-sm font-medium capitalize transition-all border',
                strictness === s
                  ? 'bg-[rgba(78,141,255,0.15)] border-[rgba(78,141,255,0.4)] text-[#4E8DFF]'
                  : 'bg-transparent border-[rgba(255,255,255,0.08)] text-[#8B95B8] hover:border-[rgba(78,141,255,0.25)]'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Section>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  AI Engine Section                                                  */
/* ------------------------------------------------------------------ */
function AIEngineSection() {
  const [features, setFeatures] = useState({
    draftScoring: true,
    insightGeneration: true,
    replyRanking: true,
    forecasting: true,
    sentimentAnalysis: true,
  });
  const [processingSpeed, setProcessingSpeed] = useState('balanced');

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
      <Section title="AI Features" description="Toggle individual AI-powered features">
        {(
          [
            ['draftScoring', 'Draft Scoring', 'Real-time content analysis and scoring'],
            ['insightGeneration', 'Insight Generation', 'AI-curated actionable insights'],
            ['replyRanking', 'Reply Ranking', 'Smart reply opportunity scoring'],
            ['forecasting', 'Forecasting', 'Performance prediction modeling'],
            ['sentimentAnalysis', 'Sentiment Analysis', 'Audience mood tracking'],
          ] as [keyof typeof features, string, string][]
        ).map(([key, label, desc]) => (
          <div key={key} className={cn(key !== 'draftScoring' && 'border-t border-[rgba(255,255,255,0.06)] pt-4')}>
            <SettingRow label={label} description={desc}>
              <Toggle checked={features[key]} onChange={() => toggleFeature(key)} />
            </SettingRow>
          </div>
        ))}
      </Section>

      <Section title="Processing Speed">
        <div className="grid grid-cols-3 gap-2">
          {(['fast', 'balanced', 'thorough'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setProcessingSpeed(s)}
              className={cn(
                'px-3 py-2.5 rounded-lg text-sm font-medium capitalize transition-all border',
                processingSpeed === s
                  ? 'bg-[rgba(78,141,255,0.15)] border-[rgba(78,141,255,0.4)] text-[#4E8DFF]'
                  : 'bg-transparent border-[rgba(255,255,255,0.08)] text-[#8B95B8] hover:border-[rgba(78,141,255,0.25)]'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Section>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Notifications Section                                              */
/* ------------------------------------------------------------------ */
function NotificationsSection() {
  const [channels, setChannels] = useState({
    email: true,
    browser: true,
    mobile: false,
  });
  const [types, setTypes] = useState({
    weekly: true,
    insights: true,
    scoreAlerts: true,
    postPerformance: false,
    milestones: true,
  });
  const [quietHours, setQuietHours] = useState(false);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
      <Section title="Channels" description="Choose how you want to be notified">
        {(
          [
            ['email', 'Email', 'user@example.com'] as const,
            ['browser', 'Browser', 'Permission granted'] as const,
            ['mobile', 'Mobile Push', 'Not configured'] as const,
          ] as const
        ).map(([key, label, desc]) => (
          <div key={key} className={cn(key !== 'email' && 'border-t border-[rgba(255,255,255,0.06)] pt-4')}>
            <SettingRow label={label} description={desc}>
              <Toggle checked={channels[key]} onChange={(v) => setChannels((p) => ({ ...p, [key]: v }))} />
            </SettingRow>
          </div>
        ))}
      </Section>

      <Section title="Notification Types">
        {(
          [
            ['weekly', 'Weekly Report', 'Get a digest every Monday'] as const,
            ['insights', 'AI Insights', 'New insights as they are generated'] as const,
            ['scoreAlerts', 'Score Alerts', 'When your content score changes significantly'] as const,
            ['postPerformance', 'Post Performance', 'Real-time performance notifications'] as const,
            ['milestones', 'Follower Milestones', 'Celebrate growth milestones'] as const,
          ] as const
        ).map(([key, label, desc]) => (
          <div key={key} className={cn(key !== 'weekly' && 'border-t border-[rgba(255,255,255,0.06)] pt-4')}>
            <SettingRow label={label} description={desc}>
              <Toggle checked={types[key]} onChange={(v) => setTypes((p) => ({ ...p, [key]: v }))} />
            </SettingRow>
          </div>
        ))}
      </Section>

      <Section title="Quiet Hours">
        <SettingRow label="Enable Quiet Hours" description="Pause notifications during set hours">
          <Toggle checked={quietHours} onChange={setQuietHours} />
        </SettingRow>
        <AnimatePresence>
          {quietHours && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="text-xs text-[#8B95B8] mb-1.5 block">Start Time</label>
                  <input type="time" defaultValue="22:00" className="form-input w-full" />
                </div>
                <div>
                  <label className="text-xs text-[#8B95B8] mb-1.5 block">End Time</label>
                  <input type="time" defaultValue="08:00" className="form-input w-full" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Section>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Appearance Section                                                 */
/* ------------------------------------------------------------------ */
function AppearanceSection() {
  const [accentColor, setAccentColor] = useState('#4E8DFF');
  const [density, setDensity] = useState('default');
  const [animations, setAnimations] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
      <Section title="Theme">
        <div className="bg-[rgba(78,141,255,0.08)] border border-[rgba(78,141,255,0.2)] rounded-lg p-4">
          <p className="text-sm text-[#8B95B8]">
            Signal OS is designed with a premium dark theme. Light mode is not available.
          </p>
        </div>
      </Section>

      <Section title="Accent Color">
        <div className="flex items-center gap-3">
          {accentColors.map((c) => (
            <button
              key={c.value}
              onClick={() => setAccentColor(c.value)}
              title={c.name}
              className={cn(
                'w-9 h-9 rounded-full transition-all border-2',
                accentColor === c.value
                  ? 'border-[#E0E4F0] scale-110 shadow-lg'
                  : 'border-transparent hover:scale-105'
              )}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </Section>

      <Section title="Density">
        <div className="grid grid-cols-3 gap-2">
          {(['compact', 'default', 'comfortable'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDensity(d)}
              className={cn(
                'px-3 py-2.5 rounded-lg text-sm font-medium capitalize transition-all border',
                density === d
                  ? 'bg-[rgba(78,141,255,0.15)] border-[rgba(78,141,255,0.4)] text-[#4E8DFF]'
                  : 'bg-transparent border-[rgba(255,255,255,0.08)] text-[#8B95B8] hover:border-[rgba(78,141,255,0.25)]'
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Animations">
        <SettingRow label="Enable Animations" description="UI transitions and micro-interactions">
          <Toggle checked={animations} onChange={setAnimations} />
        </SettingRow>
        <div className="border-t border-[rgba(255,255,255,0.06)] pt-4">
          <SettingRow label="Reduce Motion" description="Minimize animations for accessibility">
            <Toggle checked={reduceMotion} onChange={setReduceMotion} />
          </SettingRow>
        </div>
      </Section>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Privacy Section                                                    */
/* ------------------------------------------------------------------ */
function PrivacySection() {
  const [anonymousAnalytics, setAnonymousAnalytics] = useState(true);
  const [scorecardSharing, setScorecardSharing] = useState(true);
  const [leaderboard, setLeaderboard] = useState(false);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
      <Section title="Data Privacy">
        <div className="flex items-center gap-2 bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] rounded-lg p-4">
          <Shield className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
          <p className="text-sm text-[#22C55E]">
            All AI processing happens in your browser. No data leaves your device.
          </p>
        </div>
        <div className="pt-4">
          <SettingRow label="Anonymous Analytics" description="Help improve Signal OS with usage data">
            <Toggle checked={anonymousAnalytics} onChange={setAnonymousAnalytics} />
          </SettingRow>
        </div>
      </Section>

      <Section title="Visibility">
        <SettingRow label="Scorecard Sharing" description="Allow others to view your scorecards">
          <Toggle checked={scorecardSharing} onChange={setScorecardSharing} />
        </SettingRow>
        <div className="border-t border-[rgba(255,255,255,0.06)] pt-4">
          <SettingRow label="Leaderboard Participation" description="Appear on public leaderboards">
            <Toggle checked={leaderboard} onChange={setLeaderboard} />
          </SettingRow>
        </div>
      </Section>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Billing Section                                                    */
/* ------------------------------------------------------------------ */
function BillingSection() {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
      <Section title="Current Plan">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-display font-bold text-[#E0E4F0] text-xl">Professional</span>
          <span className="px-2 py-0.5 rounded-md bg-[rgba(78,141,255,0.15)] text-[#4E8DFF] text-xs font-medium">
            Active
          </span>
        </div>
        <p className="text-sm text-[#8B95B8] mb-4">
          $19/month, billed monthly. Renews on Feb 15, 2026.
        </p>
        <div className="flex items-center gap-3">
          <button className="btn-primary text-xs">
            <Zap className="w-3.5 h-3.5" /> Upgrade Plan
          </button>
          <button className="btn-secondary text-xs">Manage Subscription</button>
        </div>
      </Section>

      <Section title="Payment Method">
        <div className="flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-[#8B95B8]" />
          <div>
            <p className="text-sm text-[#E0E4F0] font-medium">Visa ending in 4242</p>
            <p className="text-xs text-[#5A6480]">Expires 12/27</p>
          </div>
          <button className="btn-secondary text-xs py-1.5 ml-auto">Update</button>
        </div>
      </Section>

      <Section title="Billing History">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.08)]">
                <th className="text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider py-2 pr-4">Date</th>
                <th className="text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider py-2 pr-4">Description</th>
                <th className="text-right text-xs font-medium text-[#5A6480] uppercase tracking-wider py-2 pr-4">Amount</th>
                <th className="text-right text-xs font-medium text-[#5A6480] uppercase tracking-wider py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: 'Jan 15, 2026', desc: 'Professional Plan', amount: '$19.00', status: 'Paid' },
                { date: 'Dec 15, 2025', desc: 'Professional Plan', amount: '$19.00', status: 'Paid' },
                { date: 'Nov 15, 2025', desc: 'Professional Plan', amount: '$19.00', status: 'Paid' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-[rgba(255,255,255,0.04)]">
                  <td className="py-3 pr-4 text-xs text-[#8B95B8]">{row.date}</td>
                  <td className="py-3 pr-4 text-sm text-[#E0E4F0]">{row.desc}</td>
                  <td className="py-3 pr-4 text-sm text-[#E0E4F0] text-right font-mono">{row.amount}</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-xs text-[#22C55E]">
                      <CheckCircle2 className="w-3 h-3" /> {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Advanced Section                                                   */
/* ------------------------------------------------------------------ */
function AdvancedSection() {
  const [animQuality, setAnimQuality] = useState('full');
  const [chartRender, setChartRender] = useState('canvas');

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
      <Section title="Performance">
        <SettingRow label="Animation Quality">
          <select
            value={animQuality}
            onChange={(e) => setAnimQuality(e.target.value)}
            className="form-input text-sm py-1.5"
          >
            <option value="full">Full</option>
            <option value="reduced">Reduced</option>
            <option value="none">None</option>
          </select>
        </SettingRow>
        <div className="border-t border-[rgba(255,255,255,0.06)] pt-4">
          <SettingRow label="Chart Rendering">
            <select
              value={chartRender}
              onChange={(e) => setChartRender(e.target.value)}
              className="form-input text-sm py-1.5"
            >
              <option value="canvas">Canvas</option>
              <option value="svg">SVG</option>
            </select>
          </SettingRow>
        </div>
      </Section>

      <Section title="Developer">
        <SettingRow label="API Key" description="For third-party integrations">
          <div className="flex items-center gap-2">
            <code className="text-xs text-[#8B95B8] bg-[rgba(255,255,255,0.05)] px-2 py-1 rounded font-mono">
              sk_live_••••••••
            </code>
            <button className="text-xs text-[#4E8DFF] hover:text-[#00C8FF] transition-colors">
              Regenerate
            </button>
          </div>
        </SettingRow>
        <div className="border-t border-[rgba(255,255,255,0.06)] pt-4">
          <SettingRow label="Webhook URL" description="Receive event notifications">
            <input
              type="text"
              placeholder="https://..."
              className="form-input text-sm w-48"
            />
          </SettingRow>
        </div>
      </Section>

      <Section title="Danger Zone" description="Irreversible actions">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button className="text-xs text-[#FF4444] border border-[#FF4444]/30 hover:bg-[rgba(255,68,68,0.1)] px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" /> Reset All Data
          </button>
          <button className="text-xs text-[#FF4444] border border-[#FF4444]/30 hover:bg-[rgba(255,68,68,0.1)] px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5" /> Delete Account
          </button>
        </div>
      </Section>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Router                                                     */
/* ------------------------------------------------------------------ */
function SettingsPanel({ category }: { category: SettingsCategory }) {
  switch (category) {
    case 'account': return <AccountSection />;
    case 'data': return <DataSection />;
    case 'scoring': return <ScoringSection />;
    case 'ai_engine': return <AIEngineSection />;
    case 'notifications': return <NotificationsSection />;
    case 'appearance': return <AppearanceSection />;
    case 'privacy': return <PrivacySection />;
    case 'billing': return <BillingSection />;
    case 'advanced': return <AdvancedSection />;
    default: return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */
export default function Settings() {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('account');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeLabel = categories.find((c) => c.id === activeCategory)?.label || 'Settings';

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      >
        <h1 className="font-display font-bold text-[#E0E4F0] text-2xl tracking-tight">Settings</h1>
      </motion.div>

      {/* Mobile Nav Dropdown */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="form-input w-full flex items-center justify-between text-left"
        >
          <span className="flex items-center gap-2 text-sm text-[#E0E4F0]">
            {(() => { const Icon = categories.find((c) => c.id === activeCategory)?.icon || User; return <Icon className="w-4 h-4" />; })()}
            {activeLabel}
          </span>
          <ChevronDown className={cn('w-4 h-4 text-[#5A6480] transition-transform', mobileNavOpen && 'rotate-180')} />
        </button>
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-1 bg-[#1A1D2E] border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveCategory(cat.id); setMobileNavOpen(false); }}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left',
                        activeCategory === cat.id
                          ? 'text-[#4E8DFF] bg-[rgba(78,141,255,0.1)]'
                          : 'text-[#8B95B8] hover:bg-[rgba(78,141,255,0.06)] hover:text-[#E0E4F0]'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Layout */}
      <div className="flex gap-6">
        {/* Left Nav (desktop) */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="hidden lg:block w-48 flex-shrink-0"
        >
          <div className="space-y-0.5 sticky top-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all relative text-left',
                    activeCategory === cat.id
                      ? 'text-[#4E8DFF] bg-[rgba(78,141,255,0.12)]'
                      : 'text-[#8B95B8] hover:bg-[rgba(78,141,255,0.08)] hover:text-[#E0E4F0]'
                  )}
                >
                  {activeCategory === cat.id && (
                    <motion.div
                      layoutId="settings-active-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-[#4E8DFF] to-[#00C8FF] rounded-r"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </motion.nav>

        {/* Content Panel */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <SettingsPanel category={activeCategory} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
