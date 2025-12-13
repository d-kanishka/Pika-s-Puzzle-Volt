import React from 'react';

interface PokemonBadgeProps {
  pokemonId: number;
  earned?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

// Pokemon badge
const pokemonData = [
  { name: 'Pikachu', color: '#FFD93D', accent: '#8B4513', quote: 'Electric and bright!' },
  { name: 'Togepi', color: '#FFF5DC', accent: '#E07B53', quote: 'Full of happiness!' },
  { name: 'Marill', color: '#5BA3D4', accent: '#4A8BC4', quote: 'Bouncy and blue!' },
  { name: 'Bulbasaur', color: '#6BB5A0', accent: '#4A9080', quote: 'Grow stronger!' },
  { name: 'Charmander', color: '#E87D3E', accent: '#D66A2B', quote: 'Fiery spirit!' },
  { name: 'Squirtle', color: '#6EB5D4', accent: '#5AA5C4', quote: 'Cool and calm!' },
  { name: 'Eevee', color: '#C4A67C', accent: '#8B6914', quote: 'Full of potential!' },
  { name: 'Jigglypuff', color: '#FFAEC9', accent: '#40C4C0', quote: 'Sweet melodies!' },
  { name: 'Psyduck', color: '#F5D76E', accent: '#4A4A4A', quote: 'Headache power!' },
  { name: 'Snorlax', color: '#6B8FA3', accent: '#E8DCC8', quote: 'Rest and recharge!' },
  { name: 'Mew', color: '#FFAEC9', accent: '#40C4C0', quote: 'Mysterious and rare!' },
  { name: 'Meowth', color: '#F5E6C8', accent: '#8B6914', quote: 'Thats right!' },
  { name: 'Gengar', color: '#705898', accent: '#E07B53', quote: 'Spooky fun!' },
  { name: 'Butterfree', color: '#9090C8', accent: '#E07B53', quote: 'Fly high!' },
  { name: 'Clefairy', color: '#FFAEC9', accent: '#8B6914', quote: 'Moon magic!' },
  { name: 'Vulpix', color: '#E87D3E', accent: '#8B4513', quote: 'Six tails of fire!' },
  { name: 'Slowpoke', color: '#FFAEC9', accent: '#F5E6C8', quote: 'Take it easy!' },
  { name: 'Ditto', color: '#A890F0', accent: '#705898', quote: 'Transform!' },
  { name: 'Lapras', color: '#6EB5D4', accent: '#8B4513', quote: 'Ocean voyager!' },
  { name: 'Dragonite', color: '#E87D3E', accent: '#6BB5A0', quote: 'Dragon master!' },
];

export const PokemonBadge: React.FC<PokemonBadgeProps> = ({
  pokemonId,
  earned = true,
  showLabel = false,
  size = 'md',
  onClick,
}) => {
  const pokemon = pokemonData[pokemonId % pokemonData.length];
  
  const sizeClasses = {
    sm: 'w-16 h-20',
    md: 'w-20 h-24',
    lg: 'w-28 h-32',
  };

  const imageSizes = {
    sm: 64,
    md: 96,
    lg: 128,
  };

  // PokeAPI
  const getPokemonSprite = (name: string): string => {
    const pokemonIds: Record<string, number> = {
      'Pikachu': 25, 'Togepi': 175, 'Marill': 183, 'Bulbasaur': 1,
      'Charmander': 4, 'Squirtle': 7, 'Eevee': 133, 'Jigglypuff': 39,
      'Psyduck': 54, 'Snorlax': 143, 'Mew': 151, 'Meowth': 52,
      'Gengar': 94, 'Butterfree': 12, 'Clefairy': 35, 'Vulpix': 37,
      'Slowpoke': 79, 'Ditto': 132, 'Lapras': 131, 'Dragonite': 149,
    };
    const id = pokemonIds[name] || 25;
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  };

  return (
    <div 
      className={`flex flex-col items-center ${!earned ? 'opacity-30 grayscale' : ''} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div 
        className={`${sizeClasses[size]} rounded-2xl p-2 flex flex-col items-center justify-center shadow-lg flex-shrink-0`}
        style={{ backgroundColor: pokemon.color }}
      >
        {/* Pokemon sprite */}
        <img 
          src={getPokemonSprite(pokemon.name)} 
          alt={pokemon.name}
          className="object-contain drop-shadow-md"
          style={{ 
            width: imageSizes[size], 
            height: imageSizes[size]
          }}
        />
      </div>
      
      {/* Name label */}
      <div className="mt-1 px-3 py-1 bg-card rounded-full shadow-sm">
        <span className="text-xs font-semibold text-foreground">{pokemon.name}</span>
      </div>
      
      {/* Quote */}
      {showLabel && (
        <span className="text-[10px] text-muted-foreground mt-1 text-center italic max-w-20">
          "{pokemon.quote}"
        </span>
      )}
    </div>
  );
};

export const getPokemonQuote = (pokemonId: number): string => {
  return pokemonData[pokemonId % pokemonData.length].quote;
};

export const getPokemonName = (pokemonId: number): string => {
  return pokemonData[pokemonId % pokemonData.length].name;
};