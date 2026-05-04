import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';

// Providers
import { Providers } from './Providers';

// Screens
import { TitleScreen } from './components/TitleScreen';
import { VoidScreen } from './components/VoidScreen';
import { CodexScreen } from './components/CodexScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { UpgradesScreen } from './components/UpgradesScreen';

function GameCoordinator() {
  const currentScreen = useGameStore(state => state.currentScreen);

  // Set theme colors via body
  useEffect(() => {
    document.body.className = 'bg-[#05070a] text-[#a0aec0] antialiased selection:bg-cyan-500/30 selection:text-white';
  }, []);

  return (
    <div className="min-h-dvh flex flex-col overflow-hidden relative">
      {/* Background Grid & Effects */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2d3748 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0, 245, 255, 0.05) 0%, transparent 70%)' }}></div>
      
      {/* Top Navigation / HUD */}
      {currentScreen !== 'title' && (
        <header className="h-12 border-b border-cyan-500/20 flex flex-col justify-center px-4 bg-[#05070a]/80 backdrop-blur-md z-20 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border border-cyan-400 rotate-45 flex items-center justify-center bg-cyan-500/10">
                <div className="w-2 h-2 bg-cyan-400"></div>
              </div>
              <div>
                <h1 className="text-white font-bold tracking-[0.2em] text-[10px] leading-tight">SIGNAL SEEKERS</h1>
                <p className="text-[8px] text-cyan-400/70 font-mono uppercase leading-tight">Scanner v.2.0.4</p>
              </div>
            </div>
            <div className="flex gap-4 items-center font-mono">
              <div className="flex flex-col items-end">
                <span className="text-[8px] uppercase opacity-50">Base Mainnet</span>
                <span className="text-[10px] text-cyan-400 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Live</span>
              </div>
            </div>
          </div>
        </header>
      )}

      <div className="flex-1 relative z-10 w-full max-w-md mx-auto flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {currentScreen === 'title' && <TitleScreen key="title" />}
          {currentScreen === 'void' && <VoidScreen key="void" />}
          {currentScreen === 'codex' && <CodexScreen key="codex" />}
          {currentScreen === 'leaderboard' && <LeaderboardScreen key="leaderboard" />}
          {currentScreen === 'gameover' && <GameOverScreen key="gameover" />}
          {currentScreen === 'upgrades' && <UpgradesScreen key="upgrades" />}
        </AnimatePresence>
      </div>

      {/* Bottom Status Bar */}
      <footer className="h-6 border-t border-white/5 flex items-center justify-between px-4 bg-black/40 text-[8px] font-mono uppercase shrink-0 relative z-20">
        <div className="flex gap-3">
          <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-green-500"></div> SYS OK</span>
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-white/40">APP: 68f52662..</span>
          <span className="text-white">BLD: bc_m82npol5</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Providers>
      <GameCoordinator />
    </Providers>
  );
}
