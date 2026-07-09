import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Unlink, RefreshCw, Twitter, CheckCircle2 } from 'lucide-react';
import { useNango } from '@/lib/nangoContext';

interface Props {
  variant?: 'minimal' | 'card' | 'button';
  showSync?: boolean;
}

export default function NangoConnect({ variant = 'button', showSync = false }: Props) {
  const { connection, profile, isConnecting, isSyncing, connectX, disconnectX, syncPosts, syncProfile } = useNango();
  const [showConfirm, setShowConfirm] = useState(false);

  if (variant === 'minimal') {
    return (
      <button
        onClick={connection ? disconnectX : connectX}
        disabled={isConnecting}
        className={`relative p-2 rounded-lg transition-all ${
          connection ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-[#8B95B8] hover:bg-white/5'
        }`}
        title={connection ? `Connected as ${profile?.displayName || 'X User'}` : 'Connect X Account'}
      >
        <Twitter className="w-4 h-4" />
        {connection && (
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
        )}
      </button>
    );
  }

  if (variant === 'card') {
    return (
      <div className="glass-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            connection ? 'bg-emerald-500/10' : 'bg-[#4E8DFF]/10'
          }`}>
            <Twitter className={`w-5 h-5 ${connection ? 'text-emerald-400' : 'text-[#4E8DFF]'}`} />
          </div>
          <div>
            <p className="text-[#E0E4F0] text-sm font-medium">
              {connection ? (profile?.displayName || 'X Connected') : 'X (Twitter)'}
            </p>
            <p className="text-[#5A6480] text-xs">
              {connection ? (profile ? `@${profile.username.replace('@', '')} · ${profile.followersCount.toLocaleString()} followers` : 'Account connected') : 'Not connected'}
            </p>
          </div>
          {connection && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto flex-shrink-0" />
          )}
        </div>

        {connection && profile && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center p-2 rounded-lg bg-white/[0.02]">
              <p className="text-[#E0E4F0] text-sm font-bold">{profile.followersCount.toLocaleString()}</p>
              <p className="text-[#5A6480] text-[10px]">Followers</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/[0.02]">
              <p className="text-[#E0E4F0] text-sm font-bold">{profile.followingCount}</p>
              <p className="text-[#5A6480] text-[10px]">Following</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/[0.02]">
              <p className="text-[#E0E4F0] text-sm font-bold">{profile.tweetCount}</p>
              <p className="text-[#5A6480] text-[10px]">Posts</p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {connection ? (
            <>
              {showSync && (
                <button
                  onClick={() => { syncPosts(); syncProfile(); }}
                  disabled={isSyncing}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-[rgba(255,255,255,0.08)] text-[#E0E4F0] text-xs hover:bg-white/5 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync'}
                </button>
              )}
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-all"
              >
                <Unlink className="w-3.5 h-3.5" />
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={connectX}
              disabled={isConnecting}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#4E8DFF] text-white text-xs hover:bg-[#3A7AEE] transition-all disabled:opacity-50"
            >
              <Link2 className="w-3.5 h-3.5" />
              {isConnecting ? 'Connecting...' : 'Connect X Account'}
            </button>
          )}
        </div>

        <AnimatePresence>
          {showConfirm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10"
            >
              <p className="text-red-400 text-xs mb-2">Disconnect your X account?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { disconnectX(); setShowConfirm(false); }}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-all"
                >
                  Yes, disconnect
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-[#8B95B8] text-xs hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // button variant
  return (
    <button
      onClick={connection ? disconnectX : connectX}
      disabled={isConnecting}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        connection
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
          : 'bg-[#4E8DFF]/10 text-[#4E8DFF] border border-[#4E8DFF]/20 hover:bg-[#4E8DFF]/20'
      } disabled:opacity-50`}
    >
      {connection ? <Unlink className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
      {isConnecting ? '...' : connection ? 'Connected' : 'Connect X'}
    </button>
  );
}
