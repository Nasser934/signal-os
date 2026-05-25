// Signal OS — 5-Dimension AI Scoring Engine
// Runs entirely client-side. No data leaves the device.

export interface Scores {
  hook: number;
  readability: number;
  engagement: number;
  sentiment: number;
  structure: number;
  overall: number;
}

export interface ScoringResult {
  scores: Scores;
  verdict: 'excellent' | 'good' | 'fair' | 'poor';
  suggestions: string[];
  breakdown: Record<string, { score: number; feedback: string }>;
}

// Weight configuration
const DEFAULT_WEIGHTS = {
  hook: 0.25,
  readability: 0.20,
  engagement: 0.25,
  sentiment: 0.15,
  structure: 0.15,
};

// Hook detection patterns
const HOOK_PATTERNS = {
  questions: /\?/g,
  numbers: /\d+/g,
  curiosity: /\b(how|why|what|secret|truth|myth|fact|surprising|shocking|unbelievable)\b/gi,
  urgency: /\b(urgent|now|today|immediately|don't miss|limited|last chance|final)\b/gi,
  controversy: /\b(wrong|mistake|never|always|worst|best|only way)\b/gi,
  story: /\b(story|once|remember|when I|years ago|the time)\b/gi,
  social_proof: /\b(everyone|nobody|most people|studies show|research|data shows)\b/gi,
};

// Readability factors
const READABILITY_WORDS = {
  simple: ['the', 'a', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'and', 'but', 'or', 'yet', 'so', 'if', 'because', 'although', 'though', 'while', 'where', 'when', 'that', 'which', 'who', 'whom', 'whose', 'what', 'this', 'these', 'those', 'I', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'but'],
  complex: ['notwithstanding', 'hereunder', 'heretofore', 'aforementioned', 'pursuant', 'thereto', 'hereinafter', 'whereas', 'ergo', 'ipso facto'],
};

// Sentiment word lists
const SENTIMENT_WORDS = {
  positive: ['amazing', 'awesome', 'excellent', 'fantastic', 'great', 'love', 'best', 'brilliant', 'outstanding', 'remarkable', 'wonderful', 'perfect', 'incredible', 'impressive', 'exceptional', 'superb', 'magnificent', 'fabulous', 'thrilled', 'delighted', 'happy', 'glad', 'pleased', 'satisfied', 'excited', 'grateful', 'thankful', 'blessed', 'optimistic', 'confident', 'proud', 'hopeful', 'inspired', 'motivated', 'energized', 'refreshed', 'calm', 'peaceful', 'joyful', 'cheerful', 'positive', 'good', 'nice', 'beautiful', 'smart', 'wise', 'helpful', 'useful', 'valuable', 'effective', 'efficient', 'successful', 'proven', 'powerful', 'strong', 'solid', 'reliable', 'trustworthy', 'honest', 'fair', 'kind', 'generous', 'creative', 'innovative', 'unique', 'special', 'rare', 'premium', 'quality', 'professional', 'expert', 'skilled', 'talented', 'gifted'],
  negative: ['terrible', 'awful', 'horrible', 'hate', 'worst', 'bad', 'poor', 'disappointing', 'frustrating', 'annoying', 'boring', 'useless', 'waste', 'failed', 'broken', 'wrong', 'stupid', 'ridiculous', 'pathetic', 'sad', 'angry', 'mad', 'upset', 'worried', 'stressed', 'anxious', 'depressed', 'disappointed', 'disgusted', 'embarrassed', 'jealous', 'frightened', 'scared', 'confused', 'helpless', 'hopeless', 'lonely', 'guilty', 'ashamed', 'hurt', 'devastated', 'furious', 'outraged', 'bitter', 'resentful', 'cynical', 'pessimistic', 'negative', 'weak', 'fragile', 'unstable', 'risky', 'dangerous', 'harmful', 'toxic', 'corrupt', 'dishonest', 'unfair', 'cruel', 'ugly', 'messy', 'dirty', 'lazy', 'careless', 'incompetent', 'ignorant'],
};

// Structure patterns
const STRUCTURE_PATTERNS = {
  shortSentence: /[^.!?]+[.!?]/g,
  lineBreak: /\n/g,
  bulletLike: /[-*•]\s/g,
  emoji: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
  hashtag: /#[a-zA-Z0-9_]+/g,
  mention: /@[a-zA-Z0-9_]+/g,
  url: /https?:\/\/[^\s]+/g,
  allCaps: /\b[A-Z]{2,}\b/g,
  quotation: /[""''`]/g,
};

function countMatches(text: string, regex: RegExp): number {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

// Hook Quality Score (0-100)
function scoreHook(text: string): number {
  const scores: number[] = [];
  const lower = text.toLowerCase();

  // Has question hook (0-20)
  scores.push(Math.min(countMatches(text, HOOK_PATTERNS.questions) * 10, 20));

  // Uses numbers/data (0-15)
  scores.push(Math.min(countMatches(text, HOOK_PATTERNS.numbers) * 5, 15));

  // Curiosity trigger words (0-20)
  const curiosityCount = countMatches(lower, HOOK_PATTERNS.curiosity);
  scores.push(Math.min(curiosityCount * 7, 20));

  // Urgency/scarcity (0-15)
  const urgencyCount = countMatches(lower, HOOK_PATTERNS.urgency);
  scores.push(Math.min(urgencyCount * 8, 15));

  // Controversy/polarity (0-15)
  const controversyCount = countMatches(lower, HOOK_PATTERNS.controversy);
  scores.push(Math.min(controversyCount * 5, 15));

  // Storytelling element (0-15)
  const storyCount = countMatches(lower, HOOK_PATTERNS.story);
  scores.push(Math.min(storyCount * 8, 15));

  // First sentence hook bonus (0-10)
  const firstSentence = text.split(/[.!?\n]/)[0] || '';
  const firstHasHook = HOOK_PATTERNS.curiosity.test(firstSentence.toLowerCase()) ||
    firstSentence.length < 80 && firstSentence.length > 20;
  scores.push(firstHasHook ? 10 : 3);

  const total = scores.reduce((a, b) => a + b, 0);
  return Math.min(Math.round(total), 100);
}

// Readability Score (0-100)
function scoreReadability(text: string): number {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return 0;

  const scores: number[] = [];

  // Word count (ideal: 15-50 words) (0-20)
  const wordCount = words.length;
  if (wordCount >= 15 && wordCount <= 50) scores.push(20);
  else if (wordCount >= 10 && wordCount <= 80) scores.push(15);
  else if (wordCount >= 5 && wordCount <= 100) scores.push(10);
  else scores.push(5);

  // Sentence count (ideal: 2-5 sentences) (0-20)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length >= 2 && sentences.length <= 5) scores.push(20);
  else if (sentences.length >= 1 && sentences.length <= 8) scores.push(15);
  else scores.push(10);

  // Average word length (ideal: 4-6 chars) (0-20)
  const avgWordLength = words.reduce((sum, w) => sum + w.replace(/[^a-zA-Z]/g, '').length, 0) / words.length;
  if (avgWordLength >= 4 && avgWordLength <= 6) scores.push(20);
  else if (avgWordLength >= 3 && avgWordLength <= 7) scores.push(15);
  else scores.push(8);

  // Simple word ratio (0-20)
  const simpleWords = words.filter(w => READABILITY_WORDS.simple.includes(w.toLowerCase()));
  const simpleRatio = simpleWords.length / words.length;
  scores.push(Math.min(Math.round(simpleRatio * 40), 20));

  // Complex word penalty (0-20)
  const complexCount = words.filter(w => w.length > 12).length;
  if (complexCount === 0) scores.push(20);
  else if (complexCount <= 2) scores.push(15);
  else if (complexCount <= 4) scores.push(10);
  else scores.push(5);

  const total = scores.reduce((a, b) => a + b, 0);
  return Math.min(Math.round(total), 100);
}

// Engagement Score (0-100)
function scoreEngagement(text: string): number {
  const scores: number[] = [];
  const lower = text.toLowerCase();

  // Call to action presence (0-25)
  const ctaPatterns = /\b(check out|click|read|watch|follow|reply|share|retweet|comment|let me know|what do you think|your thoughts|agree\?|disagree\?)\b/gi;
  scores.push(Math.min(countMatches(lower, ctaPatterns) * 8, 25));

  // Emoji usage (0-20)
  const emojiCount = countMatches(text, STRUCTURE_PATTERNS.emoji);
  if (emojiCount >= 1 && emojiCount <= 3) scores.push(20);
  else if (emojiCount === 0) scores.push(10);
  else if (emojiCount <= 5) scores.push(15);
  else scores.push(8);

  // Hashtag usage (0-15)
  const hashtagCount = countMatches(text, STRUCTURE_PATTERNS.hashtag);
  if (hashtagCount >= 1 && hashtagCount <= 3) scores.push(15);
  else if (hashtagCount === 0) scores.push(8);
  else scores.push(5);

  // Social proof (0-15)
  const socialProof = countMatches(lower, HOOK_PATTERNS.social_proof);
  scores.push(Math.min(socialProof * 8, 15));

  // Addressing reader directly (0-15)
  const directAddress = /\b(you|your|you're|you'll)\b/gi;
  const directCount = countMatches(lower, directAddress);
  scores.push(Math.min(directCount * 4, 15));

  // Open-ended element (0-10)
  const openEnded = text.includes('?') || /\b(thoughts|opinions|experience|perspective)\b/i.test(text);
  scores.push(openEnded ? 10 : 3);

  const total = scores.reduce((a, b) => a + b, 0);
  return Math.min(Math.round(total), 100);
}

// Sentiment Score (0-100)
function scoreSentiment(text: string): number {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);

  const positiveWords = words.filter(w => SENTIMENT_WORDS.positive.includes(w));
  const negativeWords = words.filter(w => SENTIMENT_WORDS.negative.includes(w));

  const posCount = positiveWords.length;
  const negCount = negativeWords.length;
  const totalEmotion = posCount + negCount;

  if (totalEmotion === 0) return 50; // Neutral

  // Sentiment balance (higher = more positive)
  const sentimentRatio = posCount / (posCount + negCount);
  const baseScore = Math.round(sentimentRatio * 100);

  // Emotional intensity bonus
  const intensity = Math.min(totalEmotion / words.length * 3, 0.2);

  return Math.min(Math.round(baseScore + intensity * 100), 100);
}

// Structure Score (0-100)
function scoreStructure(text: string): number {
  const scores: number[] = [];

  // Line breaks / formatting (0-25)
  const lineBreaks = countMatches(text, STRUCTURE_PATTERNS.lineBreak);
  if (lineBreaks >= 1 && lineBreaks <= 4) scores.push(25);
  else if (lineBreaks >= 5 && lineBreaks <= 8) scores.push(20);
  else if (lineBreaks === 0 && text.length < 100) scores.push(15);
  else scores.push(10);

  // Sentence variety (0-20)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
  const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length;
  scores.push(variance > 1 ? 20 : 12);

  // Hashtag placement (0-15)
  const hashtagCount = countMatches(text, STRUCTURE_PATTERNS.hashtag);
  const endsWithHashtag = text.trim().endsWith('#');
  if (hashtagCount >= 1 && hashtagCount <= 3 && !endsWithHashtag) scores.push(15);
  else if (hashtagCount <= 3) scores.push(10);
  else scores.push(5);

  // URL usage (0-10)
  const hasUrl = STRUCTURE_PATTERNS.url.test(text);
  scores.push(hasUrl ? 10 : 5);

  // Mention usage (0-15)
  const mentionCount = countMatches(text, STRUCTURE_PATTERNS.mention);
  scores.push(Math.min(mentionCount * 5, 15));

  // Opening power (0-15)
  const firstLine = text.split('\n')[0] || text.slice(0, 60);
  const firstLineScore = firstLine.length >= 20 && firstLine.length <= 100 ? 15 : 8;
  scores.push(firstLineScore);

  const total = scores.reduce((a, b) => a + b, 0);
  return Math.min(Math.round(total), 100);
}

// Get verdict based on overall score
function getVerdict(overall: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (overall >= 80) return 'excellent';
  if (overall >= 60) return 'good';
  if (overall >= 40) return 'fair';
  return 'poor';
}

// Generate improvement suggestions
function generateSuggestions(scores: Scores, text: string): string[] {
  const suggestions: string[] = [];

  if (scores.hook < 50) {
    suggestions.push('Start with a question, number, or bold statement to hook readers in the first 5 words');
  }
  if (scores.readability < 50) {
    suggestions.push('Break into shorter sentences. Aim for 15-50 words total with 2-5 sentences');
  }
  if (scores.engagement < 50) {
    suggestions.push('Add a call-to-action or ask an open-ended question to drive replies');
  }
  if (scores.sentiment < 40) {
    suggestions.push('Consider rephrasing with more positive or neutral language');
  }
  if (scores.structure < 50) {
    suggestions.push('Use line breaks to create visual breathing room. Place hashtags inline or at the end');
  }
  if (scores.hook >= 60 && scores.engagement < 60) {
    suggestions.push('Strong hook! Now add a clear CTA to convert attention into engagement');
  }

  // Specific suggestions
  if (!text.includes('?')) {
    suggestions.push('Consider adding a question to spark conversation');
  }
  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount > 100) {
    suggestions.push('Consider trimming to under 100 words for better engagement on X');
  }
  if (countMatches(text, STRUCTURE_PATTERNS.hashtag) === 0) {
    suggestions.push('Add 1-2 relevant hashtags to increase discoverability');
  }

  return suggestions.length > 0 ? suggestions.slice(0, 4) : ['Your content looks good! Consider A/B testing with variations.'];
}

// Main scoring function
export function analyzeDraft(text: string, weights = DEFAULT_WEIGHTS): ScoringResult {
  const hook = scoreHook(text);
  const readability = scoreReadability(text);
  const engagement = scoreEngagement(text);
  const sentiment = scoreSentiment(text);
  const structure = scoreStructure(text);

  const overall = Math.round(
    hook * weights.hook +
    readability * weights.readability +
    engagement * weights.engagement +
    sentiment * weights.sentiment +
    structure * weights.structure
  );

  const scores: Scores = { hook, readability, engagement, sentiment, structure, overall };
  const verdict = getVerdict(overall);
  const suggestions = generateSuggestions(scores, text);

  return {
    scores,
    verdict,
    suggestions,
    breakdown: {
      hook: { score: hook, feedback: hook >= 60 ? 'Strong opening hook' : 'Weak hook - needs improvement' },
      readability: { score: readability, feedback: readability >= 60 ? 'Easy to read' : 'Hard to read - simplify' },
      engagement: { score: engagement, feedback: engagement >= 60 ? 'Drives engagement' : 'Add engagement triggers' },
      sentiment: { score: sentiment, feedback: sentiment >= 60 ? 'Positive tone' : 'Consider tone adjustment' },
      structure: { score: structure, feedback: structure >= 60 ? 'Well structured' : 'Improve formatting' },
    },
  };
}

// Quick score for inline feedback
export function quickScore(text: string): number {
  const result = analyzeDraft(text);
  return result.scores.overall;
}

export default analyzeDraft;
