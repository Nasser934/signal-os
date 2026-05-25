import { useLocation } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import { Construction } from 'lucide-react';

export default function StubPage() {
  const location = useLocation();
  const pageName = location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <GlassCard className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-[rgba(78,141,255,0.1)] flex items-center justify-center mx-auto mb-4">
          <Construction className="w-8 h-8 text-[#4E8DFF]" />
        </div>
        <h2 className="font-display font-bold text-xl text-[#E0E4F0] mb-2">
          {pageName}
        </h2>
        <p className="text-[#8B95B8] text-sm">
          This page is coming soon. The full implementation will be available in the next update.
        </p>
      </GlassCard>
    </div>
  );
}
