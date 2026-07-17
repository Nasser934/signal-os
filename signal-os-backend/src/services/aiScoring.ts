import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are Signal OS, an expert content analyzer for X (Twitter). Analyze the given post content across 8 dimensions and return a JSON response.

Scoring rules (0-100):
- 90-100: Exceptional, likely viral
- 80-89: Excellent, high engagement expected
- 70-79: Good, above average
- 60-69: Average, room for improvement
- 50-59: Below average, needs work
- 0-49: Poor, major revisions needed

Dimensions & Weights:
- Hook Quality (25%): Opening line power, scroll-stop rate, pattern interrupt strength
- Readability (15%): Sentence length, clarity, flow, reading ease
- Structure (10%): Format, line breaks, visual hierarchy, scannability
- Emotional Pull (20%): Sentiment intensity, resonance, relatability
- Timing (10%): Topic relevance, trend alignment, timeliness
- Engagement Likelihood (10%): Reply trigger, RT-worthiness, shareability
- Audience Match (5%): Niche alignment, target demographic fit
- Clarity (5%): Message precision, no ambiguity, single focus

Respond ONLY with valid JSON:
{
  "overallScore": number,
  "dimensions": { "hook": {"score":number,"feedback":["string"]}, ... },
  "feedback": ["string"],
  "estimatedEngagement": "string (e.g. 4.2%)",
  "hookType": "string",
  "sentiment": "string",
  "wordCount": number,
  "charCount": number
}`;

export interface ScoreResult {
  overallScore: number;
  dimensions: Record<string, { score: number; feedback: string[] }>;
  feedback: string[];
  estimatedEngagement: string;
  hookType: string;
  sentiment: string;
  wordCount: number;
  charCount: number;
}

export async function scoreContent(content: string): Promise<ScoreResult> {
  if (!process.env.OPENAI_API_KEY) return ruleBasedScoring(content);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Analyze this X post:\n\n"${content}"` },
    ],
    temperature: 0.3,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  });

  const raw = response.choices[0]?.message?.content || '{}';
  const result = JSON.parse(raw) as ScoreResult;

  // Ensure weighted overall score
  const weights: Record<string, number> = {
    hook: 25, readability: 15, structure: 10, emotional: 20,
    timing: 10, engagement: 10, audience: 5, clarity: 5,
  };
  let weightedSum = 0;
  for (const [dim, data] of Object.entries(result.dimensions || {})) {
    weightedSum += (data.score || 50) * (weights[dim] || 5) / 100;
  }
  result.overallScore = Math.round(weightedSum);
  return result;
}

function ruleBasedScoring(content: string): ScoreResult {
  const words = content.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = content.length;
  const sentences = content.split(/[.!?]+/).filter(Boolean).length;
  const avgSentenceLength = sentences > 0 ? wordCount / sentences : 0;

  const hookWords = ['why','how','what','the','stop','dont','never','always','secret','truth','myth','real','unpopular','here','this'];
  const firstWord = words[0]?.toLowerCase() || '';
  const hasHook = hookWords.some(w => firstWord.includes(w));
  const hasQuestion = content.includes('?');
  const hasNumber = /\d/.test(content);
  const hasCaps = /[A-Z]{2,}/.test(content);

  const dims: Record<string, { score: number; feedback: string[] }> = {
    hook: { score: hasHook ? 85 : hasQuestion ? 75 : 55, feedback: [hasHook ? 'Strong hook pattern detected' : 'Consider a pattern interrupt opening'] },
    readability: { score: Math.max(40, Math.min(95, 100 - Math.abs(avgSentenceLength - 15) * 4)), feedback: [`Avg sentence: ${avgSentenceLength.toFixed(1)} words`] },
    structure: { score: hasNumber ? 75 : 60, feedback: [hasNumber ? 'Good use of numbers' : 'Add numbers for credibility'] },
    emotional: { score: hasCaps ? 72 : 58, feedback: [hasCaps ? 'Emphasis detected' : 'Add emotional triggers'] },
    timing: { score: 65, feedback: ['Topic relevance analyzed'] },
    engagement: { score: hasQuestion ? 78 : 55, feedback: [hasQuestion ? 'Questions drive engagement' : 'Add a question for replies'] },
    audience: { score: 60, feedback: ['Audience alignment assessed'] },
    clarity: { score: wordCount > 0 ? Math.min(90, Math.max(50, 100 - wordCount * 0.3)) : 50, feedback: [`${wordCount} words`] },
  };

  const weights: Record<string, number> = { hook: 25, readability: 15, structure: 10, emotional: 20, timing: 10, engagement: 10, audience: 5, clarity: 5 };
  const overall = Math.round(Object.entries(dims).reduce((s, [k, v]) => s + v.score * (weights[k] / 100), 0));

  return {
    overallScore: overall,
    dimensions: dims,
    feedback: [
      overall >= 80 ? 'Strong content with viral potential' : overall >= 60 ? 'Good foundation, refinements suggested' : 'Consider rewriting with stronger hooks',
      hasQuestion ? 'Questions increase reply rates' : 'Try adding a question',
    ],
    estimatedEngagement: overall >= 80 ? '5.2%' : overall >= 60 ? '3.1%' : '1.8%',
    hookType: hasQuestion ? 'question' : hasNumber ? 'listicle' : 'statement',
    sentiment: 'neutral',
    wordCount,
    charCount,
  };
}
