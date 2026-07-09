import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Bell, Zap } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import NangoConnect from './NangoConnect';

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#0B0E1A] overflow-hidden">
      <Navbar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-[rgba(255,255,255,0.06)] bg-[#0B0E1A]/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#5A6480] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-white/[0.03] border border-[rgba(255,255,255,0.08)] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#E0E4F0] outline-none focus:border-[#4E8DFF] w-[200px] placeholder:text-[#5A6480]"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NangoConnect variant="minimal" />
            <button className="relative p-2 rounded-lg hover:bg-white/5 text-[#8B95B8] transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#FF6B6B] rounded-full" />
            </button>
            <div className="w-7 h-7 rounded-full bg-[#4E8DFF]/20 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-[#4E8DFF]" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
