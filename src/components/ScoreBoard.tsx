
import React from 'react';
import { Card } from '@/components/ui/card';

interface ScoreBoardProps {
  balance: number;
  bet: number;
  totalWin: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ balance, bet, totalWin }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Balance */}
      <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-400/50 p-6">
        <div className="text-center">
          <h3 className="text-lg font-bold text-green-300 mb-2">💰 Saldo</h3>
          <p className="text-3xl font-extrabold text-white">
            {balance.toLocaleString()}
          </p>
          <p className="text-sm text-green-200">punktów</p>
        </div>
      </Card>

      {/* Current Bet */}
      <Card className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-400/50 p-6">
        <div className="text-center">
          <h3 className="text-lg font-bold text-blue-300 mb-2">🎯 Stawka</h3>
          <p className="text-3xl font-extrabold text-white">
            {bet}
          </p>
          <p className="text-sm text-blue-200">punktów</p>
        </div>
      </Card>

      {/* Last Win */}
      <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-400/50 p-6">
        <div className="text-center">
          <h3 className="text-lg font-bold text-purple-300 mb-2">🏆 Ostatnia wygrana</h3>
          <p className={`text-3xl font-extrabold ${totalWin > 0 ? 'text-yellow-400 animate-pulse' : 'text-white'}`}>
            {totalWin > 0 ? `+${totalWin}` : '0'}
          </p>
          <p className="text-sm text-purple-200">punktów</p>
        </div>
      </Card>
    </div>
  );
};
