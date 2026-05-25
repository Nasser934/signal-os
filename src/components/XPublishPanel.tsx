// X Publish Panel — Publish scored drafts to X via Nango
// Integrates with Nango proxy for authenticated posting

import { useState } from 'react';
import { useNango } from '@/lib/nangoContext';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import {
  Send,
  Twitter,
  AlertCircle,
  CheckCircle2,
  FileText,
  Calendar,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DraftPayload {
  content: string;
  score: number;
  dimensions?: Record<string, number>;
}

interface XPublishPanelProps {
  draft?: DraftPayload | null;
  onPublished?: () => void;
  compact?: boolean;
}

export default function XPublishPanel({ draft, onPublished, compact = false }: XPublishPanelProps) {
  const { connection, publishToX, isPublishing, xProfile } = useNango();
  const [scheduledFor, setScheduledFor] = useState<string>('');
  const [lastPublished, setLastPublished] = useState<{ id: string; text: string } | null>(null);

  const handlePublish = async () => {
    if (!draft?.content) return;

    const result = await publishToX(draft.content);

    if (result.success) {
      toast.success('Published to X via Nango!', {
        description: `Your post is now live${xProfile ? ` on @${xProfile.username.replace('@', '')}` : ''}.`,
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      });
      setLastPublished({ id: result.postId!, text: draft.content.slice(0, 80) + '...' });
      onPublished?.();
    } else {
      toast.error('Publish failed', {
        description: result.error || 'Something went wrong.',
        icon: <AlertCircle className="w-4 h-4 text-red-400" />,
      });
    }
  };

  // Compact mode (inline in draft scorer)
  if (compact) {
    return (
      <AnimatePresence mode="wait">
        {!connection ? (
          <motion.div
            key="connect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-[#4E8DFF]/5 border border-[#4E8DFF]/10"
          >
            <Twitter className="w-4 h-4 text-[#4E8DFF]" />
            <span className="text-[#8B95B8] text-xs flex-1">Connect X to publish</span>
          </motion.div>
        ) : lastPublished ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-emerald-400 text-xs truncate">Published: {lastPublished.text}</span>
          </motion.div>
        ) : (
          <motion.div
            key="publish"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={isPublishing || !draft?.content}
              className="flex-1 bg-[#4E8DFF] hover:bg-[#3A7AEE] text-white h-9 text-xs"
            >
              {isPublishing ? (
                <span className="flex items-center gap-2">
                  <Spinner className="w-3.5 h-3.5" />
                  Publishing via Nango...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5" />
                  Publish to X
                </span>
              )}
            </Button>
            {draft?.score && (
              <div className="flex items-center gap-1 text-emerald-400 text-xs">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{draft.score}/100</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Full panel mode
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Twitter className="w-4 h-4 text-[#4E8DFF]" />
        <h3 className="text-[#E0E4F0] font-semibold text-sm">Publish to X</h3>
        {connection && (
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Shield className="w-2.5 h-2.5" />
            Nango Secured
          </span>
        )}
      </div>

      {!connection ? (
        <div className="p-6 rounded-xl border border-dashed border-[rgba(255,255,255,0.08)] bg-[#1A1D2E]/50 text-center">
          <Twitter className="w-8 h-8 text-[#5A6480] mx-auto mb-3" />
          <p className="text-[#E0E4F0] text-sm mb-1">Connect X to Publish</p>
          <p className="text-[#5A6480] text-xs mb-4 max-w-[240px] mx-auto">
            Link your X account via Nango to publish scored drafts directly from Signal OS.
          </p>
        </div>
      ) : (
        <>
          {/* Draft preview */}
          {draft?.content ? (
            <div className="p-4 rounded-lg bg-white/[0.03] border border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-3.5 h-3.5 text-[#8B95B8]" />
                <span className="text-[#8B95B8] text-[10px] uppercase tracking-wider">Draft Preview</span>
              </div>
              <p className="text-[#E0E4F0] text-sm leading-relaxed">{draft.content}</p>
              {draft.score && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[rgba(255,255,255,0.04)]">
                  <span className="text-[#8B95B8] text-xs">AI Score:</span>
                  <span
                    className={`text-sm font-bold ${
                      draft.score >= 80
                        ? 'text-emerald-400'
                        : draft.score >= 60
                          ? 'text-amber-400'
                          : 'text-red-400'
                    }`}
                  >
                    {draft.score}/100
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-white/[0.03] border border-[rgba(255,255,255,0.06)] text-center">
              <p className="text-[#5A6480] text-sm">No draft selected</p>
              <p className="text-[#5A6480] text-xs mt-0.5">Score a draft first to publish it.</p>
            </div>
          )}

          {/* Schedule option */}
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-[#8B95B8]" />
            <label className="text-[#E0E4F0] text-xs">Schedule</label>
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              className="flex-1 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-xs text-[#E0E4F0] outline-none focus:border-[#4E8DFF] transition-colors"
            />
          </div>

          {/* Publish button */}
          <Button
            onClick={handlePublish}
            disabled={isPublishing || !draft?.content}
            className="w-full h-11 bg-[#4E8DFF] hover:bg-[#3A7AEE] text-white font-medium"
          >
            {isPublishing ? (
              <span className="flex items-center gap-2">
                <Spinner className="w-4 h-4" />
                Publishing via Nango Proxy...
              </span>
            ) : scheduledFor ? (
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Post
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Publish Now
              </span>
            )}
          </Button>

          {/* Success state */}
          <AnimatePresence>
            {lastPublished && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-emerald-400 text-xs font-medium">Published successfully!</p>
                  <p className="text-[#5A6480] text-[10px] truncate max-w-[280px]">{lastPublished.text}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
