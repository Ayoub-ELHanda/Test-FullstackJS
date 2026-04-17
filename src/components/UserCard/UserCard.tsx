import type { UserItem } from '../../types/github';

interface Props {
  item: UserItem;
  editMode: boolean;
  onToggleSelect: (key: string) => void;
}


export function UserCard({ item, editMode, onToggleSelect }: Props) {
  return (
    <article
      className={`user-card${item.selected ? ' user-card--selected' : ''}`}
      aria-label={`User ${item.login}`}
    >
      {/* The checkbox  renders when editMode is true (the bonus feature) */}
      {editMode && (
        <label className="user-card-checkbox" aria-label={`Select ${item.login}`}>
          <input
            type="checkbox"
            checked={item.selected}            
            onChange={() => onToggleSelect(item.key)} 
          />
        </label>
      )}

      <div className="user-card-avatar">
        <img
          src={item.avatar_url}
          alt={`${item.login}'s avatar`}
          className="user-card-avatar-img"
          loading="lazy"
          width={64}
          height={64}
        />
      </div>

      <p className="user-card-id">#{item.id}</p>
      <p className="user-card-login">{item.login}</p>

      <a
        href={item.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="user-card-link"
        aria-label={`View ${item.login}'s profile on GitHub`}
      >
        View profile
      </a>
    </article>
  );
}