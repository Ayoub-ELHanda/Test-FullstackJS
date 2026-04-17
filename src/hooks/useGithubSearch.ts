import { useState, useEffect, useCallback } from 'react';
import type { GithubUser, GithubSearchResponse, SearchStatus } from '../types/github';

interface SearchState {
  users: GithubUser[];
  status: SearchStatus;
  errorMessage: string | null;
  hasMore: boolean; // true when there are more pages to load
}

const INITIAL_STATE: SearchState = {
  users: [],
  status: 'idle',
  errorMessage: null,
  hasMore: false,
};

// How many results to fetch per page
const PER_PAGE = 30;

// Cache keyed by "query:page"
const cache = new Map<string, { items: GithubUser[]; total: number }>();

interface FetchParams {
  query: string;
  page: number;
}

export function useGithubSearch(query: string) {

  const [fetchParams, setFetchParams] = useState<FetchParams>({ query: '', page: 1 });
  const [users, setUsers] = useState<GithubUser[]>([]);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const hasMore = users.length > 0 && users.length < totalCount;

  useEffect(() => {
    setFetchParams({ query, page: 1 });
  }, [query]);

  useEffect(() => {
    const { query: q, page } = fetchParams;

    if (!q.trim()) {
      setUsers([]);
      setStatus('idle');
      setErrorMessage(null);
      setTotalCount(0);
      return;
    }

    const controller = new AbortController();
    setStatus('loading');

    const cacheKey = `${q}:${page}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      setTotalCount(cached.total);
      setUsers(prev => page === 1 ? cached.items : [...prev, ...cached.items]);
      setStatus(cached.items.length === 0 && page === 1 ? 'no-results' : 'success');
      return;
    }

    const url = `https://api.github.com/search/users?q=${encodeURIComponent(q)}&per_page=${PER_PAGE}&page=${page}`;

    fetch(url, { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 403 && res.headers.get('X-RateLimit-Remaining') === '0') {
          setStatus('rate-limited');
          setErrorMessage('GitHub API rate limit exceeded. Please wait a moment and try again.');
          return;
        }

        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

        const data: GithubSearchResponse = await res.json();

        cache.set(cacheKey, { items: data.items, total: data.total_count });
        setTotalCount(data.total_count);
        setUsers(prev => page === 1 ? data.items : [...prev, ...data.items]);
        setStatus(data.items.length === 0 && page === 1 ? 'no-results' : 'success');
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;

        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        setStatus('error');
        setErrorMessage(message);
      });

    return () => controller.abort();

  }, [fetchParams]);

  const loadMore = useCallback(() => {
    setFetchParams(prev => ({ ...prev, page: prev.page + 1 }));
  }, []);

  return { ...INITIAL_STATE, users, status, errorMessage, hasMore, loadMore };
}
