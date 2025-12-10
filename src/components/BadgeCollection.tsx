import React from 'react';
import { PokemonBadge, getPokemonName, getPokemonQuote } from './PokemonBadge';
import { X, Award } from 'lucide-react';

interface BadgeCollectionProps {
  isOpen: boolean;
  onClose: () => void;
  earnedBadges: number[];
}

export const BadgeCollection: React.FC<BadgeCollectionProps> = ({
  isOpen,
  onClose,
  earnedBadges,
}) => {
  if (!isOpen) return null;

  const totalBadges = 20;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-pika-yellow p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="text-pika-dark" size={24} />
            <h2 className="text-xl font-bold text-pika-dark">My Badges</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-cbenter justify-center rounded-full bg-pika-dark/20 hover:bg-pika-dark/30 text-pika-dark transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Badge count */}
        <div className="p-4 text-center border-b border-border">
          <span className="text-2xl font-bold text-pika-yellow">{earnedBadges.length}</span>
          <span className="text-muted-foreground"> / {totalBadges} badges collected</span>
        </div>

        {/* Badge grid */}
        <div className="p-4 max-h-[400px] overflow-y-auto">
          <div className="flex gap-4 pb-2 gap-4">
            {Array.from({ length: totalBadges }).map((_, i) => {
              const isEarned = earnedBadges.includes(i);
              return (
                <div key={i} className="flex flex-col items-center">
                  <PokemonBadge
                    pokemonId={i}
                    earned={isEarned}
                    size="lg"
                    showLabel={isEarned}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer message */}
        <div className="p-4 bg-muted text-center">
          <p className="text-sm text-muted-foreground">
            {earnedBadges.length === 0 
              ? "Complete levels to earn Pokemon badges!"
              : earnedBadges.length === totalBadges
              ? "🎉 Amazing! You collected them all!"
              : `Keep playing to collect more badges!`
            }
          </p>
        </div>
      </div>
    </div>
  );
};