import { useEffect, useRef } from 'react';

export function useIntersectionObserver(
  onIntersect: () => void,
  enabled: boolean,
): React.RefObject<HTMLDivElement | null> {

  const elementRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onIntersect);
  callbackRef.current = onIntersect; // update on every render

  useEffect(() => {
    if (!enabled) return; 

    const el = elementRef.current;
    if (!el) return; 

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callbackRef.current(); 
        }
      },
      { threshold: 0.1 } 
    );

    observer.observe(el);

    //disconnect 
    return () => observer.disconnect();

  }, [enabled]);

  return elementRef;
}