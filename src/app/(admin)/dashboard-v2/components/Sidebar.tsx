export interface NavItem {
  label: string;
  href?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

 
export default function SideBar() {
  return (
    <aside className="bg-white w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200">

      <nav className="flex md:flex-col overflow-x-auto md:overflow-visible">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
