'use client'

import pay_with_zcash_logo from "../images/pay_with_zcash_logo.png";

import Image from 'next/image'

export default function Nav() {
  return (
    // <!-- Navbar -->
    <nav className="bg-[#241F20] text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* <!-- Logo --> */}
          <div className="flex items-center">
            <a href="#" className="text-3xl font-bold text-[#FFB400]">
              <Image
                width={500}
                height={67}
                src={pay_with_zcash_logo}
                alt="pay with zcash logo"
                className="w-full sm:w-56 md:w-64 lg:w-70 xl:w-80 h-auto"
              />
            </a>
          </div>

          {/* <!-- Mobile Hamburger Icon --> */}
          <div className="lg:hidden">
            <button
              id="hamburger"
              className="text-[#FFB400] focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>

          {/* <!-- Menu Items (Desktop and Large Screens) --> */}
          <div className="hidden lg:flex space-x-8">
            <a
              href="#about"
              className="text-lg text-white hover:text-[#FFB400] transition duration-300"
            >
              About
            </a>
            <a
              href="#find_an_atm"
              className="text-lg text-white hover:text-[#FFB400] transition duration-300"
            >
              Find an ATM
            </a>
          </div>
        </div>

        {/* <!-- Mobile Menu (Hidden by default) --> */}
        <div id="mobileMenu" className="lg:hidden hidden">
          <div className="flex flex-col space-y-6 py-4 px-6 bg-[#241F20]">
            <a
              href="#about"
              className="text-lg text-white hover:text-[#FFB400] transition duration-300"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-lg text-white hover:text-[#FFB400] transition duration-300"
            >
              Contact
            </a>
            <a
              href="#blog"
              className="text-lg text-white hover:text-[#FFB400] transition duration-300"
            >
              Blog
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
