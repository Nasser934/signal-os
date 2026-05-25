import { cn } from '@/lib/utils';

export interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export type ScoreVerdict = 'excellent' | 'good' | 'fair' | 'poor';

export function getVerdict(score: number): ScoreVerdict {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

export function getVerdictLabel(score: number): string {
  const v = getVerdict(score);
  return v.charAt(0).toUpperCase() + v.slice(1);
}

const sizeMap = {
  sm: 'text-[0.65rem] px-1.5 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
};

export default function ScoreBadge({ score, size = 'md', showLabel = true, className }: ScoreBadgeProps) {
  const verdict = getVerdict(score);

  const verdictStyles: Record<ScoreVerdict, string> = {
    excellent: 'text-[#22C55E] bg-[rgba(34,197,94,0.12)] border-[rgba(34,197,94,0.25)]',
    good: 'text-[#00C8FF] bg-[rgba(0,200,255,0.12)] border-[rgba(0,200,255,0.25)]',
    fair: 'text-[#FFB347] bg-[rgba(255,179,71,0.12)] border-[rgba(255,179,71,0.25)]',
    poor: 'text-[#FF4444] bg-[rgba(255,68,68,0.12)] border-[rgba(255,68,68,0.25)]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-mono font-bold rounded-md border',
        sizeMap[size],
        verdictStyles[verdict],
        className
      )}
    >
      <span>{score}</span>
      {showLabel && (
        <span className="opacity-75">{getVerdictLabel(score)}</span>
      )}
    </span>
  );
}
