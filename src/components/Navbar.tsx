import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PenTool,
  Brain,
  Clock,
  Users,
  Hash,
  Tag,
  Smile,
  TrendingUp,
  FileText,
  Send,
  Activity,
  MessageCircle,
  Calendar,
  Search,
  Award,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';

export interface NavbarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
  { label: 'Drafts', icon: PenTool, route: '/drafts' },
  { label: 'Insights', icon: Brain, route: '/insights' },
  { label: 'Timeline', icon: Clock, route: '/timeline' },
  { label: 'Creators', icon: Users, route: '/creators' },
  { label: 'Hashtags', icon: Hash, route: '/hashtags' },
  { label: 'Topics', icon: Tag, route: '/topics' },
  { label: 'Sentiment', icon: Smile, route: '/sentiment' },
  { label: 'Forecasting', icon: TrendingUp, route: '/forecasting' },
  { label: 'Reports', icon: FileText, route: '/reports' },
  { label: 'Publish', icon: Send, route: '/publish' },
  { label: 'Command', icon: Activity, route: '/command' },
  { label: 'Replies', icon: MessageCircle, route: '/replies' },
  { label: 'Weekly', icon: Calendar, route: '/weekly' },
  { label: 'Autopsy', icon: Search, route: '/autopsy' },
  { label: 'Scorecard', icon: Award, route: '/scorecard' },
];

const bottomItems = [
  { label: 'Settings', icon: Settings, route: '/settings' },
];

export default function Navbar({ collapsed = false, onToggleCollapse }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (route: string) => {
    return location.pathname === route || location.pathname === `${route}/`;
  };

  return (
    <nav
      className={cn(
        'flex flex-col h-screen bg-[#1A1D2E] border-r border-[rgba(255,255,255,0.08)] transition-all duration-300 z-30',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 h-14 px-4 border-b border-[rgba(255,255,255,0.08)] flex-shrink-0">
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-[#4E8DFF]" />
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-[#E0E4F0] text-lg tracking-tight whitespace-nowrap overflow-hidden">
            Signal <span className="text-[#4E8DFF]">OS</span>
          </span>
        )}
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.route);

          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={cn(
                'nav-item w-full text-left relative',
                active && 'active'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Items */}
      <div className="py-3 px-2 border-t border-[rgba(255,255,255,0.08)] space-y-0.5 flex-shrink-0">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.route);

          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={cn(
                'nav-item w-full text-left relative',
                active && 'active'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </button>
          );
        })}

        {/* Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="nav-item w-full text-left mt-2"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? (
            <ChevronRight className="w-[18px] h-[18px] flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="truncate">Collapse</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
