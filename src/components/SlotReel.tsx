
import React from 'react';
import { Symbol } from './SlotMachine';

interface SlotReelProps {
  symbols: Symbol[];
  isSpinning: boolean;
  winningPositions: number[];
  delay: number;
}

export const SlotReel: React.FC<SlotReelProps> = ({ 
  symbols, 
  isSpinning, 
  winningPositions,
  delay 
}) => {
  return (
    <div className="relative">
      <div className="w-24 h-72 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border-4 border-yellow-400 shadow-lg shadow-yellow-400/50 overflow-hidden">
        {/* Neon glow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-400/10 to-transparent pointer-events-none" />
        
        {/* Reel container */}
        <div 
          className={`flex flex-col transition-transform duration-2000 ease-out ${
            isSpinning ? 'animate-spin-reel' : ''
          }`}
          style={{
            animationDelay: `${delay}ms`,
            transform: isSpinning ? 'translateY(-200px)' : 'translateY(0)'
          }}
        >
          {/* Visible symbols */}
          {symbols.length > 0 ? symbols.map((symbol, index) => (
            <div
              key={index}
              className={`h-24 flex items-center justify-center text-4xl font-bold transition-all duration-300 ${
                winningPositions.includes(index) 
                  ? 'bg-gradient-to-r from-yellow-400/30 to-orange-400/30 animate-pulse shadow-lg shadow-yellow-400/50' 
                  : 'hover:bg-white/10'
              }`}
            >
              <span className="drop-shadow-lg filter">
                {symbol.emoji}
              </span>
            </div>
          )) : (
            // Placeholder symbols when empty
            Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="h-24 flex items-center justify-center text-4xl font-bold bg-gray-700/50"
              >
                <span className="opacity-50">❓</span>
              </div>
            ))
          )}
        </div>
        
        {/* Spinning overlay */}
        {isSpinning && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-pulse" />
        )}
      </div>
      
      {/* Reel number */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
          {symbols.length > 0 ? '●' : '○'}
        </div>
      </div>
    </div>
  );
};

// CSS Animation for spinning effect
const spinReelKeyframes = `
  @keyframes spin-reel {
    0% { transform: translateY(0px); }
    100% { transform: translateY(-600px); }
  }
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = spinReelKeyframes;
  document.head.appendChild(style);
}
