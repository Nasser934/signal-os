// X Posts Feed — Displays X posts synced via Nango
// Shows engagement metrics and AI scores for each post

import { useNango, type XPost } from '@/lib/nangoContext';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import ScoreBadge from '@/components/ScoreBadge';
import {
  RefreshCw,
  Twitter,
  Heart,
  MessageCircle,
  Repeat2,
  BarChart3,
  Quote,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function XPostsFeed() {
  const { xPosts, isLoadingPosts, syncPosts, connection, xProfile } = useNango();

  if (!connection) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#4E8DFF]/10 flex items-center justify-center mb-4">
          <Twitter className="w-6 h-6 text-[#4E8DFF]" />
        </div>
        <h3 className="text-[#E0E4F0] font-medium text-sm mb-1">No X Account Connected</h3>
        <p className="text-[#5A6480] text-xs max-w-xs mb-4">
          Connect your X account via Nango to sync your posts and view AI-powered engagement analysis.
        </p>
      </div>
    );
  }

  if (isLoadingPosts && xPosts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-[#8B95B8]">
          <Spinner className="w-5 h-5" />
          <span className="text-sm">Syncing posts from X via Nango...</span>
        </div>
      </div>
    );
  }

  if (xPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <RefreshCw className="w-8 h-8 text-[#5A6480] mb-3" />
        <h3 className="text-[#E0E4F0] font-medium text-sm mb-1">No Posts Yet</h3>
        <p className="text-[#5A6480] text-xs mb-4">Sync your X posts to see them here.</p>
        <Button
          size="sm"
          variant="outline"
          onClick={syncPosts}
          className="border-[rgba(255,255,255,0.08)] bg-transparent text-[#E0E4F0] hover:bg-white/5"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Sync Now
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#4E8DFF]" />
          <span className="text-[#8B95B8] text-xs">Synced via Nango</span>
          {xProfile && (
            <span className="text-[#5A6480] text-[10px]">
              @{xProfile.username.replace('@', '')}
            </span>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={syncPosts}
          disabled={isLoadingPosts}
          className="h-7 px-2 text-[#8B95B8] hover:text-[#E0E4F0]"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isLoadingPosts ? 'animate-spin' : ''}`} />
          <span className="text-[11px]">{isLoadingPosts ? 'Syncing...' : 'Sync'}</span>
        </Button>
      </div>

      {/* Posts */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
        {xPosts.map((post, idx) => (
          <XPostCard key={post.id} post={post} index={idx} />
        ))}
      </div>
    </div>
  );
}

function XPostCard({ post, index }: { post: XPost; index: number }) {
  const navigate = useNavigate();
  const { like_count, retweet_count, reply_count, impression_count, quote_count } = post.public_metrics;
  const totalEngagement = like_count + retweet_count + reply_count + quote_count;
  const engagementRate = impression_count > 0 ? ((totalEngagement / impression_count) * 100).toFixed(2) : '0';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="group p-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#1A1D2E]/50 hover:bg-[#1E2135] hover:border-[rgba(78,141,255,0.15)] transition-all cursor-pointer"
      onClick={() => navigate(`/autopsy?post=${post.id}`)}
    >
      {/* Post text */}
      <p className="text-[#E0E4F0] text-sm leading-relaxed mb-3 line-clamp-3">{post.text}</p>

      {/* Metrics row */}
      <div className="flex items-center gap-4 mb-3">
        <MetricBadge icon={Heart} value={like_count} color="text-rose-400" />
        <MetricBadge icon={Repeat2} value={retweet_count} color="text-emerald-400" />
        <MetricBadge icon={MessageCircle} value={reply_count} color="text-[#4E8DFF]" />
        <MetricBadge icon={Quote} value={quote_count} color="text-amber-400" />
        <div className="flex items-center gap-1 ml-auto text-[#5A6480]">
          <BarChart3 className="w-3 h-3" />
          <span className="text-[10px]">{Number(impression_count).toLocaleString()}</span>
        </div>
      </div>

      {/* Bottom row: score + engagement rate */}
      <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.04)]">
        <div className="flex items-center gap-3">
          {post.score && (
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#FFD700]" />
              <ScoreBadge score={post.score} size="sm" />
            </div>
          )}
          <div className="flex items-center gap-1 text-[#5A6480]">
            <TrendingUp className="w-3 h-3" />
            <span className="text-[10px]">{engagementRate}% ER</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[#5A6480]">
          <Clock className="w-3 h-3" />
          <span className="text-[10px]">{formatRelativeTime(post.created_at)}</span>
        </div>
      </div>
    </motion.div>
  );
}

function MetricBadge({
  icon: Icon,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  color: string;
}) {
  return (
    <div className={`flex items-center gap-1 ${color}`}>
      <Icon className="w-3 h-3" />
      <span className="text-[10px] font-medium">{Number(value).toLocaleString()}</span>
    </div>
  );
}

function formatRelativeTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}
