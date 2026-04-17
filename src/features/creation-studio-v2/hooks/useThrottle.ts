import { useState, useEffect, useRef } from 'react';

/**
 * 节流 Hook
 * @param value 需要节流的值
 * @param interval 节流间隔（毫秒）
 * @returns 节流后的值
 */
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Date.now() - lastRan.current >= interval) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, interval - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(timer);
    };
  }, [value, interval]);

  return throttledValue;
}
