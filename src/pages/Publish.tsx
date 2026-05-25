import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit3,
  Trash2,
  Clock,
  Send,
  Image,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
} from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, getDay } from 'date-fns';
import GlassCard from '@/components/GlassCard';
import ScoreBadge from '@/components/ScoreBadge';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type TabId = 'queue' | 'published' | 'calendar' | 'drafts';
type PostStatus = 'Scheduled' | 'Pending' | 'Failed' | 'Published';

interface QueuePost {
  id: string;
  content: string;
  scheduledDate: Date;
  platform: 'X (Twitter)' | 'LinkedIn' | 'Threads';
  aiScore: number | null;
  status: PostStatus;
  media?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */
const now = new Date();

const queueData: QueuePost[] = [
  {
    id: 'q1',
    content: 'Launching our new AI feature tomorrow! Here is a sneak peek of what we have been building for the past 3 months...',
    scheduledDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    platform: 'X (Twitter)',
    aiScore: 87,
    status: 'Scheduled',
    media: true,
  },
  {
    id: 'q2',
    content: 'The biggest lesson I learned from 10 years of building products: speed matters more than perfection.',
    scheduledDate: new Date(now.getTime() + 48 * 60 * 60 * 1000),
    platform: 'X (Twitter)',
    aiScore: 92,
    status: 'Scheduled',
  },
  {
    id: 'q3',
    content: 'Weekly thread on the top 5 AI tools that are actually worth your time this week.',
    scheduledDate: new Date(now.getTime() + 72 * 60 * 60 * 1000),
    platform: 'LinkedIn',
    aiScore: null,
    status: 'Pending',
    media: true,
  },
];

const publishedData: QueuePost[] = [
  {
    id: 'pub1',
    content: 'Just shipped a new feature that uses AI to predict which of your drafts will perform best...',
    scheduledDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    platform: 'X (Twitter)',
    aiScore: 87,
    status: 'Published',
  },
  {
    id: 'pub2',
    content: 'The biggest mistake I see founders make: building for months without talking to users...',
    scheduledDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    platform: 'X (Twitter)',
    aiScore: 92,
    status: 'Published',
  },
  {
    id: 'pub3',
    content: '5 UX patterns every product designer should know. Which one do you use most?',
    scheduledDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
    platform: 'X (Twitter)',
    aiScore: 85,
    status: 'Published',
    media: true,
  },
  {
    id: 'pub4',
    content: 'AI will not replace you. But someone using AI will. Start experimenting today.',
    scheduledDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
    platform: 'LinkedIn',
    aiScore: 94,
    status: 'Published',
  },
];

const draftsData: QueuePost[] = [
  {
    id: 'd1',
    content: 'New blog post on how we scaled from 0 to 100K users in 6 months without paid ads. The framework inside...',
    scheduledDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    platform: 'X (Twitter)',
    aiScore: 78,
    status: 'Pending',
  },
  {
    id: 'd2',
    content: 'The creator economy is oversaturated. But authentic creators will always win. Stop chasing trends...',
    scheduledDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    platform: 'X (Twitter)',
    aiScore: 91,
    status: 'Pending',
  },
  {
    id: 'd3',
    content: 'Thread: 10 JavaScript one-liners that will make you a better developer.',
    scheduledDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    platform: 'X (Twitter)',
    aiScore: null,
    status: 'Pending',
  },
];

/* Calendar scheduled days mapping */
const scheduledDays = [
  new Date(now.getFullYear(), now.getMonth(), 5),
  new Date(now.getFullYear(), now.getMonth(), 12),
  new Date(now.getFullYear(), now.getMonth(), 15),
  new Date(now.getFullYear(), now.getMonth(), 18),
  new Date(now.getFullYear(), now.getMonth(), 22),
  new Date(now.getFullYear(), now.getMonth(), 28),
];

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const tabs: { id: TabId; label: string }[] = [
  { id: 'queue', label: 'Queue' },
  { id: 'published', label: 'Published' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'drafts', label: 'Drafts' },
];

const platformColors: Record<string, string> = {
  'X (Twitter)': 'bg-[#1DA1F2]/20 text-[#1DA1F2]',
  'LinkedIn': 'bg-[#0A66C2]/20 text-[#0A66C2]',
  'Threads': 'bg-[#E0E4F0]/20 text-[#E0E4F0]',
};

const statusColors: Record<PostStatus, string> = {
  'Scheduled': 'bg-[rgba(78,141,255,0.15)] text-[#4E8DFF]',
  'Pending': 'bg-[rgba(255,179,71,0.15)] text-[#FFB347]',
  'Failed': 'bg-[rgba(255,68,68,0.15)] text-[#FF4444]',
  'Published': 'bg-[rgba(34,197,94,0.15)] text-[#22C55E]',
};

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const containerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */
function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md', statusColors[status])}>
      {status === 'Published' && <CheckCircle2 className="w-3 h-3" />}
      {status === 'Failed' && <AlertCircle className="w-3 h-3" />}
      {status === 'Scheduled' && <Clock className="w-3 h-3" />}
      {status === 'Pending' && <Clock className="w-3 h-3" />}
      {status}
    </span>
  );
}

function QueueCard({ post, index }: { post: QueuePost; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.04 }}
    >
      <GlassCard
        className="flex flex-col md:flex-row md:items-center gap-4"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Media thumbnail placeholder */}
        <div className={cn(
          'w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center',
          post.media ? 'bg-[rgba(78,141,255,0.15)]' : 'bg-[rgba(255,255,255,0.04)]'
        )}>
          {post.media ? (
            <Image className="w-6 h-6 text-[#4E8DFF]" />
          ) : (
            <FileText className="w-6 h-6 text-[#5A6480]" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[#E0E4F0] text-sm font-medium truncate">
            {post.content.slice(0, 100)}{post.content.length > 100 ? '...' : ''}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="text-xs text-[#5A6480]">
              {format(post.scheduledDate, 'MMM d, yyyy')} at {format(post.scheduledDate, 'h:mm a')}
            </span>
            <span className={cn('text-xs px-2 py-0.5 rounded-md font-medium', platformColors[post.platform])}>
              {post.platform}
            </span>
            {post.aiScore !== null && <ScoreBadge score={post.aiScore} size="sm" />}
            <StatusBadge status={post.status} />
          </div>
        </div>

        {/* Actions */}
        <div className={cn(
          'flex items-center gap-2 transition-opacity duration-200',
          hovered ? 'opacity-100' : 'opacity-0'
        )}>
          <button className="p-2 rounded-lg hover:bg-[rgba(78,141,255,0.12)] text-[#8B95B8] hover:text-[#4E8DFF] transition-colors" title="Edit">
            <Edit3 className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-[rgba(78,141,255,0.12)] text-[#8B95B8] hover:text-[#4E8DFF] transition-colors" title="Reschedule">
            <Clock className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-[rgba(34,197,94,0.12)] text-[#8B95B8] hover:text-[#22C55E] transition-colors" title="Publish Now">
            <Send className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-[rgba(255,68,68,0.12)] text-[#8B95B8] hover:text-[#FF4444] transition-colors" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function PublishedTable() {
  return (
    <motion.div variants={containerStagger} initial="hidden" animate="show">
      <GlassCard padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.08)]">
                <th className="text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider px-5 py-3">Content</th>
                <th className="text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider px-5 py-3">Published</th>
                <th className="text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider px-5 py-3">Platform</th>
                <th className="text-right text-xs font-medium text-[#5A6480] uppercase tracking-wider px-5 py-3">Impressions</th>
                <th className="text-right text-xs font-medium text-[#5A6480] uppercase tracking-wider px-5 py-3">Engagement</th>
                <th className="text-center text-xs font-medium text-[#5A6480] uppercase tracking-wider px-5 py-3">AI Score</th>
              </tr>
            </thead>
            <tbody>
              {publishedData.map((post, i) => (
                <motion.tr
                  key={post.id}
                  variants={fadeUp}
                  custom={i}
                  className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(78,141,255,0.04)] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3 text-sm text-[#E0E4F0] max-w-[280px] truncate">
                    {post.content.slice(0, 60)}...
                  </td>
                  <td className="px-5 py-3 text-xs text-[#8B95B8]">
                    {format(post.scheduledDate, 'MMM d, h:mm a')}
                  </td>
                  <td className="px-5 py-3">
                    <span className={cn('text-xs px-2 py-0.5 rounded-md font-medium', platformColors[post.platform])}>
                      {post.platform}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-[#E0E4F0] text-right font-mono">
                    {(125000 - i * 25000).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-sm text-[#22C55E] text-right font-mono">
                    {(5.2 - i * 0.3).toFixed(1)}%
                  </td>
                  <td className="px-5 py-3 text-center">
                    {post.aiScore !== null && <ScoreBadge score={post.aiScore} size="sm" />}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startWeekday = getDay(monthStart);

  const hasScheduled = (day: Date) =>
    scheduledDays.some((d) => isSameDay(d, day));

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show">
      <GlassCard>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-lg hover:bg-[rgba(78,141,255,0.12)] text-[#8B95B8] hover:text-[#E0E4F0] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="font-display font-bold text-[#E0E4F0] text-lg">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="text-xs text-[#4E8DFF] hover:text-[#00C8FF] transition-colors font-medium px-3 py-1.5 rounded-lg hover:bg-[rgba(78,141,255,0.12)]"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-[rgba(78,141,255,0.12)] text-[#8B95B8] hover:text-[#E0E4F0] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-center text-xs text-[#5A6480] font-medium py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startWeekday }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isToday(day);
            const scheduled = hasScheduled(day);

            return (
              <motion.button
                key={day.toISOString()}
                whileHover={{ scale: 1.05 }}
                className={cn(
                  'aspect-square rounded-lg flex flex-col items-center justify-center relative transition-colors',
                  isTodayDate
                    ? 'border border-[#4E8DFF] bg-[rgba(78,141,255,0.1)]'
                    : 'hover:bg-[rgba(78,141,255,0.08)]',
                  !isCurrentMonth && 'opacity-30'
                )}
              >
                <span className={cn(
                  'text-sm font-medium',
                  isTodayDate ? 'text-[#4E8DFF]' : 'text-[#E0E4F0]'
                )}>
                  {format(day, 'd')}
                </span>
                {scheduled && (
                  <span className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-[#4E8DFF]" />
                )}
              </motion.button>
            );
          })}
        </div>
      </GlassCard>
    </motion.div>
  );
}

function DraftCard({ post, index }: { post: QueuePost; index: number }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.06 }}
    >
      <GlassCard className="h-full flex flex-col">
        <p className="text-[#E0E4F0] text-sm leading-relaxed flex-1">
          {post.content.slice(0, 120)}{post.content.length > 120 ? '...' : ''}
        </p>

        <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#5A6480]">
              Edited {format(post.scheduledDate, 'MMM d')}
            </span>
            <span className="text-xs text-[#5A6480] font-mono">
              {post.content.length}/280
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            {post.aiScore !== null ? (
              <ScoreBadge score={post.aiScore} size="sm" />
            ) : (
              <span className="text-xs text-[#5A6480]">Not scored</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button className="flex-1 btn-primary justify-center text-xs py-2">
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button className="flex-1 btn-secondary justify-center text-xs py-2">
              <Clock className="w-3.5 h-3.5" /> Schedule
            </button>
            <button className="p-2 rounded-lg hover:bg-[rgba(255,68,68,0.12)] text-[#8B95B8] hover:text-[#FF4444] transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */
export default function Publish() {
  const [activeTab, setActiveTab] = useState<TabId>('queue');
  const [showNewPost, setShowNewPost] = useState(false);

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-display font-bold text-[#E0E4F0] text-2xl tracking-tight">
            Publish
          </h1>
          <p className="text-[#8B95B8] text-sm mt-1">
            Track, queue, and schedule your content
          </p>
        </div>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          onClick={() => setShowNewPost(true)}
          className="btn-primary self-start"
        >
          <Plus className="w-4 h-4" /> New Post
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="flex items-center gap-1 border-b border-[rgba(255,255,255,0.08)]"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'relative px-4 py-2.5 text-sm font-medium transition-colors rounded-t-lg',
              activeTab === tab.id
                ? 'text-[#4E8DFF]'
                : 'text-[#8B95B8] hover:text-[#E0E4F0] hover:bg-[rgba(78,141,255,0.06)]'
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="publish-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF]"
                transition={{ duration: 0.2 }}
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'queue' && (
            <div className="space-y-3">
              {queueData.length > 0 ? (
                queueData.map((post, i) => (
                  <QueueCard key={post.id} post={post} index={i} />
                ))
              ) : (
                <EmptyState
                  icon={<Clock className="w-12 h-12" />}
                  title="No posts in queue"
                  description="Schedule a post or create a new one."
                  action={<button className="btn-primary mt-4"><Plus className="w-4 h-4" /> Create Post</button>}
                />
              )}
            </div>
          )}

          {activeTab === 'published' && <PublishedTable />}

          {activeTab === 'calendar' && <CalendarView />}

          {activeTab === 'drafts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {draftsData.map((post, i) => (
                <DraftCard key={post.id} post={post} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setShowNewPost(false)}
          >
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl"
            >
              <GlassCard padding="lg">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display font-bold text-[#E0E4F0] text-lg">New Post</h3>
                  <button
                    onClick={() => setShowNewPost(false)}
                    className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.08)] text-[#8B95B8] hover:text-[#E0E4F0] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <textarea
                    placeholder="What's on your mind?"
                    className="form-input w-full h-32 resize-none"
                    maxLength={280}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#5A6480]">0/280</span>
                    <div className="flex items-center gap-2">
                      <button className="btn-secondary text-xs">
                        <Image className="w-4 h-4" /> Media
                      </button>
                      <select className="form-input text-xs py-2">
                        <option>X (Twitter)</option>
                        <option>LinkedIn</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-[rgba(255,255,255,0.08)]">
                    <button className="btn-secondary flex-1 justify-center" onClick={() => setShowNewPost(false)}>
                      <Send className="w-4 h-4" /> Save Draft
                    </button>
                    <button className="btn-primary flex-1 justify-center" onClick={() => setShowNewPost(false)}>
                      <Clock className="w-4 h-4" /> Schedule Post
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty State                                                        */
/* ------------------------------------------------------------------ */
function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <GlassCard className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-[#5A6480] mb-4">{icon}</div>
      <h3 className="font-display font-semibold text-[#8B95B8] text-lg mb-1">{title}</h3>
      <p className="text-sm text-[#5A6480] max-w-sm">{description}</p>
      {action}
    </GlassCard>
  );
}
