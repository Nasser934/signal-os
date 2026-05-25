// Nango Context — X (Twitter) Integration for Signal OS
// Provides managed OAuth, data sync, and publish via Nango proxy

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ── Types ──────────────────────────────────────────────────────────

export interface NangoConnection {
  id: string;
  providerConfigKey: string; // e.g. 'twitter'
  connectionId: string;      // user-specific connection id
  credentials: {
    access_token: string;
    refresh_token?: string;
    expires_at?: string;
  };
  userProfile: XUserProfile | null;
  connectedAt: string;
}

export interface XUserProfile {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
  description: string;
  followers_count: number;
  following_count: number;
  tweet_count: number;
  verified: boolean;
}

export interface XPost {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
    impression_count: number;
  };
  score?: number;
}

export interface NangoContextValue {
  // Connection state
  connection: NangoConnection | null;
  isConnecting: boolean;
  connectError: string | null;

  // Actions
  connectX: () => void;
  disconnectX: () => void;

  // Data
  xPosts: XPost[];
  xProfile: XUserProfile | null;
  isLoadingPosts: boolean;
  isLoadingProfile: boolean;

  // Data actions
  syncPosts: () => Promise<void>;
  syncProfile: () => Promise<void>;

  // Publish
  publishToX: (text: string) => Promise<{ success: boolean; postId?: string; error?: string }>;
  isPublishing: boolean;

  // Nango status
  nangoReady: boolean;
}

// ── Simulated Nango SDK ────────────────────────────────────────────
// (In production, replace with actual @nangohq/frontend SDK calls)

const NANGO_STORAGE_KEY = 'sos_nango_connection';
const X_POSTS_STORAGE_KEY = 'sos_x_posts';
const X_PROFILE_STORAGE_KEY = 'sos_x_profile';

// ── Context ────────────────────────────────────────────────────────

const NangoContext = createContext<NangoContextValue | null>(null);

export function useNango(): NangoContextValue {
  const ctx = useContext(NangoContext);
  if (!ctx) throw new Error('useNango must be used within NangoProvider');
  return ctx;
}

// ── Provider ───────────────────────────────────────────────────────

export function NangoProvider({ children }: { children: React.ReactNode }) {
  const [connection, setConnection] = useState<NangoConnection | null>(() => {
    try {
      const raw = localStorage.getItem(NANGO_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [xPosts, setXPosts] = useState<XPost[]>(() => {
    try {
      const raw = localStorage.getItem(X_POSTS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [xProfile, setXProfile] = useState<XUserProfile | null>(() => {
    try {
      const raw = localStorage.getItem(X_PROFILE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [nangoReady] = useState(true);

  // Persist connection changes
  useEffect(() => {
    if (connection) {
      localStorage.setItem(NANGO_STORAGE_KEY, JSON.stringify(connection));
    } else {
      localStorage.removeItem(NANGO_STORAGE_KEY);
    }
  }, [connection]);

  useEffect(() => {
    localStorage.setItem(X_POSTS_STORAGE_KEY, JSON.stringify(xPosts));
  }, [xPosts]);

  useEffect(() => {
    if (xProfile) {
      localStorage.setItem(X_PROFILE_STORAGE_KEY, JSON.stringify(xProfile));
    } else {
      localStorage.removeItem(X_PROFILE_STORAGE_KEY);
    }
  }, [xProfile]);

  // ── Connect X via Nango ─────────────────────────────────────────
  const connectX = useCallback(() => {
    setIsConnecting(true);
    setConnectError(null);

    // Simulate Nango OAuth flow
    // In production: nango.openConnectUI({ onEvent: (e) => { ... } })
    setTimeout(() => {
      try {
        const mockConnection: NangoConnection = {
          id: `conn_${Date.now()}`,
          providerConfigKey: 'twitter',
          connectionId: `user_${Math.random().toString(36).slice(2, 10)}`,
          credentials: {
            access_token: `mock_access_${Math.random().toString(36).slice(2)}`,
            refresh_token: `mock_refresh_${Math.random().toString(36).slice(2)}`,
            expires_at: new Date(Date.now() + 7200 * 1000).toISOString(),
          },
          userProfile: null,
          connectedAt: new Date().toISOString(),
        };

        setConnection(mockConnection);

        // Auto-sync profile after connection
        const mockProfile: XUserProfile = {
          id: `u_${Math.random().toString(36).slice(2, 8)}`,
          name: 'Signal OS User',
          username: `@signaluser_${Math.random().toString(36).slice(2, 6)}`,
          profile_image_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
          description: 'Content creator powered by Signal OS AI intelligence.',
          followers_count: 12540,
          following_count: 892,
          tweet_count: 3420,
          verified: true,
        };

        setXProfile(mockProfile);
        setIsConnecting(false);
      } catch (err) {
        setConnectError(err instanceof Error ? err.message : 'Connection failed');
        setIsConnecting(false);
      }
    }, 2500);
  }, []);

  // ── Disconnect X ────────────────────────────────────────────────
  const disconnectX = useCallback(() => {
    setConnection(null);
    setXProfile(null);
    setXPosts([]);
    localStorage.removeItem(NANGO_STORAGE_KEY);
    localStorage.removeItem(X_POSTS_STORAGE_KEY);
    localStorage.removeItem(X_PROFILE_STORAGE_KEY);

    // Update Signal OS settings
    try {
      const raw = localStorage.getItem('sos_settings');
      if (raw) {
        const settings = JSON.parse(raw);
        settings.connectedAccounts = { ...settings.connectedAccounts, twitter: false };
        localStorage.setItem('sos_settings', JSON.stringify(settings));
      }
    } catch { /* silent */ }
  }, []);

  // ── Sync Posts from X via Nango Proxy ───────────────────────────
  const syncPosts = useCallback(async () => {
    if (!connection) return;
    setIsLoadingPosts(true);

    // Simulate Nango proxy request:
    // const res = await nango.get({
    //   endpoint: '/2/users/me/tweets',
    //   providerConfigKey: 'twitter',
    //   connectionId: connection.connectionId,
    //   params: { max_results: '20', 'tweet.fields': 'public_metrics,created_at' }
    // });

    setTimeout(() => {
      const newPosts: XPost[] = Array.from({ length: 8 }, (_, i) => ({
        id: `xp_${Date.now()}_${i}`,
        text: [
          'Just scored my latest draft at 92/100. Hook quality and emotional pull are through the roof. Signal OS is game-changing for content creators.',
          'The data doesn\'t lie: posts with strong opening hooks get 3.4x more engagement. Thread on the science of attention-grabbing content.',
          'Been A/B testing my content strategy for 30 days. The posts that scored 85+ consistently outperformed by 200%. Quality scoring works.',
          'Creator tip: Don\'t just write what you think is good. Use AI scoring to validate before you hit publish. Saved me from so many flops.',
          'My weekly Signal OS report shows a 47% engagement increase this month. The trend forecasting feature helped me ride 3 viral waves.',
          'The biggest insight from my content autopsy: timing matters more than I thought. Publishing at 9am vs 3pm = 2.1x difference.',
          'Just discovered my top-performing content type: contrarian takes on industry trends. 87 avg score vs 72 for my other content.',
          'Signal OS sentiment analysis revealed my audience responds best to slightly controversial takes. Engagement up 34% since I leaned into it.',
        ][i],
        created_at: new Date(Date.now() - i * 86400000 * (1 + Math.floor(Math.random() * 3))).toISOString(),
        public_metrics: {
          retweet_count: Math.floor(Math.random() * 500) + 50,
          reply_count: Math.floor(Math.random() * 200) + 20,
          like_count: Math.floor(Math.random() * 2000) + 200,
          quote_count: Math.floor(Math.random() * 100) + 10,
          impression_count: Math.floor(Math.random() * 50000) + 5000,
        },
        score: Math.floor(Math.random() * 20) + 78,
      }));

      setXPosts(prev => {
        const combined = [...newPosts, ...prev];
        const unique = Array.from(new Map(combined.map(p => [p.id, p])).values());
        return unique.slice(0, 50);
      });
      setIsLoadingPosts(false);
    }, 1500);
  }, [connection]);

  // ── Sync Profile via Nango ──────────────────────────────────────
  const syncProfile = useCallback(async () => {
    if (!connection) return;
    setIsLoadingProfile(true);

    setTimeout(() => {
      setXProfile(prev => prev ? {
        ...prev,
        followers_count: prev.followers_count + Math.floor(Math.random() * 50),
        tweet_count: prev.tweet_count + 1,
      } : null);
      setIsLoadingProfile(false);
    }, 1000);
  }, [connection]);

  // ── Publish to X via Nango Proxy ────────────────────────────────
  const publishToX = useCallback(async (text: string): Promise<{ success: boolean; postId?: string; error?: string }> => {
    if (!connection) {
      return { success: false, error: 'No X connection. Connect your account via Nango first.' };
    }
    setIsPublishing(true);

    // Simulate Nango proxy POST:
    // await nango.post({
    //   endpoint: '/2/tweets',
    //   providerConfigKey: 'twitter',
    //   connectionId: connection.connectionId,
    //   data: { text }
    // });

    return new Promise(resolve => {
      setTimeout(() => {
        const postId = `tx_${Date.now()}`;
        const newPost: XPost = {
          id: postId,
          text,
          created_at: new Date().toISOString(),
          public_metrics: { retweet_count: 0, reply_count: 0, like_count: 0, quote_count: 0, impression_count: 0 },
        };

        setXPosts(prev => [newPost, ...prev]);

        // Update profile tweet count
        setXProfile(prev => prev ? { ...prev, tweet_count: prev.tweet_count + 1 } : null);

        setIsPublishing(false);
        resolve({ success: true, postId });
      }, 2000);
    });
  }, [connection]);

  // Auto-sync posts when connection is established
  useEffect(() => {
    if (connection && xPosts.length === 0) {
      syncPosts();
      syncProfile();
    }
  }, [connection, xPosts.length, syncPosts, syncProfile]);

  const value: NangoContextValue = {
    connection,
    isConnecting,
    connectError,
    connectX,
    disconnectX,
    xPosts,
    xProfile,
    isLoadingPosts,
    isLoadingProfile,
    syncPosts,
    syncProfile,
    publishToX,
    isPublishing,
    nangoReady,
  };

  return <NangoContext.Provider value={value}>{children}</NangoContext.Provider>;
}
