import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Users,
  UserPlus,
  UserMinus,
  Star,
  TrendingUp,
  Hash,
  ExternalLink,
  Search,
  ChevronDown,
  LayoutGrid,
  Table2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/GlassCard';
import ScoreBadge from '@/components/ScoreBadge';
import DataTable from '@/components/DataTable';
import { mockCreators } from '@/lib/mockData';
import type { Creator } from '@/lib/store';

/* ------------------------------------------------------------------ */
/*  Constants                                                           */
/* ------------------------------------------------------------------ */

const easing = [0.22, 1, 0.36, 1] as [number, number, number, number];

const gradeRanges = [
  { grade: 'A+', min: 90, max: 100, color: '#22C55E' },
  { grade: 'A', min: 80, max: 89, color: '#00C8FF' },
  { grade: 'B+', min: 70, max: 79, color: '#4E8DFF' },
  { grade: 'B', min: 60, max: 69, color: '#FFB347' },
  { grade: 'C', min: 0, max: 59, color: '#FF4444' },
];

const categories = [
  'All',
  'AI & Startups',
  'Startups',
  'Crypto & Web3',
  'Design',
  'Engineering',
  'Growth Marketing',
  'Creator Economy',
  'Wellness',
  'Product',
  'Content Strategy',
  'Marketing',
];

const sortOptions = [
  { value: 'score', label: 'Quality Score' },
  { value: 'followers', label: 'Followers' },
  { value: 'engagement', label: 'Engagement' },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function getGrade(score: number) {
  return gradeRanges.find((g) => score >= g.min && score <= g.max) || gradeRanges[4];
}

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

/* ------------------------------------------------------------------ */
/*  Quality Distribution Chart                                          */
/* ------------------------------------------------------------------ */

function QualityDistribution({ creators }: { creators: Creator[] }) {
  const data = useMemo(() => {
    return gradeRanges.map((g) => ({
      grade: g.grade,
      count: creators.filter((c) => c.qualityScore >= g.min && c.qualityScore <= g.max).length,
      color: g.color,
    }));
  }, [creators]);

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#E0E4F0] font-display">
            Quality Distribution
          </h3>
          <p className="text-xs text-[#5A6480] mt-0.5">
            You follow {creators.length} accounts
          </p>
        </div>
        <Users size={16} className="text-[#5A6480]" />
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="grade"
              tick={{ fill: '#8B95B8', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#5A6480', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              contentStyle={{
                backgroundColor: 'rgba(32, 36, 54, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#E0E4F0',
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Creator Card                                                        */
/* ------------------------------------------------------------------ */

function CreatorCard({ creator, index }: { creator: Creator; index: number }) {
  const grade = getGrade(creator.qualityScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: easing }}
    >
      <GlassCard className="h-full">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-14 h-14 rounded-full border-2 object-cover"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}
              />
              {creator.verified && (
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#4E8DFF] flex items-center justify-center">
                  <Star size={10} className="text-white fill-white" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-[#E0E4F0] truncate">
                {creator.name}
              </h4>
              <p className="text-xs text-[#8B95B8]">{creator.handle}</p>
              <span
                className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                style={{
                  backgroundColor: 'rgba(78,141,255,0.12)',
                  color: '#4E8DFF',
                }}
              >
                <Hash size={9} />
                {creator.niche}
              </span>
            </div>
          </div>

          {/* Quality Score */}
          <div className="bg-[rgba(255,255,255,0.03)] rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#8B95B8]">Quality Score</span>
              <ScoreBadge score={creator.qualityScore} size="sm" />
            </div>
            <div className="w-full h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: grade.color }}
                initial={{ width: 0 }}
                animate={{ width: `${creator.qualityScore}%` }}
                transition={{ duration: 0.6, delay: index * 0.06 + 0.2, ease: easing }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[#5A6480] font-data">0</span>
              <span className="text-[10px] text-[#5A6480] font-data">100</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[rgba(255,255,255,0.02)] rounded-lg p-2">
              <div className="text-xs font-bold font-data text-[#E0E4F0]">
                {formatNumber(creator.followers)}
              </div>
              <div className="text-[10px] text-[#5A6480]">Followers</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.02)] rounded-lg p-2">
              <div className="text-xs font-bold font-data text-[#E0E4F0]">
                {creator.engagement}%
              </div>
              <div className="text-[10px] text-[#5A6480]">Engagement</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.02)] rounded-lg p-2">
              <div className="text-xs font-bold font-data text-[#E0E4F0]">
                {formatNumber(creator.posts)}
              </div>
              <div className="text-[10px] text-[#5A6480]">Posts</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.02)] rounded-lg p-2">
              <div className="text-xs font-bold font-data text-[#E0E4F0]">
                {grade.grade}
              </div>
              <div className="text-[10px] text-[#5A6480]">Grade</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button className="btn-secondary flex-1 text-xs py-2 justify-center">
              <ExternalLink size={12} />
              View
            </button>
            <button className="btn-secondary flex-1 text-xs py-2 justify-center text-[#FF4444] border-[rgba(255,68,68,0.2)] hover:bg-[rgba(255,68,68,0.08)] hover:border-[rgba(255,68,68,0.4)]">
              <UserMinus size={12} />
              Unfollow
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Discovery Card                                                      */
/* ------------------------------------------------------------------ */

function DiscoveryCard({ creator, index }: { creator: Creator; index: number }) {
  const reasons = [
    'High engagement in your niche',
    'Similar audience interests',
    'Trending in your network',
  ];
  const reason = reasons[index % reasons.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: easing }}
    >
      <GlassCard className="h-full">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-14 h-14 rounded-full border-2 object-cover"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-[#E0E4F0] truncate">
                {creator.name}
              </h4>
              <p className="text-xs text-[#8B95B8]">{creator.handle}</p>
              <span
                className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                style={{
                  backgroundColor: 'rgba(78,141,255,0.12)',
                  color: '#4E8DFF',
                }}
              >
                {creator.niche}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#8B95B8] leading-relaxed line-clamp-2">
            {creator.bio}
          </p>

          <div className="flex items-center gap-2 text-[10px] text-[#5A6480]">
            <TrendingUp size={12} className="text-[#22C55E]" />
            <span>{reason}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="text-xs font-bold font-data text-[#E0E4F0]">
                {formatNumber(creator.followers)}
              </div>
              <div className="text-[10px] text-[#5A6480]">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold font-data text-[#E0E4F0]">
                {creator.engagement}%
              </div>
              <div className="text-[10px] text-[#5A6480]">Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold font-data text-[#E0E4F0]">
                {creator.qualityScore}
              </div>
              <div className="text-[10px] text-[#5A6480]">Score</div>
            </div>
          </div>

          <button className="btn-primary w-full text-xs py-2 justify-center">
            <UserPlus size={12} />
            Follow
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Creators Page                                                  */
/* ------------------------------------------------------------------ */

export default function Creators() {
  const [activeTab, setActiveTab] = useState<'following' | 'discovery'>('following');
  const [scoreFilter, setScoreFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  /* Filtered + sorted creators */
  const filteredCreators = useMemo(() => {
    let creators = [...mockCreators];

    // Score filter
    if (scoreFilter !== 'All') {
      const grade = gradeRanges.find((g) => g.grade === scoreFilter);
      if (grade) {
        creators = creators.filter(
          (c) => c.qualityScore >= grade.min && c.qualityScore <= grade.max
        );
      }
    }

    // Category filter
    if (categoryFilter !== 'All') {
      creators = creators.filter((c) => c.niche === categoryFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      creators = creators.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q)
      );
    }

    // Sort
    creators.sort((a, b) => {
      if (sortBy === 'score') return b.qualityScore - a.qualityScore;
      if (sortBy === 'followers') return b.followers - a.followers;
      if (sortBy === 'engagement') return b.engagement - a.engagement;
      return 0;
    });

    return creators;
  }, [scoreFilter, categoryFilter, searchQuery, sortBy]);

  /* Discovery tab: shuffle order */
  const discoveryCreators = useMemo(() => {
    const shuffled = [...mockCreators].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, []);

  /* Table columns */
  const tableColumns = [
    {
      key: 'name',
      header: 'Account',
      sortable: true,
      render: (row: Creator) => (
        <div className="flex items-center gap-2">
          <img src={row.avatar} alt={row.name} className="w-8 h-8 rounded-full" />
          <div>
            <div className="text-sm font-medium text-[#E0E4F0]">{row.name}</div>
            <div className="text-xs text-[#5A6480]">{row.handle}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'qualityScore',
      header: 'Score',
      sortable: true,
      render: (row: Creator) => <ScoreBadge score={row.qualityScore} size="sm" />,
    },
    {
      key: 'grade',
      header: 'Grade',
      render: (row: Creator) => {
        const g = getGrade(row.qualityScore);
        return (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-data"
            style={{ backgroundColor: `${g.color}20`, color: g.color }}
          >
            {g.grade}
          </span>
        );
      },
    },
    {
      key: 'followers',
      header: 'Followers',
      sortable: true,
      render: (row: Creator) => (
        <span className="text-sm font-data text-[#E0E4F0]">{formatNumber(row.followers)}</span>
      ),
    },
    {
      key: 'engagement',
      header: 'Eng. Rate',
      sortable: true,
      render: (row: Creator) => (
        <span className="text-sm font-data text-[#E0E4F0]">{row.engagement}%</span>
      ),
    },
    {
      key: 'niche',
      header: 'Category',
      render: (row: Creator) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-[rgba(78,141,255,0.12)] text-[#4E8DFF]">
          {row.niche}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-md hover:bg-[rgba(78,141,255,0.08)] text-[#8B95B8] hover:text-[#E0E4F0] transition-colors">
            <ExternalLink size={14} />
          </button>
          <button className="p-1.5 rounded-md hover:bg-[rgba(255,68,68,0.08)] text-[#8B95B8] hover:text-[#FF4444] transition-colors">
            <UserMinus size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easing }}
      >
        <h1 className="font-display font-bold text-2xl text-[#E0E4F0] tracking-tight mb-1">
          Creators
        </h1>
        <p className="text-sm text-[#8B95B8]">
          Quality intelligence for accounts you follow
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: easing }}
        className="flex items-center gap-1 border-b border-[rgba(255,255,255,0.08)]"
      >
        {[
          { key: 'following' as const, label: 'Following', icon: Users },
          { key: 'discovery' as const, label: 'Discovery', icon: UserPlus },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all relative',
                active ? 'text-[#4E8DFF]' : 'text-[#8B95B8] hover:text-[#E0E4F0]'
              )}
            >
              <Icon size={16} />
              {tab.label}
              {active && (
                <motion.div
                  layoutId="creatorTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#4E8DFF] to-[#00C8FF]"
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          );
        })}
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: easing }}
        className="glass-card"
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* Score Range */}
          <div className="relative">
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="form-input appearance-none pr-8 text-sm py-2 cursor-pointer"
            >
              <option value="All">All Scores</option>
              {gradeRanges.map((g) => (
                <option key={g.grade} value={g.grade}>
                  {g.grade} ({g.min}{g.max < 100 ? `-${g.max}` : '+'})
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6480] pointer-events-none"
            />
          </div>

          {/* Category */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-input appearance-none pr-8 text-sm py-2 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6480] pointer-events-none"
            />
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A6480]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators..."
              className="form-input w-full pl-9 text-sm py-2"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input appearance-none pr-8 text-sm py-2 cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6480] pointer-events-none"
            />
          </div>

          {/* View Toggle */}
          {activeTab === 'following' && (
            <div className="flex items-center bg-[rgba(255,255,255,0.05)] rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-all',
                  viewMode === 'grid'
                    ? 'bg-[rgba(78,141,255,0.15)] text-[#4E8DFF]'
                    : 'text-[#5A6480] hover:text-[#E0E4F0]'
                )}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  'p-2 rounded-md transition-all',
                  viewMode === 'table'
                    ? 'bg-[rgba(78,141,255,0.15)] text-[#4E8DFF]'
                    : 'text-[#5A6480] hover:text-[#E0E4F0]'
                )}
              >
                <Table2 size={16} />
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'following' ? (
          <motion.div
            key="following"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Quality Distribution */}
            <QualityDistribution creators={mockCreators} />

            {/* Creator Grid / Table */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCreators.map((creator, index) => (
                  <CreatorCard key={creator.id} creator={creator} index={index} />
                ))}
              </div>
            ) : (
              <GlassCard>
                <DataTable
                  data={filteredCreators as unknown as Record<string, unknown>[]}
                  columns={tableColumns as unknown as Array<import('@/components/DataTable').Column<Record<string, unknown>>>}
                  emptyMessage="No creators match your filters"
                />
              </GlassCard>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="discovery"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {discoveryCreators.map((creator, index) => (
                <DiscoveryCard key={creator.id} creator={creator} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {activeTab === 'following' && filteredCreators.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Users size={48} className="text-[#5A6480] mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-[#8B95B8] mb-1">
            No creators found
          </h3>
          <p className="text-sm text-[#5A6480]">
            Try adjusting your filters to see more results
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
