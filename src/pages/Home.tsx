import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  Zap,
  Shield,
  BarChart3,
  MessageSquare,
  Target,
  Clock,
  CheckCircle2,
  ChevronRight,
  Award,
  Sparkles,
  PenTool,
  LineChart,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import ScoreBadge from '@/components/ScoreBadge';
import GoogleSignIn from '@/components/GoogleSignIn';

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI Draft Scorer',
      description: '5-dimension AI analysis scores every draft before you publish. Hook quality, readability, engagement, sentiment, and structure.',
      color: '#4E8DFF',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Trend Intelligence',
      description: 'Real-time topic detection across 11 categories. Know what is trending before your competitors do.',
      color: '#00C8FF',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Risk Assessment',
      description: 'Client-side AI scans for controversial language, polarizing statements, and reputation risks before posting.',
      color: '#FFB347',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Predictive Analytics',
      description: 'Bull, base, and bear scenario forecasting for every piece of content. Predict engagement before it happens.',
      color: '#22C55E',
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Reply Assistant',
      description: 'Rank and prioritize high-value replies. Never miss an important engagement opportunity again.',
      color: '#9F7AEA',
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Creator Intelligence',
      description: 'Quality scoring for accounts you follow. Discover and benchmark against top creators in your niche.',
      color: '#4E8DFF',
    },
  ];

  const stats = [
    { value: '18', label: 'AI Modules', icon: <Sparkles className="w-5 h-5" /> },
    { value: '5D', label: 'Scoring Engine', icon: <Award className="w-5 h-5" /> },
    { value: '100%', label: 'Client-Side', icon: <Shield className="w-5 h-5" /> },
    { value: '<2s', label: 'Analysis Time', icon: <Clock className="w-5 h-5" /> },
  ];

  const testimonials = [
    {
      name: 'Sarah Kim',
      handle: '@sarahkim',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      text: 'Signal OS transformed how I approach content. The AI scoring catches weak hooks before I publish. My engagement is up 340%.',
      score: 92,
    },
    {
      name: 'David Park',
      handle: '@davidpark',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
      text: 'The client-side AI is a game changer. I get instant feedback on drafts without sending my content anywhere. The 5-dimension scoring is incredibly accurate.',
      score: 87,
    },
    {
      name: 'Emma Liu',
      handle: '@emmaliu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
      text: 'Finally, a tool that understands content quality. The sentiment analysis and risk assessment have saved me from multiple potential PR issues.',
      score: 94,
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Write Your Draft',
      description: 'Compose your post in the built-in editor or paste from anywhere.',
      icon: <PenTool className="w-6 h-6" />,
    },
    {
      step: '02',
      title: 'AI Analysis',
      description: 'Our 5-dimension engine scores your content in under 2 seconds.',
      icon: <Brain className="w-6 h-6" />,
    },
    {
      step: '03',
      title: 'Optimize & Publish',
      description: 'Apply suggestions, re-score, and publish with confidence.',
      icon: <LineChart className="w-6 h-6" />,
    },
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      description: 'Essential tools for individual creators',
      features: [
        '5 drafts per day',
        'Basic AI scoring',
        'Sentiment analysis',
        '7-day history',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'Full power for serious creators',
      features: [
        'Unlimited drafts',
        'Advanced 5D scoring',
        'Topic & hashtag analysis',
        'Trend forecasting',
        'Creator intelligence',
        'Reply assistant',
        'Weekly reports',
        '90-day history',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Team',
      price: '$79',
      period: '/month',
      description: 'Collaborate with your content team',
      features: [
        'Everything in Pro',
        'Up to 5 team members',
        'Shared workspaces',
        'Brand voice training',
        'Priority support',
        'API access',
        'Unlimited history',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#141725] noise-overlay">
      {/* Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(78, 141, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(78, 141, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-[rgba(26,29,46,0.8)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]">
        <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#4E8DFF]" />
            <span className="font-display font-bold text-[#E0E4F0] tracking-tight">
              Signal <span className="text-[#4E8DFF]">OS</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[#8B95B8] hover:text-[#E0E4F0] transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-[#8B95B8] hover:text-[#E0E4F0] transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-[#8B95B8] hover:text-[#E0E4F0] transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm text-[#8B95B8] hover:text-[#E0E4F0] transition-colors hidden sm:block"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary text-xs py-2 px-4"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/4 pointer-events-none z-0">
          <img src="/hero-glow-blue.png" alt="" className="w-full h-full object-contain opacity-60" />
        </div>
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] translate-x-1/2 pointer-events-none z-0">
          <img src="/hero-glow-cyan.png" alt="" className="w-full h-full object-contain opacity-40" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(78,141,255,0.1)] border border-[rgba(78,141,255,0.2)] mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#4E8DFF]" />
              <span className="text-xs font-medium text-[#4E8DFF]">AI-Powered Attention Intelligence</span>
            </motion.div>

            <motion.h1
              variants={staggerItem}
              className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-[#E0E4F0] tracking-tight leading-[1.1] max-w-3xl mx-auto mb-6"
            >
              Write Content That
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF]">
                Commands Attention
              </span>
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="text-lg text-[#8B95B8] max-w-xl mx-auto mb-8 leading-relaxed"
            >
              Signal OS analyzes your drafts with client-side AI, scores every dimension of quality,
              and helps you publish content that performs — all without your data ever leaving your device.
            </motion.p>

            <motion.div
              variants={staggerItem}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary"
              >
                Start Writing Smarter
                <ChevronRight className="w-4 h-4" />
              </button>
              <GoogleSignIn label="Sign in with Google" variant="secondary" />
            </motion.div>

            {/* Stats Row */}
            <motion.div
              variants={staggerItem}
              className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2.5">
                  <div className="text-[#4E8DFF]">{stat.icon}</div>
                  <div className="text-left">
                    <div className="text-lg font-bold font-data text-[#E0E4F0]">{stat.value}</div>
                    <div className="text-xs text-[#5A6480]">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={staggerItem} className="font-display font-bold text-3xl md:text-4xl text-[#E0E4F0] tracking-tight mb-4">
              Every Tool You Need to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF]"> Win on X</span>
            </motion.h2>
            <motion.p variants={staggerItem} className="text-[#8B95B8] max-w-lg mx-auto">
              18 integrated modules working together to help you create, analyze, and optimize your content strategy.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={staggerItem}>
                <GlassCard className="h-full" glow glowColor="blue">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${feature.color}18`, color: feature.color }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#E0E4F0] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#8B95B8] leading-relaxed">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Score Demo Section */}
      <section className="relative z-10 py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={staggerItem}>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-[#E0E4F0] tracking-tight mb-4">
                5-Dimension AI Scoring
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF]">
                  In Under 2 Seconds
                </span>
              </h2>
              <p className="text-[#8B95B8] mb-8 leading-relaxed">
                Our proprietary scoring engine evaluates Hook Quality, Readability, Engagement Potential,
                Sentiment, and Structure. Get actionable suggestions to improve before you publish.
              </p>

              <div className="space-y-4">
                {[
                  { label: 'Hook Quality', score: 85, color: '#FFB347', desc: 'Strong opening with question pattern' },
                  { label: 'Readability', score: 92, color: '#00C8FF', desc: 'Optimal length and sentence structure' },
                  { label: 'Engagement', score: 78, color: '#22C55E', desc: 'Good CTA, could add a question' },
                  { label: 'Sentiment', score: 88, color: '#4E8DFF', desc: 'Positive and confident tone' },
                  { label: 'Structure', score: 81, color: '#9F7AEA', desc: 'Well-formatted with line breaks' },
                ].map((dim) => (
                  <div key={dim.label} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-[#E0E4F0]">{dim.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#5A6480]">{dim.desc}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${dim.score}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: dim.color }}
                        />
                      </div>
                    </div>
                    <ScoreBadge score={dim.score} size="sm" />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={staggerItem} className="relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 opacity-30">
                <img src="/hero-glow-cyan.png" alt="" className="w-full h-full object-contain" />
              </div>
              <GlassCard className="relative z-10" glow glowColor="blue">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[rgba(255,255,255,0.08)]">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-[#4E8DFF]" />
                    <span className="font-display font-bold text-[#E0E4F0]">Draft Analysis</span>
                  </div>
                  <ScoreBadge score={85} size="md" />
                </div>

                <div className="space-y-3 mb-4 p-3 bg-[rgba(255,255,255,0.03)] rounded-lg">
                  <p className="text-sm text-[#E0E4F0] leading-relaxed">
                    Just shipped a new AI feature that predicts which drafts will perform best.
                    The accuracy is mind-blowing. Here's how we built it
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-[#5A6480] uppercase tracking-wider mb-2">Suggestions</h4>
                  {[
                    'Add a question to spark conversation',
                    'Strong hook! Now add a clear CTA',
                    'Consider adding 1-2 relevant hashtags',
                  ].map((suggestion, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-[#8B95B8]">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={staggerItem} className="font-display font-bold text-3xl md:text-4xl text-[#E0E4F0] tracking-tight mb-4">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF]">Works</span>
            </motion.h2>
            <motion.p variants={staggerItem} className="text-[#8B95B8] max-w-lg mx-auto">
              Three simple steps to transform your content quality.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {howItWorks.map((step, i) => (
              <motion.div key={step.step} variants={staggerItem} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] right-0 h-px bg-gradient-to-r from-[rgba(78,141,255,0.3)] to-transparent" />
                )}
                <div className="text-center">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4E8DFF] to-[#00C8FF] flex items-center justify-center mx-auto mb-5 shadow-[0_4px_20px_rgba(78,141,255,0.3)]">
                    <div className="text-[#141725]">{step.icon}</div>
                  </div>
                  <span className="text-xs font-data text-[#5A6480] mb-2 block">{step.step}</span>
                  <h3 className="font-display font-bold text-lg text-[#E0E4F0] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#8B95B8] leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={staggerItem} className="font-display font-bold text-3xl md:text-4xl text-[#E0E4F0] tracking-tight mb-4">
              Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF]">Creators</span>
            </motion.h2>
            <motion.p variants={staggerItem} className="text-[#8B95B8] max-w-lg mx-auto">
              See what content creators are saying about Signal OS.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div key={t.handle} variants={staggerItem}>
                <GlassCard className="h-full" glow glowColor="blue">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="font-medium text-sm text-[#E0E4F0]">{t.name}</div>
                      <div className="text-xs text-[#5A6480]">{t.handle}</div>
                    </div>
                    <div className="ml-auto">
                      <ScoreBadge score={t.score} size="sm" />
                    </div>
                  </div>
                  <p className="text-sm text-[#8B95B8] leading-relaxed">{t.text}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={staggerItem} className="font-display font-bold text-3xl md:text-4xl text-[#E0E4F0] tracking-tight mb-4">
              Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF]">Transparent</span> Pricing
            </motion.h2>
            <motion.p variants={staggerItem} className="text-[#8B95B8] max-w-lg mx-auto">
              Choose the plan that fits your content goals. No hidden fees, cancel anytime.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {pricingTiers.map((tier) => (
              <motion.div key={tier.name} variants={staggerItem}>
                <GlassCard
                  className={tier.highlighted ? 'border-[rgba(78,141,255,0.35)] shadow-[0_0_40px_rgba(78,141,255,0.15)]' : ''}
                  glow={tier.highlighted}
                  glowColor="blue"
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="text-xs font-semibold bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF] text-[#141725] px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center pt-2">
                    <h3 className="font-display font-bold text-lg text-[#E0E4F0] mb-1">{tier.name}</h3>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-3xl font-bold font-data text-[#E0E4F0]">{tier.price}</span>
                      <span className="text-sm text-[#5A6480]">{tier.period}</span>
                    </div>
                    <p className="text-xs text-[#8B95B8] mb-6">{tier.description}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-sm text-[#8B95B8]">
                        <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => navigate('/dashboard')}
                    className={tier.highlighted ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}
                  >
                    {tier.cta}
                  </button>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            <GlassCard
              className="relative overflow-hidden text-center py-16 px-8"
              glow
              glowColor="blue"
            >
              {/* Background glow */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(78,141,255,0.12),transparent_70%)]" />
              </div>

              <div className="relative z-10">
                <motion.h2
                  variants={staggerItem}
                  className="font-display font-bold text-3xl md:text-4xl text-[#E0E4F0] tracking-tight mb-4"
                >
                  Ready to Transform Your Content?
                </motion.h2>
                <motion.p variants={staggerItem} className="text-[#8B95B8] max-w-lg mx-auto mb-8">
                  Join thousands of creators who use Signal OS to write better content, engage their audience, and grow faster.
                </motion.p>
                <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="btn-primary"
                  >
                    <Zap className="w-4 h-4" />
                    Get Started Free
                  </button>
                  <GoogleSignIn label="Sign in with Google" variant="secondary" />
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(255,255,255,0.08)]">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-[#4E8DFF]" />
                <span className="font-display font-bold text-[#E0E4F0]">
                  Signal <span className="text-[#4E8DFF]">OS</span>
                </span>
              </div>
              <p className="text-sm text-[#5A6480] leading-relaxed">
                AI-powered attention intelligence for X content creators. All processing happens in your browser.
              </p>
            </div>

            <div>
              <h4 className="font-display font-semibold text-sm text-[#E0E4F0] mb-4">Product</h4>
              <ul className="space-y-2">
                {['Draft Scorer', 'AI Insights', 'Timeline', 'Forecasting'].map((item) => (
                  <li key={item}>
                    <button onClick={() => navigate('/dashboard')} className="text-sm text-[#5A6480] hover:text-[#8B95B8] transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-sm text-[#E0E4F0] mb-4">Resources</h4>
              <ul className="space-y-2">
                {['Documentation', 'API Reference', 'Changelog', 'Support'].map((item) => (
                  <li key={item}>
                    <button onClick={() => navigate('/dashboard')} className="text-sm text-[#5A6480] hover:text-[#8B95B8] transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-sm text-[#E0E4F0] mb-4">Company</h4>
              <ul className="space-y-2">
                {['About', 'Blog', 'Careers', 'Privacy'].map((item) => (
                  <li key={item}>
                    <button onClick={() => navigate('/dashboard')} className="text-sm text-[#5A6480] hover:text-[#8B95B8] transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[rgba(255,255,255,0.08)] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#5A6480]">
              &copy; 2024 Signal OS. All rights reserved. Built with privacy in mind.
            </p>
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#22C55E]" />
              <span className="text-xs text-[#5A6480]">Client-side AI — your data never leaves your device</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
