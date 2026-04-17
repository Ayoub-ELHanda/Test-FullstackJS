import '@testing-library/jest-dom';
import { vi } from 'vitest';

// so components that use useIntersectionObserver can render in tests.
globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
