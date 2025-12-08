import React from 'react';

interface DragonBadgeProps {
  type: 'bronze' | 'silver' | 'gold' | 'diamond' | 'rainbow';
  size?: 'sm' | 'md' | 'lg';
  earned?: boolean;
  showLabel?: boolean;
}

const badgeConfig = {
  bronze: {
    color: 'fill-amber-600',
    accent: 'fill-amber-400',
    label: 'Bronze Dragon',
    stars: 1,
  },
  silver: {
    color: 'fill-gray-400',
    accent: 'fill-gray-200',
    label: 'Silver Dragon',
    stars: 2,
  },
  gold: {
    color: 'fill-yellow-400',
    accent: 'fill-yellow-200',
    label: 'Gold Dragon',
    stars: 3,
  },
  diamond: {
    color: 'fill-cyan-400',
    accent: 'fill-cyan-200',
    label: 'Diamond Dragon',
    stars: 4,
  },
  rainbow: {
    color: 'fill-dragon-pink',
    accent: 'fill-dragon-blue',
    label: 'Rainbow Dragon',
    stars: 5,
  },
};

export const DragonBadge: React.FC<DragonBadgeProps> = ({
  type,
  size = 'md',
  earned = true,
  showLabel = false,
}) => {
  const config = badgeConfig[type];
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className={`flex flex-col items-center gap-1 ${!earned ? 'opacity-30 grayscale' : ''}`}>
      <div className={`${sizeClasses[size]} ${earned ? 'animate-sparkle' : ''}`}>
        <svg viewBox="0 0 50 50" className="w-full h-full drop-shadow-lg">
          {/* Badge circle */}
          <circle cx="25" cy="25" r="22" className={config.color} />
          <circle cx="25" cy="25" r="18" className={config.accent} opacity="0.3" />
          
          {/* Dragon silhouette */}
          <path
            d="M 25 12 
               Q 32 12 34 18 
               Q 36 14 38 16 
               Q 36 20 34 22
               Q 36 26 34 32
               Q 32 38 25 40
               Q 18 38 16 32
               Q 14 26 16 22
               Q 14 20 12 16
               Q 14 14 16 18
               Q 18 12 25 12"
            fill="white"
            opacity="0.9"
          />
          
          {/* Stars based on level */}
          {Array.from({ length: config.stars }).map((_, i) => {
            const angle = (i - (config.stars - 1) / 2) * 20;
            const x = 25 + Math.sin((angle * Math.PI) / 180) * 8;
            const y = 8 + Math.cos((angle * Math.PI) / 180) * 2;
            return (
              <polygon
                key={i}
                points={`${x},${y - 2} ${x + 1},${y} ${x + 2.5},${y} ${x + 1.5},${y + 1.2} ${x + 2},${y + 3} ${x},${y + 2} ${x - 2},${y + 3} ${x - 1.5},${y + 1.2} ${x - 2.5},${y} ${x - 1},${y}`}
                fill="white"
              />
            );
          })}
        </svg>
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-foreground/80">{config.label}</span>
      )}
    </div>
  );
};
