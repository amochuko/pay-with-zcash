"use client";

import Link from "next/link";
import pay_with_zcash_logo from "../images/pay_with_zcash_logo.png";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <nav className="fixed z-50 top-0 left-0 right-0 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#0c1216] border-b border-white/[.25]  text-white shadow-md flex items-center justify-between w-full py-8">
      {/* <!-- Logo --> */}
      <div className="flex items-center">
        <Link href="/" className="text-3xl font-bold text-[#FFB400]">
          <Image
            width={500}
            height={67}
            src={pay_with_zcash_logo}
            alt="pay with zcash logo"
            className="w-full sm:w-56 md:w-64 lg:w-70 xl:w-80 h-auto"
          />
        </Link>
      </div>

      {/* <!-- Menu Items (Desktop and Large Screens) --> */}
      <div className="hidden lg:flex space-x-8">
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
        className={`absolute top-full left-0 right-0 mt-2 transition-all duration-300 ease-in-out transform ${
          isMobileMenuOpen
            ? "opacity-100 transform-y-0"
            : "opacity-0 translate-y-4 "
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
        </div>
      </div>
    </nav>
  );
}
