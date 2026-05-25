import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  Minus,
  ChevronDown,
  Zap,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  badge?: string;
  badgeColor?: string;
  features: { text: string; included: boolean }[];
  cta: string;
  ctaStyle: 'primary' | 'secondary';
  highlighted?: boolean;
}

const tiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for getting started',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      { text: 'AI Content Scoring', included: true },
      { text: 'Basic Analytics', included: true },
      { text: '3 Drafts/day', included: true },
      { text: 'Weekly Scorecard', included: true },
      { text: 'AI Insights', included: false },
      { text: 'Command Center', included: false },
      { text: 'Forecasting', included: false },
      { text: 'Reply Assistant', included: false },
      { text: 'Post Autopsy', included: false },
      { text: 'Team Members', included: false },
      { text: 'API Access', included: false },
      { text: 'Priority Support', included: false },
    ],
    cta: 'Get Started — Free',
    ctaStyle: 'secondary',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Everything in Starter, plus:',
    monthlyPrice: 19,
    annualPrice: 15,
    badge: 'Most Popular',
    badgeColor: '#4E8DFF',
    highlighted: true,
    features: [
      { text: 'AI Content Scoring', included: true },
      { text: 'Basic Analytics', included: true },
      { text: 'Unlimited Drafts', included: true },
      { text: 'Weekly Scorecard', included: true },
      { text: 'AI Insights', included: true },
      { text: 'Command Center', included: true },
      { text: 'Forecasting', included: true },
      { text: 'Reply Assistant', included: true },
      { text: 'Post Autopsy', included: true },
      { text: 'Team Members', included: false },
      { text: 'API Access', included: false },
      { text: 'Priority Support', included: false },
    ],
    cta: 'Start Free Trial',
    ctaStyle: 'primary',
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Everything in Pro, plus:',
    monthlyPrice: 49,
    annualPrice: 39,
    badge: 'Best Value',
    badgeColor: '#22C55E',
    features: [
      { text: 'AI Content Scoring', included: true },
      { text: 'Basic Analytics', included: true },
      { text: 'Unlimited Drafts', included: true },
      { text: 'Weekly Scorecard', included: true },
      { text: 'AI Insights', included: true },
      { text: 'Command Center', included: true },
      { text: 'Forecasting', included: true },
      { text: 'Reply Assistant', included: true },
      { text: 'Post Autopsy', included: true },
      { text: 'Team Members (3)', included: true },
      { text: 'API Access', included: true },
      { text: 'Priority Support', included: true },
    ],
    cta: 'Contact Sales',
    ctaStyle: 'secondary',
  },
];

const comparisonFeatures = [
  { feature: 'AI Content Scoring', starter: '3/day', pro: 'Unlimited', biz: 'Unlimited' },
  { feature: 'Draft Analysis', starter: 'Basic', pro: 'Full 5-dim', biz: 'Full 5-dim' },
  { feature: 'AI Insights', starter: '—', pro: 'Full', biz: 'Full' },
  { feature: 'Command Center', starter: '—', pro: 'Real-time', biz: 'Real-time' },
  { feature: 'Reply Assistant', starter: '—', pro: '20/day', biz: 'Unlimited' },
  { feature: 'Post Autopsy', starter: '—', pro: 'Last 10', biz: 'Unlimited' },
  { feature: 'Sentiment Analysis', starter: '—', pro: 'Basic', biz: 'Advanced' },
  { feature: 'Forecasting', starter: '—', pro: '7-day', biz: '30-day' },
  { feature: 'Weekly Reports', starter: 'Basic', pro: 'Full', biz: 'Custom' },
  { feature: 'Scorecard Sharing', starter: 'Basic', pro: 'Branded', biz: 'White-label' },
  { feature: 'Topic Analysis', starter: '—', pro: 'Basic', biz: 'Advanced' },
  { feature: 'Hashtag Analysis', starter: '—', pro: 'Basic', biz: 'Advanced' },
  { feature: 'Creator Quality', starter: '—', pro: '50 accounts', biz: 'Unlimited' },
  { feature: 'Team Members', starter: '1', pro: '1', biz: '3' },
  { feature: 'API Access', starter: '—', pro: '—', biz: 'Full' },
  { feature: 'Priority Support', starter: '—', pro: 'Email', biz: 'Priority' },
];

const faqItems = [
  {
    q: 'Can I really use Signal OS for free?',
    a: 'Yes! The Starter plan is free forever. You get AI content scoring, basic analytics, 3 drafts per day, and weekly scorecards. No credit card required.',
  },
  {
    q: 'What happens when I hit my daily limit?',
    a: 'You will see a friendly upgrade prompt. Your existing data and scores remain fully accessible. Upgrade anytime to unlock unlimited usage.',
  },
  {
    q: 'Is my data safe? Does it leave my device?',
    a: 'Absolutely. All AI processing happens directly in your browser using local models. No content, drafts, or account data ever leaves your device unless you explicitly enable cloud features.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes, you can cancel at any time from your Settings page. You will retain access to paid features until the end of your billing period.',
  },
  {
    q: 'What is the difference between monthly and annual billing?',
    a: 'Annual billing saves you 20% compared to monthly. Both plans offer the same features — the only difference is the billing interval and price.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'We offer a 7-day money-back guarantee for all paid plans. If Signal OS is not meeting your needs, contact us for a full refund.',
  },
  {
    q: 'Can I upgrade or downgrade my plan?',
    a: 'Yes, you can change your plan at any time from Settings > Billing. Upgrades take effect immediately; downgrades take effect at the next billing cycle.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
};

/* ------------------------------------------------------------------ */
/*  FAQ Item Component                                                 */
/* ------------------------------------------------------------------ */
function FAQItem({ item, index }: { item: typeof faqItems[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.03 }}
      className="border-b border-[rgba(255,255,255,0.08)] last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className={cn(
          'font-display font-semibold text-base transition-colors',
          open ? 'text-[#4E8DFF]' : 'text-[#E0E4F0] group-hover:text-[#8B95B8]'
        )}>
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-4"
        >
          <ChevronDown className={cn('w-5 h-5', open ? 'text-[#4E8DFF]' : 'text-[#5A6480]')} />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-[#8B95B8] leading-relaxed pb-4">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */
export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="space-y-16 pb-8">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center pt-8"
      >
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: 'linear-gradient(rgba(78, 141, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(78, 141, 255, 0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          className="font-display font-bold text-[#E0E4F0] text-4xl md:text-5xl tracking-tight mb-4"
        >
          Choose Your Plan
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-lg text-[#8B95B8] max-w-xl mx-auto mb-8"
        >
          Start free, upgrade when you are ready to unlock the full power of AI content intelligence
        </motion.p>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
          className="inline-flex items-center gap-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-full p-1"
        >
          <button
            onClick={() => setIsAnnual(false)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              !isAnnual ? 'bg-[#4E8DFF] text-white shadow-lg shadow-[rgba(78,141,255,0.3)]' : 'text-[#8B95B8] hover:text-[#E0E4F0]'
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all inline-flex items-center gap-2',
              isAnnual ? 'bg-[#4E8DFF] text-white shadow-lg shadow-[rgba(78,141,255,0.3)]' : 'text-[#8B95B8] hover:text-[#E0E4F0]'
            )}
          >
            Annual
            <span className="text-[10px] bg-[#22C55E] text-white px-1.5 py-0.5 rounded-full font-semibold">
              Save 20%
            </span>
          </button>
        </motion.div>
      </motion.section>

      {/* Pricing Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1000px] mx-auto">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: tier.highlighted ? 0.15 : i * 0.1,
              ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
            }}
            className={cn(tier.highlighted && 'md:-translate-y-1')}
          >
            <GlassCard
              className={cn(
                'h-full flex flex-col relative',
                tier.highlighted && 'border-[rgba(78,141,255,0.4)] shadow-[0_0_40px_rgba(78,141,255,0.15)]'
              )}
              hover
            >
              {/* Badge */}
              {tier.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: tier.badgeColor }}
                >
                  {tier.badge}
                </div>
              )}

              {/* Header */}
              <div className="text-center pt-2">
                <h3 className="font-display font-bold text-[#E0E4F0] text-xl mb-1">{tier.name}</h3>
                <p className="text-xs text-[#5A6480] mb-4">{tier.description}</p>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="font-mono font-bold text-[#E0E4F0] text-4xl tracking-tight">
                    ${isAnnual ? tier.annualPrice : tier.monthlyPrice}
                  </span>
                  <span className="text-sm text-[#5A6480]">/month</span>
                </div>
                {isAnnual && tier.annualPrice > 0 && (
                  <p className="text-xs text-[#5A6480] mb-4">
                    ${tier.annualPrice * 12} billed annually
                  </p>
                )}
                {tier.monthlyPrice === 0 && <div className="mb-4" />}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 my-5">
                {tier.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-2.5 text-sm">
                    {f.included ? (
                      <Check className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-[#5A6480] flex-shrink-0 mt-0.5 opacity-50" />
                    )}
                    <span className={cn(f.included ? 'text-[#E0E4F0]' : 'text-[#5A6480]')}>{f.text}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={cn(
                  'w-full py-2.5 rounded-lg text-sm font-semibold transition-all',
                  tier.ctaStyle === 'primary'
                    ? 'btn-primary justify-center'
                    : 'btn-secondary justify-center'
                )}
              >
                {tier.cta}
              </button>
            </GlassCard>
          </motion.div>
        ))}
      </section>

      {/* Feature Comparison Table */}
      <section className="max-w-[900px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.08)] bg-[#202436]">
                    <th className="text-left text-xs font-medium text-[#5A6480] uppercase tracking-wider px-5 py-3 min-w-[200px]">
                      Feature
                    </th>
                    <th className="text-center text-xs font-medium text-[#5A6480] uppercase tracking-wider px-5 py-3 w-[140px]">
                      Starter
                    </th>
                    <th className="text-center text-xs font-medium text-[#4E8DFF] uppercase tracking-wider px-5 py-3 w-[140px]">
                      Professional
                    </th>
                    <th className="text-center text-xs font-medium text-[#5A6480] uppercase tracking-wider px-5 py-3 w-[140px]">
                      Business
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(78,141,255,0.03)] transition-colors"
                    >
                      <td className="px-5 py-3 text-sm text-[#E0E4F0]">{row.feature}</td>
                      <td className="px-5 py-3 text-center">
                        {row.starter === '—' ? (
                          <Minus className="w-4 h-4 text-[#5A6480] mx-auto opacity-50" />
                        ) : (
                          <span className="text-xs text-[#E0E4F0]">{row.starter}</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {row.pro === '—' ? (
                          <Minus className="w-4 h-4 text-[#5A6480] mx-auto opacity-50" />
                        ) : (
                          <span className="text-xs text-[#E0E4F0] font-medium">{row.pro}</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {row.biz === '—' ? (
                          <Minus className="w-4 h-4 text-[#5A6480] mx-auto opacity-50" />
                        ) : (
                          <span className="text-xs text-[#E0E4F0]">{row.biz}</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-[700px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="font-display font-bold text-[#E0E4F0] text-2xl tracking-tight text-center mb-8"
        >
          Frequently Asked Questions
        </motion.h2>
        <GlassCard>
          {faqItems.map((item, i) => (
            <FAQItem key={i} item={item} index={i} />
          ))}
        </GlassCard>
      </section>

      {/* CTA Section */}
      <section className="text-center py-8 relative">
        {/* Subtle glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[400px] h-[200px] bg-[radial-gradient(ellipse,rgba(78,141,255,0.12),transparent_70%)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <h2 className="font-display font-bold text-[#E0E4F0] text-3xl tracking-tight mb-3">
            Ready to Supercharge Your Content?
          </h2>
          <p className="text-[#8B95B8] mb-6 max-w-md mx-auto">
            Join thousands of creators using AI to optimize their X presence
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary text-base px-8 py-3"
          >
            <Zap className="w-5 h-5" /> Get Started Free
          </motion.button>
          <p className="text-xs text-[#5A6480] mt-3">No credit card required</p>
        </motion.div>
      </section>
    </div>
  );
}
