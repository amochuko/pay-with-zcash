"use client";
import { useActionState } from "react";
import { signUp } from "../actions/auth.action";

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, undefined);

  return (
    <form
      action={formAction}
      className="max-w-xl mx-auto p-6 bg-slate-700  shadow-lg rounded-lg relative top-28"
    >
      <h1 className="text-2xl">Create an Account</h1>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          disabled={pending}
          className="mt-1 block w-full px-4 py-4 text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-100 disabled:text-gray-400"
        />
        {state?.errors?.name && (
          <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          disabled={pending}
          className="mt-1 block w-full px-4 py-4 text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-100 disabled:text-gray-400"
        />
        {state?.errors?.email && (
          <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          disabled={pending}
          className="mt-1 block w-full px-4 py-4 text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-100 disabled:text-gray-400"
        />
        {state?.errors?.password && (
          <div className="text-red-500 text-sm mt-2">
            <p>Password must:</p>
            <ul className="list-disc pl-5 space-y-1">
              {state.errors.password.map((err, i) => (
                <li key={err + "_" + i}>{err}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-4 text-lgpx-4 mt-8 bg-[#F4B728] text-black font-medium rounded-md hover:bg-[#CF9B20] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400 cursor-pointer"
      >
        Sign Up
      </button>
    </form>
  );
}
