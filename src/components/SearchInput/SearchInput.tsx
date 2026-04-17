interface Props {
  value: string;
  onChange: (value: string) => void;
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
        aria-label="Search GitHub users"
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}