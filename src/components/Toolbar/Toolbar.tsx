interface Props {
  selectedCount: number;  
  allSelected: boolean; 
  hasItems: boolean;
  onToggleSelectAll: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function Toolbar({
  selectedCount, allSelected, hasItems,
  onToggleSelectAll, onDuplicate, onDelete,
}: Props) {
  const hasSelection = selectedCount > 0; // used to enable/disable action buttons

  return (
    <div className="toolbar" role="toolbar" aria-label="Selection actions">

      {/* LEFT SIDE: select-all checkbox + counter */}
      <div className="toolbar-left">
        <label className="toolbar-select-all">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onToggleSelectAll}
            disabled={!hasItems}  // grey out if there are no cards at all
            aria-label="Select all users"
          />
          <span className="toolbar-count">
            {/* Show count when items are selected, "Select all" otherwise */}
            {selectedCount > 0
              ? `${selectedCount} element${selectedCount !== 1 ? 's' : ''} selected`

              : 'Select all'}
          </span>
        </label>
      </div>

      <div className="toolbar-actions">
        <button
          className="toolbar-btn toolbar-btn--duplicate"
          onClick={onDuplicate}
          disabled={!hasSelection}
          aria-label="Duplicate selected items" // screen readers read this since button has no text
          title="Duplicate"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>

        <button
          className="toolbar-btn toolbar-btn--delete"
          onClick={onDelete}
          disabled={!hasSelection}
          aria-label="Delete selected items"
          title="Delete"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>

    </div>
  );
}