import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Zap, Brain } from 'lucide-react';

const replies = [
  { id: '1', author: 'Alex Chen', handle: '@alexcreates', avatar: 'A', content: 'This scoring feature is incredible. Just got an 89 on my latest thread draft!', time: '2m ago', likes: 12 },
  { id: '2', author: 'Sarah Miller', handle: '@sarahcontent', avatar: 'S', content: 'How does the timing feature work? Can it adapt to different timezones?', time: '5m ago', likes: 3 },
  { id: '3', author: 'David Park', handle: '@davidgrowth', avatar: 'D', content: 'Love the new autopsy feature. Found some great insights from my last post.', time: '15m ago', likes: 8 },
  { id: '4', author: 'Emma Wilson', handle: '@emmawrites', avatar: 'E', content: 'Can you add LinkedIn integration next? Would love to use this there too.', time: '30m ago', likes: 5 },
];

const aiSuggestions = [
  'Thanks for the feedback! Glad the scoring is helping your content.',
  'Yes, the timing feature uses your audience activity data and adapts to any timezone automatically.',
  'Awesome! The autopsy tool gets smarter with every post you analyze.',
  'Great suggestion! LinkedIn integration is on our roadmap for Q3 2026.',
];

export default function Replies() {
  const [selectedReply, setSelectedReply] = useState(0);
  const [replyText, setReplyText] = useState('');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-[#E0E4F0] font-semibold text-lg">Replies</h2><p className="text-[#8B95B8] text-xs mt-0.5">Manage and respond to comments</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reply Feed */}
        <div className="space-y-3">
          {replies.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedReply(i)}
              className={`glass-card p-4 cursor-pointer transition-all ${selectedReply === i ? 'border-[#4E8DFF]' : 'hover:border-[rgba(78,141,255,0.3)]'}`}
            >
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#4E8DFF]/20 flex items-center justify-center text-xs font-bold text-[#4E8DFF] flex-shrink-0">{r.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#E0E4F0] text-xs font-medium">{r.author}</span>
                    <span className="text-[#5A6480] text-[10px]">{r.handle}</span>
                    <span className="text-[#5A6480] text-[10px] ml-auto">{r.time}</span>
                  </div>
                  <p className="text-[#8B95B8] text-xs leading-relaxed">{r.content}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[#5A6480] text-[10px]"><MessageCircle className="w-3 h-3" />{r.likes}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Reply Assistant */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-[#4E8DFF]" />
            <h3 className="text-[#E0E4F0] font-semibold text-sm">AI Reply Assistant</h3>
          </div>

          <div className="p-3 rounded-lg bg-white/[0.02] mb-4">
            <p className="text-[#5A6480] text-[10px] mb-1">Replying to:</p>
            <p className="text-[#E0E4F0] text-xs">{replies[selectedReply].content}</p>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-[#5A6480] text-[10px]">Suggested replies:</p>
            {aiSuggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setReplyText(s)}
                className={`w-full text-left p-2.5 rounded-lg text-xs transition-all ${
                  replyText === s ? 'bg-[#4E8DFF]/15 text-[#4E8DFF] border border-[#4E8DFF]/20' : 'bg-white/[0.02] text-[#8B95B8] hover:bg-white/5 border border-transparent'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            className="w-full bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-[#E0E4F0] outline-none focus:border-[#4E8DFF] h-20 resize-none placeholder:text-[#5A6480] mb-3"
          />

          <button className="btn-primary w-full flex items-center justify-center gap-1.5">
            <Send className="w-3.5 h-3.5" />
            Send Reply
          </button>
        </div>
      </div>
    </motion.div>
  );
}
