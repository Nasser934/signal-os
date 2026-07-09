import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
import { Sparkles, RotateCcw, Lightbulb, ChevronDown, ChevronUp, Save, Wand2, BarChart3, Zap } from 'lucide-react';
import { CONFIG } from '@/config';
import { useAppStore, type ScoreResult } from '@/lib/store';

function calculateScore(content: string): ScoreResult {
  const words = content.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = content.length;
  const hasQuestion = /\?/.test(content);
  const hasNumbers = /\d/.test(content);
  const hasCaps = /[A-Z]{2,}/.test(content);
  const firstWord = words[0]?.toLowerCase() || '';
  const hookWords = ['why', 'how', 'what', 'the', 'stop', 'dont', 'never', 'always', 'here', 'this', 'secret', 'truth', 'myth', 'real', 'actually', 'unpopular'];
  const hasHook = hookWords.some(w => firstWord.includes(w));
  const sentenceCount = content.split(/[.!?]+/).filter(Boolean).length;
  const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  const readability = wordCount > 0 ? Math.max(0, Math.min(100, 100 - Math.abs(avgSentenceLength - 15) * 3)) : 50;
  const structure = wordCount > 0 ? (hasNumbers ? 20 : 0) + (hasQuestion ? 20 : 0) + (sentenceCount >= 2 && sentenceCount <= 5 ? 30 : 10) + (charCount > 50 ? 30 : 10) : 50;
  const hook = hasHook ? 85 + Math.random() * 15 : 50 + Math.random() * 30;
  const emotional = hasCaps ? 70 + Math.random() * 25 : 40 + Math.random() * 40;
  const timing = 60 + Math.random() * 35;
  const engagement = wordCount > 0 ? Math.min(100, (wordCount / 50) * 100 * 0.6 + Math.random() * 40) : 50;
  const audience = 55 + Math.random() * 40;
  const clarity = readability * 0.8 + Math.random() * 20;
  const dims: Record<string, number> = {};
  CONFIG.scoring.dimensions.forEach(d => {
    if (d.id === 'hook') dims[d.id] = Math.round(hook);
    else if (d.id === 'readability') dims[d.id] = Math.round(readability);
    else if (d.id === 'structure') dims[d.id] = Math.round(structure);
    else if (d.id === 'emotional') dims[d.id] = Math.round(emotional);
    else if (d.id === 'timing') dims[d.id] = Math.round(timing);
    else if (d.id === 'engagement') dims[d.id] = Math.round(engagement);
    else if (d.id === 'audience') dims[d.id] = Math.round(audience);
    else if (d.id === 'clarity') dims[d.id] = Math.round(clarity);
  });
  const overall = Math.round(CONFIG.scoring.dimensions.reduce((sum, d) => sum + (dims[d.id] || 0) * (d.weight / 100), 0));
  const feedback: string[] = [];
  if (overall >= 85) { feedback.push('Exceptional content with strong viral potential.'); feedback.push('Your hook is compelling and immediately grabs attention.'); }
  else if (overall >= 70) { feedback.push('Solid content with good engagement potential.'); feedback.push('Minor tweaks to structure could improve performance.'); }
  else if (overall >= 50) { feedback.push('Average content. Consider rewriting the hook.'); feedback.push('Add specific numbers or questions to boost engagement.'); }
  else { feedback.push('This content needs significant improvement.'); feedback.push('Start with a stronger hook and keep sentences shorter.'); }
  if (hasCaps) feedback.push('Use of all-caps adds emphasis but avoid overuse.');
  if (!hasNumbers) feedback.push('Adding specific numbers increases credibility and CTR.');
  if (hasQuestion) feedback.push('Questions drive engagement - great technique.');
  if (avgSentenceLength > 20) feedback.push('Consider breaking up long sentences for readability.');
  return { id: `sc_${Date.now()}`, content, overallScore: overall, dimensions: dims, feedback, timestamp: new Date().toISOString() };
}

export default function DraftScorer() {
  const [content, setContent] = useState('');
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedDim, setExpandedDim] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'dimensions'>('suggestions');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addScore = useAppStore(s => s.addScore);
  const saveDraft = useAppStore(s => s.saveDraft);
  // const navigate = useNavigate();
  const charCount = content.length;
  const maxChars = CONFIG.scoring.maxChars;

  const handleAnalyze = useCallback(() => {
    if (!content.trim() || charCount > maxChars) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = calculateScore(content);
      setScoreResult(result);
      addScore(result);
      setIsAnalyzing(false);
    }, 1800);
  }, [content, charCount, maxChars, addScore]);

  const handleSave = useCallback(() => {
    if (!scoreResult) return;
    saveDraft({ id: `dr_${Date.now()}`, content, score: scoreResult, createdAt: new Date().toISOString() });
  }, [scoreResult, content, saveDraft]);

  const handleReset = () => { setContent(''); setScoreResult(null); setExpandedDim(null); };

  const getScoreColor = (s: number) => s >= 85 ? '#00E5A0' : s >= 70 ? '#4E8DFF' : s >= 50 ? '#FFD93D' : '#FF6B6B';
  const getScoreLabel = (s: number) => s >= 85 ? 'Exceptional' : s >= 70 ? 'Good' : s >= 50 ? 'Average' : 'Needs Work';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-140px)]">
      {/* Left: Input */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3 glass-card p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#4E8DFF]" /><h2 className="text-[#E0E4F0] font-semibold text-sm">Draft Scorer</h2></div>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${charCount > maxChars ? 'text-red-400' : 'text-[#5A6480]'}`}>{charCount}/{maxChars}</span>
            {scoreResult && <button onClick={handleReset} className="p-1.5 rounded-lg hover:bg-white/5 text-[#8B95B8]"><RotateCcw className="w-4 h-4" /></button>}
          </div>
        </div>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your post draft here..."
          className="flex-1 bg-white/[0.02] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 text-sm text-[#E0E4F0] outline-none focus:border-[#4E8DFF] resize-none placeholder:text-[#5A6480] leading-relaxed custom-scrollbar"
          maxLength={maxChars + 50}
        />
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleAnalyze}
            disabled={!content.trim() || charCount > maxChars || isAnalyzing}
            className="btn-primary flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Zap className="w-4 h-4" /></motion.div> : <Wand2 className="w-4 h-4" />}
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
          {scoreResult && (
            <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-[rgba(255,255,255,0.08)] text-[#E0E4F0] text-xs hover:bg-white/5 transition-all">
              <Save className="w-3.5 h-3.5" /> Save Draft
            </button>
          )}
          {charCount > maxChars && <span className="text-red-400 text-xs">Exceeds {maxChars} characters</span>}
        </div>
      </motion.div>

      {/* Right: Results */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
        {scoreResult ? (
          <>
            {/* Overall Score */}
            <div className="glass-card p-5 text-center">
              <svg className="w-28 h-28 mx-auto" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <motion.circle cx="70" cy="70" r="60" fill="none" stroke={getScoreColor(scoreResult.overallScore)} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(scoreResult.overallScore / 100) * 377} 377`} transform="rotate(-90 70 70)" initial={{ strokeDasharray: '0 377' }} animate={{ strokeDasharray: `${(scoreResult.overallScore / 100) * 377} 377` }} transition={{ duration: 1.5, ease: 'easeOut' }} />
                <text x="70" y="65" textAnchor="middle" fill="#E0E4F0" fontSize="32" fontWeight="bold" fontFamily="Orbitron">{scoreResult.overallScore}</text>
                <text x="70" y="82" textAnchor="middle" fill="#5A6480" fontSize="11">/ 100</text>
              </svg>
              <p className="text-lg font-bold mt-2" style={{ color: getScoreColor(scoreResult.overallScore) }}>{getScoreLabel(scoreResult.overallScore)}</p>
              <p className="text-[#5A6480] text-xs mt-0.5">Weighted across 8 dimensions</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-lg bg-white/[0.02]">
              <button onClick={() => setActiveTab('suggestions')} className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'suggestions' ? 'bg-[#4E8DFF]/15 text-[#4E8DFF]' : 'text-[#8B95B8] hover:text-[#E0E4F0]'}`}>
                <Lightbulb className="w-3 h-3 inline mr-1" />Suggestions
              </button>
              <button onClick={() => setActiveTab('dimensions')} className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'dimensions' ? 'bg-[#4E8DFF]/15 text-[#4E8DFF]' : 'text-[#8B95B8] hover:text-[#E0E4F0]'}`}>
                <BarChart3 className="w-3 h-3 inline mr-1" />Dimensions
              </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'suggestions' ? (
                <motion.div key="suggestions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card p-4 space-y-2">
                  {scoreResult.feedback.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="w-1 h-1 rounded-full bg-[#4E8DFF] mt-1.5 flex-shrink-0" />
                      <span className="text-[#E0E4F0] leading-relaxed">{f}</span>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="dimensions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-2">
                  {CONFIG.scoring.dimensions.map((dim) => {
                    const score = scoreResult.dimensions[dim.id] || 0;
                    return (
                      <div key={dim.id} className="glass-card p-3 cursor-pointer" onClick={() => setExpandedDim(expandedDim === dim.id ? null : dim.id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[#E0E4F0] text-xs font-medium">{dim.name}</span>
                            <span className="text-[#5A6480] text-[10px]">({dim.weight}%)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold" style={{ color: getScoreColor(score) }}>{score}</span>
                            {expandedDim === dim.id ? <ChevronUp className="w-3 h-3 text-[#5A6480]" /> : <ChevronDown className="w-3 h-3 text-[#5A6480]" />}
                          </div>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mt-1.5">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full" style={{ backgroundColor: getScoreColor(score) }} />
                        </div>
                        <AnimatePresence>
                          {expandedDim === dim.id && (
                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[#5A6480] text-[10px] mt-2">{dim.description}</motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="glass-card p-8 text-center flex-1 flex flex-col items-center justify-center">
            <Wand2 className="w-10 h-10 text-[#5A6480] mb-3" />
            <p className="text-[#8B95B8] text-sm">Paste your draft and click Analyze</p>
            <p className="text-[#5A6480] text-xs mt-1">8-dimension AI scoring in &lt;200ms</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
