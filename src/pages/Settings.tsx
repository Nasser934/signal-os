import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Plug, SlidersHorizontal, Brain, Bell, Palette, Shield, CreditCard } from 'lucide-react';
import NangoConnect from '@/components/NangoConnect';

type Category = 'account' | 'integrations' | 'scoring' | 'ai_engine' | 'notifications' | 'appearance' | 'privacy' | 'billing';

const categories = [
  { id: 'account' as Category, label: 'Account', icon: User },
  { id: 'integrations' as Category, label: 'Integrations', icon: Plug },
  { id: 'scoring' as Category, label: 'Scoring', icon: SlidersHorizontal },
  { id: 'ai_engine' as Category, label: 'AI Engine', icon: Brain },
  { id: 'notifications' as Category, label: 'Notifications', icon: Bell },
  { id: 'appearance' as Category, label: 'Appearance', icon: Palette },
  { id: 'privacy' as Category, label: 'Privacy', icon: Shield },
  { id: 'billing' as Category, label: 'Billing', icon: CreditCard },
];

const integrations = [
  { name: 'X (Twitter)', status: 'Active', desc: 'OAuth 2.0 - Post, sync, analyze' },
  { name: 'LinkedIn', status: 'Soon', desc: 'Cross-post to professional network' },
  { name: 'Threads', status: 'Soon', desc: 'Share to Meta text platform' },
  { name: 'Bluesky', status: 'Soon', desc: 'Decentralized social publishing' },
];

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="mb-4">
        <h3 className="text-[#E0E4F0] font-semibold text-sm">{title}</h3>
        <p className="text-[#5A6480] text-xs mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-[rgba(255,255,255,0.06)]">
      <span className="text-[#E0E4F0] text-xs">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className={`w-10 h-5 rounded-full transition-colors relative ${on ? 'bg-[#4E8DFF]' : 'bg-white/10'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${on ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [active, setActive] = useState<Category>('account');

  const renderContent = () => {
    switch (active) {
      case 'account':
        return (
          <div className="space-y-3">
            <Section title="Profile" description="Manage your account details">
              <div className="space-y-3">
                <div>
                  <label className="text-[#8B95B8] text-xs mb-1 block">Display Name</label>
                  <input
                    defaultValue="Signal OS User"
                    className="w-full bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-[#E0E4F0] outline-none focus:border-[#4E8DFF]"
                  />
                </div>
                <div>
                  <label className="text-[#8B95B8] text-xs mb-1 block">Bio</label>
                  <textarea
                    defaultValue="AI-powered content creator"
                    className="w-full bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-[#E0E4F0] outline-none focus:border-[#4E8DFF] h-20 resize-none"
                  />
                </div>
              </div>
            </Section>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-4">
            <Section title="API Integrations" description="Connect external accounts via Nango">
              <NangoConnect variant="card" showSync />
            </Section>
            <Section title="Available Integrations" description="More platforms coming soon">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {integrations.map((int) => (
                  <div key={int.name} className="p-4 rounded-lg bg-white/[0.02] border border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#E0E4F0] text-sm font-medium">{int.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          int.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-[#4E8DFF]/10 text-[#4E8DFF]'
                        }`}
                      >
                        {int.status}
                      </span>
                    </div>
                    <p className="text-[#5A6480] text-xs">{int.desc}</p>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        );

      case 'scoring':
        return (
          <div className="space-y-3">
            <Section title="Scoring Preferences" description="Customize how your content is scored">
              <div className="space-y-2">
                <Toggle label="Strict scoring mode" />
                <Toggle label="Include timing analysis" defaultOn />
                <Toggle label="Compare to top creators" defaultOn />
                <Toggle label="Real-time engagement prediction" defaultOn />
              </div>
            </Section>
          </div>
        );

      case 'ai_engine':
        return (
          <div className="space-y-3">
            <Section title="AI Engine" description="Configure the AI analysis engine">
              <div className="space-y-2">
                <Toggle label="Enable trend forecasting" defaultOn />
                <Toggle label="Enable sentiment analysis" defaultOn />
                <Toggle label="Enable competitor benchmarking" />
                <Toggle label="Deep analysis mode (slower but more accurate)" />
              </div>
            </Section>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-3">
            <Section title="Notification Preferences" description="Choose what you want to be notified about">
              <div className="space-y-2">
                <Toggle label="Score complete notifications" defaultOn />
                <Toggle label="Trend alerts" defaultOn />
                <Toggle label="Weekly report ready" defaultOn />
                <Toggle label="New feature announcements" defaultOn />
                <Toggle label="Marketing emails" />
              </div>
            </Section>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-3">
            <Section title="Appearance" description="Customize the look and feel">
              <div className="space-y-2">
                <Toggle label="Show grid background" defaultOn />
                <Toggle label="Animations enabled" defaultOn />
                <Toggle label="Compact mode" />
              </div>
            </Section>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-3">
            <Section title="Privacy" description="Control your data and privacy">
              <div className="space-y-2">
                <Toggle label="Store score history locally" defaultOn />
                <Toggle label="Anonymous analytics" defaultOn />
                <Toggle label="Share anonymized data for model improvement" />
              </div>
            </Section>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-4">
            <Section title="Current Plan" description="Your subscription details">
              <div className="p-4 rounded-lg bg-[#4E8DFF]/5 border border-[#4E8DFF]/10">
                <p className="text-[#E0E4F0] font-semibold text-sm">Pro Plan</p>
                <p className="text-[#8B95B8] text-xs mt-0.5">$29/month - Renews July 15, 2026</p>
                <p className="text-emerald-400 text-xs mt-1">Active</p>
              </div>
            </Section>
          </div>
        );
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-6 h-[calc(100vh-140px)]">
      <div className="w-[200px] flex-shrink-0 space-y-0.5">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
              active === c.id
                ? 'bg-[rgba(78,141,255,0.12)] text-[#4E8DFF] font-medium'
                : 'text-[#8B95B8] hover:bg-white/5 hover:text-[#E0E4F0]'
            }`}
          >
            <c.icon className="w-4 h-4" />
            {c.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">{renderContent()}</div>
    </motion.div>
  );
}
