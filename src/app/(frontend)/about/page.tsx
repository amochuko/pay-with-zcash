import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        ← Back to Business Directory
      </Link>

      <div className="mt-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">About Us</h1>

        <div className="flex justify-center my-12">
          <Image
            src="/images/spend-zec-accepted.png"
            width={240}
            height={60}
            alt="zcash accepted logo"
            className="object-contain"
            quality={100}
          />
        </div>

        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          This website is an answer to the question – Where can I pay with
          Zcash? Zcash is an electronic cash system. It’s global, decentralized,
          and open to all. Zcash also uses encryption that allows you to spend
          safely.
        </p>

        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          This directory is free to use. The items listed are for informational
          purposes only, and not endorsements of any kind. Enjoy!
        </p>

        <p className="mt-12 text-sm sm:text-base text-muted-foreground leading-relaxed">
          Join the community:
          <ul className="flex gap-6 py-4">
            <li>
              <Link
                href="https://discord.com/channels/978714252934258779/1019068568295440394"
                referrerPolicy="no-referrer"
                target="_blank"
              >
                <svg
                  viewBox="0 0 70 60"
                  className="w-10 h-10 transition-colors duration-200"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M60.104 4.552A58.564 58.564 0 0044.2.02a41.18 41.18 0 00-1.984 4.105 55.632 55.632 0 00-16.45 0A41.177 41.177 0 0023.781.02 58.596 58.596 0 007.875 4.552 61.263 61.263 0 0 0 0 45.135a59.708 59.708 0 0017.803 9.096 45.045 45.045 0 003.853-6.188 37.703 37.703 0 01-6.06-2.873c.509-.373.998-.77 1.468-1.188a42.19 42.19 0 0037.978 0c.47.418.96.815 1.468 1.188a37.62 37.62 0 01-6.06 2.873 45.134 45.134 0 003.853 6.188A59.708 59.708 0 0071 45.135a61.247 61.247 0 00-10.896-40.583zM23.69 37.28c-3.327 0-6.056-3.07-6.056-6.846 0-3.776 2.689-6.847 6.056-6.847s6.118 3.07 6.056 6.847c0 3.776-2.689 6.846-6.056 6.846zm23.62 0c-3.327 0-6.056-3.07-6.056-6.846 0-3.776 2.689-6.847 6.056-6.847s6.118 3.07 6.056 6.847c0 3.776-2.689 6.846-6.056 6.846z" />
                </svg>
              </Link>
            </li>
          </ul>
        </p>
      </div>
    </div>
  );
}
