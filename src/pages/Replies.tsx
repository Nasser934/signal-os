import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  AtSign,
  Users,
  Send,
  X,
  Clock,
  Brain,
  Search,
  Filter,
  Zap,
  Eye,
  Bookmark,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import GlassCard from '@/components/GlassCard';
import ScoreBadge from '@/components/ScoreBadge';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type Priority = 'high' | 'medium' | 'low';
type OppType = 'direct_mention' | 'trending' | 'niche' | 'follower';

interface Opportunity {
  id: string;
  priority: Priority;
  type: OppType;
  score: number;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  likes: number;
  replies: number;
  postedAt: Date;
  reason: string;
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */
const now = new Date();

const opportunities: Opportunity[] = [
  {
    id: 'o1',
    priority: 'high',
    type: 'trending',
    score: 94,
    author: 'Sarah Kim',
    handle: '@sarahkim',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    content: 'What do you think about the future of AI in content creation? Will human creators become obsolete or will AI amplify our creativity?',
    likes: 5200,
    replies: 412,
    postedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    reason: 'High engagement post in your niche. Your expertise would add significant value to this conversation.',
  },
  {
    id: 'o2',
    priority: 'high',
    type: 'direct_mention',
    score: 89,
    author: 'Alex Chen',
    handle: '@alexchen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    content: 'Just read an amazing thread from @user on building in public. The transparency and consistency is inspiring. What are your thoughts on sharing revenue numbers publicly?',
    likes: 3400,
    replies: 287,
    postedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    reason: 'Direct mention with high engagement. Quick response will maximize visibility.',
  },
  {
    id: 'o3',
    priority: 'medium',
    type: 'niche',
    score: 76,
    author: 'Emma Liu',
    handle: '@emmaliu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    content: 'Looking for recommendations on the best UX research tools for remote teams. What is everyone using these days?',
    likes: 1200,
    replies: 189,
    postedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    reason: 'Niche opportunity in product design. Your experience with remote UX tools is relevant.',
  },
  {
    id: 'o4',
    priority: 'medium',
    type: 'follower',
    score: 68,
    author: 'Jordan Blake',
    handle: '@jordanblake',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan',
    content: 'The creator economy is evolving faster than ever. Newsletter subscriptions, community memberships, digital products — what is your primary monetization strategy?',
    likes: 2800,
    replies: 345,
    postedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000),
    reason: 'Follower post with solid engagement. Topic aligns with your content strategy.',
  },
  {
    id: 'o5',
    priority: 'low',
    type: 'niche',
    score: 52,
    author: 'David Park',
    handle: '@davidpark',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    content: 'Rust vs Go for backend services in 2024. I have been team Rust for 3 years but Go is catching up fast. Convince me otherwise.',
    likes: 890,
    replies: 234,
    postedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
    reason: 'Moderate engagement in engineering niche. Lower priority but good for building relationships.',
  },
  {
    id: 'o6',
    priority: 'high',
    type: 'trending',
    score: 91,
    author: 'Nina Patel',
    handle: '@ninapatel',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nina',
    content: 'Growth hack of the week: We added a simple referral prompt after users completed their first milestone. Referrals increased 340%. What simple changes have worked for you?',
    likes: 5200,
    replies: 345,
    postedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    reason: 'Viral growth post. Your marketing expertise would be highly valued here.',
  },
  {
    id: 'o7',
    priority: 'medium',
    type: 'direct_mention',
    score: 73,
    author: 'Chris Adams',
    handle: '@chrisadams',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chris',
    content: 'The best product managers I know all share one trait: they write exceptionally well. Who do you think writes the best product content on X?',
    likes: 2100,
    replies: 445,
    postedAt: new Date(now.getTime() - 10 * 60 * 60 * 1000),
    reason: 'Direct question to the community. Good opportunity to showcase your product insights.',
  },
];

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const priorityConfig: Record<Priority, { color: string; icon: typeof AlertCircle; label: string }> = {
  high: { color: '#FF4444', icon: AlertCircle, label: 'High' },
  medium: { color: '#FFB347', icon: AlertTriangle, label: 'Medium' },
  low: { color: '#4E8DFF', icon: MessageCircle, label: 'Low' },
};

const typeConfig: Record<OppType, { color: string; bg: string; icon: typeof TrendingUp; label: string }> = {
  trending: { color: '#FFB347', bg: 'rgba(255,179,71,0.15)', icon: TrendingUp, label: 'Trending' },
  direct_mention: { color: '#00C8FF', bg: 'rgba(0,200,255,0.15)', icon: AtSign, label: 'Direct Mention' },
  niche: { color: '#22C55E', bg: 'rgba(34,197,94,0.15)', icon: Zap, label: 'Niche' },
  follower: { color: '#4E8DFF', bg: 'rgba(78,141,255,0.15)', icon: Users, label: 'Follower' },
};

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const slideRight = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */
function StatCard({ label, value, color, icon: Icon, delay }: {
  label: string;
  value: number;
  color: string;
  icon: typeof AlertCircle;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
    >
      <GlassCard className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div>
          <p className="font-mono font-bold text-2xl tracking-tight" style={{ color }}>
            {value}
          </p>
          <p className="text-xs text-[#8B95B8]">{label}</p>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = priorityConfig[priority];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md"
      style={{ backgroundColor: `${cfg.color}20`, color: cfg.color }}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function TypeBadge({ type }: { type: OppType }) {
  const cfg = typeConfig[type];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function OpportunityCard({ opp, index, onReply, onDismiss }: {
  opp: Opportunity;
  index: number;
  onReply: (opp: Opportunity) => void;
  onDismiss: (id: string) => void;
}) {
  return (
    <motion.div
      variants={slideRight}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
      transition={{ delay: index * 0.04 }}
      layout
    >
      <GlassCard className="flex flex-col gap-4">
        {/* Top row: badges + score + time */}
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={opp.priority} />
          <TypeBadge type={opp.type} />
          <div className="ml-auto flex items-center gap-3">
            <span className="font-mono font-bold text-lg" style={{ color: priorityConfig[opp.priority].color }}>
              {opp.score}
            </span>
            <span className="text-xs text-[#5A6480]">
              {formatDistanceToNow(opp.postedAt, { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Author + content */}
        <div className="flex items-start gap-3">
          <img
            src={opp.avatar}
            alt={opp.author}
            className="w-10 h-10 rounded-full bg-[#202436] flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#E0E4F0]">{opp.author}</span>
              <span className="text-xs text-[#5A6480]">{opp.handle}</span>
            </div>
            <p className="text-sm text-[#8B95B8] mt-1 leading-relaxed">
              {opp.content.length > 180 ? opp.content.slice(0, 180) + '...' : opp.content}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-[#5A6480]">
              <span>{opp.likes.toLocaleString()} likes</span>
              <span>{opp.replies} replies</span>
              <span>Posted {formatDistanceToNow(opp.postedAt, { addSuffix: true })}</span>
            </div>
          </div>
        </div>

        {/* Why reply */}
        <div className="bg-[rgba(78,141,255,0.06)] rounded-lg px-4 py-3 border border-[rgba(78,141,255,0.1)]">
          <div className="flex items-center gap-1.5 mb-1">
            <Brain className="w-3.5 h-3.5 text-[#4E8DFF]" />
            <span className="text-xs font-medium text-[#4E8DFF]">Why reply</span>
          </div>
          <p className="text-xs text-[#8B95B8] leading-relaxed">{opp.reason}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onReply(opp)}
            className="btn-primary text-xs py-2"
          >
            <MessageCircle className="w-3.5 h-3.5" /> Quick Reply
          </button>
          <button className="btn-secondary text-xs py-2">
            <Eye className="w-3.5 h-3.5" /> View Post
          </button>
          <button
            onClick={() => onDismiss(opp.id)}
            className="btn-secondary text-xs py-2"
          >
            <X className="w-3.5 h-3.5" /> Dismiss
          </button>
          <button className="p-2 rounded-lg hover:bg-[rgba(255,179,71,0.12)] text-[#8B95B8] hover:text-[#FFB347] transition-colors ml-auto" title="Snooze">
            <Clock className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function QuickReplyPanel({ opportunity, onClose }: {
  opportunity: Opportunity;
  onClose: () => void;
}) {
  const [replyText, setReplyText] = useState('');
  const suggestions = [
    'Share a personal experience related to the topic',
    'Ask a follow-up question to deepen engagement',
    'Add a contrarian perspective with data backing',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex justify-end"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)] backdrop-blur-sm" />
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md h-full overflow-y-auto"
      >
        <div className="min-h-full bg-[#1A1D2E] border-l border-[rgba(255,255,255,0.08)] p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-[#E0E4F0] text-lg">Quick Reply</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.08)] text-[#8B95B8] hover:text-[#E0E4F0] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Original Post */}
          <GlassCard padding="md" glow glowColor="blue">
            <div className="flex items-start gap-3">
              <img
                src={opportunity.avatar}
                alt={opportunity.author}
                className="w-8 h-8 rounded-full bg-[#202436] flex-shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#E0E4F0]">{opportunity.author}</span>
                  <span className="text-xs text-[#5A6480]">{opportunity.handle}</span>
                </div>
                <p className="text-xs text-[#8B95B8] mt-1 leading-relaxed">{opportunity.content}</p>
              </div>
            </div>
          </GlassCard>

          {/* AI Suggestions */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-[#4E8DFF]" />
              <span className="text-sm font-medium text-[#E0E4F0]">AI Suggestions</span>
            </div>
            <div className="space-y-2">
              {suggestions.map((s, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.2 }}
                  onClick={() => setReplyText(s)}
                  className="w-full text-left text-xs text-[#8B95B8] bg-[rgba(78,141,255,0.08)] hover:bg-[rgba(78,141,255,0.15)] border border-[rgba(78,141,255,0.15)] rounded-lg px-3 py-2.5 transition-colors leading-relaxed"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Reply Composer */}
          <div>
            <label className="text-sm font-medium text-[#E0E4F0] mb-2 block">Your Reply</label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="form-input w-full h-40 resize-none"
              maxLength={280}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-[#5A6480]">{replyText.length}/280</span>
              {replyText.length > 0 && (
                <ScoreBadge score={Math.min(85 + Math.floor(replyText.length / 10), 98)} size="sm" />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-3">
            <button className="btn-primary flex-1 justify-center">
              <Send className="w-4 h-4" /> Send Reply
            </button>
            <button className="btn-secondary flex-1 justify-center">
              <Bookmark className="w-4 h-4" /> Save Draft
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */
export default function Replies() {
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState<Opportunity | null>(null);
  const [items, setItems] = useState(opportunities);

  const filtered = items.filter((opp) => {
    if (priorityFilter !== 'all' && opp.priority !== priorityFilter) return false;
    if (typeFilter !== 'all' && opp.type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        opp.author.toLowerCase().includes(q) ||
        opp.content.toLowerCase().includes(q) ||
        opp.handle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDismiss = (id: string) => {
    setItems((prev) => prev.filter((o) => o.id !== id));
  };

  const highCount = items.filter((o) => o.priority === 'high').length;
  const mediumCount = items.filter((o) => o.priority === 'medium').length;
  const totalToday = items.length;

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      >
        <h1 className="font-display font-bold text-[#E0E4F0] text-2xl tracking-tight">
          Reply Assistant
        </h1>
        <p className="text-[#8B95B8] text-sm mt-1">
          Rank and prioritize your reply opportunities
        </p>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6480]" />
          <input
            type="text"
            placeholder="Search by username or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input w-full pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#5A6480]" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="form-input text-sm py-2 pr-8"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-input text-sm py-2 pr-8"
          >
            <option value="all">All Types</option>
            <option value="direct_mention">Direct Mentions</option>
            <option value="trending">Trending Posts</option>
            <option value="niche">Niche Opportunities</option>
            <option value="follower">Follower Posts</option>
          </select>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="High Priority" value={highCount} color="#FF4444" icon={AlertCircle} delay={0} />
        <StatCard label="Medium Priority" value={mediumCount} color="#FFB347" icon={AlertTriangle} delay={0.06} />
        <StatCard label="Reply Today" value={totalToday} color="#4E8DFF" icon={MessageCircle} delay={0.12} />
      </div>

      {/* Opportunity List */}
      <motion.div
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.04 } },
        }}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((opp, i) => (
              <OpportunityCard
                key={opp.id}
                opp={opp}
                index={i}
                onReply={setReplyingTo}
                onDismiss={handleDismiss}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GlassCard className="flex flex-col items-center justify-center py-16 text-center">
                <MessageCircle className="w-12 h-12 text-[#5A6480] mb-4" />
                <h3 className="font-display font-semibold text-[#8B95B8] text-lg mb-1">No opportunities found</h3>
                <p className="text-sm text-[#5A6480]">Adjust your filters to see more reply opportunities.</p>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Reply Panel */}
      <AnimatePresence>
        {replyingTo && (
          <QuickReplyPanel opportunity={replyingTo} onClose={() => setReplyingTo(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
