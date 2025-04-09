"use client";

import { createPolicy } from "@/app/actions/privacy-policy.action";
import { useActionState, useEffect } from "react";

const initialState = {
  message: "",
  data: [],
};

type PrivacyPolicyFormProp = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreatePrivacyPolicyForm(props: PrivacyPolicyFormProp) {
  const [state, formAction, pending] = useActionState(
    createPolicy,
    initialState
  );

  useEffect(() => {
    if (!state?.message && pending) {
      if (props.isOpen && props.onClose) {
        props.onClose();
      }
    }
    return () => {};
  }, [pending, props, state?.message]);

  return (
    <div className="privacy-policy-form relative mx-auto w-full max-w-2xl rounded-lg bg-white p-8 shadow dark:bg-slate-800 mt-12">
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
          <textarea
            name="description"
            id="description"
            cols={48}
            rows={48}
            required
            disabled={pending}
            className="w-full rounded-md border p-3 text-slate-800 focus:outline-none focus:ring-blue-100 dark:bg-slate-200 dark:text-neutral-800 h-48"
          />

          {/* Show error message if state has a message */}
          {state?.message && (
            <p className="text-red-400 my-2">{state?.message.toString()}</p>
          )}
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
            className={`min-w-10 rounded px-4 py-2 text-black cursor-pointer bg-[#FFB400] hover:bg-[#CF9B20] hover:text-black`}
            onClick={(e) => {
              e.preventDefault();
              props.onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
