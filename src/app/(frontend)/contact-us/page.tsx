import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        ← Back to Business Directory
      </Link>

      <div className="mt-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Contact Us</h1>

        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          Have a question, suggestion, or need assistance with your business
          listing? We'd be happy to hear from you.
        </p>
      </div>

      <div className="rounded-lg p-4 sm:p-6 md:p-8 shadow-lg bg-slate-600 dark:bg-slate-800">
        <form action="#">
          <div className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block mb-1.5 text-sm font-medium text-slate-100"
              >
                Your Name
              </label>

              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Enter your name"
                className="w-full rounded-md border p-3 h-11 sm:h-12 text-sm bg-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-1.5 text-sm font-medium text-slate-100"
              >
                Email Address
              </label>

              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-md border p-3 h-11 sm:h-12 text-sm bg-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block mb-1.5 text-sm font-medium text-slate-100"
              >
                Subject
              </label>

              <input
                type="text"
                id="subject"
                name="subject"
                required
                placeholder="What is this regarding?"
                className="w-full rounded-md border p-3 h-11 sm:h-12 text-sm bg-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block mb-1.5 text-sm font-medium text-slate-100"
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="How can we help?"
                className="w-full rounded-md border p-3 text-sm bg-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-y"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full sm:w-auto rounded px-6 py-2.5 text-sm font-medium text-black bg-[#FFB400] hover:bg-[#CF9B20] transition-colors cursor-pointer"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
