import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Calendar, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const drafts = [
  { id: '1', content: 'The biggest myth in content creation is that consistency beats quality. The truth? Both matter, but quality is the multiplier.', score: 92 },
  { id: '2', content: 'Here is why most AI tools fail for creators (and what actually works)', score: 88 },
  { id: '3', content: 'I analyzed 10,000 viral posts. Here are the 7 patterns they all share:', score: 85 },
];

export default function Publish() {
  const [selectedDraft, setSelectedDraft] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  const handlePublish = async () => {
    if (!selectedDraft) return;
    setPublishing(true);
    await new Promise(r => setTimeout(r, 2000));
    setPublishing(false);
    toast.success('Published successfully!');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-[#E0E4F0] font-semibold text-lg">Publish</h2><p className="text-[#8B95B8] text-xs mt-0.5">Select and publish your scored drafts</p></div>
      </div>

      <div className="space-y-3">
        {drafts.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedDraft(d.id)}
            className={`glass-card p-4 cursor-pointer transition-all ${selectedDraft === d.id ? 'border-[#4E8DFF]' : 'hover:border-[rgba(78,141,255,0.3)]'}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedDraft === d.id ? 'border-[#4E8DFF] bg-[#4E8DFF]' : 'border-[rgba(255,255,255,0.2)]'}`}>
                {selectedDraft === d.id && <Sparkles className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1">
                <p className="text-[#E0E4F0] text-sm">{d.content}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-xs font-bold ${d.score >= 85 ? 'text-emerald-400' : 'text-[#4E8DFF]'}`}>Score: {d.score}</span>
                  <span className="text-[#5A6480] text-[10px]">2h ago</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedDraft && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <h3 className="text-[#E0E4F0] font-semibold text-sm mb-3">Publish Options</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#5A6480]" />
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-xs text-[#E0E4F0] outline-none focus:border-[#4E8DFF]"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="btn-primary flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {publishing ? 'Publishing...' : scheduleDate ? 'Schedule' : 'Publish Now'}
            </button>
            <button className="px-4 py-2 rounded-lg bg-white/[0.03] border border-[rgba(255,255,255,0.08)] text-[#8B95B8] text-xs hover:bg-white/5 transition-all">
              Save as Draft
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
