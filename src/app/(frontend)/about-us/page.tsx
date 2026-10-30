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
      </div>
    </div>
  );
}
