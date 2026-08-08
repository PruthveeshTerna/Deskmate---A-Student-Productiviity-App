'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}

export default function PomodoroPage() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(25 * 60);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-variant p-4">
      <h1 className="text-2xl font-bold mb-4">Pomodoro Timer</h1>
      <div className="text-5xl font-mono mb-6">{formatTime(secondsLeft)}</div>
      <div className="flex gap-4">
        {isRunning ? (
          <button
            onClick={handlePause}
            className="p-2 bg-primary text-on-primary rounded-full"
          >
            <Pause className="h-6 w-6" />
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="p-2 bg-primary text-on-primary rounded-full"
          >
            <Play className="h-6 w-6" />
          </button>
        )}
        <button
          onClick={handleReset}
          className="p-2 bg-secondary text-on-secondary rounded-full"
        >
          <RefreshCw className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
