import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  userId: string | null;
  verified: boolean;
  currentStore: string | null;
  points: number;
  setUserId: (userId: string) => void;
  setVerified: (verified: boolean) => void;
  setCurrentStore: (store: string) => void;
  setPoints: (points: number) => void;
  addPoints: (points: number) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userId: null,
      verified: false,
      currentStore: null,
      points: 0,
      setUserId: (userId) => set({ userId }),
      setVerified: (verified) => set({ verified }),
      setCurrentStore: (currentStore) => set({ currentStore }),
      setPoints: (points) => set({ points }),
      addPoints: (points) => set((state) => ({ points: state.points + points })),
      reset: () => set({ userId: null, verified: false, currentStore: null, points: 0 }),
    }),
    {
      name: 'shelfsync-storage',
    }
  )
);
