import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import { cn } from '@/lib/utils';
import {
  Calendar, BarChart2, FileText, Award, Users, Settings,
  Download, Trash2, Edit, Pause, Play, Check, ChevronDown,
  Search,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface ReportType {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface ScheduledReport {
  id: string;
  name: string;
  type: string;
  frequency: string;
  format: string;
  lastRun: string;
  nextRun: string;
  status: 'active' | 'paused';
}

interface HistoryEntry {
  id: string;
  name: string;
  type: string;
  generated: string;
  format: string;
  size: string;
  status: 'ready' | 'expired';
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */
const reportTypes: ReportType[] = [
  { id: 'weekly', label: 'Weekly Summary', icon: Calendar, description: '7-day performance overview' },
  { id: 'monthly', label: 'Monthly Analysis', icon: BarChart2, description: 'Deep-dive monthly report' },
  { id: 'content', label: 'Content Performance', icon: FileText, description: 'Post-by-post breakdown' },
  { id: 'scorecard', label: 'AI Scorecard', icon: Award, description: 'Full AI scoring report' },
  { id: 'audience', label: 'Audience Report', icon: Users, description: 'Follower and engagement analysis' },
  { id: 'custom', label: 'Custom Report', icon: Settings, description: 'Build your own report' },
];

const scheduledData: ScheduledReport[] = [
  { id: 's1', name: 'Weekly Summary', type: 'Weekly', frequency: 'Every Monday at 9AM', format: 'PDF', lastRun: 'Jan 15, 2026', nextRun: 'Jan 22, 2026', status: 'active' },
  { id: 's2', name: 'Monthly Analysis', type: 'Monthly', frequency: '1st of each month', format: 'HTML', lastRun: 'Jan 1, 2026', nextRun: 'Feb 1, 2026', status: 'active' },
  { id: 's3', name: 'AI Scorecard', type: 'Scorecard', frequency: 'Every Friday at 5PM', format: 'PDF', lastRun: 'Jan 12, 2026', nextRun: 'Jan 19, 2026', status: 'paused' },
];

const historyData: HistoryEntry[] = [
  { id: 'h1', name: 'Weekly Summary - Jan 15', type: 'Weekly', generated: 'Jan 15, 2026 9:00 AM', format: 'PDF', size: '2.4 MB', status: 'ready' },
  { id: 'h2', name: 'Monthly Analysis - Jan', type: 'Monthly', generated: 'Jan 1, 2026 8:30 AM', format: 'HTML', size: '5.1 MB', status: 'ready' },
  { id: 'h3', name: 'Content Performance - Dec', type: 'Content', generated: 'Dec 31, 2025 6:00 PM', format: 'CSV', size: '890 KB', status: 'expired' },
  { id: 'h4', name: 'Weekly Summary - Jan 8', type: 'Weekly', generated: 'Jan 8, 2026 9:00 AM', format: 'PDF', size: '2.2 MB', status: 'ready' },
  { id: 'h5', name: 'AI Scorecard - Jan 12', type: 'Scorecard', generated: 'Jan 12, 2026 5:00 PM', format: 'PDF', size: '3.8 MB', status: 'ready' },
];

const sectionOptions = [
  { id: 'kpi', label: 'KPI Summary' },
  { id: 'posts', label: 'Top Posts' },
  { id: 'engagement', label: 'Engagement Analysis' },
  { id: 'sentiment', label: 'Sentiment Report' },
  { id: 'growth', label: 'Growth Metrics' },
  { id: 'recommendations', label: 'AI Recommendations' },
];

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  }),
};

/* ------------------------------------------------------------------ */
/*  Generate Tab                                                       */
/* ------------------------------------------------------------------ */
function GenerateTab() {
  const [selected, setSelected] = useState<string | null>(null);
  const [format, setFormat] = useState('PDF');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeBranding, setIncludeBranding] = useState(true);
  const [selectedSections, setSelectedSections] = useState<string[]>(['kpi', 'posts', 'engagement']);
  const [generateState, setGenerateState] = useState<'idle' | 'generating' | 'done'>('idle');

  const toggleSection = (id: string) => {
    setSelectedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    if (!selected) return;
    setGenerateState('generating');
    setTimeout(() => setGenerateState('done'), 2000);
  };

  const reset = () => {
    setGenerateState('idle');
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((rt, i) => {
          const Icon = rt.icon;
          const isActive = selected === rt.id;
          return (
            <motion.button
              key={rt.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              onClick={() => { setSelected(rt.id); setGenerateState('idle'); }}
              className={cn(
                'text-left p-5 rounded-xl border transition-all duration-200 relative',
                'bg-[rgba(26,29,46,0.7)] backdrop-blur-xl',
                isActive
                  ? 'border-[rgba(78,141,255,0.5)] shadow-[inset_0_1px_1px_rgba(78,141,255,0.12),0_4px_24px_rgba(0,0,0,0.3)] bg-[rgba(78,141,255,0.08)]'
                  : 'border-[rgba(78,141,255,0.15)] hover:border-[rgba(78,141,255,0.25)]'
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center',
                  isActive ? 'bg-[rgba(78,141,255,0.2)]' : 'bg-[rgba(255,255,255,0.05)]'
                )}>
                  <Icon className={cn('w-4.5 h-4.5', isActive ? 'text-[#4E8DFF]' : 'text-[#8B95B8]')} />
                </div>
                {isActive && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#4E8DFF] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <h4 className="font-display font-semibold text-sm text-[#E0E4F0] mb-1">{rt.label}</h4>
              <p className="text-xs text-[#8B95B8]">{rt.description}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Configuration Panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          >
            <GlassCard>
              <h4 className="font-display font-semibold text-[#E0E4F0] mb-4">Report Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Range */}
                <div>
                  <label className="text-xs text-[#5A6480] mb-1.5 block">Date Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      className="flex-1 bg-[rgba(26,29,46,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-sm text-[#E0E4F0] focus:outline-none focus:border-[rgba(78,141,255,0.5)]"
                      defaultValue="2026-01-01"
                    />
                    <span className="text-[#5A6480] text-sm">to</span>
                    <input
                      type="date"
                      className="flex-1 bg-[rgba(26,29,46,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-sm text-[#E0E4F0] focus:outline-none focus:border-[rgba(78,141,255,0.5)]"
                      defaultValue="2026-01-15"
                    />
                  </div>
                </div>

                {/* Format */}
                <div>
                  <label className="text-xs text-[#5A6480] mb-1.5 block">Format</label>
                  <div className="relative">
                    <select
                      value={format}
                      onChange={e => setFormat(e.target.value)}
                      className="w-full appearance-none bg-[rgba(26,29,46,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg pl-3 pr-8 py-2 text-sm text-[#E0E4F0] focus:outline-none focus:border-[rgba(78,141,255,0.5)]"
                    >
                      <option>PDF</option>
                      <option>HTML</option>
                      <option>JSON</option>
                      <option>CSV</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#5A6480] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="mt-5">
                <label className="text-xs text-[#5A6480] mb-2 block">Sections to Include</label>
                <div className="flex flex-wrap gap-2">
                  {sectionOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => toggleSection(opt.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border',
                        selectedSections.includes(opt.id)
                          ? 'bg-[rgba(78,141,255,0.15)] border-[rgba(78,141,255,0.3)] text-[#4E8DFF]'
                          : 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.08)] text-[#8B95B8] hover:border-[rgba(255,255,255,0.15)]'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 mt-5">
                <button
                  onClick={() => setIncludeCharts(!includeCharts)}
                  className="flex items-center gap-2 text-sm text-[#8B95B8] hover:text-[#E0E4F0] transition-colors"
                >
                  <div className={cn(
                    'w-9 h-5 rounded-full relative transition-colors duration-200',
                    includeCharts ? 'bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF]' : 'bg-[rgba(255,255,255,0.1)]'
                  )}>
                    <div className={cn(
                      'absolute top-0.5 w-4 h-4 bg-[#E0E4F0] rounded-full transition-transform duration-200',
                      includeCharts ? 'left-[18px]' : 'left-0.5'
                    )} />
                  </div>
                  Include Charts
                </button>
                <button
                  onClick={() => setIncludeBranding(!includeBranding)}
                  className="flex items-center gap-2 text-sm text-[#8B95B8] hover:text-[#E0E4F0] transition-colors"
                >
                  <div className={cn(
                    'w-9 h-5 rounded-full relative transition-colors duration-200',
                    includeBranding ? 'bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF]' : 'bg-[rgba(255,255,255,0.1)]'
                  )}>
                    <div className={cn(
                      'absolute top-0.5 w-4 h-4 bg-[#E0E4F0] rounded-full transition-transform duration-200',
                      includeBranding ? 'left-[18px]' : 'left-0.5'
                    )} />
                  </div>
                  Branding / Watermark
                </button>
              </div>

              {/* Generate Button */}
              <div className="mt-6">
                {generateState === 'done' ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-3"
                  >
                    <button
                      onClick={reset}
                      className="flex-1 bg-gradient-to-r from-[#22C55E] to-[#22C55E] text-[#1A1D2E] font-semibold text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(34,197,94,0.3)] hover:shadow-[0_4px_20px_rgba(34,197,94,0.4)] transition-all"
                    >
                      <Check className="w-4 h-4" />
                      Download Report
                    </button>
                    <button
                      onClick={reset}
                      className="px-5 py-2.5 rounded-lg border border-[rgba(255,255,255,0.12)] text-[#8B95B8] text-sm font-medium hover:border-[rgba(78,141,255,0.4)] hover:text-[#E0E4F0] transition-all"
                    >
                      New
                    </button>
                  </motion.div>
                ) : (
                  <button
                    onClick={handleGenerate}
                    disabled={!selected || generateState === 'generating'}
                    className={cn(
                      'w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all',
                      selected
                        ? 'bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF] text-[#1A1D2E] shadow-[0_2px_12px_rgba(78,141,255,0.3)] hover:shadow-[0_4px_20px_rgba(78,141,255,0.4)]'
                        : 'bg-[rgba(255,255,255,0.08)] text-[#5A6480] cursor-not-allowed'
                    )}
                  >
                    {generateState === 'generating' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#1A1D2E] border-t-transparent rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Generate Report
                      </>
                    )}
                  </button>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scheduled Tab                                                      */
/* ------------------------------------------------------------------ */
function ScheduledTab() {
  const [items, setItems] = useState(scheduledData);

  const toggleStatus = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, status: item.status === 'active' ? 'paused' : 'active' as 'active' | 'paused' } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  if (items.length === 0) {
    return (
      <GlassCard className="text-center py-12">
        <FileText className="w-12 h-12 text-[#5A6480] mx-auto mb-3" />
        <p className="text-[#8B95B8] font-medium mb-1">No scheduled reports yet</p>
        <p className="text-xs text-[#5A6480]">Create your first scheduled report from the Generate tab.</p>
      </GlassCard>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[rgba(255,255,255,0.08)]">
            <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Report Name</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Type</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Frequency</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Format</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Last Run</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Next Run</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Status</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <motion.tr
              key={item.id}
              className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(78,141,255,0.04)] transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
            >
              <td className="py-3 px-4 text-sm text-[#E0E4F0] font-medium">{item.name}</td>
              <td className="py-3 px-4">
                <span className="text-xs px-2 py-0.5 rounded-md bg-[rgba(78,141,255,0.12)] text-[#4E8DFF] font-medium">{item.type}</span>
              </td>
              <td className="py-3 px-4 text-sm text-[#8B95B8]">{item.frequency}</td>
              <td className="py-3 px-4">
                <span className="text-xs px-2 py-0.5 rounded-md bg-[rgba(0,200,255,0.12)] text-[#00C8FF] font-medium">{item.format}</span>
              </td>
              <td className="py-3 px-4 text-sm text-[#8B95B8]">{item.lastRun}</td>
              <td className="py-3 px-4 text-sm text-[#8B95B8]">{item.nextRun}</td>
              <td className="py-3 px-4">
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-md font-medium transition-colors duration-200',
                  item.status === 'active' ? 'bg-[rgba(34,197,94,0.12)] text-[#22C55E]' : 'bg-[rgba(255,179,71,0.12)] text-[#FFB347]'
                )}>
                  {item.status === 'active' ? 'Active' : 'Paused'}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-md hover:bg-[rgba(78,141,255,0.1)] text-[#8B95B8] hover:text-[#4E8DFF] transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleStatus(item.id)}
                    className="p-1.5 rounded-md hover:bg-[rgba(78,141,255,0.1)] text-[#8B95B8] hover:text-[#4E8DFF] transition-colors"
                  >
                    {item.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-md hover:bg-[rgba(255,68,68,0.1)] text-[#8B95B8] hover:text-[#FF4444] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  History Tab                                                        */
/* ------------------------------------------------------------------ */
function HistoryTab() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filtered = historyData.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || h.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[#5A6480] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reports..."
            className="w-full bg-[rgba(26,29,46,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg pl-9 pr-3 py-2 text-sm text-[#E0E4F0] placeholder-[#5A6480] focus:outline-none focus:border-[rgba(78,141,255,0.5)]"
          />
        </div>
        <div className="relative">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="appearance-none bg-[rgba(26,29,46,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg pl-3 pr-8 py-2 text-sm text-[#E0E4F0] focus:outline-none focus:border-[rgba(78,141,255,0.5)]"
          >
            <option value="all">All Types</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="content">Content</option>
            <option value="scorecard">Scorecard</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#5A6480] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.08)]">
              <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Report Name</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Type</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Generated</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Format</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Size</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <motion.tr
                key={item.id}
                className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(78,141,255,0.04)] transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
              >
                <td className="py-3 px-4 text-sm text-[#E0E4F0] font-medium">{item.name}</td>
                <td className="py-3 px-4">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-[rgba(78,141,255,0.12)] text-[#4E8DFF] font-medium">{item.type}</span>
                </td>
                <td className="py-3 px-4 text-sm text-[#8B95B8]">{item.generated}</td>
                <td className="py-3 px-4">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-[rgba(0,200,255,0.12)] text-[#00C8FF] font-medium">{item.format}</span>
                </td>
                <td className="py-3 px-4 text-sm text-[#8B95B8]">{item.size}</td>
                <td className="py-3 px-4">
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-md font-medium',
                    item.status === 'ready' ? 'bg-[rgba(34,197,94,0.12)] text-[#22C55E]' : 'bg-[rgba(255,68,68,0.12)] text-[#FF4444]'
                  )}>
                    {item.status === 'ready' ? 'Ready' : 'Expired'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-md hover:bg-[rgba(78,141,255,0.1)] text-[#8B95B8] hover:text-[#4E8DFF] transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-[rgba(255,68,68,0.1)] text-[#8B95B8] hover:text-[#FF4444] transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Reports Page                                                  */
/* ------------------------------------------------------------------ */
export default function Reports() {
  const [activeTab, setActiveTab] = useState<'generate' | 'scheduled' | 'history'>('generate');

  const tabs = [
    { id: 'generate' as const, label: 'Generate' },
    { id: 'scheduled' as const, label: 'Scheduled' },
    { id: 'history' as const, label: 'History' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div>
        <motion.h1
          className="font-display font-bold text-2xl text-[#E0E4F0] tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Reports
        </motion.h1>
        <motion.p
          className="text-[#8B95B8] text-sm mt-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Generate, schedule, and export reports
        </motion.p>
      </div>

      {/* Tabs */}
      <div className="border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex gap-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative px-5 py-3 text-sm font-medium transition-colors',
                activeTab === tab.id ? 'text-[#4E8DFF]' : 'text-[#8B95B8] hover:text-[#E0E4F0]'
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="reports-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'generate' && <GenerateTab />}
          {activeTab === 'scheduled' && <ScheduledTab />}
          {activeTab === 'history' && <HistoryTab />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
