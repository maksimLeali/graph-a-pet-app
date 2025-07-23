import { useRef, useCallback } from 'react';

export interface LongPressOptions {
  /** Durata minima (ms) per riconoscere il long‑press (default: 500) */
  threshold?: number;
}

type EventHandlers = {
  onMouseDown: React.MouseEventHandler;
  onTouchStart: React.TouchEventHandler;
  onMouseUp: React.MouseEventHandler;
  onMouseLeave: React.MouseEventHandler;
  onTouchEnd: React.TouchEventHandler;
};

/**
 * Hook per gestire il “long press” su un elemento HTML
 *
 * @param onLongPress callback da eseguire al termine del press prolungato
 * @param options soglia in millisecondi
 * @returns insieme di event handler da spalmare sul tuo JSX
 */
export function useLongPress(
  onLongPress: () => void,
  { threshold = 500 }: LongPressOptions = {}
): EventHandlers {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPress = useCallback(() => {
    timer.current = setTimeout(onLongPress, threshold);
  }, [onLongPress, threshold]);

  const clearPress = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  return {
    onMouseDown: startPress,
    onTouchStart: startPress,
    onMouseUp: clearPress,
    onMouseLeave: clearPress,
    onTouchEnd: clearPress,
  };
}
