"use client";

import Link from "next/link";
import { logOut } from "../../actions/auth.action";
import { navMenuBackend } from "../../lib/nav-menu";
import { convertToTitleCase } from "../../lib/utils/string";

type SideBarProps = {
  isSidebarOpen: boolean;
};
export default function SideBar(props: SideBarProps) {
  return (
    <div
      className={`nav-bar-left flex flex-col h-full ${
        props.isSidebarOpen ? "block" : "hidden"
      } md:block text-white p-6`}
    >
      <ul className="nav-items flex-grow-1 overflow-y-auto min-h--[100]">
        {navMenuBackend.map((n) => (
          <li key={n.link} className="nav-item mb-4">
            <Link
              href={
                n.link.endsWith("home") ? "/dashboard" : `/dashboard/${n.link}`
              }
              className="text-white hover:text-gray-300"
            >
              {convertToTitleCase(n.title)}
            </Link>
          </li>
        ))}
      </ul>

      <button
        type="submit"
        onClick={logOut}
        className="mt-48 cursor-pointer bg-amber-400 text-black p-2 font-bold"
      >
        Log out
      </button>
    </div>
  );
}
