import React from 'react';

interface PikachuMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: 'happy' | 'excited' | 'sad' | 'thinking';
  animate?: boolean;
  onClick?: () => void;
}

export const PikachuMascot: React.FC<PikachuMascotProps> = ({
  size = 'md',
  mood = 'happy',
  animate = false,
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36',
  };

  const animationClass = animate 
    ? mood === 'excited' ? 'animate-dance' : 'animate-bounce-gentle'
    : '';

  return (
    <div 
      className={`${sizeClasses[size]} ${animationClass} cursor-pointer transition-transform hover:scale-110`}
      onClick={onClick}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Body */}
        <ellipse cx="50" cy="60" rx="28" ry="30" fill="#FFD93D" />
        
        {/* Head */}
        <circle cx="50" cy="38" r="25" fill="#FFD93D" />
        
        {/* Ears */}
        <path d="M 25 25 Q 18 5 30 15 Q 35 20 32 28" fill="#FFD93D" />
        <path d="M 30 15 Q 20 8 25 18" fill="#1a1a1a" />
        <path d="M 75 25 Q 82 5 70 15 Q 65 20 68 28" fill="#FFD93D" />
        <path d="M 70 15 Q 80 8 75 18" fill="#1a1a1a" />
        
        {/* Red cheeks */}
        <circle cx="28" cy="42" r="6" fill="#FF6B6B" opacity="0.8" />
        <circle cx="72" cy="42" r="6" fill="#FF6B6B" opacity="0.8" />
        
        {/* Eyes */}
        {mood === 'happy' || mood === 'excited' ? (
          <>
            <ellipse cx="40" cy="36" rx="5" ry="6" fill="#1a1a1a" />
            <ellipse cx="60" cy="36" rx="5" ry="6" fill="#1a1a1a" />
            <circle cx="42" cy="34" r="2" fill="white" />
            <circle cx="62" cy="34" r="2" fill="white" />
          </>
        ) : mood === 'sad' ? (
          <>
            <ellipse cx="40" cy="38" rx="5" ry="4" fill="#1a1a1a" />
            <ellipse cx="60" cy="38" rx="5" ry="4" fill="#1a1a1a" />
            <path d="M 35 32 Q 40 30 45 32" stroke="#1a1a1a" strokeWidth="2" fill="none" />
            <path d="M 55 32 Q 60 30 65 32" stroke="#1a1a1a" strokeWidth="2" fill="none" />
          </>
        ) : (
          <>
            <ellipse cx="40" cy="36" rx="5" ry="6" fill="#1a1a1a" />
            <ellipse cx="60" cy="36" rx="5" ry="6" fill="#1a1a1a" />
            <circle cx="42" cy="34" r="2" fill="white" />
            <circle cx="62" cy="34" r="2" fill="white" />
          </>
        )}
        
        {/* Mouth */}
        {mood === 'happy' ? (
          <path d="M 45 48 Q 50 52 55 48" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : mood === 'excited' ? (
          <ellipse cx="50" cy="50" rx="6" ry="4" fill="#1a1a1a" />
        ) : mood === 'sad' ? (
          <path d="M 45 52 Q 50 48 55 52" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : (
          <circle cx="55" cy="48" r="2" fill="#1a1a1a" />
        )}
        
        {/* Nose */}
        <ellipse cx="50" cy="44" rx="2" ry="1.5" fill="#1a1a1a" />
        
        {/* Tail */}
        <path d="M 78 55 L 90 45 L 95 50 L 88 55 L 95 60 L 90 65 L 78 60" fill="#8B4513" />
        <path d="M 78 55 L 85 50 L 88 55 L 85 60 L 78 60" fill="#FFD93D" />
        
        {/* Arms (small) */}
        <ellipse cx="25" cy="62" rx="6" ry="8" fill="#FFD93D" />
        <ellipse cx="75" cy="62" rx="6" ry="8" fill="#FFD93D" />
        
        {/* Feet */}
        <ellipse cx="38" cy="88" rx="10" ry="6" fill="#FFD93D" />
        <ellipse cx="62" cy="88" rx="10" ry="6" fill="#FFD93D" />
        
        {/* Stripes on back */}
        <path d="M 35 50 Q 38 55 35 60" stroke="#8B4513" strokeWidth="3" fill="none" />
        <path d="M 65 50 Q 62 55 65 60" stroke="#8B4513" strokeWidth="3" fill="none" />
      </svg>
    </div>
  );
};