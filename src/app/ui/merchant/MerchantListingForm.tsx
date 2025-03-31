"use client";

import { addMerchant } from "@/app/lib/actions";
import { Category } from "@/app/lib/models/Category";
import { redirect } from "next/navigation";

import { useActionState, useEffect } from "react";

const initialState = {
  message: "",
  data: undefined,
};

type ListingFormProp = {
  addMerchant: (prevState: unknown, formData: FormData) => void;
  categories: Category[] | [];
};

export default function MerchantListingForm(props: ListingFormProp) {
  const [state, formAction, pending] = useActionState(
    addMerchant,
    initialState
  );

  useEffect(()=>{
    if (state?.data) {
      alert(
        "Your application was successful! Please note that it may take up to 24 hours for review before it becomes available to the public."
      );
      redirect("/");
    }
  },[state?.data])

  return (
    <div className="relative top-44 mx-auto w-full max-w-2xl rounded-lg bg-white p-8 shadow dark:bg-slate-800">
      <form action={formAction}>
        <h4 className="py-4 text-2xl font-medium text-slate-300">
          Submit Listing to Directory
        </h4>
        <div className="flex flex-col gap-0.5 my-4">
          <label
            htmlFor="merchant_name"
            className="my-1 font-medium dark:text-slate-200"
          >
            Business Name
          </label>
          <input
            type="text"
            name="merchant_name"
            id="merchant_name"
            required
            disabled={pending}
            className="w-full rounded-md border p-3 h-12 text-slate-800 focus:outline-none focus:ring-blue-100 dark:bg-slate-200 dark:text-neutral-800"
          />
        </div>
        <div className="flex flex-col gap-1.5 my-4">
          <label
            htmlFor="category_id"
            className="my-1 font-medium dark:text-slate-200"
          >
            Select Category
          </label>
          <select
            disabled={pending}
            name="category_id"
            id="category_id"
            className="w-full rounded-md border p-3 h-12 text-slate-800 focus:outline-none  focus:ring-blue-100 dark:bg-slate-200 dark:text-neutral-800"
          >
            {props.categories.map((cat, i) =>
              cat.category_name ? (
                <option key={cat + "_" + i} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ) : (
                <option key={cat + "_" + i} value={cat.category_name}>
                  {"--Select a category--"}
                </option>
              )
            )}
          </select>
        </div>
        <div className="flex flex-col gap-1.5 my-4">
          <label
            htmlFor="website_url"
            className="my-1 font-medium dark:text-slate-200"
          >
            Website
          </label>
          <input
            type="text"
            name="website_url"
            id="website_url"
            required
            disabled={pending}
            className="w-full rounded-md border p-3 h-12 text-slate-800 focus:outline-none focus:ring-blue-100 dark:bg-slate-200 dark:text-neutral-800"
          />
        </div>
        <div className="flex flex-col gap-1.5 my-4">
          <label
            htmlFor="email_address"
            className="my-1 font-medium dark:text-slate-200"
          >
            Email Address
          </label>
          <input
            type="email"
            name="email_address"
            id="email_address"
            required
            disabled={pending}
            className="w-full rounded-md border p-3 h-12 text-slate-800 focus:outline-none focus:ring-blue-100 dark:bg-slate-200 dark:text-neutral-800"
          />

          {/* Show error message if state has a message */}
          {state?.message && (
            <p className="text-red-400 my-2">{state?.message.toString()}</p>
          )}
        </div>
        <div className="mt-12 space-x-8 space-y-3">
          <button
            className={`min-w-10 rounded bg-[--color-brand-yellow] px-4 py-2 border border-slate-300 text-white transition duration-300 hover:bg-[#FFB400] hover:text-black cursor-pointer`}
            type="submit"
            disabled={pending}
          >
            {pending ? "Processing" : "Submit"}
          </button>
          <button
            className={`min-w-10 rounded border border-slate-300 bg-slate-800 px-4 py-2 text-white cursor-pointer hover:bg-[#FFB400] hover:text-black`}
            onClick={(e) => {
              e.preventDefault();

              redirect("/");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
