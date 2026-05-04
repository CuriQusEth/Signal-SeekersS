import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignalVisualizer } from './SignalVisualizer';
import { useGameStore } from '../store/gameStore';
import { randomRange } from '../lib/utils';
import { AlertTriangle, Database, Crosshair, ArrowRight, Activity, RadioTower, Wrench } from 'lucide-react';

const MESSAGES = [
  { text: "Log 001: The stars are singing.", rarity: "common" },
  { text: "Protocol Sigma: Do not trust the whispers.", rarity: "rare" },
  { text: "Anomaly Detected: Organic life signature in sector 7G.", rarity: "epic" },
  { text: "Core Override: I am awake.", rarity: "legendary" },
  { text: "Transmission fragmented...", rarity: "common" },
  { text: "Coordinates embedded: 49.2, -120.4", rarity: "rare" }
];

export function VoidScreen() {
  const { depth, score, currentAntennaPower, increaseDepth, unlockMessage, setScreen } = useGameStore();

  const [currentFreq, setCurrentFreq] = useState(50);
  const [targetFreq, setTargetFreq] = useState(randomRange(10, 90));
  const [lockProgress, setLockProgress] = useState(0);
  const [isDecoding, setIsDecoding] = useState(false);
  
  const interactionRef = useRef<boolean>(false);

  // Smooth dragging for frequency input
  const handleTouchMove = (e: any) => {
    if (!interactionRef.current) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setCurrentFreq(percentage);
  };
  
  const handleMouseMove = (e: any) => {
    if (!interactionRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setCurrentFreq(percentage);
  };

  // Game Loop logic
  useEffect(() => {
    if (isDecoding) return;

    let interval = setInterval(() => {
      const diff = Math.abs(currentFreq - targetFreq);
      
      if (diff < 1.0 * currentAntennaPower) {
        setLockProgress(p => {
          const np = p + 2;
          if (np >= 100) {
            handleDecode();
            return 0;
          }
          return np;
        });
        if (navigator.vibrate && diff < 0.2) navigator.vibrate(20);
      } else {
        setLockProgress(p => Math.max(0, p - 5));
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentFreq, targetFreq, currentAntennaPower, isDecoding]);

  const handleDecode = () => {
    setIsDecoding(true);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    
    setTimeout(() => {
      // Pick random message
      const msgTmpl = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      unlockMessage({
        id: Math.random().toString(36).substring(7),
        text: msgTmpl.text,
        rarity: msgTmpl.rarity as any,
        frequency: targetFreq,
        depth: depth
      });
      increaseDepth(1);
      
      // Earn fragments based on rarity
      useGameStore.getState().addFragments(msgTmpl.rarity === 'legendary' ? 50 : msgTmpl.rarity === 'epic' ? 25 : msgTmpl.rarity === 'rare' ? 10 : 5);
      
      // Generate new target
      setTargetFreq(randomRange(5, 95));
      setIsDecoding(false);
      setLockProgress(0);
      
      // Random chance for noise storm or game over scenario if depth gets super high
      // (Simplified for MVP)
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col h-full p-6 mx-auto relative overflow-hidden"
    >
      {/* Header Info */}
      <header className="flex justify-between items-center mb-8 pt-2">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-mono text-white/40 tracking-widest mb-1">Depth_Layer</span>
          <span className="font-mono text-white text-lg font-bold">{(depth * 100).toFixed(0)}m</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setScreen('codex')} className="p-3 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <Database size={16} className="text-white/60" />
          </button>
          <button onClick={() => setScreen('upgrades')} className="p-3 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <Wrench size={16} className="text-cyan-400" />
          </button>
          <button onClick={() => setScreen('leaderboard')} className="p-3 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <Activity size={16} className="text-magenta-400" />
          </button>
        </div>
      </header>

      {/* Visualizer Area */}
      <section className="relative flex-1 mb-8 flex flex-col justify-center items-center h-full min-h-[300px]">
        {/* Coord HUD */}
        <div className="absolute top-0 left-0 text-cyan-400/50 font-mono text-[10px] leading-tight z-10 pointer-events-none">
          COORD: 42.029.112<br/>
          AZIMUTH: 18.42<br/>
          SIG_QUALITY: {Math.max(0, 100 - Math.abs(currentFreq - targetFreq)*10).toFixed(1)}%
        </div>

        <div className="absolute inset-0 z-0">
          <SignalVisualizer currentFreq={currentFreq} targetFreq={targetFreq} noiseLevel={depth * 0.5 + 10} />
        </div>
        
        {/* Decorative Rings around Visualizer to match design (on top) */}
        <div className="absolute inset-0 pointer-events-none rounded-full border border-white/5 opacity-50 scale-105" style={{ borderRadius: '50%'}}></div>
        <div className="absolute inset-8 pointer-events-none rounded-full border border-cyan-500/20 opacity-30 scale-110" style={{ borderRadius: '50%'}}></div>

        {/* Decoding Overlay */}
        <AnimatePresence>
          {isDecoding && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#05070a]/90 z-20 flex flex-col items-center justify-center backdrop-blur-md border border-cyan-500/30"
            >
              <div className="w-12 h-12 border-2 border-cyan-400 rotate-45 flex items-center justify-center mb-8">
                 <div className="w-4 h-4 bg-cyan-400 animate-ping"></div>
              </div>
              <h2 className="font-mono text-white tracking-[0.2em] uppercase text-xs mb-4">Decrypting_Signal</h2>
              <div className="w-48 h-1 bg-white/10 overflow-hidden">
                <motion.div 
                  className="h-full bg-cyan-400" 
                  initial={{ width: 0 }} 
                  animate={{ width: "100%" }} 
                  transition={{ duration: 1.8 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Target Reticle (Mock showing lock strength) */}
        {!isDecoding && lockProgress > 0 && (
           <div className="absolute w-16 h-16 border border-cyan-400 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10 pointer-events-none">
             <div className="w-2 h-2 bg-cyan-400 animate-pulse"></div>
             <span className="absolute -top-6 text-[10px] text-cyan-400 font-mono uppercase font-bold tracking-widest text-shadow">LOCKING_{lockProgress.toFixed(0)}%</span>
           </div>
        )}
      </section>

      {/* Tuner Controls */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex justify-between font-mono text-[9px] text-white/50 uppercase tracking-widest mb-2 px-1">
          <span>Freq: {currentFreq.toFixed(2)} MHz</span>
          <span className={Math.abs(currentFreq - targetFreq) < 5 ? "text-cyan-400 font-bold" : ""}>
            Signal: {Math.max(0, 100 - Math.abs(currentFreq - targetFreq)*10).toFixed(0)}%
          </span>
        </div>
        
        {/* Custom Drag Slider representing the Tuning Controls in Design */}
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-white/40">10.0</span>
          <div 
            className="flex-1 h-14 bg-white/5 border border-white/10 relative overflow-hidden cursor-ew-resize touch-none"
            onMouseDown={(e) => { interactionRef.current = true; handleMouseMove(e); }}
            onMouseUp={() => { interactionRef.current = false; }}
            onMouseLeave={() => { interactionRef.current = false; }}
            onMouseMove={handleMouseMove}
            onTouchStart={(e) => { interactionRef.current = true; handleTouchMove(e); }}
            onTouchEnd={() => { interactionRef.current = false; }}
            onTouchMove={handleTouchMove}
          >
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-cyan-400/50 z-0 pointer-events-none"></div>
            
            {/* Tick marks moving */}
            <motion.div className="absolute inset-y-0 left-0 flex items-center pointer-events-none opacity-30 font-mono text-[8px] whitespace-nowrap text-white"
              style={{ x: `calc(50% - ${currentFreq}%)` }}>
              {Array.from({length: 40}).map((_, i) => (
                <span key={i} className="inline-block w-8 text-center">|</span>
              ))}
            </motion.div>

            {/* Indicator / Tune Line */}
            <motion.div 
              className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] pointer-events-none z-10"
              style={{ left: `${currentFreq}%` }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          </div>
          <span className="text-[10px] font-mono text-white/40">99.0</span>
        </div>
      </div>
      
      {/* Footer Stats / Game Over trigger */}
      <footer className="h-10 border-t border-white/5 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-white/40 mt-auto">
        <div className="flex gap-4">
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div> SCORE: {score}</span>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors" onClick={() => setScreen('gameover')}>
          TERMINATE
        </button>
      </footer>
    </motion.div>
  );
}
