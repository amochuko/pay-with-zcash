export interface NavItem {
  label: string;
  href?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/dashboard" },
  { label: "About", href: "/dashboard/about" },
  { label: "Services", href: "/dashboard/services" },
  { label: "Contact", href: "/dashboard/contact" },
];

export default function SideBar() {
  return (
    <aside className="flex w-full border-b md:border-b-0 ">
      <nav className="hidden md:block w-64 flex-1 flex-shrink-0 p-4">
        <ul className="flex md:flex-col overflow-x-auto md:overflow-visible gap-6">
          {NAV_ITEMS.map((item) => (
            <li
              key={item.label}
              className="hover:bg-gray-400 border-b-1 border-slate-500 hover:text-gray-900 hover:cursor-pointer"
            >
              <a
                href={item.href}
                className="px-2 py-3 inline-block text-gray-300 whitespace-nowrap "
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
