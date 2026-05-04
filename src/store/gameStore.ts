import { create } from 'zustand';

export type Screen = 'title' | 'void' | 'codex' | 'leaderboard' | 'upgrades' | 'gameover';

export interface DecodedMessage {
  id: string;
  text: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  frequency: number;
  depth: number;
}

interface GameState {
  currentScreen: Screen;
  depth: number;
  score: number;
  fragments: number;
  decodedMessages: DecodedMessage[];
  currentAntennaPower: number;
  noiseLevel: number;
  
  setScreen: (screen: Screen) => void;
  increaseDepth: (amount: number) => void;
  addScore: (points: number) => void;
  addFragments: (amount: number) => void;
  unlockMessage: (msg: DecodedMessage) => void;
  upgradeAntenna: () => void;
  resetRun: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentScreen: 'title',
  depth: 0,
  score: 0,
  fragments: 0,
  decodedMessages: [],
  currentAntennaPower: 1,
  noiseLevel: 50,
  
  setScreen: (screen) => set({ currentScreen: screen }),
  increaseDepth: (amount) => set((state) => ({ depth: state.depth + amount })),
  addScore: (points) => set((state) => ({ score: state.score + points })),
  addFragments: (amount) => set((state) => ({ fragments: state.fragments + amount })),
  unlockMessage: (msg) => set((state) => ({ 
    decodedMessages: [...state.decodedMessages, msg],
    score: state.score + (msg.rarity === 'legendary' ? 1000 : msg.rarity === 'epic' ? 500 : msg.rarity === 'rare' ? 250 : 100)
  })),
  upgradeAntenna: () => set((state) => {
    if (state.fragments >= state.currentAntennaPower * 10) {
      return {
        fragments: state.fragments - state.currentAntennaPower * 10,
        currentAntennaPower: state.currentAntennaPower + 1
      };
    }
    return state;
  }),
  resetRun: () => set({
    depth: 0,
    score: 0,
    currentScreen: 'void'
  })
}));
