// LocalStorage CRUD Store for Signal OS
// Provides type-safe storage operations for all entities

export interface Draft {
  id: string;
  content: string;
  scores: Record<string, number> | null;
  overallScore: number | null;
  verdict: string | null;
  suggestions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  content: string;
  author: string;
  handle: string;
  avatar: string;
  likes: number;
  replies: number;
  reposts: number;
  impressions: number;
  engagement: number;
  sentiment: string;
  score: number;
  topics: string[];
  hashtags: string[];
  createdAt: string;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  engagement: number;
  qualityScore: number;
  niche: string;
  verified: boolean;
}

export interface Reply {
  id: string;
  postId: string;
  content: string;
  author: string;
  handle: string;
  score: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'weekly' | 'monthly' | 'custom';
  status: 'draft' | 'scheduled' | 'generated' | 'sent';
  dateRange: { start: string; end: string };
  metrics: Record<string, number>;
  createdAt: string;
}

export interface Checkpoint {
  id: string;
  label: string;
  description: string;
  score: number;
  maxScore: number;
  category: string;
  checked: boolean;
}

export interface Settings {
  theme: 'dark';
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  animations: boolean;
  soundEffects: boolean;
  autoSave: boolean;
  scoringWeights: {
    hook: number;
    readability: number;
    engagement: number;
    sentiment: number;
    structure: number;
  };
  notifications: {
    email: boolean;
    browser: boolean;
    weekly: boolean;
    mentions: boolean;
  };
  connectedAccounts: {
    twitter: boolean;
    linkedin: boolean;
    threads: boolean;
  };
}

export interface ScoreEntry {
  id: string;
  type: 'draft' | 'post';
  score: number;
  dimensions: Record<string, number>;
  createdAt: string;
}

const defaults = {
  drafts: [] as Draft[],
  posts: [] as Post[],
  accounts: [] as Creator[],
  replies: [] as Reply[],
  reports: [] as Report[],
  checkpoints: [] as Checkpoint[],
  settings: {
    theme: 'dark' as const,
    fontSize: 'medium',
    compactMode: false,
    animations: true,
    soundEffects: false,
    autoSave: true,
    scoringWeights: {
      hook: 1.0,
      readability: 1.0,
      engagement: 1.0,
      sentiment: 1.0,
      structure: 1.0,
    },
    notifications: {
      email: true,
      browser: true,
      weekly: true,
      mentions: true,
    },
    connectedAccounts: {
      twitter: false,
      linkedin: false,
      threads: false,
    },
  } as Settings,
  scoreHistory: [] as ScoreEntry[],
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`sos_${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(`sos_${key}`, JSON.stringify(value));
}

// Drafts
export const draftsStore = {
  getAll: (): Draft[] => getItem('drafts', defaults.drafts),
  getById: (id: string): Draft | undefined => draftsStore.getAll().find(d => d.id === id),
  save: (draft: Draft): void => {
    const all = draftsStore.getAll();
    const idx = all.findIndex(d => d.id === draft.id);
    if (idx >= 0) all[idx] = draft;
    else all.unshift(draft);
    setItem('drafts', all);
  },
  remove: (id: string): void => {
    setItem('drafts', draftsStore.getAll().filter(d => d.id !== id));
  },
  clear: (): void => setItem('drafts', []),
};

// Posts
export const postsStore = {
  getAll: (): Post[] => getItem('posts', defaults.posts),
  getById: (id: string): Post | undefined => postsStore.getAll().find(p => p.id === id),
  save: (post: Post): void => {
    const all = postsStore.getAll();
    const idx = all.findIndex(p => p.id === post.id);
    if (idx >= 0) all[idx] = post;
    else all.unshift(post);
    setItem('posts', all);
  },
  remove: (id: string): void => {
    setItem('posts', postsStore.getAll().filter(p => p.id !== id));
  },
  clear: (): void => setItem('posts', []),
};

// Accounts (Creators)
export const accountsStore = {
  getAll: (): Creator[] => getItem('accounts', defaults.accounts),
  getById: (id: string): Creator | undefined => accountsStore.getAll().find(a => a.id === id),
  save: (account: Creator): void => {
    const all = accountsStore.getAll();
    const idx = all.findIndex(a => a.id === account.id);
    if (idx >= 0) all[idx] = account;
    else all.push(account);
    setItem('accounts', all);
  },
  remove: (id: string): void => {
    setItem('accounts', accountsStore.getAll().filter(a => a.id !== id));
  },
  clear: (): void => setItem('accounts', []),
};

// Replies
export const repliesStore = {
  getAll: (): Reply[] => getItem('replies', defaults.replies),
  getById: (id: string): Reply | undefined => repliesStore.getAll().find(r => r.id === id),
  save: (reply: Reply): void => {
    const all = repliesStore.getAll();
    const idx = all.findIndex(r => r.id === reply.id);
    if (idx >= 0) all[idx] = reply;
    else all.unshift(reply);
    setItem('replies', all);
  },
  remove: (id: string): void => {
    setItem('replies', repliesStore.getAll().filter(r => r.id !== id));
  },
  clear: (): void => setItem('replies', []),
};

// Reports
export const reportsStore = {
  getAll: (): Report[] => getItem('reports', defaults.reports),
  getById: (id: string): Report | undefined => reportsStore.getAll().find(r => r.id === id),
  save: (report: Report): void => {
    const all = reportsStore.getAll();
    const idx = all.findIndex(r => r.id === report.id);
    if (idx >= 0) all[idx] = report;
    else all.unshift(report);
    setItem('reports', all);
  },
  remove: (id: string): void => {
    setItem('reports', reportsStore.getAll().filter(r => r.id !== id));
  },
  clear: (): void => setItem('reports', []),
};

// Checkpoints
export const checkpointsStore = {
  getAll: (): Checkpoint[] => getItem('checkpoints', defaults.checkpoints),
  getById: (id: string): Checkpoint | undefined => checkpointsStore.getAll().find(c => c.id === id),
  save: (checkpoint: Checkpoint): void => {
    const all = checkpointsStore.getAll();
    const idx = all.findIndex(c => c.id === checkpoint.id);
    if (idx >= 0) all[idx] = checkpoint;
    else all.push(checkpoint);
    setItem('checkpoints', all);
  },
  remove: (id: string): void => {
    setItem('checkpoints', checkpointsStore.getAll().filter(c => c.id !== id));
  },
  clear: (): void => setItem('checkpoints', []),
};

// Settings
export const settingsStore = {
  get: (): Settings => getItem('settings', defaults.settings),
  save: (settings: Partial<Settings>): void => {
    setItem('settings', { ...settingsStore.get(), ...settings });
  },
  reset: (): void => setItem('settings', defaults.settings),
};

// Score History
export const scoreHistoryStore = {
  getAll: (): ScoreEntry[] => getItem('scoreHistory', defaults.scoreHistory),
  add: (entry: ScoreEntry): void => {
    const all = scoreHistoryStore.getAll();
    all.unshift(entry);
    if (all.length > 100) all.length = 100; // Keep last 100
    setItem('scoreHistory', all);
  },
  clear: (): void => setItem('scoreHistory', []),
};

// Export all stores
export const store = {
  drafts: draftsStore,
  posts: postsStore,
  accounts: accountsStore,
  replies: repliesStore,
  reports: reportsStore,
  checkpoints: checkpointsStore,
  settings: settingsStore,
  scoreHistory: scoreHistoryStore,
};

export default store;
