import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ScoreResult {
  id: string;
  content: string;
  overallScore: number;
  dimensions: Record<string, number>;
  feedback: string[];
  timestamp: string;
}

interface Draft {
  id: string;
  content: string;
  score: ScoreResult;
  createdAt: string;
}

interface AppState {
  scores: ScoreResult[];
  drafts: Draft[];
  addScore: (score: ScoreResult) => void;
  saveDraft: (draft: Draft) => void;
  deleteDraft: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      scores: [],
      drafts: [],
      addScore: (score) => set((s) => ({ scores: [score, ...s.scores].slice(0, 100) })),
      saveDraft: (draft) => set((s) => ({ drafts: [draft, ...s.drafts].slice(0, 50) })),
      deleteDraft: (id) => set((s) => ({ drafts: s.drafts.filter((d) => d.id !== id) })),
    }),
    { name: 'signal-os-store' }
  )
);
