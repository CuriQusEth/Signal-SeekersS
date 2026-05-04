import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useSiwe } from '../hooks/useSiwe';
import { Trophy, Upload, ShieldCheck, Activity } from 'lucide-react';

export function GameOverScreen() {
  const { score, depth, setScreen, resetRun } = useGameStore();
  const { submitScoreOnChain, isAuthenticated, signIn } = useSiwe();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRestart = () => {
    resetRun();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!isAuthenticated) {
        await signIn();
      }
      // Re-check after sign in attempt
      const res = await submitScoreOnChain(score, depth);
      if (res && res.ok) {
        setSubmitted(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full p-6 relative max-w-sm mx-auto z-10 w-full"
    >
      <div className="absolute inset-0 bg-[#05070a]/50 pointer-events-none" />

      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-full text-red-500"
      >
        <Activity size={40} />
      </motion.div>

      <h1 className="text-4xl font-display uppercase font-bold text-white mb-2 z-10 tracking-[0.2em] text-center glow-text drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">
        Signal Lost
      </h1>
      
      <p className="text-cyan-400/50 font-mono text-[10px] uppercase tracking-widest text-center mb-8 z-10">
        Connection to probe terminated.
      </p>

      <div className="w-full bg-white/5 border-l-2 border-cyan-400 p-6 z-10 mb-8 space-y-4 font-mono">
        <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
          <span className="text-white/40 uppercase tracking-widest">Max_Depth</span>
          <span className="text-cyan-400">{(depth * 100).toFixed(0)}m</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/40 uppercase tracking-widest">Data_Recovered</span>
          <span className="text-magenta-400 font-bold">{score}</span>
        </div>
      </div>

      <div className="w-full flex justify-center flex-col gap-4 z-10 mb-8">
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting || submitted}
          className={`flex items-center justify-center gap-3 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(6,182,212,0.1)]
            ${submitted ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500' : 
              'bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20'}`}
        >
          {submitted ? <ShieldCheck size={16} /> : <Upload size={16} />}
          {isSubmitting ? 'Verifying...' : submitted ? 'Recorded On-Chain' : 'Record Transmission'}
        </button>

        <button 
          onClick={() => { handleRestart(); setScreen('leaderboard'); }}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Trophy size={14} /> View Leaderboard
        </button>
      </div>

      <button 
        onClick={() => { handleRestart(); setScreen('void'); }}
        className="z-10 text-white/30 text-[10px] font-mono uppercase tracking-[0.2em] border-b border-white/10 pb-1 hover:text-white transition-colors"
      >
        Initialize new run
      </button>

    </motion.div>
  );
}
