import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for trying out Signal OS',
    features: ['50 scores per month', 'Basic 8-dimension analysis', 'Score history (7 days)', 'Community support'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: 29,
    period: '/month',
    description: 'For serious content creators',
    features: ['Unlimited scores', 'Full AI insights', 'Unlimited history', 'Timing intelligence', 'Priority support', 'Export reports'],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Team',
    price: 79,
    period: '/month',
    description: 'For teams and agencies',
    features: ['Everything in Pro', 'Up to 5 team members', 'Shared templates', 'API access', 'Custom branding', 'Dedicated account manager'],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function Pricing() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold mb-3">Simple Pricing</h2>
        <p className="text-[#8B95B8]">Choose the plan that fits your content goals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card p-6 relative ${plan.popular ? 'border-[#4E8DFF]' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#4E8DFF] text-white text-[10px] font-medium">
                Most Popular
              </div>
            )}
            <div className="text-center mb-5">
              <h3 className="text-[#E0E4F0] font-semibold mb-1">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-[#5A6480] text-sm">$</span>
                <span className="font-display text-4xl font-bold text-[#E0E4F0]">{plan.price}</span>
                <span className="text-[#5A6480] text-sm">{plan.period}</span>
              </div>
              <p className="text-[#5A6480] text-xs mt-1">{plan.description}</p>
            </div>

            <div className="space-y-2.5 mb-6">
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-[#8B95B8] text-xs">{f}</span>
                </div>
              ))}
            </div>

            <button
              className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                plan.popular
                  ? 'bg-[#4E8DFF] text-white hover:bg-[#3A7AEE]'
                  : 'bg-white/[0.03] border border-[rgba(255,255,255,0.08)] text-[#E0E4F0] hover:bg-white/5'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-[#5A6480] text-xs">
        All plans include SSL security and data encryption. Cancel anytime.
      </p>
    </motion.div>
  );
}
