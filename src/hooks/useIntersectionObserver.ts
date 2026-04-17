import { useEffect, useRef } from 'react';

export function useIntersectionObserver(
  onIntersect: () => void,
  enabled: boolean,
): React.RefObject<HTMLDivElement | null> {

  const elementRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onIntersect);
  callbackRef.current = onIntersect; // update on every render

  useEffect(() => {
    if (!enabled) return; // don't observe when loading or no more results

    const el = elementRef.current;
    if (!el) return; // element not mounted yet

    const observer = new IntersectionObserver(
      ([entry]) => {
        // entry.isIntersecting is true when the element enters the viewport
        if (entry.isIntersecting) {
          callbackRef.current(); // call loadMore
        }
      },
      { threshold: 0.1 } // fire when at least 10% of the element is visible
    );

    observer.observe(el);

    //disconnect the observer when enabled changes or component unmounts
    return () => observer.disconnect();

  }, [enabled]);

  return elementRef;
}