type SearchBarProps = {
  onSearchChange: (q: string) => void;
};

export default function SearchBar(props: SearchBarProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onSearchChange(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        onChange={handleInputChange}
        type="text"
        placeholder="Search by category or merchant..."
        className="uppercase border border-white/[.45] p-4 max-w-2xl"
      />
    </div>
  );
}
