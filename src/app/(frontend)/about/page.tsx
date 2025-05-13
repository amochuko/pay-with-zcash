import Image from "next/image";
import spendZecAccepted from "../../images/spend-zec-accepted.png";

export default function AboutPage() {
  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-6">
        About{" "}
      </h1>
      <div className="flex justify-center mb-12">
        <Image
          src={spendZecAccepted}
          width={240}
          height={60}
          alt="zcash accepted logo"
        />
      </div>
      <p className="text-lg mb-4 leading-relaxed">
        This website is an answer to the question – Where can I pay with Zcash?
        Zcash is an electronic cash system. It’s global, decentralized, and open
        to all. Zcash also uses encryption that allows you to spend safely.
      </p>
      <p className="text-lg mb-4 leading-relaxed">
        This directory is free to use. The items listed are for informational
        purposes only, and not endorsements of any kind. Enjoy!
      </p>
    </div>
  );
}
