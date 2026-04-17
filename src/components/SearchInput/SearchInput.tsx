interface Props {
  value: string;
  onChange: (value: string) => void; // called every time the user types a character
}

// Controlled input component for searching GitHub users
export function SearchInput({ value, onChange }: Props) {
  return (
    <div className="search-input-wrapper">
      <input
        className="search-input"
        type="search"
        placeholder="Search input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search GitHub users" // for screen readers
        autoComplete="off" // disable browser suggestions
        spellCheck={false} // no red underlines on usernames
      />
    </div>
  );
}