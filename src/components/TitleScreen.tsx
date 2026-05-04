import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useSiwe } from '../hooks/useSiwe';
import { Radio } from 'lucide-react';

export function TitleScreen() {
  const setScreen = useGameStore(state => state.setScreen);
  const { sayGM } = useSiwe();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full p-6 z-10 relative"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="mb-8 w-16 h-16 border-2 border-cyan-400 rotate-45 flex items-center justify-center bg-cyan-500/10"
      >
        <div className="w-8 h-8 bg-cyan-400 flex items-center justify-center p-1 -rotate-45">
           <Radio size={32} className="text-[#05070a]" />
        </div>
      </motion.div>
      
      <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-[0.2em] mb-2 text-center text-white glow-text" style={{ fontFamily: 'var(--font-display)' }}>
        Signal Seekers
      </h1>
      
      <p className="text-cyan-400/70 font-mono text-[10px] tracking-widest uppercase mb-12 text-center">
        Frequency Scanner v.2.0.4
      </p>

      <button 
        onClick={() => setScreen('void')}
        className="px-8 py-4 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 font-bold uppercase tracking-widest text-sm hover:bg-cyan-500/20 transition-all w-full max-w-[280px] mb-4 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
      >
        Initialize Scan
      </button>

      <button 
        onClick={sayGM}
        className="px-8 py-3 bg-transparent border border-white/10 text-white/50 font-mono text-xs uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all w-full max-w-[280px]"
      >
        Say GM On-Chain
      </button>

      <div className="absolute bottom-6 font-mono text-[9px] text-white/30 uppercase tracking-widest flex items-center gap-4">
        <span>ERC-8021</span>
        <div className="w-1 h-1 bg-white/30 rounded-full"></div>
        <span>Base Mainnet</span>
      </div>
    </motion.div>
  );
}
