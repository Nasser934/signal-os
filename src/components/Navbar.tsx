import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, PenTool, Brain, Clock, Users, Hash, FileText,
  BarChart3, Send, MessageSquare, Zap, Terminal, Award, Shield,
  Settings, CreditCard, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navSections = [
  {
    title: 'Core',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/drafts', label: 'Draft Scorer', icon: PenTool },
      { path: '/insights', label: 'AI Insights', icon: Brain },
    ],
  },
  {
    title: 'Analysis',
    items: [
      { path: '/timeline', label: 'Timing', icon: Clock },
      { path: '/creators', label: 'Creators', icon: Users },
      { path: '/hashtags', label: 'Hashtags', icon: Hash },
      { path: '/topics', label: 'Topics', icon: FileText },
      { path: '/sentiment', label: 'Sentiment', icon: BarChart3 },
      { path: '/forecasting', label: 'Forecasting', icon: Zap },
    ],
  },
  {
    title: 'Workflow',
    items: [
      { path: '/publish', label: 'Publish', icon: Send },
      { path: '/replies', label: 'Replies', icon: MessageSquare },
      { path: '/command', label: 'Command', icon: Terminal },
    ],
  },
  {
    title: 'Evaluation',
    items: [
      { path: '/scorecard', label: 'Scorecard', icon: Award },
      { path: '/weekly', label: 'Weekly', icon: BarChart3 },
      { path: '/autopsy', label: 'Autopsy', icon: Shield },
      { path: '/reports', label: 'Reports', icon: FileText },
    ],
  },
];

export default function Navbar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`${collapsed ? 'w-[60px]' : 'w-[220px]'} flex-shrink-0 h-screen bg-[#0F1221] border-r border-[rgba(255,255,255,0.06)] flex flex-col transition-all duration-300 relative z-50`}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-[rgba(255,255,255,0.06)]">
        <div className="w-7 h-7 rounded-lg bg-[#4E8DFF] flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-2.5 font-display text-sm font-bold text-[#E0E4F0]"
          >
            Signal OS
          </motion.span>
        )}
      </div>

      {/* Nav Sections */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar py-3 px-2 space-y-1">
        {navSections.map((section) => (
          <div key={section.title} className="mb-3">
            {!collapsed && (
              <p className="text-[10px] font-semibold text-[#5A6480] uppercase tracking-wider px-2 mb-1">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <a
                  key={item.path}
                  href={`#${item.path}`}
                  className={`nav-item mb-0.5 ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </a>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-[rgba(255,255,255,0.06)] space-y-0.5">
        <a href="#/pricing" className="nav-item">
          <CreditCard className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Pricing</span>}
        </a>
        <a href="#/settings" className="nav-item">
          <Settings className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </a>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#1A1D2E] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#5A6480] hover:text-[#E0E4F0] transition-colors z-50"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  );
}
