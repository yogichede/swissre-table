// hooks/useDebouncedCallback.ts
import { useEffect, useMemo, useRef } from "react";

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay = 300
) {
  const callbackRef = useRef(callback);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return useMemo(() => {
    return (...args: Parameters<T>) => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    };
  }, [delay]);
}