import React, { useState, useEffect, useCallback } from 'react';
import { DragonMascot } from './DragonMascot';
import { DragonBadge } from './DragonBadge';
import { useSound } from '@/hooks/useSound';
import { X, Star, Trophy, Sparkles } from 'lucide-react';

interface MathGameProps {
  isOpen: boolean;
  onClose: () => void;
}

type GameState = 'start' | 'playing' | 'correct' | 'gameover' | 'celebration';

interface Question {
  num1: number;
  num2: number;
  operator: '+' | '-' | '×';
  answer: number;
}

const getBadgeType = (count: number): 'bronze' | 'silver' | 'gold' | 'diamond' | 'rainbow' => {
  if (count >= 25) return 'rainbow';
  if (count >= 20) return 'diamond';
  if (count >= 15) return 'gold';
  if (count >= 10) return 'silver';
  return 'bronze';
};

const generateQuestion = (level: number): Question => {
  const operators: ('+' | '-' | '×')[] = level < 3 ? ['+', '-'] : ['+', '-', '×'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  
  let num1: number, num2: number, answer: number;
  
  const maxNum = Math.min(10 + level * 2, 20);
  
  switch (operator) {
    case '+':
      num1 = Math.floor(Math.random() * maxNum) + 1;
      num2 = Math.floor(Math.random() * (maxNum - num1)) + 1;
      answer = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * maxNum) + 1;
      num2 = Math.floor(Math.random() * num1) + 1;
      answer = num1 - num2;
      break;
    case '×':
      num1 = Math.floor(Math.random() * Math.min(level + 3, 10)) + 1;
      num2 = Math.floor(Math.random() * Math.min(level + 3, 10)) + 1;
      answer = num1 * num2;
      break;
    default:
      num1 = 1;
      num2 = 1;
      answer = 2;
  }
  
  return { num1, num2, operator, answer };
};

export const MathGame: React.FC<MathGameProps> = ({ isOpen, onClose }) => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [badges, setBadges] = useState<number>(0);
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('dragonMathHighScore');
    return saved ? parseInt(saved) : 0;
  });
  
  const {
    playClick,
    playCorrect,
    playWrong,
    playTick,
    playUrgentTick,
    playGameOver,
    playCelebration,
    playBadgeEarned,
  } = useSound();

  const getTimeLimit = useCallback(() => {
    if (level <= 3) return 60;
    if (level <= 6) return 45;
    return 30;
  }, [level]);

  const startGame = () => {
    playClick();
    setGameState('playing');
    setLevel(1);
    setScore(0);
    setQuestion(generateQuestion(1));
    setUserAnswer('');
    setTimeLeft(60);
  };

  const nextQuestion = useCallback(() => {
    const newLevel = Math.floor(score / 3) + 1;
    setLevel(newLevel);
    setQuestion(generateQuestion(newLevel));
    setUserAnswer('');
    setTimeLeft(getTimeLimit());
  }, [score, getTimeLimit]);

  const handleNumberClick = (num: string) => {
    playClick();
    if (userAnswer.length < 4) {
      setUserAnswer(prev => prev + num);
    }
  };

  const handleDelete = () => {
    playClick();
    setUserAnswer(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (!question || !userAnswer) return;
    
    const isCorrect = parseInt(userAnswer) === question.answer;
    
    if (isCorrect) {
      playCorrect();
      const newScore = score + 1;
      setScore(newScore);
      
      // Check for badge milestone (every 5 correct answers)
      if (newScore % 5 === 0) {
        setBadges(prev => prev + 1);
        setShowBadgeAnimation(true);
        playBadgeEarned();
        setTimeout(() => setShowBadgeAnimation(false), 2000);
      }
      
      // Check for celebration milestone (every 10 correct answers)
      if (newScore % 10 === 0) {
        playCelebration();
        setGameState('celebration');
        setTimeout(() => {
          setGameState('playing');
          nextQuestion();
        }, 2500);
      } else {
        setGameState('correct');
        setTimeout(() => {
          setGameState('playing');
          nextQuestion();
        }, 800);
      }
    } else {
      playWrong();
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('dragonMathHighScore', score.toString());
      }
      setGameState('gameover');
      playGameOver();
    }
  };

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          playGameOver();
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('dragonMathHighScore', score.toString());
          }
          setGameState('gameover');
          return 0;
        }
        if (prev <= 10) {
          playUrgentTick();
        } else if (prev % 5 === 0) {
          playTick();
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState, playGameOver, playTick, playUrgentTick, score, highScore]);

  // Reset game when modal closes
  useEffect(() => {
    if (!isOpen) {
      setGameState('start');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const timerPercentage = (timeLeft / getTimeLimit()) * 100;
  const isUrgent = timeLeft <= 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl border border-border/30 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-dragon-blue/10 rounded-full blur-xl" />
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-dragon-pink/10 rounded-full blur-xl" />
          {gameState === 'celebration' && (
            <>
              <div className="absolute top-1/4 left-1/4 text-2xl animate-float">✨</div>
              <div className="absolute top-1/3 right-1/4 text-2xl animate-float" style={{ animationDelay: '0.3s' }}>🌟</div>
              <div className="absolute bottom-1/3 left-1/3 text-2xl animate-float" style={{ animationDelay: '0.6s' }}>⭐</div>
              <div className="absolute top-1/2 right-1/3 text-2xl animate-float" style={{ animationDelay: '0.9s' }}>💫</div>
            </>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>

        {/* Badge animation overlay */}
        {showBadgeAnimation && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="text-center animate-scale-in">
              <DragonBadge type={getBadgeType(badges * 5)} size="lg" showLabel />
              <p className="mt-4 text-xl font-bold text-dragon-gradient">Badge Earned!</p>
            </div>
          </div>
        )}

        <div className="relative p-6">
          {/* START SCREEN */}
          {gameState === 'start' && (
            <div className="text-center py-8">
              <DragonMascot size="xl" mood="excited" />
              <h2 className="mt-4 text-2xl font-bold text-dragon-gradient">
                Dragon Math Challenge!
              </h2>
              <p className="mt-2 text-muted-foreground">
                Answer quickly before time runs out!
              </p>
              
              {/* High score display */}
              {highScore > 0 && (
                <div className="mt-4 flex items-center justify-center gap-2 text-dragon-gold">
                  <Trophy size={20} />
                  <span className="font-semibold">Best: {highScore}</span>
                </div>
              )}
              
              {/* Badges display */}
              {badges > 0 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-sm text-muted-foreground">Badges:</span>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(badges, 5) }).map((_, i) => (
                      <DragonBadge key={i} type={getBadgeType((i + 1) * 5)} size="sm" />
                    ))}
                  </div>
                </div>
              )}
              
              <button
                onClick={startGame}
                className="mt-8 px-8 py-4 bg-dragon-gradient text-foreground font-bold text-lg rounded-full hover:brightness-110 transition-all shadow-lg animate-pulse-glow"
              >
                Let's Play!
              </button>
            </div>
          )}

          {/* PLAYING SCREEN */}
          {(gameState === 'playing' || gameState === 'correct') && question && (
            <div className="py-4">
              {/* Header with score and timer */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Star className="text-dragon-gold" size={20} />
                  <span className="font-bold text-lg">{score}</span>
                </div>
                <div className="text-sm text-muted-foreground">Level {level}</div>
                <div className={`font-mono font-bold text-lg ${isUrgent ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
                  {timeLeft}s
                </div>
              </div>
              
              {/* Timer bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden mb-6">
                <div
                  className={`h-full transition-all duration-1000 ${isUrgent ? 'bg-destructive' : 'bg-dragon-gradient'}`}
                  style={{ width: `${timerPercentage}%` }}
                />
              </div>

              {/* Question */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-3 text-4xl font-bold">
                  <span className="text-dragon-blue">{question.num1}</span>
                  <span className="text-dragon-pink">{question.operator}</span>
                  <span className="text-dragon-blue">{question.num2}</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="text-3xl text-foreground">?</span>
                </div>
              </div>

              {/* Answer display */}
              <div className="bg-background/50 rounded-2xl p-4 mb-6 min-h-[60px] flex items-center justify-center border border-border/20">
                <span className={`text-3xl font-bold ${gameState === 'correct' ? 'text-green-500' : 'text-foreground'}`}>
                  {userAnswer || '___'}
                </span>
                {gameState === 'correct' && (
                  <Sparkles className="ml-2 text-dragon-gold animate-sparkle" size={24} />
                )}
              </div>

              {/* Number pad */}
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'DEL', 0, '✓'].map((btn) => (
                  <button
                    key={btn}
                    onClick={() => {
                      if (btn === 'DEL') handleDelete();
                      else if (btn === '✓') handleSubmit();
                      else handleNumberClick(btn.toString());
                    }}
                    disabled={gameState === 'correct'}
                    className={`h-14 rounded-xl font-bold text-xl transition-all active:scale-95 ${
                      btn === '✓'
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : btn === 'DEL'
                        ? 'bg-destructive/20 text-destructive hover:bg-destructive/30'
                        : 'bg-dragon-button hover:bg-dragon-button-hover text-foreground'
                    } ${gameState === 'correct' ? 'opacity-50' : ''}`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CELEBRATION SCREEN */}
          {gameState === 'celebration' && (
            <div className="text-center py-12">
              <DragonMascot size="xl" mood="excited" />
              <h2 className="mt-4 text-3xl font-bold text-dragon-gradient animate-pulse">
                Amazing!
              </h2>
              <p className="mt-2 text-xl text-foreground">
                {score} correct answers!
              </p>
              <div className="mt-4 flex justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="text-dragon-gold animate-sparkle"
                    size={32}
                    style={{ animationDelay: `${i * 0.1}s` }}
                    fill="currentColor"
                  />
                ))}
              </div>
            </div>
          )}

          {/* GAME OVER SCREEN */}
          {gameState === 'gameover' && (
            <div className="text-center py-8">
              <DragonMascot size="lg" mood="sad" />
              <h2 className="mt-4 text-2xl font-bold text-foreground">
                {timeLeft === 0 ? "Time's Up!" : 'Oops!'}
              </h2>
              {question && timeLeft > 0 && (
                <p className="mt-2 text-muted-foreground">
                  The answer was <span className="text-dragon-pink font-bold">{question.answer}</span>
                </p>
              )}
              <div className="mt-4 text-lg">
                <span className="text-muted-foreground">Score: </span>
                <span className="text-dragon-blue font-bold">{score}</span>
              </div>
              {score >= highScore && score > 0 && (
                <div className="mt-2 flex items-center justify-center gap-2 text-dragon-gold">
                  <Trophy size={20} />
                  <span className="font-bold">New High Score!</span>
                </div>
              )}
              <button
                onClick={startGame}
                className="mt-8 px-8 py-4 bg-dragon-gradient text-foreground font-bold text-lg rounded-full hover:brightness-110 transition-all shadow-lg"
              >
                Try Again!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
