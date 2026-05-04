import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';

export function CodexScreen() {
  const { decodedMessages, setScreen } = useGameStore();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-magenta-400 border-magenta-500';
      case 'epic': return 'text-cyan-400 border-cyan-500';
      case 'rare': return 'text-cyan-200 border-cyan-400';
      default: return 'text-white/70 border-white/10';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full p-6 mx-auto w-full z-10"
    >
      <header className="flex items-center justify-between mb-8 pt-2">
        <button onClick={() => setScreen('void')} className="p-3 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft size={16} className="text-white/60" />
        </button>
        <h2 className="font-mono uppercase tracking-[0.2em] text-xs text-cyan-400 flex items-center gap-2">
          <BookOpen size={16} /> Decoded_Logs
        </h2>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 relative font-mono text-[11px]">
        {decodedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 h-32 text-white/40 font-mono text-xs uppercase tracking-widest text-center">
            <AlertCircle size={24} className="mb-2 opacity-30" />
            <p>No records found in cache.</p>
          </div>
        ) : (
          decodedMessages.map((msg, i) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 bg-white/5 border-l-2 ${getRarityColor(msg.rarity)}`}
            >
              <p className="mb-2 font-bold uppercase tracking-widest text-xs flex justify-between">
                 <span>SIG-{msg.depth}m: DATA</span>
                 <span className="opacity-50 text-[9px] font-normal">{msg.frequency.toFixed(2)} MHz</span>
              </p>
              <p className="opacity-70 leading-relaxed text-white">
                "{msg.text}"
              </p>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
