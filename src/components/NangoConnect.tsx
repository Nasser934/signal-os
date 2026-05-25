// Nango Connect — X (Twitter) OAuth Component
// Embeds Nango-powered auth flow for connecting X accounts

import { useNango } from '@/lib/nangoContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Plug,
  Unplug,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Twitter,
  ExternalLink,
  Shield,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NangoConnectProps {
  variant?: 'button' | 'card' | 'minimal';
  showSync?: boolean;
}

export default function NangoConnect({ variant = 'button', showSync = false }: NangoConnectProps) {
  const {
    connection,
    isConnecting,
    connectError,
    connectX,
    disconnectX,
    syncPosts,
    syncProfile,
    isLoadingPosts,
    xProfile,
  } = useNango();

  // ── Minimal variant (icon button in navbar/header) ──────────────
  if (variant === 'minimal') {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={connection ? disconnectX : connectX}
              disabled={isConnecting}
              className={`relative p-2 rounded-lg transition-all duration-200 ${
                connection
                  ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-white/5 text-[#8B95B8] hover:bg-[#4E8DFF]/10 hover:text-[#4E8DFF]'
              }`}
            >
              {isConnecting ? (
                <Spinner className="w-[18px] h-[18px]" />
              ) : connection ? (
                <Plug className="w-[18px] h-[18px]" />
              ) : (
                <Unplug className="w-[18px] h-[18px]" />
              )}
              {connection && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-[#1E2135] border-[rgba(255,255,255,0.08)] text-[#E0E4F0]">
            <p>{connection ? 'X connected via Nango' : 'Connect X via Nango'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // ── Card variant (dashboard/settings panels) ────────────────────
  if (variant === 'card') {
    return (
      <div className="relative overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1D2E]/80 p-5">
        {/* Background glow */}
        {connection && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
        )}

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                connection
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-[#4E8DFF]/10 text-[#4E8DFF]'
              }`}
            >
              <Twitter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[#E0E4F0] font-semibold text-sm">X (Twitter)</h3>
              <div className="flex items-center gap-2 mt-0.5">
                {connection ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 text-xs font-medium">Connected via Nango</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5A6480]" />
                    <span className="text-[#5A6480] text-xs">Not connected</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {connection && showSync && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  syncPosts();
                  syncProfile();
                }}
                disabled={isLoadingPosts}
                className="h-8 px-3 text-xs border-[rgba(255,255,255,0.08)] bg-transparent text-[#8B95B8] hover:text-[#E0E4F0] hover:bg-white/5"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoadingPosts ? 'animate-spin' : ''}`} />
                Sync
              </Button>
            )}

            <Button
              size="sm"
              onClick={connection ? disconnectX : connectX}
              disabled={isConnecting}
              className={`h-8 px-4 text-xs font-medium ${
                connection
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                  : 'bg-[#4E8DFF] hover:bg-[#3A7AEE] text-white'
              }`}
            >
              {isConnecting ? (
                <span className="flex items-center gap-1.5">
                  <Spinner className="w-3.5 h-3.5" />
                  Connecting...
                </span>
              ) : connection ? (
                <span className="flex items-center gap-1.5">
                  <Unplug className="w-3.5 h-3.5" />
                  Disconnect
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Plug className="w-3.5 h-3.5" />
                  Connect
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Error message */}
        <AnimatePresence>
          {connectError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 flex items-center gap-2 text-red-400 text-xs bg-red-500/10 rounded-lg px-3 py-2"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {connectError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connected profile info */}
        <AnimatePresence>
          {connection && xProfile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]"
            >
              <div className="flex items-center gap-3">
                <img
                  src={xProfile.profile_image_url}
                  alt={xProfile.name}
                  className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.08)]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[#E0E4F0] text-sm font-medium truncate">{xProfile.name}</p>
                  <p className="text-[#5A6480] text-xs truncate">{xProfile.username}</p>
                </div>
                {xProfile.verified && (
                  <Badge className="bg-[#4E8DFF]/15 text-[#4E8DFF] border-0 text-[10px] px-2 py-0.5">
                    Verified
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center p-2 rounded-lg bg-white/[0.03]">
                  <p className="text-[#E0E4F0] font-semibold text-sm">{xProfile.followers_count.toLocaleString()}</p>
                  <p className="text-[#5A6480] text-[10px] mt-0.5">Followers</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/[0.03]">
                  <p className="text-[#E0E4F0] font-semibold text-sm">{xProfile.following_count.toLocaleString()}</p>
                  <p className="text-[#5A6480] text-[10px] mt-0.5">Following</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/[0.03]">
                  <p className="text-[#E0E4F0] font-semibold text-sm">{xProfile.tweet_count.toLocaleString()}</p>
                  <p className="text-[#5A6480] text-[10px] mt-0.5">Posts</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-[10px] text-[#5A6480]">
                <Shield className="w-3 h-3" />
                <span>Secured by Nango OAuth</span>
                <span className="mx-1">|</span>
                <Zap className="w-3 h-3" />
                <span>Auto-refresh enabled</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── Button variant (default) ────────────────────────────────────
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={connection ? 'outline' : 'default'}
          size="sm"
          className={`h-9 px-4 ${
            connection
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300'
              : 'bg-[#4E8DFF] hover:bg-[#3A7AEE] text-white'
          }`}
        >
          {connection ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              X Connected
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Twitter className="w-4 h-4" />
              Connect X
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#1A1D2E] border-[rgba(255,255,255,0.08)] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#E0E4F0] flex items-center gap-2">
            <Twitter className="w-5 h-5 text-[#4E8DFF]" />
            {connection ? 'X Account Connected' : 'Connect X (Twitter)'}
          </DialogTitle>
          <DialogDescription className="text-[#5A6480]">
            {connection
              ? 'Your X account is connected via Nango. You can sync posts and publish content.'
              : 'Connect your X account through Nango to enable content sync, analytics, and publishing.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Nango branding */}
          {!connection && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#4E8DFF]/5 border border-[#4E8DFF]/10">
              <Shield className="w-5 h-5 text-[#4E8DFF] flex-shrink-0" />
              <div>
                <p className="text-[#E0E4F0] text-xs font-medium">Powered by Nango</p>
                <p className="text-[#5A6480] text-[11px] mt-0.5">Secure OAuth with auto token refresh and proxy requests</p>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="space-y-2">
            {[
              { icon: RefreshCw, label: 'Sync your posts for AI scoring', active: connection },
              { icon: Zap, label: 'Publish scored drafts directly to X', active: connection },
              { icon: ExternalLink, label: 'Pull engagement analytics', active: connection },
            ].map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className={`flex items-center gap-2.5 text-xs ${active ? 'text-[#E0E4F0]' : 'text-[#5A6480]'}`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-400' : 'text-[#5A6480]'}`} />
                {label}
                {active && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto" />}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              className={`flex-1 ${
                connection
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                  : 'bg-[#4E8DFF] hover:bg-[#3A7AEE] text-white'
              }`}
              onClick={connection ? disconnectX : connectX}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <span className="flex items-center gap-2">
                  <Spinner className="w-4 h-4" />
                  Connecting via Nango...
                </span>
              ) : connection ? (
                <span className="flex items-center gap-2">
                  <Unplug className="w-4 h-4" />
                  Disconnect
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Plug className="w-4 h-4" />
                  Connect via Nango
                </span>
              )}
            </Button>
          </div>

          {connectError && (
            <p className="text-red-400 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {connectError}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
