import Link from "next/link";

type SearchBarProps = {
  onSearchChange: (q: string) => void;
};

export default function SearchBar(props: SearchBarProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onSearchChange(e.target.value);
  };

  return (
    <div className="search-bar flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full justify-between">
      <input
        onChange={handleInputChange}
        type="text"
        placeholder="Search by category or merchant..."
        className="border border-white/[.45] p-4 w-full flex-1/2 sm:w-auto sm:max-w-xs md:max-w-md lg:max-w-2xl xl:max-w-3xl"
      />
      <Link
        href={"/submit-listing"}
        className="uppercase border border-white/[.45] p-4 mt-4 sm:mt-0 hover:bg-[#FFB400] hover:text-black"
      >
        Add your business
      </Link>
    </div>
  );
}
