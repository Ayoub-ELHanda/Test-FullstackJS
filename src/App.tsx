import { useState, useCallback, useEffect } from 'react';
import { SearchInput } from './components/SearchInput/SearchInput';
import { Toolbar } from './components/Toolbar/Toolbar';
import { UserGrid } from './components/UserGrid/UserGrid';
import { useDebounce } from './hooks/useDebounce';
import { useGithubSearch } from './hooks/useGithubSearch';
import type { UserItem } from './types/github';

function App() {
  const [query, setQuery] = useState('');
  const [editMode, setEditMode] = useState(false);

  // separate from API data so duplicate/delete don't trigger a re-fetch
  const [userItems, setUserItems] = useState<UserItem[]>([]);

  const debouncedQuery = useDebounce(query, 400);

  // fall back to popular users when the query is too short
  const effectiveQuery = debouncedQuery.trim().length >= 2
    ? debouncedQuery.trim()
    : 'followers:>1000';

  const { users, status, errorMessage, hasMore, loadMore } = useGithubSearch(effectiveQuery);

  // rebuild the local list whenever the API returns new results
  useEffect(() => {
    setUserItems(users.map((u) => ({ ...u, key: String(u.id), selected: false })));
  }, [users]);

  const selectedCount = userItems.filter((u) => u.selected).length;
  const allSelected = userItems.length > 0 && selectedCount === userItems.length;

  const toggleSelect = useCallback((key: string) => {
    setUserItems((prev) =>
      prev.map((u) => (u.key === key ? { ...u, selected: !u.selected } : u))
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setUserItems((prev) => prev.map((u) => ({ ...u, selected: !allSelected })));
  }, [allSelected]);

  const duplicateSelected = useCallback(() => {
    setUserItems((prev) => {
      const copies = prev
        .filter((u) => u.selected)
        .map((u) => ({
          ...u,
          // unique key so React doesn't confuse the copy with the original
          key: `${u.key}-copy-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          selected: false,
        }));
      return [...prev, ...copies];
    });
  }, []);

  const deleteSelected = useCallback(() => {
    setUserItems((prev) => prev.filter((u) => !u.selected));
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Github Search</h1>
        <button
          className={`edit-mode-btn${editMode ? ' edit-mode-btn--active' : ''}`}
          onClick={() => setEditMode((prev) => !prev)}
          aria-pressed={editMode}
        >
          {editMode ? 'Exit Edit' : 'Edit'}
        </button>
      </header>

      <main className="app-main">
        <div className="search-wrapper">
          <SearchInput value={query} onChange={setQuery} />
        </div>

        {editMode && (
          <Toolbar
            selectedCount={selectedCount}
            allSelected={allSelected}
            hasItems={userItems.length > 0}
            onToggleSelectAll={toggleSelectAll}
            onDuplicate={duplicateSelected}
            onDelete={deleteSelected}
          />
        )}

        <UserGrid
          items={userItems}
          status={status}
          errorMessage={errorMessage}
          editMode={editMode}
          onToggleSelect={toggleSelect}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      </main>
    </div>
  );
}

export default App;
