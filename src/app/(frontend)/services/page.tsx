import { howItWorks, keyBenefits } from "./data";
export default function PayWithZcashInvoicingPage() {
  return (
    <div className="container">
      <div className="header my-12">
        <h1 className="text-3xl font-bold">
          PayWithZcash:{" "}
          <span className="text-2xl">
            Private Zcash Invoicing & Payment Processing for Modern Merchants
          </span>
        </h1>

        <p className="text-base mt-4 leading-8">
          PayWithZcash provides a complete invoicing and payment processing
          infrastructure that allows businesses to accept ZEC (Zcash) seamlessly
          from customers while preserving financial privacy for both parties. We
          handle the entire transaction lifecycle—from invoice generation and
          payment confirmation to receipt issuance—so merchants never have to
          manage blockchain technicalities.
        </p>

        <h3 className="mt-8 mb-2 text-xl font-semibold">Key Benefits:</h3>

        <ul className="list-disc space-y-3 mb-8">
          {keyBenefits.map((kb) => (
            <li key={kb.label} className="flex items-start">
              - {kb.description}
            </li>
          ))}
        </ul>

        <p>{howItWorks}</p>
      </div>
      {/* <!-- PayWithZcash Service Card --> */}
      <div className=" bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-24">
        <div className="p-8">
          {/* <!-- Header with status badge --> */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900">PayWithZcash</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5 animate-pulse"></span>
              In Development
            </span>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Private Zcash invoicing and payment processing for modern merchants.
            Accept ZEC without touching a single blockchain technicality.
          </p>

          {/* <!-- Benefits --> */}
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-700">
                Three integration methods: REST API, Drop-in SDK, Hosted
                Checkout
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-700">
                Automated invoice → confirmation → receipt flow
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-700">
                Shielded settlement keeps revenue data off public explorers
              </span>
            </li>
          </ul>

          {/* <!-- Waitlist Form --> */}
          <form className="border-t border-gray-100 pt-6">
            <label
              htmlFor="waitlist-email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Join the early-access list
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                id="waitlist-email"
                required
                placeholder="you@yourstore.com"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />

              <select className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Where do you sell? (optional)</option>
                <option>Shopify</option>
                <option>WooCommerce / WordPress</option>
                <option>Custom stack (own website)</option>
                <option>Marketplace / other</option>
              </select>

              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition whitespace-nowrap"
              >
                Get Early Access
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              No spam. One email when we open merchant onboarding. Currently
              building:{" "}
              <span className="font-mono text-gray-500">SDK v0.1</span>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
