import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Search, Bell } from 'lucide-react';

export interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Get page title from route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/drafts') return 'Draft Scorer';
    if (path === '/insights') return 'AI Insights';
    if (path === '/timeline') return 'Timeline';
    if (path === '/creators') return 'Creators';
    if (path === '/hashtags') return 'Hashtags';
    if (path === '/topics') return 'Topics';
    if (path === '/sentiment') return 'Sentiment';
    if (path === '/forecasting') return 'Forecasting';
    if (path === '/reports') return 'Reports';
    if (path === '/publish') return 'Publish';
    if (path === '/command') return 'Command Center';
    if (path === '/replies') return 'Reply Assistant';
    if (path === '/weekly') return 'Weekly Report';
    if (path === '/autopsy') return 'Post Autopsy';
    if (path === '/scorecard') return 'Scorecard';
    if (path === '/settings') return 'Settings';
    if (path === '/pricing') return 'Pricing';
    return 'Signal OS';
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#141725] noise-overlay">
      {/* Grid Pattern Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(78, 141, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(78, 141, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Sidebar */}
      <div className="flex-shrink-0 z-30">
        <Navbar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        {/* Top Bar */}
        <header className="h-14 flex items-center justify-between px-6 bg-[#1A1D2E] border-b border-[rgba(255,255,255,0.08)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="font-display font-bold text-[#E0E4F0] text-lg tracking-tight">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-[rgba(255,255,255,0.05)] rounded-lg px-3 py-1.5 border border-[rgba(255,255,255,0.08)]">
              <Search className="w-4 h-4 text-[#5A6480]" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-[#E0E4F0] placeholder-[#5A6480] outline-none w-40"
              />
              <kbd className="text-[10px] text-[#5A6480] bg-[rgba(255,255,255,0.08)] px-1.5 py-0.5 rounded">⌘K</kbd>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-[rgba(78,141,255,0.08)] transition-colors">
              <Bell className="w-[18px] h-[18px] text-[#8B95B8]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF4444] rounded-full" />
            </button>

            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4E8DFF] to-[#00C8FF] flex items-center justify-center text-xs font-bold text-[#141725] cursor-pointer">
              U
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 min-h-0">
          <div className="max-w-[1440px] mx-auto">
            {children || <Outlet />}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
