"use client";


import { addCategory } from "@/app/actions/category.action";
import { useActionState, useEffect } from "react";

const initialState = {
  message: "",
};

type CreaateCategoryModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
};
export default function CreaateCategoryModal(props: CreaateCategoryModalProps) {
  const [state, action, pending] = useActionState(addCategory, initialState);

  useEffect(() => {
    if (!state?.message && pending) {
      if (props.isOpen && props.onClose) {
        props.onClose();
      }
    }
    return () => {};
  }, [pending, props, state?.message]);

  if (!props.isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
      onClick={props.onClose}
    >
      <div
        className="bg-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
      >
        <button
          onClick={props.onClose}
          className="absolute top-2 right-2 bg-[#F4B728] text-black text-2xl rounded-full w-12 h-12 p-2 cursor-pointer font-extrabold"
        >
          ×
        </button>
        <h3 className="text-2xl font-semibold text-center my-8 mb-14 text-white">
          Add New Category
        </h3>
        <form action={action} className="space-y-4">
          <div className="flex flex-col gap-2 mb-8">
            <label
              htmlFor="category_name"
              className="block text-sm font-medium text-white"
            >
              Category Name
            </label>
            <input
              type="text"
              id="category_name"
              name="category_name"
              required
              className="mt-1 block w-full px-4 py-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm md:text-2xl"
              placeholder="Enter name"
            />
          </div>
          {state?.message && (
            <p aria-live="polite" className="text-rose-400 p-2">
              {state.message}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-4 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer text-2xl"
          >
            {pending ? "Processing" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
