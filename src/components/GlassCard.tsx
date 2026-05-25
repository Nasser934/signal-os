import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
  glowColor?: 'blue' | 'amber' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, hover = true, glow = false, glowColor = 'blue', padding = 'md', ...props }, ref) => {
    const paddingMap = {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-xl backdrop-blur-xl',
          'bg-[rgba(26,29,46,0.7)]',
          'border border-[rgba(78,141,255,0.15)]',
          'shadow-[inset_0_1px_1px_rgba(78,141,255,0.08),0_4px_24px_rgba(0,0,0,0.2)]',
          paddingMap[padding],
          hover && 'transition-all duration-300 ease-out',
          hover && 'hover:border-[rgba(78,141,255,0.25)] hover:shadow-[inset_0_1px_1px_rgba(78,141,255,0.12),0_8px_32px_rgba(0,0,0,0.3)]',
          glow && glowColor === 'blue' && 'before:absolute before:inset-0 before:rounded-xl before:bg-[radial-gradient(circle_at_center,rgba(78,141,255,0.08),transparent_70%)] before:-z-10',
          glow && glowColor === 'amber' && 'before:absolute before:inset-0 before:rounded-xl before:bg-[radial-gradient(circle_at_center,rgba(255,179,71,0.08),transparent_70%)] before:-z-10',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;
