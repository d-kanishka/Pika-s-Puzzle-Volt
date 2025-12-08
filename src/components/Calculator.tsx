import React, { useState } from 'react';
import { DragonMascot } from './DragonMascot';
import { useSound } from '@/hooks/useSound';

interface CalculatorProps {
  onOpenGame: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onOpenGame }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('0');
  const { playClick } = useSound();

  const evaluateExpression = (expression: string): string => {
    try {
      const exp = expression.replace(/×/g, '*').replace(/÷/g, '/');
      
      // Handle percentage
      const withPercent = exp.replace(/(\d+\.?\d*)%/g, '($1/100)');
      
      // Use Function constructor for safe evaluation
      const sanitized = withPercent.replace(/[^0-9+\-*/.()]/g, '');
      if (!sanitized) return '0';
      
      const evalResult = new Function(`return ${sanitized}`)();
      
      if (isNaN(evalResult) || !isFinite(evalResult)) {
        return 'Error';
      }
      
      // Format the result
      const formatted = parseFloat(evalResult.toFixed(10));
      return formatted.toString();
    } catch (e) {
      return 'Error';
    }
  };

  const toggleSign = (exp: string): string => {
    if (!exp) return exp;
    
    // Find the last number in the expression
    const regex = /(-?\d+\.?\d*)$/;
    const match = exp.match(regex);
    
    if (match) {
      const number = match[0];
      const toggled = number.startsWith('-') ? number.substring(1) : `-${number}`;
      return exp.slice(0, match.index) + toggled;
    }
    return exp;
  };

  const handleButtonClick = (value: string) => {
    playClick();
    
    if (value === 'AC') {
      setInput('');
      setResult('0');
    } else if (value === 'DEL') {
      setInput(prev => prev.slice(0, -1));
    } else if (value === '=') {
      const evalResult = evaluateExpression(input);
      setResult(evalResult);
      if (evalResult !== 'Error') {
        setInput(evalResult);
      }
    } else if (value === '+/-') {
      setInput(prev => toggleSign(prev));
    } else if (value === '%') {
      setInput(prev => prev + '%');
    } else {
      // Prevent multiple operators in a row (except minus for negative numbers)
      const operators = ['+', '-', '×', '÷'];
      const lastChar = input.slice(-1);
      
      if (operators.includes(value) && operators.includes(lastChar)) {
        // Replace last operator with new one
        setInput(prev => prev.slice(0, -1) + value);
      } else {
        setInput(prev => prev + value);
      }
    }
  };

  const buttons = [
    { text: 'AC', type: 'function' },
    { text: 'DEL', type: 'function' },
    { text: '%', type: 'function' },
    { text: '÷', type: 'operator' },
    { text: '7', type: 'number' },
    { text: '8', type: 'number' },
    { text: '9', type: 'number' },
    { text: '×', type: 'operator' },
    { text: '4', type: 'number' },
    { text: '5', type: 'number' },
    { text: '6', type: 'number' },
    { text: '-', type: 'operator' },
    { text: '1', type: 'number' },
    { text: '2', type: 'number' },
    { text: '3', type: 'number' },
    { text: '+', type: 'operator' },
    { text: '+/-', type: 'function' },
    { text: '0', type: 'number' },
    { text: '.', type: 'number' },
    { text: '=', type: 'operator' },
  ];

  const getButtonClasses = (type: string) => {
    const base = 'w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold transition-all duration-150 active:scale-95 shadow-lg';
    
    switch (type) {
      case 'function':
        return `${base} bg-muted/60 text-foreground hover:bg-muted/80 border border-border/30`;
      case 'operator':
        return `${base} bg-dragon-orange text-foreground hover:brightness-110 shadow-dragon-orange/30`;
      case 'number':
      default:
        return `${base} bg-dragon-button text-foreground hover:bg-dragon-button-hover border border-border/20`;
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Dragon mascot button */}
      <div className="absolute -top-2 -right-2 z-10">
        <DragonMascot
          size="sm"
          mood="happy"
          animate={true}
          onClick={onOpenGame}
        />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-dragon-pink/90 px-2 py-0.5 rounded-full text-[10px] font-medium text-foreground whitespace-nowrap shadow-lg">
          Play Game!
        </div>
      </div>

      {/* Calculator body */}
      <div className="bg-card rounded-3xl p-5 shadow-2xl border border-border/30 backdrop-blur-sm">
        {/* Decorative elements */}
        <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-dragon-blue/40 animate-sparkle" />
        <div className="absolute top-8 left-8 w-1.5 h-1.5 rounded-full bg-dragon-pink/40 animate-sparkle" style={{ animationDelay: '0.5s' }} />
        
        {/* Display */}
        <div className="bg-background/50 rounded-2xl p-4 mb-5 min-h-[120px] flex flex-col justify-end items-end border border-border/20">
          <div className="text-muted-foreground text-xl font-medium overflow-x-auto max-w-full scrollbar-hide">
            {input || '0'}
          </div>
          <div className="text-foreground text-4xl font-bold mt-2 overflow-x-auto max-w-full scrollbar-hide">
            {result}
          </div>
        </div>

        {/* Buttons grid */}
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(btn.text)}
              className={getButtonClasses(btn.type)}
            >
              {btn.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
