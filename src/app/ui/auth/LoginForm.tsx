"use client";

import { logIn } from "@/app/actions/auth.action";
import { useActionState } from "react";

export default function LoginForm() {
  const [state, loginAction, pending] = useActionState(logIn, undefined);

  return (
    <form
      action={loginAction}
      className="max-w-xl mx-auto p-12 bg-slate-200 dark:bg-slate-700 shadow-lg rounded-lg relative top-50"
    >
      <h1 className="text-2xl font-bold mb-12">Login</h1>

      <div className="flex flex-col gap-8">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-bold sr-only">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email Address"
            disabled={pending}
            className="mt-1 block w-full px-4 py-4 text-lg border border-gray-600 dark:border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-100 disabled:text-gray-400"
          />
          {state?.errors?.email && (
            <p className="text-red-600 mt-2">{state.errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-bold sr-only">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            disabled={pending}
            className="mt-1 block w-full px-4 py-4 text-lg border border-gray-600 dark:border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-100 disabled:text-gray-400"
          />
          {state?.errors?.password && (
            <p className="text-red-600 mt-2">{state.errors.password}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-4 text-lgpx-4 mt-8 bg-[#F4B728] text-black font-bold rounded-md hover:bg-[#CF9B20] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400 cursor-pointer"
      >
        {pending ? "Processing..." : "Log In"}
      </button>
      <p className="mt-12 font-medium">
        No accouunt? <a href="/sign-up">Sign up</a>
      </p>
    </form>
  );
}
