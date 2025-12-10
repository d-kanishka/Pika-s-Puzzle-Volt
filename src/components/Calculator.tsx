import React, { useState } from 'react';
import { PikachuMascot } from './PikachuMascot';
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
      
      // handle percentage
      const withPercent = exp.replace(/(\d+\.?\d*)%/g, '($1/100)');
      
      const sanitized = withPercent.replace(/[^0-9+\-*/.()]/g, '');
      if (!sanitized) return '0';
      
      const evalResult = new Function(`return ${sanitized}`)();
      
      if (isNaN(evalResult) || !isFinite(evalResult)) {
        return 'Error';
      }
      
      const formatted = parseFloat(evalResult.toFixed(10));
      return formatted.toString();
    } catch (e) {
      return 'Error';
    }
  };

  const toggleSign = (exp: string): string => {
    if (!exp) return exp;
    
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
      // prevent multiple operators in a row 
      const operators = ['+', '-', '×', '÷'];
      const lastChar = input.slice(-1);
      
      if (operators.includes(value) && operators.includes(lastChar)) {
      
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
        return `${base} bg-pika-brown text-card hover:brightness-110`;
      case 'operator':
        return `${base} bg-pika-yellow text-pika-dark hover:brightness-110`;
      case 'number':
      default:
        return `${base} bg-card text-foreground hover:bg-muted border border-border`;
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Pikachu mascot button */}
      <div className="absolute -top-2 -right-2 z-10">
        <PikachuMascot
          size="sm"
          mood="happy"
          animate={true}
          onClick={onOpenGame}
        />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-pika-yellow px-2 py-0.5 rounded-full text-[10px] font-medium text-pika-dark whitespace-nowrap shadow-lg">
          Play Game!
        </div>
      </div>

      {/* Calculator body */}
      <div className="bg-pika-dark rounded-3xl p-5 shadow-2xl border border-pika-brown/30">
        {/* Display */}
        <div className="bg-pika-cream rounded-2xl p-4 mb-5 min-h-[120px] flex flex-col justify-end items-end border border-border">
          <div className="text-muted-foreground text-xl font-medium overflow-x-auto max-w-full scrollbar-hide">
            {input || '0'}
          </div>
          <div className="text-pika-dark text-4xl font-bold mt-2 overflow-x-auto max-w-full scrollbar-hide">
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