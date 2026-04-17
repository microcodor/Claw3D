import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ScreenMode = 'single' | 'multi';
export type ActiveScreen = 'office' | 'trending' | 'creation';
export type LayoutDirection = 'row' | 'column';
export type DataMode = 'mock' | 'real';
export type TrendingVersion = 'v1' | 'v2';

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
  
  // SCR-02 version selection
  trendingVersion: TrendingVersion;
  setTrendingVersion: (version: TrendingVersion) => void;
  
  // Toggle functions
  toggleScreenMode: () => void;
  toggleLayoutDirection: () => void;
  toggleTrendingVersion: () => void;
}

export const useOfficeLayout = create<OfficeLayoutState>()(
  persist(
    (set) => ({
      // Default to multi-screen mode (三横屏展示)
      screenMode: 'multi',
      setScreenMode: (mode) => set({ screenMode: mode }),
      
      // Default to office screen (SCR-01)
      activeScreen: 'office',
      setActiveScreen: (screen) => set({ activeScreen: screen }),
      
      // Default to row layout (横向排列)
      layoutDirection: 'row',
      setLayoutDirection: (direction) => set({ layoutDirection: direction }),
      
      // Default to mock data mode
      trendingDataMode: 'mock',
      setTrendingDataMode: (mode) => set({ trendingDataMode: mode }),
      
      creationDataMode: 'mock',
      setCreationDataMode: (mode) => set({ creationDataMode: mode }),
      
      // Default to V2 (new version)
      trendingVersion: 'v2',
      setTrendingVersion: (version) => set({ trendingVersion: version }),
      
      // Toggle functions
      toggleScreenMode: () =>
        set((state) => ({
          screenMode: state.screenMode === 'single' ? 'multi' : 'single',
        })),
      
      toggleLayoutDirection: () =>
        set((state) => ({
          layoutDirection: state.layoutDirection === 'row' ? 'column' : 'row',
        })),
      
      toggleTrendingVersion: () =>
        set((state) => ({
          trendingVersion: state.trendingVersion === 'v1' ? 'v2' : 'v1',
        })),
    }),
    {
      name: 'office-layout-storage',
    }
  )
);
