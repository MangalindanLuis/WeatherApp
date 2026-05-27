import { Search } from "lucide-react";

export default function SearchBar({
  city,
  setCity,
  onSearch,
}) {
  return (
    <div className="searchBox">
      <input
        type="text"
        placeholder="Search city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && onSearch()
        }
      />

      <button onClick={onSearch}>
        <Search size={20} />
      </button>
    </div>
  );
}