import { useState, useEffect } from 'react';

/**
 * 媒体查询 Hook
 * @param query 媒体查询字符串
 * @returns 是否匹配
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // 初始化
    setMatches(media.matches);

    // 监听变化
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // 添加监听器
    media.addEventListener('change', listener);

    // 清理
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}
