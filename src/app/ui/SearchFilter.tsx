type SearchFilterProps = {
  searchQuery: string;
  onChange: (text: string) => void;
};

export function SearchFilter(props: SearchFilterProps) {
  return (
    <input
      type="text"
      className="h-10 w-full rounded-md border border-border/50 bg-card/50 px-3 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20 sm:text-base"
      placeholder="Search by Merchant name"
      value={props.searchQuery}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
}
