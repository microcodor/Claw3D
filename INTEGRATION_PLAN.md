# Three-Screen Architecture Integration Plan

## Overview
Integrating openclaw-dashboard's SCR-02 (热搜舆情中心) and SCR-03 (创作工作室) into Claw3D while preserving all existing functionality.

## Architecture Decision
- **SCR-01**: 数字办公室 (existing, unchanged)
- **SCR-02**: 热搜舆情中心 (Trending Center - 19 platforms, 190 hotspots)
- **SCR-03**: 创作工作室 (Creation Studio - 11 mock messages, typing effects)

## Implementation Status

### ✅ Completed
1. **Layout State Management** (`src/features/office/hooks/useOfficeLayout.ts`)
   - Zustand store with screen mode, active screen, layout direction
   - Persistence with localStorage
   - Data mode toggles for SCR-02 and SCR-03

2. **Layout Components**
   - `src/features/office/components/ScreenSelector.tsx` - Tab navigation
   - `src/features/office/components/LayoutToggle.tsx` - Layout controls
   - `src/features/office/components/MultiScreenLayout.tsx` - Container
   - `src/features/office/components/multi-screen-layout.module.css` - Styles

3. **Type Definitions**
   - `src/features/trending-center/types/index.ts` - TypeScript interfaces

4. **SCR-02 (Trending Center)** ✅
   - Data: `src/features/trending-center/data/hotspotData.json` (10 platforms, 100 items)
   - Service: `src/features/trending-center/services/hotspotService.ts`
   - Components: MiniLineChart, SentimentPie, KeywordCloud, HorizontalBarChart, TrendingRow
   - Screen: `src/features/trending-center/screens/TrendingCenterScreen.tsx`
   - Styles: `src/features/trending-center/styles/trending-center.module.css`

5. **SCR-03 (Creation Studio)** ✅
   - Data: `src/features/creation-studio/data/mockMessages.ts` (3 mock messages)
   - Components: Particles, ThinkingSteps, OutputDisplay, useTypingEffect
   - Screen: `src/features/creation-studio/screens/CreationStudioScreen.tsx`
   - Styles: `src/features/creation-studio/styles/creation-studio.module.css`

6. **Office Page Integration** ✅
   - Modified `src/app/office/page.tsx` to use `<MultiScreenLayout>`
   - Lazy-loaded `<TrendingCenter>` and `<CreationStudio>`
   - Default single-screen mode preserved

### ⏳ Pending
7. **Testing**
   - Verify zero impact on existing Office functionality
   - Test single-screen and multi-screen modes
   - Test layout direction toggle
   - Performance testing
   - Fix any TypeScript errors
   - Test on development server

## Data Strategy
- **SCR-01**: Real Gateway data (existing)
- **SCR-02 & SCR-03**: Mock data initially (from openclaw-dashboard)
- Service layer pattern: `mockService` + `realService` with mode toggle
- Data file: `src/features/trending-center/data/hotspotData.json` (needs to be created)

## Key Files to Create
```
Claw3D/
├── src/features/trending-center/
│   ├── data/hotspotData.json (copy from openclaw-dashboard)
│   ├── services/hotspotService.ts
│   ├── components/
│   │   ├── TrendingList.tsx
│   │   ├── MiniLineChart.tsx
│   │   ├── SentimentPie.tsx
│   │   ├── KeywordCloud.tsx
│   │   └── HorizontalBarChart.tsx
│   ├── screens/TrendingCenterScreen.tsx
│   └── styles/trending-center.module.css
│
├── src/features/creation-studio/
│   ├── data/mockMessages.ts
│   ├── services/creationService.ts
│   ├── components/
│   │   ├── Particles.tsx
│   │   ├── ThinkingSteps.tsx
│   │   ├── OutputDisplay.tsx
│   │   └── useTypingEffect.ts
│   ├── screens/CreationStudioScreen.tsx
│   └── styles/creation-studio.module.css
```

## Next Steps
1. Create hotspotData.json in Claw3D
2. Implement hotspotService.ts
3. Create TrendingCenterScreen and components
4. Implement creationService.ts
5. Create CreationStudioScreen and components
6. Modify office/page.tsx to use MultiScreenLayout
7. Test and verify

## Notes
- Default behavior: Single-screen mode (preserves current UX)
- Multi-screen as optional toggle
- Zero modifications to existing OfficeScreen component
- Lazy loading for SCR-02 and SCR-03 to minimize performance impact
