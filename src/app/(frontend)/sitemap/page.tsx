import Link from "next/link";
export default function SiteMap() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        ← Back to Business Directory
      </Link>

      {/* <!-- Main Content --> */}
      <div className="px-4 py-12">
        {/* <!-- Page Title --> */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-primary mb-3">
            Site Map
          </h1>
          <p className="text-lg text-gray-500">
            Find your way around Pay With Zcash. Below is a complete list of
            every page on our website.
          </p>
        </div>

        {/* <!-- Sitemap Grid --> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* <!-- Section: Home --> */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                {/* <!-- Home Icon --> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Main</h2>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="group flex items-center text-gray-600 hover:text-blue-600"
                >
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2 group-hover:bg-blue-600 transition-colors"></span>
                  Home
                </Link>
              </li>
            </ul>
          </div>

          {/* <!-- Section: About --> */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                {/* <!-- Users Icon --> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">About Us</h2>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  href={"/about"}
                  className="group flex items-center text-gray-600 hover:text-blue-600"
                >
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2 group-hover:bg-blue-600 transition-colors"></span>
                  About us
                </Link>
              </li>
            </ul>
          </div>

          {/* <!-- Section: Services --> */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
                {/* <!-- Briefcase Icon --> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Services</h2>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/services"
                  className="group flex items-center text-gray-600 hover:text-blue-600"
                >
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2 group-hover:bg-blue-600 transition-colors"></span>
                  PayWithZcash
                </Link>
              </li>
            </ul>
          </div>

          {/* <!-- Section: Blog --> */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 text-red-600 p-2 rounded-lg mr-3">
                {/* <!-- Pencil Icon --> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Blog & Resources
              </h2>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/blog"
                  className="group flex items-center text-gray-600 hover:text-blue-600"
                >
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2 group-hover:bg-blue-600 transition-colors"></span>
                  Latest Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* <!-- Section: Contact --> */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">
                {/* <!-- Mail Icon --> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Contact</h2>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="group flex items-center text-gray-600 hover:text-blue-600"
                >
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2 group-hover:bg-blue-600 transition-colors"></span>
                  Get in Touch
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="group flex items-center text-gray-600 hover:text-blue-600"
                >
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2 group-hover:bg-blue-600 transition-colors"></span>
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* <!-- Legal / Utility Pages --> */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6 text-center">
            Utility Pages
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/privacy-policy"
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
