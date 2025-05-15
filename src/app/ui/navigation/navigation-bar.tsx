"use client";

import Link from "next/link";
import pay_with_zcash_logo from "./pay_with_zcash_logo.png";
import pay_with_zcash_logo_black from "./pay_with_zcash_logo_black.png";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { THEME_NAME } from "../../lib/config";
import ThemeToggle from "../theme-toggle";

export default function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const setThemeAttribute = (themeName: string) => {
    document.documentElement.setAttribute("data-theme", themeName);
  };

  useEffect(() => {
    // check saved theme prefernece from localstorage or defaul t light
    const savedTheme = localStorage.getItem(THEME_NAME) || "light";
    setTheme(savedTheme);

    setThemeAttribute(savedTheme);
  }, []);

  const handleToggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    localStorage.setItem(THEME_NAME, newTheme); // save theme to local storage
    console.log("called...");
    setThemeAttribute(newTheme);
  };

  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close the mobile menu when the page changes
  useEffect(() => {
    // Reset the mobile menu state when the route changes
    setIsMobileMenuOpen(false);
  }, [pathname]); // Dependency on the route path changes

  return (
    // <!-- Navbar -->
    <nav className="fixed z-50 top-0 left-0 right-0 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl  mx-auto flex items-center justify-between w-full py-8 bg-white dark:bg-[#0c1216]">
        {/* <!-- Logo --> */}
        <div className="flex items-center">
          <Link href="/" className="text-3xl font-bold">
            <Image
              width={500}
              height={67}
              src={
                theme === "dark"
                  ? pay_with_zcash_logo
                  : pay_with_zcash_logo_black
              }
              alt="pay with zcash logo"
              className="w-full sm:w-56 md:w-64 lg:w-70 xl:w-80 h-auto"
            />
          </Link>
        </div>

        {/* <!-- Menu Items (Desktop and Large Screens) --> */}
        <div className="hidden lg:flex lg:items-center space-x-8">
          <Link
            href="/about"
            className="text-lg text-black  hover:text-gray-800  dark:hover:text-[#d7bd82] dark:text-[#FFB400]  transition duration-300"
          >
            About
          </Link>
          <Link
            href="/find-an-atm"
            className="text-lg text-black  hover:text-gray-800  dark:hover:text-[#d7bd82] dark:text-[#FFB400]  transition duration-300"
          >
            Find an ATM
          </Link>
          <ThemeToggle theme={theme} toggleTheme={handleToggleTheme} />
        </div>

        {/* <!-- Mobile Hamburger Icon --> */}

        <div className="lg:hidden relative ">
          <button
            id="hamburger"
            className="text-[#FFB400] focus:outline-none cursor-pointer"
            onClick={toggleMobileMenu}
          >
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 26 26"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>

        {/* <!-- Mobile Menu (Hidden by default) --> */}
        <div
          id="mobileMenu"
          className={`absolute top-full left-0 right-0 mt-2 transition-all duration-300 ease-in-out transform z-0 ${
            isMobileMenuOpen
              ? "opacity-100 transform-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center space-y-6 py-4 px-6 bg-[#241F20]">
            <Link
              href="/about"
              className="text-lg text-white hover:text-[#FFB400] transition duration-300"
            >
              About
            </Link>
            <Link
              href="/find-an-atm"
              className="text-lg text-white hover:text-[#FFB400] transition duration-300"
            >
              Find an ATM
            </Link>
            <ThemeToggle theme={theme} toggleTheme={handleToggleTheme} />
          </div>
        </div>
      </div>
    </nav>
  );
}
