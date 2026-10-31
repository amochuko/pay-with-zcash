import { Search } from "lucide-react";

type SearchBarProps = {
  onSearchChange: (q: string) => void;
};

export default function SearchBar(props: SearchBarProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onSearchChange(e.target.value);
  };

  return (
    <div className="search-bar w-full">
      <div className="relative w-full sm:max-w-md lg:max-w-xl">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          id="search"
          onChange={handleInputChange}
          type="text"
          placeholder="Search by name, state, country..."
          className="w-full border border-primary rounded-sm pl-10 pr-3 sm:pr-4 h-11 sm:h-12 text-sm sm:text-base outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}
