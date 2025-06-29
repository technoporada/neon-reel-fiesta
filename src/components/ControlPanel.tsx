
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ControlPanelProps {
  bet: number;
  onBetChange: (bet: number) => void;
  onSpin: () => void;
  onReset: () => void;
  isSpinning: boolean;
  canSpin: boolean;
}

const BET_OPTIONS = [5, 10, 25, 50, 100];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  bet,
  onBetChange,
  onSpin,
  onReset,
  isSpinning,
  canSpin
}) => {
  return (
    <div className="space-y-6">
      {/* Bet Selection */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-4">Wybierz stawkę:</h3>
        <div className="flex justify-center gap-2 flex-wrap">
          {BET_OPTIONS.map((betOption) => (
            <Button
              key={betOption}
              onClick={() => onBetChange(betOption)}
              disabled={isSpinning}
              variant={bet === betOption ? "default" : "outline"}
              className={`
                px-6 py-3 font-bold transition-all duration-300
                ${bet === betOption 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50' 
                  : 'bg-gray-700/50 border-gray-500 text-gray-300 hover:bg-gray-600/50 hover:border-gray-400'
                }
              `}
            >
              {betOption}
            </Button>
          ))}
        </div>
      </div>

      {/* Current Bet Display */}
      <div className="text-center">
        <Badge variant="outline" className="text-lg px-4 py-2 bg-blue-600/20 border-blue-400 text-blue-300">
          Aktualna stawka: {bet} punktów
        </Badge>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        {/* Spin Button */}
        <Button
          onClick={onSpin}
          disabled={isSpinning || !canSpin}
          className={`
            px-12 py-6 text-2xl font-bold rounded-2xl transition-all duration-300 transform
            ${isSpinning 
              ? 'bg-gray-600 cursor-not-allowed' 
              : canSpin
                ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:scale-110 shadow-2xl shadow-purple-500/50 animate-pulse'
                : 'bg-gray-600 cursor-not-allowed'
            }
          `}
        >
          {isSpinning ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              Kręci się...
            </div>
          ) : (
            '🎰 SPIN 🎰'
          )}
        </Button>

        {/* Reset Button */}
        <Button
          onClick={onReset}
          disabled={isSpinning}
          variant="outline"
          className="px-8 py-6 text-lg font-bold rounded-2xl bg-red-600/20 border-red-400 text-red-300 hover:bg-red-600/30 hover:border-red-300 transition-all duration-300"
        >
          🔄 Reset
        </Button>
      </div>

      {/* Spin Status */}
      {!canSpin && !isSpinning && (
        <div className="text-center">
          <p className="text-red-400 font-bold animate-pulse">
            ⚠️ Niewystarczające środki! Zmniejsz stawkę lub zresetuj grę.
          </p>
        </div>
      )}

      {/* Game Rules */}
      <div className="text-center text-gray-400 text-sm max-w-2xl mx-auto">
        <details className="cursor-pointer">
          <summary className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
            📋 Zasady gry
          </summary>
          <div className="mt-2 space-y-1">
            <p>🎯 Zbierz 3+ identyczne symbole w linii, by wygrać!</p>
            <p>🏆 5 symboli = x5 stawki | 4 symbole = x3 stawki | 3 symbole = x2 stawki</p>
            <p>⭐ Rzadsze symbole = większe nagrody</p>
            <p>💰 Najwyższa wygrana: 5x Jackpot = 2500 punktów (przy stawce 10)</p>
          </div>
        </details>
      </div>
    </div>
  );
};
