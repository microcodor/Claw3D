import { useMediaQuery } from './useMediaQuery';

export interface Breakpoints {
  isXL: boolean;  // >= 1920px
  isLG: boolean;  // >= 1366px
  isMD: boolean;  // >= 1024px
  isSM: boolean;  // < 1024px
}

/**
 * 断点 Hook
 * @returns 当前断点状态
 */
export function useBreakpoint(): Breakpoints {
  const isXL = useMediaQuery('(min-width: 1920px)');
  const isLG = useMediaQuery('(min-width: 1366px)');
  const isMD = useMediaQuery('(min-width: 1024px)');
  const isSM = !isMD;

  return {
    isXL,
    isLG,
    isMD,
    isSM,
  };
}
