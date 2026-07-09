import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface NangoConnection {
  provider: string;
  connectionId: string;
  createdAt: string;
}

export interface XUserProfile {
  id: string;
  username: string;
  displayName: string;
  followersCount: number;
  followingCount: number;
  tweetCount: number;
  avatar?: string;
}

export interface XPost {
  id: string;
  text: string;
  createdAt: string;
  likeCount: number;
  retweetCount: number;
  replyCount: number;
  quoteCount: number;
  impressionCount: number;
  aiScore?: number;
}

interface NangoState {
  connection: NangoConnection | null;
  profile: XUserProfile | null;
  posts: XPost[];
  isConnecting: boolean;
  isSyncing: boolean;
  isPublishing: boolean;
  connectX: () => Promise<void>;
  disconnectX: () => void;
  syncPosts: () => Promise<void>;
  syncProfile: () => Promise<void>;
  publishToX: (text: string) => Promise<{ success: boolean; url?: string }>;
}

const NangoContext = createContext<NangoState | null>(null);

const STORAGE_KEY = 'signal-os-nango';
const POSTS_KEY = 'signal-os-x-posts';
const PROFILE_KEY = 'signal-os-x-profile';

const loadFromStorage = <T,>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const mockPosts: XPost[] = [
  { id: '1', text: 'The biggest myth in content creation is that consistency beats quality. The truth? Both matter, but quality is the multiplier.', createdAt: '2026-07-08T09:30:00Z', likeCount: 342, retweetCount: 89, replyCount: 45, quoteCount: 12, impressionCount: 15420, aiScore: 92 },
  { id: '2', text: 'Here is why most AI tools fail for creators (and what actually works)', createdAt: '2026-07-07T14:15:00Z', likeCount: 518, retweetCount: 134, replyCount: 67, quoteCount: 23, impressionCount: 28900, aiScore: 88 },
  { id: '3', text: 'I analyzed 10,000 viral posts. Here are the 7 patterns they all share:', createdAt: '2026-07-06T10:00:00Z', likeCount: 891, retweetCount: 245, replyCount: 112, quoteCount: 45, impressionCount: 45600, aiScore: 85 },
  { id: '4', text: 'The thread format that consistently gets 10x engagement', createdAt: '2026-07-05T16:45:00Z', likeCount: 267, retweetCount: 78, replyCount: 34, quoteCount: 8, impressionCount: 12300, aiScore: 81 },
  { id: '5', text: '3 storytelling frameworks every creator should master:', createdAt: '2026-07-04T11:20:00Z', likeCount: 445, retweetCount: 156, replyCount: 89, quoteCount: 31, impressionCount: 22100, aiScore: 79 },
  { id: '6', text: 'Stop writing hooks like this. A data-driven breakdown:', createdAt: '2026-07-03T08:00:00Z', likeCount: 198, retweetCount: 45, replyCount: 23, quoteCount: 5, impressionCount: 8900, aiScore: 76 },
  { id: '7', text: 'Unpopular opinion: Engagement pods are hurting your reach.', createdAt: '2026-07-02T19:30:00Z', likeCount: 623, retweetCount: 198, replyCount: 156, quoteCount: 67, impressionCount: 31200, aiScore: 90 },
  { id: '8', text: 'The single biggest mistake I see creators make every day:', createdAt: '2026-07-01T12:00:00Z', likeCount: 412, retweetCount: 123, replyCount: 78, quoteCount: 29, impressionCount: 18700, aiScore: 86 },
];

const mockProfile: XUserProfile = {
  id: 'mock-user',
  username: '@signaluser',
  displayName: 'Signal User',
  followersCount: 12500,
  followingCount: 450,
  tweetCount: 892,
};

export function NangoProvider({ children }: { children: ReactNode }) {
  const [connection, setConnection] = useState<NangoConnection | null>(
    () => loadFromStorage<NangoConnection>(STORAGE_KEY)
  );
  const [profile, setProfile] = useState<XUserProfile | null>(
    () => loadFromStorage<XUserProfile>(PROFILE_KEY)
  );
  const [posts, setPosts] = useState<XPost[]>(
    () => loadFromStorage<XPost[]>(POSTS_KEY) || []
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const connectX = useCallback(async () => {
    setIsConnecting(true);
    await new Promise((r) => setTimeout(r, 2000));
    const conn: NangoConnection = {
      provider: 'twitter',
      connectionId: 'conn_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setConnection(conn);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conn));
    setProfile(mockProfile);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(mockProfile));
    setPosts(mockPosts);
    localStorage.setItem(POSTS_KEY, JSON.stringify(mockPosts));
    setIsConnecting(false);
  }, []);

  const disconnectX = useCallback(() => {
    setConnection(null);
    setProfile(null);
    setPosts([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(POSTS_KEY);
    localStorage.removeItem(PROFILE_KEY);
  }, []);

  const syncPosts = useCallback(async () => {
    if (!connection) return;
    setIsSyncing(true);
    await new Promise((r) => setTimeout(r, 1500));
    const updated = mockPosts.map((p) => ({
      ...p,
      likeCount: p.likeCount + Math.floor(Math.random() * 20),
      impressionCount: p.impressionCount + Math.floor(Math.random() * 500),
    }));
    setPosts(updated);
    localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
    setIsSyncing(false);
  }, [connection]);

  const syncProfile = useCallback(async () => {
    if (!connection) return;
    setIsSyncing(true);
    await new Promise((r) => setTimeout(r, 1000));
    const updated = {
      ...mockProfile,
      followersCount: mockProfile.followersCount + Math.floor(Math.random() * 100),
    };
    setProfile(updated);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    setIsSyncing(false);
  }, [connection]);

  const publishToX = useCallback(
    async (text: string) => {
      if (!connection) return { success: false };
      setIsPublishing(true);
      await new Promise((r) => setTimeout(r, 2000));
      const newPost: XPost = {
        id: `new_${Date.now()}`,
        text,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        retweetCount: 0,
        replyCount: 0,
        quoteCount: 0,
        impressionCount: 0,
      };
      setPosts((prev) => [newPost, ...prev]);
      localStorage.setItem(POSTS_KEY, JSON.stringify([newPost, ...posts]));
      setIsPublishing(false);
      return { success: true, url: `https://x.com/signaluser/status/${newPost.id}` };
    },
    [connection, posts]
  );

  return (
    <NangoContext.Provider
      value={{
        connection,
        profile,
        posts,
        isConnecting,
        isSyncing,
        isPublishing,
        connectX,
        disconnectX,
        syncPosts,
        syncProfile,
        publishToX,
      }}
    >
      {children}
    </NangoContext.Provider>
  );
}

export function useNango() {
  const ctx = useContext(NangoContext);
  if (!ctx) throw new Error('useNango must be used within NangoProvider');
  return ctx;
}
