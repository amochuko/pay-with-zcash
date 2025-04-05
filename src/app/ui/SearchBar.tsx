import Link from "next/link";

type SearchBarProps = {
  onSearchChange: (q: string) => void;
};

export default function SearchBar(props: SearchBarProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onSearchChange(e.target.value);
  };

  return (
    <div className="search-bar flex flex-col sm:flex-row sm:items-center w-full">
      <div className="flex-grow">
        <input
          id="search"
          onChange={handleInputChange}
          type="text"
          placeholder="Search by category or merchant..."
          className="border border-white/[.45] p-4 w-full sm:max-w-xs md:max-w-md lg:max-w-2xl xl:max-w-3xl"
        />
      </div>
      <div className="flex-none sm:mt-0 mt-10">
        <Link
          href={"/submit-listing"}
          className="uppercase border text-center border-white/[.45] p-4 sm:mt-0 bg-[#FFB400] hover:bg-[#CF9B20] text-black hover:font-medium"
        >
          Add your business
        </Link>
      </div>
    </div>
  );
}
