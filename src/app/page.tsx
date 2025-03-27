import Link from "next/link";
import Image from "next/image";
import { getMerchants } from "./lib/actions";

export default async function HomePage() {
  const merchants = await getMerchants();

  return (
    <div className="min-h-screen p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header>
        <Link
          href={"/submit-listing"}
          className="uppercase border border-white/[.45] p-4"
        >
          Add your business
        </Link>
      </header>
      <main className="flex flex-col gap-[32px] items-center sm:items-start">
        {/* {merchants?.map((m, i) => (
          <div key={m.merchant_id + '_' + i} className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md w-full max-w-xs md:max-w-sm lg:max-w-md">
            <Image
              src={m.logo_url}
              width={50}
              height={50}
              alt="Logo"
              className="w-16 h-16 mb-4"
            />

            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Product Name
            </h2>

            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">
              Upvote
            </button>
          </div>
        ))} */}

        <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg w-full max-w-xs md:max-w-sm lg:max-w-md">
          {/* <!-- Logo on the left --> */}
          <div className="flex items-center mb-4">
            <Image
              src="path/to/logo.png"
              alt="Logo"
              className="w-16 h-16 mr-4"
              width={100}
              height={100}
            />
            <h3 className="text-2xl font-semibold text-gray-800">
              Product Name
            </h3>
          </div>

          {/* <!-- Additional text - Red Rock Coffeehouse --> */}
          <p className="text-lg text-gray-600 mb-4">Red Rock Coffeehouse</p>

          {/* <!-- Upvote Button --> */}
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none mb-4">
            Upvote
          </button>

          {/* <!-- List of Tags --> */}
          <div className="flex flex-wrap space-x-2 mb-4">
            <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-sm mb-2">
              Tag 1
            </span>
            <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-sm mb-2">
              Tag 2
            </span>
            <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-sm mb-2">
              Tag 3
            </span>
          </div>

          {/* <!-- External Website Link --> */}
          <a
            href="https://www.example.com"
            target="_blank"
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Visit Website
          </a>
        </div>
      </main>
    </div>
  );
}
