import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer bg-slate-200 ">
      <ul className="flex flex-col max-w-screen-xl mx-auto gap-4 p-6 py-8 dark:text-black">
        <li className="font-medium">
          ©{new Date().getFullYear()} Pay With Zcash. All rights reserved.
        </li>
        <li>
          <Link
            className="text-[#2d2d2bae]  hover:text-[#1d1d1bae]  hover:underline"
            href="/privacy-policy"
          >
            Privacy Policy
          </Link>
        </li>
      </ul>
      <ul className="flex max-w-screen-xl mx-auto gap-6 px-6 py-8 dark:text-black">
        <li>
          <Link
            className="text-[#2d2d2bae]"
            href="https://github.com/amochuko/pay-with-zcash"
            referrerPolicy="no-referrer"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.304.762-1.604-2.665-.3-5.466-1.335-5.466-5.933 0-1.311.468-2.382 1.236-3.222-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.51 11.51 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.222 0 4.61-2.804 5.63-5.475 5.922.43.372.823 1.104.823 2.222v3.293c0 .322.216.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </li>
        <li>
          <Link
            className="text-[#2d2d2bae]"
            href="https://discord.com/channels/978714252934258779/1019068568295440394"
            referrerPolicy="no-referrer"
            target="_blank"
          >
            <svg
              viewBox="0 0 70 60"
              className="w-6 h-6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M60.104 4.552A58.564 58.564 0 0044.2.02a41.18 41.18 0 00-1.984 4.105 55.632 55.632 0 00-16.45 0A41.177 41.177 0 0023.781.02 58.596 58.596 0 007.875 4.552 61.263 61.263 0 0 0 0 45.135a59.708 59.708 0 0017.803 9.096 45.045 45.045 0 003.853-6.188 37.703 37.703 0 01-6.06-2.873c.509-.373.998-.77 1.468-1.188a42.19 42.19 0 0037.978 0c.47.418.96.815 1.468 1.188a37.62 37.62 0 01-6.06 2.873 45.134 45.134 0 003.853 6.188A59.708 59.708 0 0071 45.135a61.247 61.247 0 00-10.896-40.583zM23.69 37.28c-3.327 0-6.056-3.07-6.056-6.846 0-3.776 2.689-6.847 6.056-6.847s6.118 3.07 6.056 6.847c0 3.776-2.689 6.846-6.056 6.846zm23.62 0c-3.327 0-6.056-3.07-6.056-6.846 0-3.776 2.689-6.847 6.056-6.847s6.118 3.07 6.056 6.847c0 3.776-2.689 6.846-6.056 6.846z"
                fill="#2d2d2bae"
              />
            </svg>
          </Link>
        </li>
      </ul>
    </footer>
  );
}
