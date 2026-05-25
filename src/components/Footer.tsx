import { Zap } from 'lucide-react';

export interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={className}>
      <div className="flex items-center justify-between py-4 px-6 border-t border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#4E8DFF]" />
          <span className="text-xs text-[#5A6480]">
            Signal <span className="text-[#4E8DFF]">OS</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#5A6480]">
            AI-Powered Attention Intelligence
          </span>
          <span className="text-xs text-[#5A6480]">
            All processing happens in your browser
          </span>
        </div>
      </div>
    </footer>
  );
}
