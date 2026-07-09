import { useState } from 'react';
import { useNango } from '@/lib/nangoContext';
import { Send, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Props { draftContent?: string; draftScore?: number; compact?: boolean; }

export default function XPublishPanel({ draftContent, draftScore, compact = false }: Props) {
  const { connection, publishToX, isPublishing } = useNango();
  const [text, setText] = useState(draftContent || '');
  const [published, setPublished] = useState(false);

  const handlePublish = async () => {
    if (!text.trim() || !connection) return;
    const result = await publishToX(text);
    if (result.success) {
      setPublished(true);
      toast.success('Published to X successfully!');
      setTimeout(() => { setPublished(false); setText(''); }, 3000);
    } else {
      toast.error('Failed to publish. Please try again.');
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write something..."
          className="flex-1 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-[#E0E4F0] outline-none focus:border-[#4E8DFF] placeholder:text-[#5A6480]"
        />
        <button
          onClick={handlePublish}
          disabled={!connection || isPublishing || !text.trim()}
          className="p-2 rounded-lg bg-[#4E8DFF] text-white hover:bg-[#3A7AEE] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPublishing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <Send className="w-4 h-4" />
            </motion.div>
          ) : published ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-[#4E8DFF]" />
          <h3 className="text-[#E0E4F0] font-semibold text-sm">Publish to X</h3>
        </div>
        {draftScore && (
          <span className="flex items-center gap-1 text-xs text-[#4E8DFF]">
            <TrendingUp className="w-3 h-3" />
            Score: {draftScore}
          </span>
        )}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={connection ? "What's on your mind?" : 'Connect your X account to publish...'}
        disabled={!connection}
        className="w-full bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-[#E0E4F0] outline-none focus:border-[#4E8DFF] h-24 resize-none placeholder:text-[#5A6480] disabled:opacity-50 mb-3"
      />

      <div className="flex items-center justify-between">
        <span className="text-[#5A6480] text-xs">{text.length}/280</span>
        <button
          onClick={handlePublish}
          disabled={!connection || isPublishing || !text.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4E8DFF] text-white text-sm font-medium hover:bg-[#3A7AEE] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <AnimatePresence mode="wait">
            {isPublishing ? (
              <motion.span key="publishing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <Send className="w-3.5 h-3.5" />
                </motion.div>
                Publishing...
              </motion.span>
            ) : published ? (
              <motion.span key="published" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Published!
              </motion.span>
            ) : (
              <motion.span key="publish" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                Publish
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {!connection && (
        <p className="text-amber-400/80 text-xs mt-3">Connect your X account in Settings to enable publishing</p>
      )}
    </div>
  );
}
