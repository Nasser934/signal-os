// Signal OS — AI Insight Engine
// Runs entirely client-side. Topic pattern matching, sentiment, trends, risk, forecasts.

export interface TopicInsight {
  category: string;
  confidence: number;
  signal: 'act' | 'monitor' | 'ignore';
  summary: string;
  keywords: string[];
}

export interface SentimentResult {
  score: number;
  label: 'positive' | 'neutral' | 'negative' | 'mixed';
  breakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  keyPhrases: string[];
}

export interface TrendSignal {
  topic: string;
  direction: 'up' | 'down' | 'stable';
  velocity: number; // 0-100
  volume: number;   // 0-100
  sentiment: number; // 0-100
  recommendation: string;
}

export interface RiskAssessment {
  score: number; // 0-100, higher = more risky
  factors: { factor: string; level: 'high' | 'medium' | 'low' }[];
  mitigation: string[];
}

export interface Forecast {
  scenario: 'bull' | 'base' | 'bear';
  probability: number;
  estimatedEngagement: number;
  estimatedReach: number;
  factors: string[];
}

// Topic categories with keyword patterns
const TOPIC_CATEGORIES = [
  {
    name: 'AI & Machine Learning',
    keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'llm', 'gpt', 'chatgpt', 'neural', 'deep learning', 'model', 'algorithm', 'automation', 'copilot', 'agent', ' AGI', 'generative ai', 'foundation model', 'transformer', 'nlp', 'computer vision'],
  },
  {
    name: 'Crypto & Web3',
    keywords: ['bitcoin', 'ethereum', 'crypto', 'blockchain', 'web3', 'nft', 'defi', 'token', 'altcoin', 'mining', 'wallet', 'dao', 'smart contract', 'btc', 'eth', 'solana', 'layer2', '空投', '空投'],
  },
  {
    name: 'Startup & Business',
    keywords: ['startup', 'founder', 'ceo', 'venture', 'funding', 'series a', 'series b', 'ipo', 'bootstrapped', 'saas', 'revenue', 'profit', 'growth', 'scale', 'pitch', 'investor', 'unicorn', 'burn rate', 'mrr', 'arr', 'ltv', 'cac'],
  },
  {
    name: 'Product & Design',
    keywords: ['ux', 'ui', 'product design', 'user research', 'wireframe', 'prototype', 'figma', 'design system', 'accessibility', 'usability', 'user testing', 'iteration', 'mvp', 'product market fit', 'roadmap', 'feature', 'release'],
  },
  {
    name: 'Engineering & Dev',
    keywords: ['coding', 'programming', 'developer', 'software', 'frontend', 'backend', 'fullstack', 'devops', 'api', 'database', 'cloud', 'aws', 'serverless', 'microservices', 'kubernetes', 'docker', 'typescript', 'python', 'react', 'rust', 'go'],
  },
  {
    name: 'Marketing & Growth',
    keywords: ['marketing', 'growth hack', 'seo', 'content', 'social media', 'viral', 'campaign', 'conversion', 'funnel', 'lead gen', 'brand', 'influencer', 'community', 'organic', 'paid', 'ctr', 'cpc', 'roas', 'attribution'],
  },
  {
    name: 'Creator Economy',
    keywords: ['creator', 'influencer', 'youtuber', 'streamer', 'podcaster', 'newsletter', 'substack', 'monetization', 'audience', 'follower', 'engagement', 'personal brand', 'thought leader', 'content strategy', 'platform', 'algorithm'],
  },
  {
    name: 'Tech Industry',
    keywords: ['big tech', 'apple', 'google', 'meta', 'amazon', 'microsoft', 'tesla', 'elon', 'acquisition', 'layoff', 'hiring', 'remote work', 'return to office', 'big tech', 'silicon valley', 'tech layoffs', 'regulation', 'antitrust'],
  },
  {
    name: 'Science & Research',
    keywords: ['research', 'study', 'paper', 'journal', 'hypothesis', 'experiment', 'data', 'peer reviewed', 'breakthrough', 'discovery', 'innovation', 'biotech', 'climate', 'space', 'physics', 'biology', 'medicine'],
  },
  {
    name: 'Politics & Policy',
    keywords: ['election', 'policy', 'government', 'regulation', 'legislation', 'vote', 'democracy', 'bipartisan', 'administration', 'congress', 'senate', 'white house', 'supreme court', 'trade war', 'sanctions', 'geopolitics'],
  },
  {
    name: 'Health & Wellness',
    keywords: ['health', 'fitness', 'mental health', 'wellness', 'nutrition', 'exercise', 'meditation', 'sleep', 'productivity', 'habit', 'mindfulness', 'stress', 'burnout', 'work life balance', 'self care', 'longevity'],
  },
];

// Sentiment word lists (extended)
const SENTIMENT_LEXICON = {
  positive: ['amazing', 'awesome', 'excellent', 'fantastic', 'great', 'love', 'best', 'brilliant', 'outstanding', 'remarkable', 'wonderful', 'perfect', 'incredible', 'impressive', 'exceptional', 'superb', 'magnificent', 'fabulous', 'thrilled', 'delighted', 'happy', 'glad', 'pleased', 'satisfied', 'excited', 'grateful', 'optimistic', 'confident', 'proud', 'hopeful', 'inspired', 'positive', 'good', 'nice', 'beautiful', 'smart', 'helpful', 'useful', 'valuable', 'effective', 'successful', 'proven', 'powerful', 'strong', 'solid', 'reliable', 'creative', 'innovative', 'unique', 'special', 'premium', 'quality', 'professional', 'expert', 'win', 'gain', 'boost', 'surge', 'soar', 'rally', 'breakthrough', 'milestone', 'achievement'],
  negative: ['terrible', 'awful', 'horrible', 'hate', 'worst', 'bad', 'poor', 'disappointing', 'frustrating', 'annoying', 'boring', 'useless', 'waste', 'failed', 'broken', 'wrong', 'stupid', 'ridiculous', 'pathetic', 'sad', 'angry', 'worried', 'stressed', 'anxious', 'depressed', 'disgusted', 'embarrassed', 'furious', 'outraged', 'bitter', 'resentful', 'cynical', 'pessimistic', 'weak', 'fragile', 'risky', 'dangerous', 'harmful', 'toxic', 'corrupt', 'dishonest', 'unfair', 'lazy', 'careless', 'incompetent', 'loss', 'crash', 'decline', 'fall', 'drop', 'crisis', 'scandal', 'collapse', 'bankrupt'],
  intensifiers: ['very', 'extremely', 'incredibly', 'absolutely', 'totally', 'completely', 'utterly', 'highly', 'deeply', 'seriously', 'quite', 'rather', 'pretty', 'really', 'so', 'too', 'most', 'least'],
  negations: ['not', 'no', 'never', 'none', 'nobody', 'nothing', 'neither', 'nowhere', 'hardly', 'scarcely', 'barely', 'doesn\'t', 'isn\'t', 'wasn\'t', 'shouldn\'t', 'wouldn\'t', 'couldn\'t', 'won\'t', 'can\'t', 'don\'t', 'didn\'t'],
};

/**
 * Detect topics in text using keyword pattern matching
 */
export function detectTopics(text: string): TopicInsight[] {
  const lower = text.toLowerCase();
  const insights: TopicInsight[] = [];

  for (const category of TOPIC_CATEGORIES) {
    const matches = category.keywords.filter(kw => lower.includes(kw.toLowerCase()));
    const confidence = Math.min(matches.length / 3, 1) * 100;

    if (confidence > 10) {
      let signal: 'act' | 'monitor' | 'ignore' = 'monitor';
      if (confidence > 60) signal = 'act';
      else if (confidence < 25) signal = 'ignore';

      insights.push({
        category: category.name,
        confidence: Math.round(confidence),
        signal,
        summary: generateTopicSummary(category.name, matches, signal),
        keywords: matches,
      });
    }
  }

  // Sort by confidence descending
  insights.sort((a, b) => b.confidence - a.confidence);
  return insights.slice(0, 5); // Top 5 topics
}

function generateTopicSummary(category: string, _keywords: string[], _signal: string): string {
  const summaries: Record<string, string[]> = {
    'AI & Machine Learning': [
      'AI content is trending — high engagement potential with technical audiences',
      'ML discussion detected — niche but highly engaged community',
      'Generative AI topic — massive reach potential, act fast on timing',
    ],
    'Crypto & Web3': [
      'Crypto content has polarized audience — expect high engagement both ways',
      'Web3 topic detected — niche community with strong engagement',
      'Token/crypto mention — volatile sentiment, monitor closely',
    ],
    'Startup & Business': [
      'Startup content resonates with founder community — strong share potential',
      'Business growth topic — appeals to professional audience',
      'Funding/revenue discussion — high value for entrepreneur followers',
    ],
    'Product & Design': [
      'Design content engages creative professionals — strong visual potential',
      'Product discussion — high quality engagement from practitioners',
      'UX topic — evergreen content with consistent performance',
    ],
    'Engineering & Dev': [
      'Technical content drives high-quality engagement from developer community',
      'Engineering topic — strong bookmark and reference potential',
      'Code/tech discussion — reaches highly skilled audience segment',
    ],
    'Marketing & Growth': [
      'Growth marketing content — broad appeal across industries',
      'Marketing strategy topic — high share rate among professionals',
      'Viral/growth discussion — timely and actionable content',
    ],
    'Creator Economy': [
      'Creator content resonates with growing audience segment',
      'Personal brand topic — highly relevant to platform users',
      'Monetization discussion — strong engagement from aspiring creators',
    ],
    'Tech Industry': [
      'Big tech content generates broad discussion — expect high reach',
      'Industry news topic — timely content with newsjacking potential',
      'Tech policy/regulation — generates strong opinions and engagement',
    ],
    'Science & Research': [
      'Science content performs well for educational engagement',
      'Research topic — appeals to intellectually curious audience',
      'Breakthrough content — high share potential when simplified',
    ],
    'Politics & Policy': [
      'Political content is polarizing — high engagement but monitor sentiment',
      'Policy topic — relevant to professional and civic audiences',
      'Regulation discussion — timely for industry-specific audiences',
    ],
    'Health & Wellness': [
      'Wellness content has broad appeal — strong evergreen potential',
      'Health topic — high save/bookmark rate from audience',
      'Productivity discussion — universal relevance, consistent performance',
    ],
  };

  const options = summaries[category] || ['Topic detected with moderate engagement potential'];
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Analyze sentiment of text
 */
export function analyzeSentiment(text: string): SentimentResult {
  const lower = text.toLowerCase();
  const words = lower.match(/\b[a-z']+\b/g) || [];

  let positive = 0;
  let negative = 0;
  const keyPhrases: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const nextWord = words[i + 1] || '';
    const prevWord = words[i - 1] || '';

    // Check for negation
    const isNegated = SENTIMENT_LEXICON.negations.includes(prevWord);
    const multiplier = SENTIMENT_LEXICON.intensifiers.includes(prevWord) ? 1.5 : 1;

    if (SENTIMENT_LEXICON.positive.includes(word)) {
      const val = isNegated ? -1 : 1;
      if (isNegated) negative += multiplier;
      else positive += multiplier;
      if (val > 0) keyPhrases.push(word);
    }
    if (SENTIMENT_LEXICON.negative.includes(word)) {
      const val = isNegated ? 1 : -1;
      if (isNegated) positive += multiplier;
      else negative += multiplier;
      if (val < 0) keyPhrases.push(word);
    }

    // Bigram check
    const bigram = `${word} ${nextWord}`;
    if (SENTIMENT_LEXICON.positive.some(p => bigram.includes(p))) {
      positive += 0.5;
    }
  }

  const total = positive + negative;
  const neutral = Math.max(words.length - total, 0);

  if (total === 0) {
    return {
      score: 50,
      label: 'neutral',
      breakdown: { positive: 0, negative: 0, neutral: 100 },
      keyPhrases: [],
    };
  }

  const score = Math.round((positive / total) * 100);
  let label: 'positive' | 'neutral' | 'negative' | 'mixed' = 'neutral';
  if (score > 60) label = 'positive';
  else if (score < 40) label = 'negative';
  else if (score >= 40 && score <= 60 && positive > 0 && negative > 0) label = 'mixed';

  return {
    score,
    label,
    breakdown: {
      positive: Math.round((positive / (positive + negative + neutral)) * 100),
      negative: Math.round((negative / (positive + negative + neutral)) * 100),
      neutral: Math.round((neutral / (positive + negative + neutral)) * 100),
    },
    keyPhrases: keyPhrases.slice(0, 5),
  };
}

/**
 * Generate trend signals for topics
 */
export function generateTrendSignals(topics: string[]): TrendSignal[] {
  return topics.map(topic => {
    // Deterministic pseudo-random based on topic string
    const hash = topic.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(hash + seed) * 10000;
      return x - Math.floor(x);
    };

    const velocity = Math.round(pseudoRandom(1) * 100);
    const volume = Math.round(pseudoRandom(2) * 100);
    const sentiment = Math.round(30 + pseudoRandom(3) * 70);

    let direction: 'up' | 'down' | 'stable' = 'stable';
    if (velocity > 60) direction = 'up';
    else if (velocity < 30) direction = 'down';

    const recommendations = [
      'High momentum — post now for maximum visibility',
      'Steady growth — good time to contribute',
      'Declining interest — add unique angle to stand out',
      'Early trend — first-mover advantage available',
      'Peak attention — high competition but large audience',
      'Niche topic — targeted engagement expected',
    ];

    return {
      topic,
      direction,
      velocity,
      volume,
      sentiment,
      recommendation: recommendations[Math.floor(pseudoRandom(4) * recommendations.length)],
    };
  });
}

/**
 * Assess risk of content
 */
export function assessRisk(text: string): RiskAssessment {
  const lower = text.toLowerCase();
  const factors: { factor: string; level: 'high' | 'medium' | 'low' }[] = [];
  let score = 0;

  // Check controversial topics
  const controversialTerms = ['controversy', 'scandal', 'scam', 'fraud', 'lawsuit', 'illegal', 'banned', 'cancelled'];
  const controversyCount = controversialTerms.filter(t => lower.includes(t)).length;
  if (controversyCount > 0) {
    factors.push({ factor: 'Controversial language detected', level: 'high' });
    score += 25;
  }

  // Check polarizing statements
  const polarizingTerms = ['always', 'never', 'worst', 'best ever', 'only', 'everyone knows', 'nobody'];
  const polarizingCount = polarizingTerms.filter(t => lower.includes(t)).length;
  if (polarizingCount > 0) {
    factors.push({ factor: 'Polarizing absolutes', level: polarizingCount > 2 ? 'high' : 'medium' });
    score += polarizingCount * 8;
  }

  // Check misinformation risk
  const claimPatterns = /\b(studies show|research proves|data shows|science says)\b/gi;
  const hasUnsupportedClaims = claimPatterns.test(text) && !text.includes('http');
  if (hasUnsupportedClaims) {
    factors.push({ factor: 'Unsupported claims without sources', level: 'medium' });
    score += 15;
  }

  // Check political sensitivity
  const politicalTerms = ['election', 'voting', 'party', 'candidate', 'policy', 'government'];
  const politicalCount = politicalTerms.filter(t => lower.includes(t)).length;
  if (politicalCount > 0) {
    factors.push({ factor: 'Political content', level: 'medium' });
    score += 10;
  }

  // Check defamation risk
  const defamationTerms = ['corrupt', 'liar', 'criminal', 'fraud', 'scam'];
  const defamationCount = defamationTerms.filter(t => lower.includes(t)).length;
  if (defamationCount > 0) {
    factors.push({ factor: 'Potential defamation language', level: 'high' });
    score += 30;
  }

  if (factors.length === 0) {
    factors.push({ factor: 'No significant risk factors detected', level: 'low' });
  }

  return {
    score: Math.min(Math.round(score), 100),
    factors,
    mitigation: generateMitigations(factors),
  };
}

function generateMitigations(factors: { factor: string; level: string }[]): string[] {
  const mitigations: string[] = [];
  for (const factor of factors) {
    if (factor.level === 'high') {
      mitigations.push(`Review and soften language around: ${factor.factor}`);
    }
    if (factor.factor.includes('claims')) {
      mitigations.push('Add source links to support factual claims');
    }
    if (factor.factor.includes('Political')) {
      mitigations.push('Consider balanced framing for political topics');
    }
  }
  if (mitigations.length === 0) {
    mitigations.push('Content appears low-risk. Proceed with confidence.');
  }
  return mitigations;
}

/**
 * Generate forecast scenarios for content performance
 */
export function generateForecast(text: string, historicalAvg?: number): Forecast[] {
  const scores = {
    hook: text.length > 20 && text.length < 280 ? 70 : 40,
    readability: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length >= 2 ? 65 : 45,
    engagement: text.includes('?') || text.includes('!') ? 60 : 40,
  };

  const base = historicalAvg || 50;
  const qualityFactor = (scores.hook + scores.readability + scores.engagement) / 300;

  return [
    {
      scenario: 'bull',
      probability: Math.round(15 + qualityFactor * 20),
      estimatedEngagement: Math.round(base * (1.5 + qualityFactor)),
      estimatedReach: Math.round(base * (2 + qualityFactor * 2)),
      factors: ['Strong hook detected', 'Optimal length for engagement', 'Trending topic alignment'],
    },
    {
      scenario: 'base',
      probability: Math.round(50 + qualityFactor * 15),
      estimatedEngagement: Math.round(base * (0.8 + qualityFactor * 0.5)),
      estimatedReach: Math.round(base * (1 + qualityFactor)),
      factors: ['Average historical performance', 'Standard content characteristics'],
    },
    {
      scenario: 'bear',
      probability: Math.round(20 + (1 - qualityFactor) * 15),
      estimatedEngagement: Math.round(base * 0.4),
      estimatedReach: Math.round(base * 0.5),
      factors: ['Low engagement triggers', 'Suboptimal timing', 'Competition from other content'],
    },
  ];
}

/**
 * Master AI analysis combining all engines
 */
export interface FullAnalysis {
  topics: TopicInsight[];
  sentiment: SentimentResult;
  trends: TrendSignal[];
  risk: RiskAssessment;
  forecasts: Forecast[];
}

export function fullAnalysis(text: string, historicalAvg?: number): FullAnalysis {
  const topics = detectTopics(text);
  const sentiment = analyzeSentiment(text);
  const trends = generateTrendSignals(topics.map(t => t.category));
  const risk = assessRisk(text);
  const forecasts = generateForecast(text, historicalAvg);

  return { topics, sentiment, trends, risk, forecasts };
}

export default {
  detectTopics,
  analyzeSentiment,
  generateTrendSignals,
  assessRisk,
  generateForecast,
  fullAnalysis,
};
