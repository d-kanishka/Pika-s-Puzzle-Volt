import React, { useState, useEffect, useCallback } from 'react';
import { PikachuMascot } from './PikachuMascot';
import { PokemonBadge } from './PokemonBadge';
import { LevelMap } from './LevelMap';
import { BadgeCollection } from './BadgeCollection';
import { useSound } from '@/hooks/useSound';
import { X, Trophy, Sparkles, Award, Map } from 'lucide-react';

interface MathGameProps {
  isOpen: boolean;
  onClose: () => void;
}

type GameState = 'menu' | 'levelmap' | 'playing' | 'correct' | 'gameover' | 'levelcomplete' | 'celebration';

interface Question {
  num1: number;
  num2: number;
  operator: '+' | '-' | '×';
  answer: number;
}

interface GameProgress {
  currentLevel: number;
  completedLevels: number[];
  levelStars: Record<number, number>;
  earnedBadges: number[];
  totalScore: number;
}

const QUESTIONS_PER_LEVEL = 5;
const TOTAL_LEVELS = 20;

const loadProgress = (): GameProgress => {
  const saved = localStorage.getItem('pikaMathProgress');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    currentLevel: 1,
    completedLevels: [],
    levelStars: {},
    earnedBadges: [],
    totalScore: 0,
  };
};

const saveProgress = (progress: GameProgress) => {
  localStorage.setItem('pikaMathProgress', JSON.stringify(progress));
};

const generateQuestion = (level: number): Question => {
  const operators: ('+' | '-' | '×')[] = level < 5 ? ['+', '-'] : ['+', '-', '×'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  
  let num1: number, num2: number, answer: number;
  
  const maxNum = Math.min(8 + level * 2, 20);
  
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
      num1 = Math.floor(Math.random() * Math.min(level + 2, 10)) + 1;
      num2 = Math.floor(Math.random() * Math.min(level + 2, 10)) + 1;
      answer = num1 * num2;
      break;
    default:
      num1 = 1;
      num2 = 1;
      answer = 2;
  }
  
  return { num1, num2, operator, answer };
};

const getTimeLimit = (level: number): number => {
  if (level <= 5) return 60;
  if (level <= 10) return 45;
  if (level <= 15) return 35;
  return 30;
};

export const MathGame: React.FC<MathGameProps> = ({ isOpen, onClose }) => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [progress, setProgress] = useState<GameProgress>(loadProgress);
  const [playingLevel, setPlayingLevel] = useState(1);
  const [questionCount, setQuestionCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);
  const [newBadgeId, setNewBadgeId] = useState<number | null>(null);
  const [showBadgeCollection, setShowBadgeCollection] = useState(false);
  
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

  const startLevel = (level: number) => {
    playClick();
    setPlayingLevel(level);
    setQuestionCount(0);
    setCorrectCount(0);
    setQuestion(generateQuestion(level));
    setUserAnswer('');
    setTimeLeft(getTimeLimit(level));
    setGameState('playing');
  };

  const nextQuestion = useCallback(() => {
    if (questionCount + 1 >= QUESTIONS_PER_LEVEL) {
      // Level complete!
      const stars = correctCount >= 5 ? 3 : correctCount >= 3 ? 2 : correctCount >= 1 ? 1 : 0;
      
      const newProgress = { ...progress };
      
      if (!newProgress.completedLevels.includes(playingLevel)) {
        newProgress.completedLevels.push(playingLevel);
        
        // Award badge for every level completed
        if (!newProgress.earnedBadges.includes(playingLevel - 1)) {
          newProgress.earnedBadges.push(playingLevel - 1);
          setNewBadgeId(playingLevel - 1);
          setShowBadgeAnimation(true);
          playBadgeEarned();
        }
      }
      
      if (!newProgress.levelStars[playingLevel] || newProgress.levelStars[playingLevel] < stars) {
        newProgress.levelStars[playingLevel] = stars;
      }
      
      newProgress.totalScore += correctCount * 10;
      newProgress.currentLevel = Math.max(newProgress.currentLevel, playingLevel + 1);
      
      setProgress(newProgress);
      saveProgress(newProgress);
      
      if (correctCount >= 3) {
        playCelebration();
        setGameState('levelcomplete');
      } else {
        setGameState('gameover');
      }
    } else {
      setQuestionCount(prev => prev + 1);
      setQuestion(generateQuestion(playingLevel));
      setUserAnswer('');
      setTimeLeft(getTimeLimit(playingLevel));
    }
  }, [questionCount, correctCount, playingLevel, progress, playBadgeEarned, playCelebration]);

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
      setCorrectCount(prev => prev + 1);
      setGameState('correct');
      setTimeout(() => {
        setGameState('playing');
        nextQuestion();
      }, 800);
    } else {
      playWrong();
      playGameOver();
      setGameState('gameover');
    }
  };

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          playGameOver();
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
  }, [gameState, playGameOver, playTick, playUrgentTick]);

  // Reset game when modal closes
  useEffect(() => {
    if (!isOpen) {
      setGameState('menu');
      setShowBadgeAnimation(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const timerPercentage = (timeLeft / getTimeLimit(playingLevel)) * 100;
  const isUrgent = timeLeft <= 10;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>

          {/* Badge animation overlay */}
          {showBadgeAnimation && newBadgeId !== null && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-sm">
              <div className="text-center animate-scale-in">
                <PokemonBadge pokemonId={newBadgeId} size="lg" showLabel />
                <p className="mt-4 text-xl font-bold text-pika-yellow">Badge Earned!</p>
                <button
                  onClick={() => setShowBadgeAnimation(false)}
                  className="mt-4 px-6 py-2 bg-pika-yellow text-pika-dark font-bold rounded-full hover:brightness-110"
                >
                  Awesome!
                </button>
              </div>
            </div>
          )}

          <div className="relative p-6">
            {/* MENU SCREEN */}
            {gameState === 'menu' && (
              <div className="text-center py-8">
                <PikachuMascot size="xl" mood="excited" />
                <h2 className="mt-4 text-2xl font-bold text-pika-yellow">
                  Pikachu Math Challenge!
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Answer quickly before time runs out!
                </p>
                
                {/* Stats */}
                <div className="mt-4 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1 text-pika-yellow">
                    <Trophy size={18} />
                    <span className="font-semibold">{progress.totalScore}</span>
                  </div>
                  <button
                    onClick={() => setShowBadgeCollection(true)}
                    className="flex items-center gap-1 text-pika-orange hover:text-pika-yellow transition-colors"
                  >
                    <Award size={18} />
                    <span className="font-semibold">{progress.earnedBadges.length}/{TOTAL_LEVELS}</span>
                  </button>
                </div>
                
                {/* Earned badges preview */}
                {progress.earnedBadges.length > 0 && (
                  <div className="mt-4 flex justify-center gap-1 flex-wrap">
                    {progress.earnedBadges.slice(-5).map((badgeId) => (
                      <PokemonBadge key={badgeId} pokemonId={badgeId} size="sm" />
                    ))}
                  </div>
                )}
                
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={() => setGameState('levelmap')}
                    className="px-8 py-4 bg-pika-teal text-card font-bold text-lg rounded-full hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Map size={20} />
                    Select Level
                  </button>
                  <button
                    onClick={() => startLevel(progress.currentLevel)}
                    className="px-8 py-4 bg-pika-yellow text-pika-dark font-bold text-lg rounded-full hover:brightness-110 transition-all shadow-md"
                  >
                    Continue Level {progress.currentLevel}
                  </button>
                </div>
              </div>
            )}

            {/* LEVEL MAP SCREEN */}
            {gameState === 'levelmap' && (
              <div className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setGameState('menu')}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back
                  </button>
                  <h2 className="text-lg font-bold text-pika-yellow">Select Level</h2>
                  <div className="w-12" />
                </div>
                
                <LevelMap
                  currentLevel={progress.currentLevel}
                  completedLevels={progress.completedLevels}
                  levelStars={progress.levelStars}
                  onSelectLevel={startLevel}
                />
              </div>
            )}

            {/* PLAYING SCREEN */}
            {(gameState === 'playing' || gameState === 'correct') && question && (
              <div className="py-4">
                {/* Header with score and timer */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Level</span>
                    <span className="font-bold text-lg text-pika-yellow">{playingLevel}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {questionCount + 1}/{QUESTIONS_PER_LEVEL}
                  </div>
                  <div className={`font-mono font-bold text-lg ${isUrgent ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
                    {timeLeft}s
                  </div>
                </div>
                
                {/* Timer bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-6">
                  <div
                    className={`h-full transition-all duration-1000 ${isUrgent ? 'bg-destructive' : 'bg-pika-yellow'}`}
                    style={{ width: `${timerPercentage}%` }}
                  />
                </div>

                {/* Question */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-3 text-4xl font-bold">
                    <span className="text-pika-teal">{question.num1}</span>
                    <span className="text-pika-pink">{question.operator}</span>
                    <span className="text-pika-teal">{question.num2}</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="text-3xl text-foreground">?</span>
                  </div>
                </div>

            {/*answer box - snorlx*/}
                <div className="relative mb-6">
                  <img 
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png"
                    alt=""
                    className="absolute -top-10 right-0 w-26 h-26 z-20"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="bg-pika-cream rounded-2xl p-4 min-h-[60px] flex items-center justify-center border border-border relative">
                    <img 
                      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/163.png"
                      alt=""
                      className="absolute left-4 w-20 h-20"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <span className={`text-3xl font-bold ${gameState === 'correct' ? 'text-pika-green' : 'text-pika-dark'}`}>
                      {userAnswer || '___'}
                    </span>
                    {gameState === 'correct' && (
                      <Sparkles className="ml-2 text-pika-yellow animate-sparkle" size={24} />
                    )}
                  </div>
                </div>

                {/* Number pad with pokemon decorations */}
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
                      className={`relative h-14 rounded-xl font-bold text-xl transition-all active:scale-95 ${
                        btn === '✓'
                          ? 'bg-pika-yellow text-pika-dark hover:brightness-110'
                          : btn === 'DEL'
                          ? 'bg-pika-brown text-card hover:brightness-110'
                          : 'bg-card hover:bg-muted text-foreground border border-border'
                      } ${gameState === 'correct' ? 'opacity-50' : ''}`}
                    >
                      {btn}
                      {/* Squirtle on button 7 */}
                      {btn === 7 && (
                        <img 
                          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png"
                          alt=""
                          className="absolute left-0 bottom-3 w-25 h-30"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      )}
                      {/* Bulbasaur on button 3 */}
                      {btn === 6 && (
                        <img 
                          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
                          alt=""
                          className="absolute right-1 bottom-2 w-20 h-30"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      )}
                      {/* Piplup on button 0 */}
                      {btn === 0 && (
                        <img 
                          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/393.png"
                          alt=""
                          className="absolute right-1 bottom-0 w-20 h-15"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* LEVEL COMPLETE SCREEN */}
            {gameState === 'levelcomplete' && (
              <div className="text-center py-8">
                <PikachuMascot size="xl" mood="excited" />
                <h2 className="mt-4 text-3xl font-bold text-pika-yellow animate-pulse">
                  Level Complete!
                </h2>
                <p className="mt-2 text-xl text-foreground">
                  {correctCount}/{QUESTIONS_PER_LEVEL} correct!
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  {playingLevel < TOTAL_LEVELS && (
                    <button
                      onClick={() => startLevel(playingLevel + 1)}
                      className="px-8 py-4 bg-pika-yellow text-pika-dark font-bold text-lg rounded-full hover:brightness-110 transition-all shadow-lg"
                    >
                      Next Level
                    </button>
                  )}
                  <button
                    onClick={() => setGameState('menu')}
                    className="px-8 py-3 bg-muted text-foreground font-bold rounded-full hover:bg-muted/80 transition-all"
                  >
                    Back to Menu
                  </button>
                </div>
              </div>
            )}

            {/* GAME OVER SCREEN */}
            {gameState === 'gameover' && (
              <div className="text-center py-8">
                <PikachuMascot size="lg" mood="sad" />
                <h2 className="mt-4 text-2xl font-bold text-foreground">
                  {timeLeft === 0 ? "Time's Up!" : 'Oops!'}
                </h2>
                {question && timeLeft > 0 && (
                  <p className="mt-2 text-muted-foreground">
                    The answer was <span className="text-pika-pink font-bold">{question.answer}</span>
                  </p>
                )}
                <div className="mt-4 text-lg">
                  <span className="text-muted-foreground">Score: </span>
                  <span className="text-pika-teal font-bold">{correctCount}/{questionCount + 1}</span>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={() => startLevel(playingLevel)}
                    className="px-8 py-4 bg-pika-yellow text-pika-dark font-bold text-lg rounded-full hover:brightness-110 transition-all shadow-lg"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => setGameState('menu')}
                    className="px-8 py-3 bg-muted text-foreground font-bold rounded-full hover:bg-muted/80 transition-all"
                  >
                    Back to Menu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BadgeCollection
        isOpen={showBadgeCollection}
        onClose={() => setShowBadgeCollection(false)}
        earnedBadges={progress.earnedBadges}
      />
    </>
  );
};