import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ArrowLeft, Trophy, Crown } from 'lucide-react';

export function LeaderboardScreen() {
  const { setScreen } = useGameStore();
  const [board, setBoard] = useState<{address: string; score: number; depth: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(d => {
        setBoard(d);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col h-full p-6 mx-auto w-full z-10"
    >
      <header className="flex items-center justify-between mb-8 pt-2">
        <button onClick={() => setScreen('title')} className="p-3 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft size={16} className="text-white/60" />
        </button>
        <h2 className="font-mono uppercase tracking-[0.2em] text-xs text-cyan-400 flex items-center gap-2">
          <Trophy size={16} /> OnChain_Leaderboard
        </h2>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {loading ? (
          <div className="text-center font-mono text-[10px] text-white/40 py-10 uppercase animate-pulse tracking-widest">
            Syncing Mainnet...
          </div>
        ) : board.length === 0 ? (
          <div className="text-center font-mono text-[10px] text-white/40 py-10 uppercase tracking-widest">
            Network Empty
          </div>
        ) : (
          board.map((entry, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-center justify-between px-4 py-3 bg-white/5 border-l-2 font-mono text-[10px] tracking-widest
                ${idx === 0 ? 'border-magenta-500' : 'border-white/10'}`}
            >
              <div className="flex items-center gap-3 w-32 shrink-0">
                <span className={`w-4 text-center ${idx === 0 ? 'text-magenta-400' : 'text-white/30'}`}>
                  {idx === 0 ? <Crown size={12} className="mx-auto" /> : `${idx + 1}`}
                </span>
                <span className={`uppercase ${idx === 0 ? 'text-white' : 'text-white/70'}`}>
                  {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                </span>
              </div>
              
              <div className="flex justify-end gap-6 flex-1 text-right">
                <span className="text-cyan-400">{entry.score} DATA</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
