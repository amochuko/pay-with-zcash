"use client";
import { addMerchant } from "@/app/actions/merchant.action";
import { CategoryRow } from "@/app/lib/types/category.type";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { useActionState, useEffect } from "react";

const initialState = {
  message: "",
  data: undefined,
};

type ListingFormProp = {
  addMerchant: (prevState: unknown, formData: FormData) => void;
  categories: CategoryRow[] | [];
};

export default function MerchantListingForm(props: ListingFormProp) {
  const [state, formAction, pending] = useActionState(
    addMerchant,
    initialState,
  );

  useEffect(() => {
    if (!state?.data) {
      return;
    }

    alert(
      "Your application was successful! Please note that it may take up to 24 hours for review before it becomes available to the public.",
    );

    redirect("/");
  }, [state?.data]);

  return (
    <div className="mt-4 sm:mt-16">
      {/* Page introduction */}
      <div className="mx-auto w-full max-w-2xl mb-6 sm:mb-8 p-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors mb-5"
        >
          <ArrowLeft size={16} />
          Back to Business Directory
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 my-6">
          Submit your business to the Zcash Business Directory
        </h1>

        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          Help Zcash users discover your business and identify where they can
          pay using ZEC.
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          NOTE: Your listing will be reviewed before appearing in the directory.
        </p>
      </div>

      <div className="relative mx-auto my-10 sm:my-14 w-full max-w-2xl rounded-lg p-4 sm:p-6 md:p-8 shadow-lg bg-slate-600 dark:bg-slate-800">
        <form action={formAction}>
          <h4 className="mb-6 text-xl sm:text-2xl font-semibold text-slate-100">
            Submit Listing to Directory
          </h4>

          {/* Business Name and Shielded Payments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            <div className="min-w-0">
              <label
                htmlFor="merchant_name"
                className="block mb-1.5 text-sm font-medium text-slate-100 dark:text-slate-200"
              >
                Business Name
              </label>

              <input
                type="text"
                name="merchant_name"
                id="merchant_name"
                required
                disabled={pending}
                className="w-full rounded-md border p-3 h-11 sm:h-12 text-sm sm:text-base text-slate-800 bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />

              {typeof state?.message != "string" && (
                <span className="block text-sm text-red-300 mt-2">
                  {state?.message?.fieldErrors.merchant_name}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <label
                htmlFor="accepts_shielded"
                className="block mb-1.5 text-sm font-medium text-slate-100 dark:text-slate-200"
              >
                Accepts Shielded
              </label>

              <select
                name="accepts_shielded"
                id="accepts_shielded"
                disabled={pending}
                className="w-full rounded-md border p-3 h-11 sm:h-12 text-sm sm:text-base text-slate-800 bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="YES">Yes</option>
                <option value="NO">No</option>
              </select>

              {typeof state?.message != "string" && (
                <span className="block text-sm text-red-300 mt-2">
                  {state?.message?.fieldErrors.accepts_shielded}
                </span>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5 my-6">
            <label
              htmlFor="category_id"
              className="text-sm font-medium text-slate-100 dark:text-slate-200"
            >
              Select Category
            </label>

            <select
              disabled={pending}
              name="category_id"
              id="category_id"
              className="w-full rounded-md border p-3 h-11 sm:h-12 text-sm sm:text-base text-slate-800 bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {props.categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name || "--Select a category--"}
                </option>
              ))}
            </select>
          </div>

          {/* Website */}
          <div className="flex flex-col gap-1.5 my-6">
            <label
              htmlFor="website_url"
              className="text-sm font-medium text-slate-100 dark:text-slate-200"
            >
              Website
            </label>

            <input
              type="text"
              name="website_url"
              id="website_url"
              required
              disabled={pending}
              className="w-full rounded-md border p-3 h-11 sm:h-12 text-sm sm:text-base text-slate-800 bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            {typeof state?.message != "string" && (
              <span className="text-sm text-red-300 mt-2">
                {state?.message?.fieldErrors.website_url}
              </span>
            )}
          </div>

          {/* Country */}
          <div className="flex flex-col gap-1.5 my-6">
            <label
              htmlFor="country"
              className="text-sm font-medium text-slate-100 dark:text-slate-200"
            >
              Country
            </label>

            <input
              type="text"
              name="country"
              id="country"
              required
              disabled={pending}
              className="w-full rounded-md border p-3 h-11 sm:h-12 text-sm sm:text-base text-slate-800 bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            {typeof state?.message != "string" && (
              <span className="text-sm text-red-300 mt-2">
                {state?.message?.fieldErrors.country}
              </span>
            )}
          </div>

          {/* State and City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            <div className="min-w-0">
              <label
                htmlFor="state"
                className="block mb-1.5 text-sm font-medium text-slate-100 dark:text-slate-200"
              >
                State
              </label>

              <input
                type="text"
                name="state"
                id="state"
                required
                disabled={pending}
                className="w-full rounded-md border p-3 h-11 sm:h-12 text-sm sm:text-base text-slate-800 bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />

              {typeof state?.message != "string" && (
                <span className="block text-sm text-red-300 mt-2">
                  {state?.message?.fieldErrors.state}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <label
                htmlFor="city"
                className="block mb-1.5 text-sm font-medium text-slate-100 dark:text-slate-200"
              >
                City
              </label>

              <input
                type="text"
                name="city"
                id="city"
                required
                disabled={pending}
                className="w-full rounded-md border p-3 h-11 sm:h-12 text-sm sm:text-base text-slate-800 bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />

              {typeof state?.message != "string" && (
                <span className="block text-sm text-red-300 mt-2">
                  {state?.message?.fieldErrors.city}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 mt-10">
            <Link
              href="/"
              className="inline-flex justify-center items-center rounded px-5 py-2.5 text-sm font-medium text-black bg-[#FFB400] hover:bg-[#CF9B20] transition-colors"
            >
              Cancel
            </Link>

            <button
              className="rounded px-5 py-2.5 text-sm font-medium text-black transition-colors duration-300 bg-[#FFB400] hover:bg-[#CF9B20] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={pending}
            >
              {pending ? "Processing..." : "Submit Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
