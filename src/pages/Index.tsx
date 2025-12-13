import React, { useState } from 'react';
import { Calculator } from '@/components/Calculator';
import { MathGame } from '@/components/MathGame';

const Index = () => {
  const [isGameOpen, setIsGameOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-pika-yellow/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-pika-teal/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pika-pink/10 rounded-full blur-2xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <Calculator onOpenGame={() => setIsGameOpen(true)} />
      </div>

      {/* Game modal */}
      <MathGame isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />
    </div>
  );
};

export default Index;