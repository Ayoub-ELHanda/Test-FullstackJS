import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useGithubSearch } from './useGithubSearch';

const MOCK_USERS = [
  { id: 1, login: 'alice', avatar_url: 'https://example.com/a.png', html_url: 'https://github.com/alice' },
  { id: 2, login: 'bob', avatar_url: 'https://example.com/b.png', html_url: 'https://github.com/bob' },
];

afterEach(() => vi.restoreAllMocks());

describe('useGithubSearch', () => {
  it('starts idle when query is empty', () => {
    const { result } = renderHook(() => useGithubSearch(''));
    expect(result.current.status).toBe('idle');
    expect(result.current.users).toHaveLength(0);
  });

  it('starts idle for whitespace-only query', () => {
    const { result } = renderHook(() => useGithubSearch('   '));
    expect(result.current.status).toBe('idle');
  });

  it('transitions to loading then success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => null },
      json: async () => ({ total_count: 2, incomplete_results: false, items: MOCK_USERS }),
    }));

    const { result } = renderHook(() => useGithubSearch('alice'));
    expect(result.current.status).toBe('loading');

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.users).toHaveLength(2);
  });

  it('reports no-results when items array is empty', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => null },
      json: async () => ({ total_count: 0, incomplete_results: false, items: [] }),
    }));

    const { result } = renderHook(() => useGithubSearch('xyznotfound'));
    await waitFor(() => expect(result.current.status).toBe('no-results'));
    expect(result.current.users).toHaveLength(0);
  });

  it('reports rate-limited on 403 with X-RateLimit-Remaining: 0', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 403,
      headers: { get: (key: string) => (key === 'X-RateLimit-Remaining' ? '0' : null) },
      json: async () => ({}),
    }));

    const { result } = renderHook(() => useGithubSearch('test'));
    await waitFor(() => expect(result.current.status).toBe('rate-limited'));
    expect(result.current.errorMessage).toBeTruthy();
  });

  it('reports error on non-403 HTTP failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      headers: { get: () => null },
    }));

    const { result } = renderHook(() => useGithubSearch('test'));
    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.errorMessage).toContain('500');
  });

  it('ignores aborted requests without setting error state', async () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(abortError));

    const { result } = renderHook(() => useGithubSearch('test'));
    // After the abort, state should NOT flip to error
    await new Promise((r) => setTimeout(r, 50));
    expect(result.current.status).not.toBe('error');
  });
});
