import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ArrowLeft, Zap, Wrench } from 'lucide-react';

export function UpgradesScreen() {
  const { fragments, currentAntennaPower, upgradeAntenna, setScreen } = useGameStore();

  const cost = currentAntennaPower * 10;
  const canAfford = fragments >= cost;

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
          <Wrench size={16} /> Hardware_Status
        </h2>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto space-y-6 max-w-sm mx-auto w-full">
        <div className="p-6 bg-white/5 border-l-2 border-magenta-500 font-mono text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-magenta-500/5 group-hover:bg-magenta-500/10 transition-colors pointer-events-none" />
          <div className="text-white/40 uppercase tracking-widest text-[9px] mb-2 relative z-10">Signal_Fragments</div>
          <div className="text-3xl text-magenta-400 font-bold relative z-10">{fragments}</div>
        </div>

        <div className="p-6 bg-white/5 border border-white/10 text-center flex flex-col items-center">
          <Zap size={32} className="text-cyan-400 mb-6 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          
          <h3 className="font-mono uppercase tracking-widest text-sm text-white mb-2">Signal Amplifier Lvl {currentAntennaPower}</h3>
          <p className="font-mono text-[10px] text-center text-white/50 mb-8 leading-relaxed max-w-[240px]">
            Increases frequency lock tolerance, making it easier to lock onto deep anomaly signals.
          </p>

          <button 
            onClick={upgradeAntenna}
            disabled={!canAfford}
            className={`w-full py-4 font-mono uppercase tracking-[0.2em] text-[10px] transition-all shadow-[0_0_20px_rgba(6,182,212,0.1)]
              ${canAfford ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/20' : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'}`}
          >
            Upgrade (-{cost} Frags)
          </button>
        </div>
      </div>
    </motion.div>
  );
}
