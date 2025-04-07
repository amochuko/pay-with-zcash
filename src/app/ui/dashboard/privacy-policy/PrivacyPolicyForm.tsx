"use client";

import { addMerchant } from "@/app/actions/merchant.action";
import { redirect } from "next/navigation";

import { useActionState, useEffect } from "react";

const initialState = {
  message: "",
  data: undefined,
};

type PrivacyPolicyFormProp = {
  addPolicy: (prevState: unknown, formData: FormData) => void;
};

export default function PrivacyPolicyForm(props: PrivacyPolicyFormProp) {
  const [state, formAction, pending] = useActionState(
    addMerchant,
    initialState
  );

  useEffect(() => {
    if (!state?.data) {
      return;
    }
    alert(
      "Your application was successful! Please note that it may take up to 24 hours for review before it becomes available to the public."
    );
    redirect("/");
  }, [state?.data]);

  return (
    <div className="privacy-policy relative top-44 mx-auto w-full max-w-2xl rounded-lg bg-white p-8 shadow dark:bg-slate-800">
      <form action={formAction}>
        <h4 className="py-4 text-2xl font-medium text-slate-300">Add Policy</h4>
        <div className="flex flex-col gap-0.5 my-4">
          <label
            htmlFor="title"
            className="my-1 font-medium dark:text-slate-200"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            disabled={pending}
            className="w-full rounded-md border p-3 h-12 text-slate-800 focus:outline-none focus:ring-blue-100 dark:bg-slate-200 dark:text-neutral-800"
          />
        </div>

        <div className="flex flex-col gap-1.5 my-4">
          <label
            htmlFor="description"
            className="my-1 font-medium dark:text-slate-200"
          >
            Description
          </label>
          <input
            type="text"
            name="description"
            id="description"
            required
            disabled={pending}
            className="w-full rounded-md border p-3 h-12 text-slate-800 focus:outline-none focus:ring-blue-100 dark:bg-slate-200 dark:text-neutral-800"
          />
        </div>

        <div className="mt-12 space-x-8 space-y-3">
          <button
            className={`min-w-10 rounded px-4 py-2 text-black transition duration-300 bg-[#FFB400] hover:bg-[#CF9B20] hover:text-black cursor-pointer`}
            type="submit"
            disabled={pending}
          >
            {pending ? "Processing" : "Submit"}
          </button>
          <button
            type="reset"
            className={`min-w-10 rounded px-4 py-2 text-black cursor-pointer bg-[#FFB400] hover:bg-[#CF9B20] hover:text-black`}
            onClick={(e) => {
              e.preventDefault();

              redirect("/dashboard");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
