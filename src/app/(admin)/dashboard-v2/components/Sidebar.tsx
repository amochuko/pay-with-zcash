import { logOut } from "@/app/actions/auth.action";
import { navMenuBackend } from "@/app/lib/nav-menu";
import { convertToTitleCase } from "@/app/lib/utils/string";
import Link from "next/link";

export interface NavItem {
  label: string;
  href?: string;
}

export default function SideBar() {
  return (
    <aside className="flex flex-col w-full border-b md:border-b-0">
      <nav className="hidden md:block w-64 flex-1 flex-shrink-0 p-4">
        <ul className="flex md:flex-col overflow-x-auto md:overflow-visible gap-6">
          {navMenuBackend.map((n) => (
            <li
              key={n.link}
              className="hover:bg-gray-400 border-b-1 border-slate-500 hover:text-gray-900 hover:cursor-pointer"
            >
              <Link
                href={
                  n.link.endsWith("home")
                    ? "/dashboard"
                    : `/dashboard/${n.link}`
                }
                className="px-2 py-3 inline-block text-gray-300 whitespace-nowrap "
              >
                {convertToTitleCase(n.title)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="submit"
        onClick={logOut}
        className="mt-48 mx-auto cursor-pointer min-w-[140px] px-2 py-3 bg-amber-400 text-slate-800 font-bold"
      >
        Log out
      </button>
    </aside>
  );
}
