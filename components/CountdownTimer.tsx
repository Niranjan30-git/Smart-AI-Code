
import React, { useState, useEffect } from 'react';

export const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{h: number, m: number, s: number}>({ h: 23, m: 59, s: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-2 font-mono text-xl font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
      <span className="text-xs font-sans text-indigo-400 mr-2 uppercase tracking-wider">Ends In</span>
      <span>{format(timeLeft.h)}</span>
      <span className="animate-pulse">:</span>
      <span>{format(timeLeft.m)}</span>
      <span className="animate-pulse">:</span>
      <span>{format(timeLeft.s)}</span>
    </div>
  );
};
