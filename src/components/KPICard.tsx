import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import GlassCard from './GlassCard';
import Sparkline from './Sparkline';

export interface KPICardProps {
  title: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  delta?: number;
  deltaLabel?: string;
  sparklineData?: number[];
  sparklineColor?: string;
  icon?: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export default function KPICard({
  title,
  value,
  prefix = '',
  suffix = '',
  delta,
  deltaLabel = 'vs last period',
  sparklineData,
  sparklineColor = '#4E8DFF',
  icon,
  className,
  glow = true,
  onClick,
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  const isNumeric = !isNaN(numericValue);
  const countRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const duration = 1000;

  useEffect(() => {
    if (!isNumeric) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      countRef.current = eased * numericValue;
      setDisplayValue(Math.round(countRef.current * 10) / 10);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      startTimeRef.current = 0;
    };
  }, [numericValue, isNumeric]);

  const formatValue = (v: number) => {
    if (v >= 1000000) return `${prefix}${(v / 1000000).toFixed(1)}M${suffix}`;
    if (v >= 1000) return `${prefix}${(v / 1000).toFixed(1)}K${suffix}`;
    return `${prefix}${v}${suffix}`;
  };

  return (
    <GlassCard
      className={cn('metric-card cursor-default', onClick && 'cursor-pointer', className)}
      glow={glow}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {icon && (
              <div className="text-[#8B95B8]">{icon}</div>
            )}
            <span className="text-xs font-medium text-[#5A6480] uppercase tracking-wider font-sans">
              {title}
            </span>
          </div>
          <div className="text-2xl font-bold font-data text-[#E0E4F0] letterpress tracking-tight">
            {isNumeric ? formatValue(displayValue) : `${prefix}${value}${suffix}`}
          </div>
          {delta !== undefined && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span
                className={cn(
                  'inline-flex items-center text-xs font-semibold font-data px-1.5 py-0.5 rounded',
                  delta >= 0
                    ? 'text-[#22C55E] bg-[rgba(34,197,94,0.12)]'
                    : 'text-[#FF4444] bg-[rgba(255,68,68,0.12)]'
                )}
              >
                {delta >= 0 ? '+' : ''}{delta}%
              </span>
              <span className="text-xs text-[#5A6480]">{deltaLabel}</span>
            </div>
          )}
        </div>
        {sparklineData && (
          <div className="ml-3 flex-shrink-0">
            <Sparkline
              data={sparklineData}
              width={80}
              height={32}
              color={sparklineColor}
            />
          </div>
        )}
      </div>
    </GlassCard>
  );
}
