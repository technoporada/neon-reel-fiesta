
import React, { useState, useEffect, useRef } from 'react';
import { SlotReel } from './SlotReel';
import { WinDisplay } from './WinDisplay';
import { ControlPanel } from './ControlPanel';
import { ScoreBoard } from './ScoreBoard';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Volume2, VolumeX } from 'lucide-react';

export interface Symbol {
  id: string;
  emoji: string;
  name: string;
  value: number;
  rarity: number; // 1-10, gdzie 10 to najrzadszy
}

export const SYMBOLS: Symbol[] = [
  { id: 'cherry', emoji: '🍒', name: 'Cherry', value: 10, rarity: 3 },
  { id: 'lemon', emoji: '🍋', name: 'Lemon', value: 15, rarity: 3 },
  { id: 'orange', emoji: '🍊', name: 'Orange', value: 20, rarity: 4 },
  { id: 'plum', emoji: '🍇', name: 'Grapes', value: 25, rarity: 4 },
  { id: 'watermelon', emoji: '🍉', name: 'Watermelon', value: 30, rarity: 5 },
  { id: 'bell', emoji: '🔔', name: 'Bell', value: 50, rarity: 6 },
  { id: 'star', emoji: '⭐', name: 'Star', value: 75, rarity: 7 },
  { id: 'diamond', emoji: '💎', name: 'Diamond', value: 100, rarity: 8 },
  { id: 'seven', emoji: '7️⃣', name: 'Lucky Seven', value: 200, rarity: 9 },
  { id: 'jackpot', emoji: '💰', name: 'Jackpot', value: 500, rarity: 10 }
];

export interface GameState {
  balance: number;
  bet: number;
  isSpinning: boolean;
  reels: Symbol[][];
  winningLines: number[][];
  totalWin: number;
  soundEnabled: boolean;
}

const SlotMachine: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    balance: 1000,
    bet: 10,
    isSpinning: false,
    reels: Array(5).fill([]).map(() => []),
    winningLines: [],
    totalWin: 0,
    soundEnabled: true
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const winSoundRef = useRef<HTMLAudioElement>(null);

  // Generowanie symboli dla bębna z uwzględnieniem rzadkości
  const generateReelSymbols = (): Symbol[] => {
    const symbols: Symbol[] = [];
    SYMBOLS.forEach(symbol => {
      const count = Math.max(1, 11 - symbol.rarity); // Im rzadszy, tym mniej wystąpień
      for (let i = 0; i < count; i++) {
        symbols.push(symbol);
      }
    });
    return symbols.sort(() => Math.random() - 0.5);
  };

  // Sprawdzanie linii wygrywających
  const checkWinningLines = (reels: Symbol[][]): { lines: number[][], totalWin: number } => {
    const lines: number[][] = [];
    let totalWin = 0;

    // Sprawdź poziome linie
    for (let row = 0; row < 3; row++) {
      const line = reels.map(reel => reel[row]);
      const firstSymbol = line[0];
      let consecutiveCount = 1;
      
      for (let i = 1; i < line.length; i++) {
        if (line[i].id === firstSymbol.id) {
          consecutiveCount++;
        } else {
          break;
        }
      }
      
      if (consecutiveCount >= 3) {
        lines.push([row, row, row, row, row]);
        const multiplier = consecutiveCount === 5 ? 5 : consecutiveCount === 4 ? 3 : 2;
        totalWin += firstSymbol.value * multiplier * gameState.bet / 10;
      }
    }

    // Sprawdź przekątne
    const diagonal1 = [reels[0][0], reels[1][1], reels[2][2], reels[3][1], reels[4][0]];
    const diagonal2 = [reels[0][2], reels[1][1], reels[2][0], reels[3][1], reels[4][2]];
    
    [diagonal1, diagonal2].forEach((diagonal, index) => {
      const firstSymbol = diagonal[0];
      let consecutiveCount = 1;
      
      for (let i = 1; i < diagonal.length; i++) {
        if (diagonal[i].id === firstSymbol.id) {
          consecutiveCount++;
        } else {
          break;
        }
      }
      
      if (consecutiveCount >= 3) {
        lines.push(index === 0 ? [0, 1, 2, 1, 0] : [2, 1, 0, 1, 2]);
        const multiplier = consecutiveCount === 5 ? 5 : consecutiveCount === 4 ? 3 : 2;
        totalWin += firstSymbol.value * multiplier * gameState.bet / 10;
      }
    });

    return { lines, totalWin };
  };

  // Funkcja spin
  const handleSpin = async () => {
    if (gameState.isSpinning || gameState.balance < gameState.bet) {
      if (gameState.balance < gameState.bet) {
        toast({
          title: "Niewystarczające środki!",
          description: "Zwiększ saldo lub zmniejsz stawkę.",
          variant: "destructive",
        });
      }
      return;
    }

    setGameState(prev => ({
      ...prev,
      isSpinning: true,
      balance: prev.balance - prev.bet,
      winningLines: [],
      totalWin: 0
    }));

    // Odtwórz dźwięk kręcenia
    if (gameState.soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    // Symulacja kręcenia bębnów
    const newReels: Symbol[][] = [];
    for (let i = 0; i < 5; i++) {
      const reelSymbols = generateReelSymbols();
      const startIndex = Math.floor(Math.random() * reelSymbols.length);
      newReels.push([
        reelSymbols[startIndex % reelSymbols.length],
        reelSymbols[(startIndex + 1) % reelSymbols.length],
        reelSymbols[(startIndex + 2) % reelSymbols.length]
      ]);
    }

    // Czekaj na zakończenie animacji
    setTimeout(() => {
      const { lines, totalWin } = checkWinningLines(newReels);
      
      setGameState(prev => ({
        ...prev,
        isSpinning: false,
        reels: newReels,
        winningLines: lines,
        totalWin,
        balance: prev.balance + totalWin
      }));

      if (totalWin > 0) {
        // Odtwórz dźwięk wygranej
        if (gameState.soundEnabled && winSoundRef.current) {
          winSoundRef.current.currentTime = 0;
          winSoundRef.current.play().catch(() => {});
        }
        
        toast({
          title: "Wygrana! 🎉",
          description: `Wygrałeś ${totalWin} punktów!`,
        });
      }
    }, 2000);
  };

  const handleBetChange = (newBet: number) => {
    if (!gameState.isSpinning) {
      setGameState(prev => ({ ...prev, bet: newBet }));
    }
  };

  const handleReset = () => {
    if (!gameState.isSpinning) {
      setGameState(prev => ({
        ...prev,
        balance: 1000,
        winningLines: [],
        totalWin: 0
      }));
      toast({
        title: "Gra zresetowana",
        description: "Saldo zostało przywrócone do 1000 punktów.",
      });
    }
  };

  const toggleSound = () => {
    setGameState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent mb-4 animate-pulse">
            🎰 NEON SLOTS 🎰
          </h1>
          <p className="text-xl text-gray-300">Najlepsza gra slotowa w galaktyce!</p>
        </div>

        {/* Sound toggle */}
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSound}
            className="bg-purple-700/50 border-purple-400 hover:bg-purple-600/50"
          >
            {gameState.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>

        {/* Game Board */}
        <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/20">
          {/* Score Board */}
          <ScoreBoard 
            balance={gameState.balance}
            bet={gameState.bet}
            totalWin={gameState.totalWin}
          />

          {/* Win Display */}
          {gameState.totalWin > 0 && (
            <WinDisplay 
              amount={gameState.totalWin} 
              winningLines={gameState.winningLines}
            />
          )}

          {/* Slot Reels */}
          <div className="flex justify-center gap-4 mb-8">
            {Array.from({ length: 5 }, (_, index) => (
              <SlotReel
                key={index}
                symbols={gameState.reels[index] || []}
                isSpinning={gameState.isSpinning}
                winningPositions={gameState.winningLines.map(line => line[index])}
                delay={index * 200}
              />
            ))}
          </div>

          {/* Control Panel */}
          <ControlPanel
            bet={gameState.bet}
            onBetChange={handleBetChange}
            onSpin={handleSpin}
            onReset={handleReset}
            isSpinning={gameState.isSpinning}
            canSpin={gameState.balance >= gameState.bet}
          />
        </div>

        {/* Demo Notice */}
        <div className="text-center mt-6 text-gray-400">
          <p>🎮 Tryb DEMO - Graj bez ryzyka! 🎮</p>
        </div>
      </div>

      {/* Audio elements */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+D" />
      </audio>
      <audio ref={winSoundRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+D" />
      </audio>
    </div>
  );
};

export default SlotMachine;
