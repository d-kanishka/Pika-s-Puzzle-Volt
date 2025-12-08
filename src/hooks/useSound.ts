import { useCallback, useRef } from 'react';

// Audio context for generating sounds
const createAudioContext = () => {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

export const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = createAudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      console.log('Audio not available');
    }
  }, [getAudioContext]);

  const playClick = useCallback(() => {
    playTone(800, 0.05, 'square', 0.1);
  }, [playTone]);

  const playCorrect = useCallback(() => {
    // Happy ascending melody
    playTone(523, 0.15, 'sine', 0.3);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.3), 100);
    setTimeout(() => playTone(784, 0.2, 'sine', 0.3), 200);
  }, [playTone]);

  const playWrong = useCallback(() => {
    // Sad descending tone
    playTone(300, 0.3, 'sawtooth', 0.2);
  }, [playTone]);

  const playTick = useCallback(() => {
    playTone(600, 0.03, 'square', 0.05);
  }, [playTone]);

  const playUrgentTick = useCallback(() => {
    playTone(800, 0.05, 'square', 0.15);
  }, [playTone]);

  const playGameOver = useCallback(() => {
    playTone(400, 0.2, 'sawtooth', 0.2);
    setTimeout(() => playTone(300, 0.2, 'sawtooth', 0.2), 150);
    setTimeout(() => playTone(200, 0.4, 'sawtooth', 0.2), 300);
  }, [playTone]);

  const playCelebration = useCallback(() => {
    // Victory fanfare!
    const notes = [523, 659, 784, 1047, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 'sine', 0.3), i * 100);
    });
  }, [playTone]);

  const playBadgeEarned = useCallback(() => {
    // Magical sparkle sound
    const notes = [880, 1109, 1319, 1760];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.15, 'sine', 0.25), i * 80);
    });
  }, [playTone]);

  return {
    playClick,
    playCorrect,
    playWrong,
    playTick,
    playUrgentTick,
    playGameOver,
    playCelebration,
    playBadgeEarned,
  };
};
