
import React, { useEffect, useState } from 'react';

interface WinDisplayProps {
  amount: number;
  winningLines: number[][];
}

export const WinDisplay: React.FC<WinDisplayProps> = ({ amount, winningLines }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (amount > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [amount]);

  if (amount <= 0) return null;

  return (
    <div className="text-center mb-6 relative">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            >
              {['🎉', '⭐', '💰', '🔥', '💎'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Win announcement */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-6 shadow-2xl shadow-orange-500/50 animate-pulse">
        <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          🏆 WYGRANA! 🏆
        </h2>
        <p className="text-6xl font-extrabold text-white mb-4 animate-bounce">
          +{amount}
        </p>
        <div className="flex justify-center items-center gap-2 text-white/90">
          <span className="text-lg">Linie wygrywające:</span>
          <span className="bg-white/20 px-3 py-1 rounded-full font-bold">
            {winningLines.length}
          </span>
        </div>
      </div>

      {/* Winning lines visualization */}
      <div className="mt-4 flex justify-center gap-2">
        {winningLines.map((line, index) => (
          <div 
            key={index}
            className="w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-ping"
            style={{ animationDelay: `${index * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};
