import React from 'react';

interface DragonMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: 'happy' | 'sad' | 'excited' | 'thinking';
  animate?: boolean;
  onClick?: () => void;
  className?: string;
}

export const DragonMascot: React.FC<DragonMascotProps> = ({
  size = 'md',
  mood = 'happy',
  animate = true,
  onClick,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  const animationClass = animate
    ? mood === 'excited'
      ? 'animate-dance'
      : mood === 'sad'
      ? 'animate-shake'
      : 'animate-bounce-gentle'
    : '';

  const getEyeExpression = () => {
    switch (mood) {
      case 'sad':
        return { eyeY: 18, eyeHeight: 6 };
      case 'excited':
        return { eyeY: 15, eyeHeight: 10 };
      case 'thinking':
        return { eyeY: 16, eyeHeight: 4 };
      default:
        return { eyeY: 16, eyeHeight: 8 };
    }
  };

  const getMouthPath = () => {
    switch (mood) {
      case 'sad':
        return 'M 18 32 Q 25 28 32 32';
      case 'excited':
        return 'M 16 28 Q 25 38 34 28 Q 25 35 16 28';
      case 'thinking':
        return 'M 20 30 L 30 30';
      default:
        return 'M 18 28 Q 25 35 32 28';
    }
  };

  const { eyeY, eyeHeight } = getEyeExpression();

  return (
    <div
      onClick={onClick}
      className={`${sizeClasses[size]} ${animationClass} ${onClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${className}`}
    >
      <svg viewBox="0 0 50 50" className="w-full h-full drop-shadow-lg">
        {/* Body */}
        <ellipse cx="25" cy="35" rx="12" ry="10" className="fill-dragon-pink" />
        
        {/* Wings */}
        <path
          d="M 10 25 Q 2 20 5 30 Q 8 35 13 32"
          className="fill-dragon-blue"
          opacity="0.8"
        />
        <path
          d="M 40 25 Q 48 20 45 30 Q 42 35 37 32"
          className="fill-dragon-blue"
          opacity="0.8"
        />
        
        {/* Head */}
        <circle cx="25" cy="20" r="14" className="fill-dragon-pink" />
        
        {/* Horns */}
        <path d="M 15 10 Q 12 2 18 8" className="fill-dragon-purple" />
        <path d="M 35 10 Q 38 2 32 8" className="fill-dragon-purple" />
        
        {/* Ears/spikes */}
        <circle cx="12" cy="14" r="3" className="fill-dragon-blue" />
        <circle cx="38" cy="14" r="3" className="fill-dragon-blue" />
        
        {/* Eyes */}
        <ellipse cx="19" cy={eyeY} rx="4" ry={eyeHeight / 2} fill="white" />
        <ellipse cx="31" cy={eyeY} rx="4" ry={eyeHeight / 2} fill="white" />
        <circle cx="20" cy={eyeY} r="2" fill="#1a1a2e" />
        <circle cx="32" cy={eyeY} r="2" fill="#1a1a2e" />
        {/* Eye sparkles */}
        <circle cx="21" cy={eyeY - 1} r="0.8" fill="white" />
        <circle cx="33" cy={eyeY - 1} r="0.8" fill="white" />
        
        {/* Blush */}
        <ellipse cx="13" cy="22" rx="3" ry="2" className="fill-dragon-blue" opacity="0.4" />
        <ellipse cx="37" cy="22" rx="3" ry="2" className="fill-dragon-blue" opacity="0.4" />
        
        {/* Mouth */}
        <path
          d={getMouthPath()}
          fill="none"
          stroke="#1a1a2e"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        {/* Nostrils */}
        <circle cx="22" cy="24" r="1" fill="#1a1a2e" opacity="0.5" />
        <circle cx="28" cy="24" r="1" fill="#1a1a2e" opacity="0.5" />
        
        {/* Belly spot */}
        <ellipse cx="25" cy="37" rx="6" ry="5" className="fill-dragon-blue" opacity="0.3" />
        
        {/* Tail */}
        <path
          d="M 35 42 Q 45 45 42 38 Q 40 35 37 40"
          className="fill-dragon-pink"
        />
        <circle cx="43" cy="38" r="2" className="fill-dragon-purple" />
        
        {/* Feet */}
        <ellipse cx="20" cy="44" rx="4" ry="2" className="fill-dragon-purple" />
        <ellipse cx="30" cy="44" rx="4" ry="2" className="fill-dragon-purple" />
      </svg>
    </div>
  );
};
