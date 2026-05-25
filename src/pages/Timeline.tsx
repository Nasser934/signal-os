import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import {
  FileText,
  MessageCircle,
  TrendingUp,
  Award,
  ExternalLink,
  Search,
  StickyNote,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/GlassCard';
import { timelineEvents } from '@/lib/mockData';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

type EventType = 'post' | 'engagement' | 'milestone' | 'trend';

interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  type: EventType;
  title: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                           */
/* ------------------------------------------------------------------ */

const eventTypeConfig: Record<
  EventType,
  { color: string; icon: typeof FileText; label: string }
> = {
  post: { color: '#4E8DFF', icon: FileText, label: 'Post' },
  engagement: { color: '#00C8FF', icon: MessageCircle, label: 'Reply' },
  milestone: { color: '#FF6B9D', icon: Award, label: 'Milestone' },
  trend: { color: '#9F7AEA', icon: TrendingUp, label: 'Trend' },
};

const filterOptions: { value: EventType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Events' },
  { value: 'post', label: 'Posts' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'milestone', label: 'Milestones' },
  { value: 'trend', label: 'Trends' },
];

const dateRangeOptions = [
  'All Time',
  'Last 7 Days',
  'Last 30 Days',
];

const easing = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  Helper Components                                                   */
/* ------------------------------------------------------------------ */

function EventIcon({ type, size = 16 }: { type: EventType; size?: number }) {
  const config = eventTypeConfig[type];
  const Icon = config.icon;
  return <Icon size={size} style={{ color: config.color }} />;
}

function EventTypeBadge({ type }: { type: EventType }) {
  const config = eventTypeConfig[type];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
      style={{
        backgroundColor: `${config.color}20`,
        color: config.color,
        border: `1px solid ${config.color}30`,
      }}
    >
      <EventIcon type={type} size={12} />
      {config.label}
    </span>
  );
}

function ImpactBadge({ impact }: { impact: 'high' | 'medium' | 'low' }) {
  const colors = {
    high: { bg: 'rgba(255,68,68,0.12)', text: '#FF4444', label: 'High' },
    medium: { bg: 'rgba(255,179,71,0.12)', text: '#FFB347', label: 'Medium' },
    low: { bg: 'rgba(34,197,94,0.12)', text: '#22C55E', label: 'Low' },
  };
  const c = colors[impact];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {c.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail Panel                                                        */
/* ------------------------------------------------------------------ */

function EventDetailPanel({ event, onClose }: { event: TimelineEvent; onClose: () => void }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: easing }}
      className="overflow-hidden"
    >
      <GlassCard className="mt-3" glowColor="blue">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <EventTypeBadge type={event.type} />
              <ImpactBadge impact={event.impact} />
              <span className="text-xs text-[#5A6480] font-data">
                {format(parseISO(event.date), 'MMM dd, yyyy')} at {event.time}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-[rgba(255,255,255,0.08)] transition-colors text-[#5A6480] hover:text-[#E0E4F0]"
            >
              <ChevronUp size={16} />
            </button>
          </div>

          {/* Content */}
          <div>
            <h4 className="text-lg font-display font-semibold text-[#E0E4F0] mb-1">
              {event.title}
            </h4>
            <p className="text-sm text-[#8B95B8] leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Impressions', value: '12.4K' },
              { label: 'Engagement', value: '4.2%' },
              { label: 'Replies', value: '156' },
              { label: 'Reposts', value: '89' },
            ].map((m) => (
              <div
                key={m.label}
                className="bg-[rgba(255,255,255,0.03)] rounded-lg p-3 text-center"
              >
                <div className="text-sm font-bold font-data text-[#E0E4F0]">{m.value}</div>
                <div className="text-[10px] text-[#5A6480] uppercase tracking-wider mt-0.5">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button className="btn-primary text-xs py-2 px-4">
              <ExternalLink size={14} />
              View on X
            </button>
            <button className="btn-secondary text-xs py-2 px-4">
              <Search size={14} />
              Run Autopsy
            </button>
            <button className="btn-secondary text-xs py-2 px-4">
              <StickyNote size={14} />
              Add Note
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Timeline Event Card                                                 */
/* ------------------------------------------------------------------ */

function TimelineEventCard({
  event,
  index,
  isSelected,
  onSelect,
}: {
  event: TimelineEvent;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isLeft = index % 2 === 0;
  const config = eventTypeConfig[event.type];

  return (
    <div className={cn('relative flex items-start w-full', isLeft ? 'flex-row' : 'flex-row-reverse')}>
      {/* Event Card */}
      <motion.div
        className={cn('w-[calc(50%-28px)]', isLeft ? 'mr-auto' : 'ml-auto')}
        initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.08, ease: easing }}
      >
        <div onClick={onSelect} className="cursor-pointer">
          <GlassCard
            className={cn(
              'transition-all duration-200',
              isSelected && 'border-[rgba(78,141,255,0.35)] shadow-[inset_0_1px_1px_rgba(78,141,255,0.15),0_8px_32px_rgba(0,0,0,0.35)]'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <EventTypeBadge type={event.type} />
              <span className="text-xs text-[#5A6480] font-data">
                {format(parseISO(event.date), 'MMM dd')} &middot; {event.time}
              </span>
            </div>

            <h4 className="text-sm font-semibold text-[#E0E4F0] mb-1 leading-snug">
              {event.title}
            </h4>
            <p className="text-xs text-[#8B95B8] leading-relaxed line-clamp-2">
              {event.description}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <ImpactBadge impact={event.impact} />
              <span className="text-[10px] text-[#5A6480] ml-auto flex items-center gap-0.5">
                {isSelected ? (
                  <>
                    Less <ChevronUp size={10} />
                  </>
                ) : (
                  <>
                    Details <ChevronDown size={10} />
                  </>
                )}
              </span>
            </div>
          </GlassCard>
        </div>

        <AnimatePresence>
          {isSelected && <EventDetailPanel event={event} onClose={onSelect} />}
        </AnimatePresence>
      </motion.div>

      {/* Center Node Dot */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-5 z-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.08 + 0.15, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div
          className="w-3.5 h-3.5 rounded-full border-2 border-[#E0E4F0] shadow-lg"
          style={{ backgroundColor: config.color }}
        />
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Timeline Card                                                */
/* ------------------------------------------------------------------ */

function MobileTimelineCard({
  event,
  index,
  isSelected,
  onSelect,
}: {
  event: TimelineEvent;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const config = eventTypeConfig[event.type];

  return (
    <motion.div
      className="relative pl-8"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: easing }}
    >
      {/* Node dot on left edge */}
      <motion.div
        className="absolute left-0 top-5 z-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.08 + 0.15, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div
          className="w-3.5 h-3.5 rounded-full border-2 border-[#E0E4F0] shadow-lg"
          style={{ backgroundColor: config.color }}
        />
      </motion.div>

      <div onClick={onSelect} className="cursor-pointer">
        <GlassCard
          className={cn(
            'transition-all duration-200',
            isSelected && 'border-[rgba(78,141,255,0.35)]'
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <EventTypeBadge type={event.type} />
            <span className="text-xs text-[#5A6480] font-data">
              {format(parseISO(event.date), 'MMM dd')} &middot; {event.time}
            </span>
          </div>

          <h4 className="text-sm font-semibold text-[#E0E4F0] mb-1 leading-snug">
            {event.title}
          </h4>
          <p className="text-xs text-[#8B95B8] leading-relaxed line-clamp-2">
            {event.description}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <ImpactBadge impact={event.impact} />
          </div>
        </GlassCard>
      </div>

      <AnimatePresence>
        {isSelected && <EventDetailPanel event={event} onClose={onSelect} />}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Timeline Page                                                  */
/* ------------------------------------------------------------------ */

export default function Timeline() {
  const [eventFilter, setEventFilter] = useState<EventType | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /* Filters */
  const filteredEvents = useMemo((): TimelineEvent[] => {
    let events: TimelineEvent[] = timelineEvents.map((e) => ({
      id: e.id,
      date: e.date,
      time: e.time,
      title: e.title,
      impact: (e.impact === 'high' || e.impact === 'medium' || e.impact === 'low'
        ? e.impact
        : 'medium') as 'high' | 'medium' | 'low',
      description: e.description,
      type: (e.type === 'post' || e.type === 'engagement' || e.type === 'milestone' || e.type === 'trend'
        ? e.type
        : 'post') as EventType,
    }));

    if (eventFilter !== 'all') {
      events = events.filter((e) => e.type === eventFilter);
    }

    if (dateFilter === 'Last 7 Days') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      events = events.filter((e) => parseISO(e.date) >= cutoff);
    } else if (dateFilter === 'Last 30 Days') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      events = events.filter((e) => parseISO(e.date) >= cutoff);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }

    return events;
  }, [eventFilter, dateFilter, searchQuery]);

  const selectedEvent = useMemo(
    () => filteredEvents.find((e) => e.id === selectedId) || null,
    [filteredEvents, selectedId]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easing }}
      >
        <h1 className="font-display font-bold text-2xl text-[#E0E4F0] tracking-tight mb-1">
          Timeline
        </h1>
        <p className="text-sm text-[#8B95B8]">
          Chronological view of your content activity and performance events
        </p>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: easing }}
        className="glass-card"
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* Event Type Filter */}
          <div className="relative">
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value as EventType | 'all')}
              className="form-input appearance-none pr-8 text-sm py-2 cursor-pointer"
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6480] pointer-events-none"
            />
          </div>

          {/* Date Range */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="form-input appearance-none pr-8 text-sm py-2 cursor-pointer"
            >
              {dateRangeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6480] pointer-events-none"
            />
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A6480]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="form-input w-full pl-9 text-sm py-2"
            />
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Desktop: alternating left/right */}
        <div className="hidden md:block">
          {/* Central connector line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />

          {/* Traveling pulse dot */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#4E8DFF]"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{ boxShadow: '0 0 8px rgba(78,141,255,0.6)' }}
          />

          <div className="space-y-6 relative z-10">
            {filteredEvents.map((event, index) => (
              <TimelineEventCard
                key={event.id}
                event={event}
                index={index}
                isSelected={selectedId === event.id}
                onSelect={() =>
                  setSelectedId((prev) => (prev === event.id ? null : event.id))
                }
              />
            ))}
          </div>
        </div>

        {/* Mobile: all left-aligned */}
        <div className="md:hidden">
          {/* Left edge connector line */}
          <div
            className="absolute left-[7px] top-0 bottom-0 w-px"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          />

          <div className="space-y-4 relative z-10">
            {filteredEvents.map((event, index) => (
              <MobileTimelineCard
                key={event.id}
                event={event}
                index={index}
                isSelected={selectedId === event.id}
                onSelect={() =>
                  setSelectedId((prev) => (prev === event.id ? null : event.id))
                }
              />
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <ClockIcon className="w-12 h-12 text-[#5A6480] mx-auto mb-4" />
            <h3 className="text-lg font-display font-semibold text-[#8B95B8] mb-1">
              No events found
            </h3>
            <p className="text-sm text-[#5A6480]">
              Try adjusting your filters to see more results
            </p>
          </motion.div>
        )}
      </div>

      {/* Selected Detail Panel (mobile/desktop shared) */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: easing }}
          >
            {/* Detail panel is rendered inline within each card */}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* Clock icon for empty state (avoids reimporting Clock) */
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
