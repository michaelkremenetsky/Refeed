import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ObserverRect = Omit<DOMRectReadOnly, "toJSON">;

const defaultState: ObserverRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

export function useResizeObserver<T extends HTMLElement = any>() {
  const frameID = useRef(0);
  const ref = useRef<T>(null);

  const [rect, setRect] = useState<ObserverRect>(defaultState);

  const observer = useMemo(
    () =>
      typeof window !== "undefined"
        ? new ResizeObserver((entries: any) => {
            const entry = entries[0];

            if (entry) {
              cancelAnimationFrame(frameID.current);

              frameID.current = requestAnimationFrame(() => {
                if (ref.current) {
                  setRect(entry.contentRect);
                }
              });
            }
          })
        : null,
    [],
  );

  useEffect(() => {
    if (ref.current) {
      observer?.observe(ref.current);
    }

    return () => {
      observer?.disconnect();

      if (frameID.current) {
        cancelAnimationFrame(frameID.current);
      }
    };
  }, [ref.current]);

  return [ref, rect] as const;
}

// Wrapper hook that ignores 0 width after a non-zero width has been observed
export function useResizeObserverWithCallback<T extends HTMLElement>(): {
  ref: React.RefObject<T>;
  width: number | undefined;
} {
  const [width, setWidth] = useState<number | undefined>();
  const hasNonZeroWidthBeenObserved = useRef(false);
  const [ref, { width: observedWidth }] = useResizeObserver<T>();

  const updateWidth = useCallback((newWidth: number) => {
    // If newWidth is 0 and we've already observed a non-zero width, ignore it
    if (newWidth === 0 && hasNonZeroWidthBeenObserved.current) {
      return;
    }
    // If newWidth is non-zero, update the state and mark that a non-zero width has been observed
    if (newWidth > 0) {
      hasNonZeroWidthBeenObserved.current = true;
      setWidth(newWidth);
    }
  }, []);

  // Effect to handle observed width changes
  useEffect(() => {
    if (observedWidth !== undefined) {
      updateWidth(observedWidth);
    }
  }, [observedWidth, updateWidth]);

  return { ref, width };
}
