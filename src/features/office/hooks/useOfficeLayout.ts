import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ScreenMode = 'single' | 'multi';
export type ActiveScreen = 'office' | 'trending' | 'creation';
export type LayoutDirection = 'row' | 'column';
export type DataMode = 'mock' | 'real';

interface OfficeLayoutState {
  // Screen mode
  screenMode: ScreenMode;
  setScreenMode: (mode: ScreenMode) => void;
  
  // Active screen (for single-screen mode)
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  
  // Layout direction (for multi-screen mode)
  layoutDirection: LayoutDirection;
  setLayoutDirection: (direction: LayoutDirection) => void;
  
  // Data modes for SCR-02 and SCR-03
  trendingDataMode: DataMode;
  setTrendingDataMode: (mode: DataMode) => void;
  
  creationDataMode: DataMode;
  setCreationDataMode: (mode: DataMode) => void;
  
  // Toggle functions
  toggleScreenMode: () => void;
  toggleLayoutDirection: () => void;
}

export const useOfficeLayout = create<OfficeLayoutState>()(
  persist(
    (set) => ({
      // Default to single-screen mode to preserve current UX
      screenMode: 'single',
      setScreenMode: (mode) => set({ screenMode: mode }),
      
      // Default to office screen
      activeScreen: 'office',
      setActiveScreen: (screen) => set({ activeScreen: screen }),
      
      // Default to row layout
      layoutDirection: 'row',
      setLayoutDirection: (direction) => set({ layoutDirection: direction }),
      
      // Default to mock data mode
      trendingDataMode: 'mock',
      setTrendingDataMode: (mode) => set({ trendingDataMode: mode }),
      
      creationDataMode: 'mock',
      setCreationDataMode: (mode) => set({ creationDataMode: mode }),
      
      // Toggle functions
      toggleScreenMode: () =>
        set((state) => ({
          screenMode: state.screenMode === 'single' ? 'multi' : 'single',
        })),
      
      toggleLayoutDirection: () =>
        set((state) => ({
          layoutDirection: state.layoutDirection === 'row' ? 'column' : 'row',
        })),
    }),
    {
      name: 'office-layout-storage',
    }
  )
);
