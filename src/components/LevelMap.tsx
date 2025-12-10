import React from 'react';
import { Lock, Check } from 'lucide-react';

interface LevelMapProps {
  currentLevel: number;
  completedLevels: number[];
  onSelectLevel: (level: number) => void;
  levelStars: Record<number, number>;
}

const TOTAL_LEVELS = 20;

// colors for level nodes - matching pantone pokemon palette
const levelColors = [
  '#FFD93D', '#6BB5A0', '#E87D3E', '#6EB5D4', '#FFAEC9',
  '#F5D76E', '#705898', '#C4A67C', '#5BA3D4', '#E07B53',
  '#6BB5A0', '#FFD93D', '#FFAEC9', '#6EB5D4', '#E87D3E',
  '#705898', '#F5D76E', '#C4A67C', '#5BA3D4', '#FFD93D',
];

export const LevelMap: React.FC<LevelMapProps> = ({
  currentLevel,
  completedLevels,
  onSelectLevel,
  levelStars,
}) => {
  const isLevelUnlocked = (level: number) => {
    if (level === 1) return true;
    return completedLevels.includes(level - 1);
  };

  const isLevelCompleted = (level: number) => completedLevels.includes(level);

  //  path layout
  const getPosition = (level: number) => {
    const row = Math.floor((level - 1) / 4);
    const col = (level - 1) % 4;
    const isReversed = row % 2 === 1;
    const actualCol = isReversed ? 3 - col : col;
    
    return {
      left: `${actualCol * 25 + 12.5}%`,
      top: `${row * 80 + 40}px`,
    };
  };

  return (
    <div className="relative w-full overflow-y-auto max-h-[400px] pb-8" style={{ minHeight: '350px' }}>
      {/* path lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '450px' }}>
        {Array.from({ length: TOTAL_LEVELS - 1 }).map((_, i) => {
          const level = i + 1;
          const pos1 = getPosition(level);
          const pos2 = getPosition(level + 1);
          
          const x1 = parseFloat(pos1.left);
          const y1 = parseFloat(pos1.top) + 24;
          const x2 = parseFloat(pos2.left);
          const y2 = parseFloat(pos2.top) + 24;
          
          return (
            <line
              key={i}
              x1={`${x1}%`}
              y1={y1}
              x2={`${x2}%`}
              y2={y2}
              stroke={isLevelCompleted(level) ? '#FFD93D' : '#d1d5db'}
              strokeWidth="4"
              strokeDasharray={isLevelCompleted(level) ? '0' : '8 4'}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* level nodes */}
      {Array.from({ length: TOTAL_LEVELS }).map((_, i) => {
        const level = i + 1;
        const pos = getPosition(level);
        const unlocked = isLevelUnlocked(level);
        const completed = isLevelCompleted(level);
        const stars = levelStars[level] || 0;
        const isCurrent = level === currentLevel;
        
        return (
          <div
            key={level}
            className="absolute transform -translate-x-1/2"
            style={{ left: pos.left, top: pos.top }}
          >
            <button
              onClick={() => unlocked && onSelectLevel(level)}
              disabled={!unlocked}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                transition-all duration-200 shadow-lg border-4
                ${unlocked 
                  ? 'hover:scale-110 cursor-pointer' 
                  : 'cursor-not-allowed opacity-60'
                }
                ${isCurrent ? 'animate-pulse-glow scale-110' : ''}
              `}
              style={{
                backgroundColor: unlocked ? levelColors[i] : '#9ca3af',
                borderColor: completed ? '#FFD93D' : unlocked ? 'white' : '#6b7280',
                color: unlocked ? '#1a1a1a' : '#4b5563',
              }}
            >
              {!unlocked ? (
                <Lock size={18} />
              ) : completed ? (
                <Check size={20} strokeWidth={3} />
              ) : (
                level
              )}
            </button>
            
          </div>
        );
      })}
    </div>
  );
};