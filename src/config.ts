export const CONFIG = {
  app: {
    name: 'Signal OS',
    tagline: 'AI-Powered Attention Intelligence for Content Creators',
    version: '2.0.0',
  },
  scoring: {
    dimensions: [
      { id: 'hook', name: 'Hook Quality', weight: 25, description: 'Opening line power, scroll-stop rate' },
      { id: 'readability', name: 'Readability', weight: 15, description: 'Sentence length, clarity, flow' },
      { id: 'structure', name: 'Structure', weight: 10, description: 'Format, line breaks, visual hierarchy' },
      { id: 'emotional', name: 'Emotional Pull', weight: 20, description: 'Sentiment intensity, resonance' },
      { id: 'timing', name: 'Timing', weight: 10, description: 'Post time optimization' },
      { id: 'engagement', name: 'Engagement Likelihood', weight: 10, description: 'Reply, RT, like probability' },
      { id: 'audience', name: 'Audience Match', weight: 5, description: 'Niche alignment' },
      { id: 'clarity', name: 'Clarity', weight: 5, description: 'Message precision, no ambiguity' },
    ],
    maxChars: 280,
    thresholds: {
      exceptional: 85,
      good: 70,
      average: 50,
    },
  },
  pricing: {
    free: { price: 0, name: 'Free', scoresPerMonth: 50 },
    pro: { price: 29, name: 'Pro', scoresPerMonth: Infinity },
    team: { price: 79, name: 'Team', scoresPerMonth: Infinity },
  },
};
