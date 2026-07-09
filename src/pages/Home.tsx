import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Brain, BarChart3, TrendingUp, Shield, Clock, ArrowRight, Sparkles, Target, PenTool } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0E1A] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4E8DFF]/5 via-transparent to-[#00E5A0]/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4E8DFF]/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00E5A0]/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 h-16 flex items-center justify-between px-8 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#4E8DFF] flex items-center justify-center">
            <Zap className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-display text-base font-bold text-[#E0E4F0]">Signal OS</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/pricing')} className="px-4 py-2 text-sm text-[#8B95B8] hover:text-[#E0E4F0] transition-colors">Pricing</button>
          <button onClick={() => navigate('/dashboard')} className="btn-primary flex items-center gap-1.5">
            Launch App <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-20 pb-16 px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4E8DFF]/10 border border-[#4E8DFF]/20 text-[#4E8DFF] text-xs font-medium mb-6">
            <Sparkles className="w-3 h-3" />
            AI-Powered Attention Intelligence
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-[#E0E4F0] leading-tight mb-5">
            Know Your Score.<br />
            <span className="bg-gradient-to-r from-[#4E8DFF] to-[#00E5A0] bg-clip-text text-transparent">
              Own the Feed.
            </span>
          </h1>
          <p className="text-[#8B95B8] text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Signal OS analyzes your content across 8 dimensions and predicts performance before you hit publish.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="btn-primary text-base px-6 py-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Get Started Free
            </button>
            <button onClick={() => navigate('/pricing')} className="px-6 py-3 rounded-lg bg-white/[0.03] border border-[rgba(255,255,255,0.08)] text-[#E0E4F0] text-sm hover:bg-white/5 transition-all">
              View Pricing
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center justify-center gap-12 mt-16"
        >
          {[
            { value: '87%', label: 'Accuracy' },
            { value: '3.4x', label: 'Engagement Lift' },
            { value: '<200ms', label: 'Score Time' },
            { value: '8', label: 'Dimensions' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl font-bold text-[#E0E4F0]">{stat.value}</p>
              <p className="text-[#5A6480] text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-3">Everything You Need</h2>
            <p className="text-[#8B95B8]">A complete content intelligence platform</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Brain, title: '8-Dimension Scoring', desc: 'Hook, Readability, Structure, Emotion, Timing, Engagement, Audience, Clarity' },
              { icon: Zap, title: 'Real-Time Analysis', desc: 'Get your content score in under 200ms as you type' },
              { icon: TrendingUp, title: 'Viral Prediction', desc: 'AI predicts engagement potential before you publish' },
              { icon: Clock, title: 'Timing Intelligence', desc: 'Heatmap of optimal post times for your audience' },
              { icon: Target, title: 'Competitor Tracking', desc: 'Monitor top creators and benchmark your performance' },
              { icon: Shield, title: 'Content Autopsy', desc: 'Deep-dive post-mortem analysis of underperforming content' },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="glass-card p-5 hover:border-[rgba(78,141,255,0.2)] transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#4E8DFF]/10 flex items-center justify-center mb-3 group-hover:bg-[#4E8DFF]/20 transition-all">
                  <feat.icon className="w-5 h-5 text-[#4E8DFF]" />
                </div>
                <h3 className="text-[#E0E4F0] font-semibold text-sm mb-1.5">{feat.title}</h3>
                <p className="text-[#5A6480] text-xs leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-[#8B95B8]">From draft to viral in three steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Write Your Draft', desc: 'Paste your post into the Draft Scorer. Up to 280 characters for X.', icon: PenTool },
              { step: '02', title: 'Get AI Score', desc: '8-dimension analysis in under 200ms. See exactly what works and what does not.', icon: Zap },
              { step: '03', title: 'Optimize & Publish', desc: 'Apply suggestions, re-score, then publish directly to X via Nango.', icon: TrendingUp },
            ].map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.15 }} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4E8DFF]/20 to-[#00C8FF]/20 flex items-center justify-center mx-auto mb-4">
                  <s.icon className="w-6 h-6 text-[#4E8DFF]" />
                </div>
                <span className="text-[#4E8DFF] font-display text-sm font-bold">{s.step}</span>
                <h3 className="text-[#E0E4F0] font-semibold mt-2 mb-2">{s.title}</h3>
                <p className="text-[#5A6480] text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-16 px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-xl mx-auto text-center glass-card p-8"
        >
          <h2 className="font-display text-2xl font-bold mb-3">Ready to Score?</h2>
          <p className="text-[#8B95B8] mb-6">Start optimizing your content today. Free plan includes 50 scores per month.</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary text-base px-8 py-3">
            Launch Signal OS
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-8 border-t border-[rgba(255,255,255,0.06)] text-center">
        <p className="text-[#5A6480] text-xs">Signal OS v2.0 — AI-Powered Attention Intelligence</p>
      </footer>
    </div>
  );
}
