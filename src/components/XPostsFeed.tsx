import { motion } from 'framer-motion';
import { Heart, Repeat2, MessageCircle, Quote, Eye, TrendingUp } from 'lucide-react';
import { useNango } from '@/lib/nangoContext';

export default function XPostsFeed({ compact = false }: { compact?: boolean }) {
  const { posts, connection } = useNango();

  if (!connection) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-[#5A6480] text-sm">Connect your X account to see your posts</p>
      </div>
    );
  }

  const displayPosts = compact ? posts.slice(0, 3) : posts;

  return (
    <div className="space-y-3">
      {displayPosts.map((post, i) => {
        const engagement =
          post.likeCount + post.retweetCount + post.replyCount + post.quoteCount;
        const engagementRate = post.impressionCount > 0
          ? ((engagement / post.impressionCount) * 100).toFixed(1)
          : '0';

        return (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4 hover:border-[rgba(78,141,255,0.2)] transition-all cursor-pointer"
          >
            <p className="text-[#E0E4F0] text-sm leading-relaxed mb-3">{post.text}</p>
            <div className="flex items-center gap-4 text-[#5A6480]">
              <span className="flex items-center gap-1 text-xs">
                <Heart className="w-3 h-3" />
                {post.likeCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <Repeat2 className="w-3 h-3" />
                {post.retweetCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <MessageCircle className="w-3 h-3" />
                {post.replyCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <Quote className="w-3 h-3" />
                {post.quoteCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-xs ml-auto">
                <Eye className="w-3 h-3" />
                {post.impressionCount.toLocaleString()}
              </span>
              {post.aiScore && (
                <span className="flex items-center gap-1 text-xs text-[#4E8DFF]">
                  <TrendingUp className="w-3 h-3" />
                  {post.aiScore}
                </span>
              )}
            </div>
            <p className="text-[#5A6480] text-[10px] mt-2">Engagement rate: {engagementRate}%</p>
          </motion.div>
        );
      })}
    </div>
  );
}
