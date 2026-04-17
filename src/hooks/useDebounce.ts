import { useState, useEffect } from 'react';

// The <T> makes this hook generic — it works with strings, numbers, or any type.
export function useDebounce<T>(value: T, delay: number): T {

  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Every time `value` changes, we start a timer.After `delay` ms, we update debouncedValue to match value.
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timer);

  }, [value, delay]);

  return debouncedValue;
}