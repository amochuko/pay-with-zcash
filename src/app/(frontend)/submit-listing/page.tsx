import { postMerchantListing } from "@/app/lib/actions";
import { categories } from "@/app/lib/data";

export default function SubmitListing() {
  return (
    <form
      action={postMerchantListing}
      className="relative top-44 mx-auto w-full max-w-2xl rounded-lg bg-white p-8 shadow dark:bg-slate-800"
    >
      <h4 className="py-4 text-2xl font-medium text-slate-300">
        Submit Listing to Directory
      </h4>
      <div className="flex flex-col gap-0.5 my-4">
        <label
          htmlFor="bizName"
          className="my-1 font-medium dark:text-slate-200"
        >
          Business Name
        </label>
        <input
          type="text"
          name="bizName"
          id="bizName"
          className="w-full rounded-md border p-3 h-12 text-slate-800 focus:outline-none focus:ring-blue-100 dark:bg-slate-200 dark:text-neutral-800"
        />
      </div>
      <div className="flex flex-col gap-1.5 my-4">
        <label
          htmlFor="category"
          className="my-1 font-medium dark:text-slate-200"
        >
          Select Category
        </label>
        <select
          className="w-full rounded-md border p-3 h-12 text-slate-800 focus:outline-none  focus:ring-blue-100 dark:bg-slate-200 dark:text-neutral-800"
          id="category"
        >
          {Object.entries(categories[0]).map(([key, value]) => (
            <option key={value + key} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5 my-4">
        <label
          htmlFor="website"
          className="my-1 font-medium dark:text-slate-200"
        >
          Website
        </label>
        <input
          type="text"
          name="website"
          id="website"
          className="w-full rounded-md border p-3 h-12 text-slate-800 focus:outline-none focus:ring-blue-100 dark:bg-slate-200 dark:text-neutral-800"
        />
      </div>
      <div className="flex flex-col gap-1.5 my-4">
        <label htmlFor="email" className="my-1 font-medium dark:text-slate-200">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="w-full rounded-md border p-3 h-12 text-slate-800 focus:outline-none focus:ring-blue-100 dark:bg-slate-200 dark:text-neutral-800"
        />
      </div>
      <div className="mt-12 space-x-8 space-y-3">
        <button
          className={`min-w-10 rounded bg-[--color-brand-yellow] px-4 py-2 border border-slate-300 text-white transition duration-300 hover:bg-[--color-brand-yellow-shade]`}
          type="submit"
        >
          Submit
        </button>
        <button
          className={`min-w-10 rounded border border-slate-300 bg-slate-800 px-4 py-2 text-white`}
          type="submit"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
