import React, { useState } from 'react';
import { Calculator } from '@/components/Calculator';
import { MathGame } from '@/components/MathGame';

const Index = () => {
  const [isGameOpen, setIsGameOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-dragon-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-dragon-pink/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-dragon-purple/5 rounded-full blur-2xl" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-32 right-32 text-3xl opacity-20 animate-float">✨</div>
        <div className="absolute bottom-40 left-32 text-2xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🌟</div>
        <div className="absolute top-1/3 left-16 text-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>⭐</div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <h1 className="text-center text-2xl font-bold text-dragon-gradient mb-6">
          Dragon Calculator
        </h1>
        <Calculator onOpenGame={() => setIsGameOpen(true)} />
      </div>

      {/* Game modal */}
      <MathGame isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />
    </div>
  );
};

export default Index;
