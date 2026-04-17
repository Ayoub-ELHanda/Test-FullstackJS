import type { UserItem, SearchStatus } from '../../types/github';
import { UserCard } from '../UserCard/UserCard';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface Props {
  items: UserItem[];
  status: SearchStatus;
  errorMessage: string | null;
  editMode: boolean;
  onToggleSelect: (key: string) => void;
  hasMore: boolean; 
  onLoadMore: () => void;
}


const SKELETON_COUNT = 12;
function SkeletonCard() {
  return (
    <div className="user-card skeleton-card" aria-hidden="true">
      <div className="skeleton-avatar" />
      <div className="skeleton-line skeleton-line--short" />
      <div className="skeleton-line skeleton-line--long" />
      <div className="skeleton-btn" />
    </div>
  );
}


export function UserGrid({ items, status, errorMessage, editMode, onToggleSelect, hasMore, onLoadMore }: Props) {

  const sentinelRef = useIntersectionObserver(
    onLoadMore,
    hasMore && status === 'success'
  );

  const isInitialLoading = (status === 'idle' || status === 'loading') && items.length === 0;
  const isLoadingMore = status === 'loading' && items.length > 0;

  return (
    <div className="grid-container">

      {/* INITIAL LOADING: show 12 animated placeholder cards */}
      {isInitialLoading && (
        <section aria-label="Search results" aria-busy="true">
          <div className="user-grid">
            {Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>
      )}

      {/* RATE LIMITED: GitHub blocked us — too many requests */}
      {status === 'rate-limited' && (
        <div className="status-message status-message--error" role="alert">
          <p>{errorMessage}</p>
        </div>
      )}

      {/* ERROR: network failure or HTTP error */}
      {status === 'error' && (
        <div className="status-message status-message--error" role="alert">
          <p>Something went wrong: {errorMessage}</p>
        </div>
      )}

      {/* NO RESULTS: search worked but found nothing */}
      {status === 'no-results' && (
        <div className="status-message" role="status">
          <p>No users found.</p>
        </div>
      )}

      {/* SUCCESS or LOADING MORE: show the actual cards */}
      {(status === 'success' || isLoadingMore) && (
        <section aria-label="Search results">
          <div className="user-grid">
            {items.map((item) => (
              <UserCard
                key={item.key}
                item={item}
                editMode={editMode}
                onToggleSelect={onToggleSelect}
              />
            ))}
          </div>

          <div ref={sentinelRef} className="sentinel" aria-hidden="true" />

          {/* Show a spinner while loading the next page */}
          {isLoadingMore && (
            <div className="load-more-indicator" aria-label="Loading more results">
              <div className="spinner" />
            </div>
          )}
        </section>
      )}

    </div>
  );
}