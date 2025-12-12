import React, { useState, useMemo } from 'react';
import { 
  Search, 
  RotateCcw, 
  Shield, 
  Sword, 
  Zap, 
  Skull, 
  Heart, 
  Flame, 
  Wind, 
  EyeOff, 
  Target, 
  AlertTriangle,
  Ghost,
  DollarSign,
  Snowflake,
  Gift,
  Plus,
  Minus,
  X,
  Clock
} from 'lucide-react';

// --- Data Definitions ---

type TokenType = 'Positive' | 'Negative' | 'Unique';
type Season = 'Common' | 'Season 1' | 'Season 2' | 'Marvel' | 'Santa vs Krampus';

interface TokenDef {
  id: string;
  name: string;
  type: TokenType;
  season: Season;
  stackLimit: number | string;
  description: string;
  duration: string; // New field for persistence/removal info
  icon?: React.ElementType;
}

const TOKEN_DATA: TokenDef[] = [
  // --- COMMON / SHARED ---
  {
    id: 'agility',
    name: 'Agility',
    type: 'Positive',
    season: 'Common',
    stackLimit: 2,
    description: 'When you receive damage, spend to roll 1 die. On 1-3, prevent half incoming dmg (rounded up).',
    duration: 'Persistent (Spend to use)',
    icon: Wind
  },
  {
    id: 'blind',
    name: 'Blind',
    type: 'Negative',
    season: 'Common',
    stackLimit: 1,
    description: 'Afflicted player rolls 1 die before Offensive Roll Phase. On 1-2, their phase ends immediately.',
    duration: 'Remove at end of Roll Phase',
    icon: EyeOff
  },
  {
    id: 'bounty',
    name: 'Bounty',
    type: 'Negative',
    season: 'Common',
    stackLimit: 1,
    description: 'When afflicted player is attacked, attacker gains +1 dmg and +1 CP.',
    duration: 'Remove after Attack resolves',
    icon: Target
  },
  {
    id: 'burn',
    name: 'Burn',
    type: 'Negative',
    season: 'Common',
    stackLimit: 5,
    description: 'Deals 1 dmg per token during Upkeep Phase. (Pyromancer specifics vary).',
    duration: 'Persistent',
    icon: Flame
  },
  {
    id: 'cheer',
    name: 'Cheer',
    type: 'Positive',
    season: 'Common',
    stackLimit: 3,
    description: 'Spend 1: Re-roll any number of dice. Spend 3: Change one die to a 6.',
    duration: 'Persistent (Spend to use)',
    icon: Zap
  },
  {
    id: 'concussion',
    name: 'Concussion',
    type: 'Negative',
    season: 'Common',
    stackLimit: 1,
    description: 'Skip your Income Phase.',
    duration: 'Remove after Income Phase',
    icon: AlertTriangle
  },
  {
    id: 'constrict',
    name: 'Constrict',
    type: 'Negative',
    season: 'Common',
    stackLimit: 1,
    description: 'Must spend 1 CP for every Roll Attempt after the first during Offensive Roll Phase.',
    duration: 'Remove at end of Roll Phase',
    icon: AlertTriangle
  },
  {
    id: 'crit',
    name: 'Crit',
    type: 'Positive',
    season: 'Common',
    stackLimit: 1,
    description: 'Spend during Offensive Roll Phase to add 50% dmg (rounded up) and make dmg Ultimate.',
    duration: 'Persistent (Spend to use)',
    icon: Sword
  },
  {
    id: 'evasive',
    name: 'Evasive',
    type: 'Positive',
    season: 'Common',
    stackLimit: 3,
    description: 'When taking dmg, spend to roll 1 die. On 1-2, prevent ALL dmg.',
    duration: 'Persistent (Spend to use)',
    icon: Wind
  },
  {
    id: 'flight',
    name: 'Flight',
    type: 'Positive',
    season: 'Common',
    stackLimit: 1,
    description: 'When attacked, spend to roll 1 die. On 4-6, prevent ALL dmg.',
    duration: 'Persistent (Spend to use)',
    icon: Wind
  },
  {
    id: 'knockdown',
    name: 'Knockdown',
    type: 'Negative',
    season: 'Common',
    stackLimit: 1,
    description: 'Spend 2 CP to remove before Offensive Roll Phase, otherwise skip that phase.',
    duration: 'Remove at end of Roll Phase',
    icon: AlertTriangle
  },
  {
    id: 'poison',
    name: 'Poison',
    type: 'Negative',
    season: 'Common',
    stackLimit: 3,
    description: 'Suffer 1 undefendable dmg per token during Upkeep Phase.',
    duration: 'Persistent',
    icon: Skull
  },
  {
    id: 'protect',
    name: 'Protect',
    type: 'Positive',
    season: 'Common',
    stackLimit: 1,
    description: 'Spend to prevent half of incoming damage (rounded up).',
    duration: 'Persistent (Spend to use)',
    icon: Shield
  },
  {
    id: 'retribution',
    name: 'Retribution',
    type: 'Positive',
    season: 'Common',
    stackLimit: 2,
    description: 'When attacked, spend to deal dmg back to attacker (usually half incoming).',
    duration: 'Persistent (Spend to use)',
    icon: Sword
  },
  {
    id: 'shadows',
    name: 'Shadows',
    type: 'Positive',
    season: 'Common',
    stackLimit: 2,
    description: 'Spend to roll die. 4-6: Prevent all dmg. Also boosts next attack dmg.',
    duration: 'Persistent (Spend to use)',
    icon: Ghost
  },
  {
    id: 'stun',
    name: 'Stun',
    type: 'Negative',
    season: 'Common',
    stackLimit: 1,
    description: 'Cannot Attack, Defend, or Play Cards. Skip Offensive & Defensive Roll Phases.',
    duration: 'Remove at end of Turn',
    icon: Zap
  },
  {
    id: 'targeted',
    name: 'Targeted',
    type: 'Negative',
    season: 'Common',
    stackLimit: 1,
    description: 'Attacker may re-roll any number of dice once when attacking you.',
    duration: 'Remove after Attack resolves',
    icon: Target
  },
  {
    id: 'wither',
    name: 'Wither',
    type: 'Negative',
    season: 'Common',
    stackLimit: 1,
    description: 'Next time you deal dmg, reduce it by half (rounded down).',
    duration: 'Remove after dealing dmg',
    icon: Skull
  },

  // --- SEASON 1 ---
  {
    id: 'chi',
    name: 'Chi',
    type: 'Positive',
    season: 'Season 1',
    stackLimit: 5,
    description: 'Spend to prevent 1 dmg OR add 1 dmg to your attack.',
    duration: 'Persistent (Spend to use)',
    icon: Zap
  },
  {
    id: 'entangle',
    name: 'Entangle',
    type: 'Negative',
    season: 'Season 1',
    stackLimit: 1,
    description: 'Cannot use Evasive tokens or perform Defensive Rolls.',
    duration: 'Persistent (Must be cleansed)',
    icon: AlertTriangle
  },
  {
    id: 'fire_mastery',
    name: 'Fire Mastery',
    type: 'Positive',
    season: 'Season 1',
    stackLimit: 5,
    description: 'Spend to deal 1 dmg to any opponent (Instant).',
    duration: 'Persistent (Spend to use)',
    icon: Flame
  },
  {
    id: 'ninjutsu',
    name: 'Ninjutsu',
    type: 'Positive',
    season: 'Season 1',
    stackLimit: 1,
    description: 'Spend to add dmg or make an attack undefendable.',
    duration: 'Persistent (Spend to use)',
    icon: Sword
  },
  {
    id: 'sneak_attack',
    name: 'Sneak Attack',
    type: 'Positive',
    season: 'Season 1',
    stackLimit: 1,
    description: 'Add +2 to your attack dmg.',
    duration: 'Remove after first Attack',
    icon: Sword
  },

  // --- SEASON 2 ---
  {
    id: 'reload',
    name: 'Reload',
    type: 'Positive',
    season: 'Season 2',
    stackLimit: 3,
    description: 'Spend to re-roll any number of dice (even after 3 attempts).',
    duration: 'Persistent (Spend to use)',
    icon: RotateCcw
  },
  {
    id: 'duel',
    name: 'Duel',
    type: 'Negative',
    season: 'Season 2',
    stackLimit: 1,
    description: 'Forces an isolated 1v1 roll-off between players.',
    duration: 'Resolves Immediately',
    icon: Sword
  },
  {
    id: 'honor',
    name: 'Honor',
    type: 'Positive',
    season: 'Season 2',
    stackLimit: 5,
    description: 'Spend to increase damage dealt by 1.',
    duration: 'Persistent (Spend to use)',
    icon: Shield
  },
  {
    id: 'shame',
    name: 'Shame',
    type: 'Negative',
    season: 'Season 2',
    stackLimit: 5,
    description: 'Reduces damage dealt by 1.',
    duration: 'Persistent',
    icon: Skull
  },
  {
    id: 'tactical_advantage',
    name: 'Tac. Advantage',
    type: 'Positive',
    season: 'Season 2',
    stackLimit: 5,
    description: 'Spend to gain 1 CP or draw 1 card.',
    duration: 'Persistent (Spend to use)',
    icon: Zap
  },
  {
    id: 'cursed_doubloon',
    name: 'Cursed Doubloon',
    type: 'Unique',
    season: 'Season 2',
    stackLimit: 5,
    description: 'Upkeep: Roll die. 1-2: take dmg. 6: Give doubloon to another player.',
    duration: 'Persistent (Passes on 6)',
    icon: DollarSign
  },
  {
    id: 'parlay',
    name: 'Parlay',
    type: 'Negative',
    season: 'Season 2',
    stackLimit: 1,
    description: 'Deal 0 dmg during your next turn.',
    duration: 'Remove at end of Turn',
    icon: EyeOff
  },
  {
    id: 'nanite',
    name: 'Nanite',
    type: 'Negative',
    season: 'Season 2',
    stackLimit: 5,
    description: 'Deals dmg over time or explodes for high dmg (Artificer).',
    duration: 'Persistent',
    icon: Zap
  },
  {
    id: 'synth',
    name: 'Synth',
    type: 'Positive',
    season: 'Season 2',
    stackLimit: 5,
    description: 'Spend to upgrade your bots or gain CP.',
    duration: 'Persistent (Spend to use)',
    icon: Zap
  },
  {
    id: 'holy_presence',
    name: 'Holy Presence',
    type: 'Positive',
    season: 'Season 2',
    stackLimit: 1,
    description: 'Prevents all Negative Status Effects.',
    duration: 'Persistent (Spend/Remove varies)',
    icon: Shield
  },
  {
    id: 'blinding_light',
    name: 'Blinding Light',
    type: 'Negative',
    season: 'Season 2',
    stackLimit: 1,
    description: 'Roll 1 die fewer during Offensive Roll Phase.',
    duration: 'Remove at end of Roll Phase',
    icon: EyeOff
  },
  {
    id: 'blood_power',
    name: 'Blood Power',
    type: 'Positive',
    season: 'Season 2',
    stackLimit: 5,
    description: 'Spend to heal yourself or deal extra dmg.',
    duration: 'Persistent (Spend to use)',
    icon: Heart
  },
  {
    id: 'mesmerize',
    name: 'Mesmerize',
    type: 'Negative',
    season: 'Season 2',
    stackLimit: 1,
    description: 'Afflicted player gives their CP gain to the Vampire Lord.',
    duration: 'Remove start of Vampire\'s next turn',
    icon: EyeOff
  },

  // --- MARVEL ---
  {
    id: 'webbed',
    name: 'Webbed',
    type: 'Negative',
    season: 'Marvel',
    stackLimit: 1,
    description: 'Cannot re-roll dice during Roll Phase.',
    duration: 'Remove at end of Roll Phase',
    icon: Wind
  },
  {
    id: 'combo',
    name: 'Combo',
    type: 'Positive',
    season: 'Marvel',
    stackLimit: 1,
    description: 'Perform an additional Attack action this turn.',
    duration: 'Remove at end of Turn',
    icon: Zap
  },
  {
    id: 'kinetic_energy',
    name: 'Kinetic Energy',
    type: 'Positive',
    season: 'Marvel',
    stackLimit: 5,
    description: 'Spend to deal burst damage back to opponents.',
    duration: 'Persistent (Spend to use)',
    icon: Zap
  },
  {
    id: 'vibranium_suit',
    name: 'Vibranium Suit',
    type: 'Positive',
    season: 'Marvel',
    stackLimit: 1,
    description: 'Spend to prevent incoming dmg.',
    duration: 'Persistent (Spend to use)',
    icon: Shield
  },
  {
    id: 'cosmic_ray',
    name: 'Cosmic Ray',
    type: 'Positive',
    season: 'Marvel',
    stackLimit: 2,
    description: 'Spend to roll extra dice for dmg calculation.',
    duration: 'Persistent (Spend to use)',
    icon: Zap
  },
  {
    id: 'time_bomb',
    name: 'Time Bomb',
    type: 'Negative',
    season: 'Marvel',
    stackLimit: 1,
    description: 'Counts down. If explodes, massive undefendable dmg.',
    duration: 'Persistent (Until explode/defuse)',
    icon: Skull
  },
  {
    id: 'covert_ops',
    name: 'Covert Ops',
    type: 'Positive',
    season: 'Marvel',
    stackLimit: 3,
    description: 'Spend to change die result or look at opponent cards.',
    duration: 'Persistent (Spend to use)',
    icon: EyeOff
  },
  {
    id: 'reality_warp',
    name: 'Reality Warp',
    type: 'Negative',
    season: 'Marvel',
    stackLimit: 1,
    description: 'Must re-roll one die (forced by opponent).',
    duration: 'Remove after triggered',
    icon: RotateCcw
  },
  {
    id: 'illusion',
    name: 'Illusion',
    type: 'Positive',
    season: 'Marvel',
    stackLimit: 2,
    description: 'Spend to force opponent to miss attack (attack clone).',
    duration: 'Persistent (Spend to use)',
    icon: Ghost
  },
  {
    id: 'ice_shard',
    name: 'Ice Shard',
    type: 'Negative',
    season: 'Marvel',
    stackLimit: 5,
    description: 'Stacks to freeze opponents (Stun effect).',
    duration: 'Persistent',
    icon: Snowflake
  },
  {
    id: 'rage',
    name: 'Rage',
    type: 'Positive',
    season: 'Marvel',
    stackLimit: 5,
    description: 'Increases damage dealt.',
    duration: 'Persistent',
    icon: Flame
  },
  {
    id: 'focus_fire',
    name: 'Focus Fire',
    type: 'Negative',
    season: 'Marvel',
    stackLimit: 1,
    description: 'All attacks against this target deal +1 dmg.',
    duration: 'Persistent',
    icon: Target
  },

  // --- SANTA / KRAMPUS ---
  {
    id: 'coal',
    name: 'Coal',
    type: 'Negative',
    season: 'Santa vs Krampus',
    stackLimit: 5,
    description: 'Reduces damage dealt or deals damage to holder.',
    duration: 'Persistent',
    icon: Skull
  },
  {
    id: 'eggnog',
    name: 'Eggnog',
    type: 'Positive',
    season: 'Santa vs Krampus',
    stackLimit: 5,
    description: 'Provides Healing or CP.',
    duration: 'Persistent (Spend to use)',
    icon: Heart
  },
  {
    id: 'gift',
    name: 'Gift',
    type: 'Unique',
    season: 'Santa vs Krampus',
    stackLimit: 3,
    description: 'Can be positive (Heal/CP) or trap (Dmg) depending on source.',
    duration: 'Persistent (Spend to use)',
    icon: Gift
  },
  {
    id: 'joy',
    name: 'Joy',
    type: 'Positive',
    season: 'Santa vs Krampus',
    stackLimit: 5,
    description: 'Enhances abilities or defense.',
    duration: 'Persistent',
    icon: Heart
  },
];

// --- Helper Components ---

const FilterButton = ({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 whitespace-nowrap
      ${active 
        ? 'bg-indigo-600 text-white shadow-md' 
        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
      }`}
  >
    {label}
  </button>
);

// --- Main App Component ---

const App = () => {
  // State
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [activeSeason, setActiveSeason] = useState<Season | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Derived Data
  const filteredTokens = useMemo(() => {
    // 1. Filter
    const filtered = TOKEN_DATA.filter(token => {
      const matchesSeason = activeSeason === 'All' || token.season === activeSeason;
      const matchesSearch = token.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSeason && matchesSearch;
    });

    // 2. Sort: Active (count > 0) items first, then alphabetical
    return filtered.sort((a, b) => {
      const countA = counts[a.id] || 0;
      const countB = counts[b.id] || 0;
      
      const hasCountA = countA > 0;
      const hasCountB = countB > 0;

      // If one has count and other doesn't, put the one with count first
      if (hasCountA && !hasCountB) return -1;
      if (!hasCountA && hasCountB) return 1;
      
      // Otherwise sort alphabetically
      return a.name.localeCompare(b.name);
    });
  }, [activeSeason, searchQuery, counts]);

  // Handlers
  const adjustCount = (id: string, delta: number, limit: number | string) => {
    setCounts(prev => {
      const current = prev[id] || 0;
      const numericLimit = typeof limit === 'number' ? limit : 99;
      const next = Math.max(0, Math.min(numericLimit, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const resetAll = () => setCounts({});

  // Helpers for styling
  const getTypeColor = (type: TokenType) => {
    switch (type) {
      case 'Positive': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Negative': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Unique': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-indigo-500 selection:text-white p-4 pb-20">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
              <Sword size={24} className="text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Dice Throne Tracker
            </h1>
          </div>
          
          <button 
            onClick={resetAll}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors border border-gray-700"
          >
            <RotateCcw size={16} />
            Reset Counts
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search tokens (e.g., 'Agility', 'Poison')..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <FilterButton active={activeSeason === 'All'} label="All" onClick={() => setActiveSeason('All')} />
            <FilterButton active={activeSeason === 'Common'} label="Common" onClick={() => setActiveSeason('Common')} />
            <FilterButton active={activeSeason === 'Season 1'} label="Season 1" onClick={() => setActiveSeason('Season 1')} />
            <FilterButton active={activeSeason === 'Season 2'} label="Season 2" onClick={() => setActiveSeason('Season 2')} />
            <FilterButton active={activeSeason === 'Marvel'} label="Marvel" onClick={() => setActiveSeason('Marvel')} />
            <FilterButton active={activeSeason === 'Santa vs Krampus'} label="Santa/Krampus" onClick={() => setActiveSeason('Santa vs Krampus')} />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTokens.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Ghost size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No tokens found matching your criteria.</p>
          </div>
        ) : (
          filteredTokens.map((token) => (
            <div 
              key={token.id}
              className={`relative flex flex-col bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${counts[token.id] ? 'ring-2 ring-indigo-500/50 -translate-y-1' : ''}`}
            >
              {/* Background Icon Watermark */}
              {token.icon && React.createElement(token.icon, {
                size: 140,
                className: "absolute -bottom-8 -right-8 text-gray-700/10 transform rotate-12 pointer-events-none"
              })}

              <div className="p-5 flex-1 flex flex-col z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="pr-2">
                    <h3 className="text-lg font-bold text-gray-100 leading-tight">{token.name}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded border ${getTypeColor(token.type)}`}>
                        {token.type}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-700/50 p-2 rounded-lg text-gray-400">
                    {token.icon && React.createElement(token.icon, { size: 20 })}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300 leading-relaxed mb-4 flex-grow">
                  {token.description}
                </p>

                {/* Duration / Persistence */}
                <div className="flex items-center gap-2 text-xs text-indigo-300 mb-4 bg-indigo-900/30 p-2 rounded border border-indigo-500/20">
                    <Clock size={14} />
                    <span className="font-semibold">{token.duration}</span>
                </div>

                {/* Footer / Controls */}
                <div className="mt-auto pt-3 border-t border-gray-700/50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-gray-500 font-mono">
                      Limit: <span className="text-gray-400">{token.stackLimit}</span>
                    </div>
                    
                    <div className="flex items-center bg-gray-900/80 rounded-lg p-1 border border-gray-700 shadow-inner">
                      <button 
                        onClick={() => adjustCount(token.id, -1, token.stackLimit)}
                        className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-colors disabled:opacity-30 text-gray-400"
                        disabled={!counts[token.id]}
                      >
                        <Minus size={16} />
                      </button>
                      
                      <span className={`w-8 text-center text-lg font-bold font-mono ${counts[token.id] ? 'text-indigo-400' : 'text-gray-600'}`}>
                        {counts[token.id] || 0}
                      </span>
                      
                      <button 
                        onClick={() => adjustCount(token.id, 1, token.stackLimit)}
                        className="p-1.5 hover:bg-green-500/20 hover:text-green-400 rounded-md transition-colors disabled:opacity-30 text-gray-400"
                        disabled={counts[token.id] >= (typeof token.stackLimit === 'number' ? token.stackLimit : 99)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
