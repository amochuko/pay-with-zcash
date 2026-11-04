"use client";

import {
  ContactFormState,
} from "@/app/actions/contact.action";
import { useActionState } from "react";

const initialState: ContactFormState = {
  success: false,
  message: "",
};

type ContactFormProps = {
  submitContactAction: (
    _prevState: ContactFormState,
    formData: FormData,
  ) => Promise<ContactFormState>;
};
export function ContactForm(props: ContactFormProps) {
  const [state, formAction, pending] = useActionState(
    props.submitContactAction,
    initialState,
  );

  return (
    <div className="rounded-lg p-4 sm:p-6 md:p-8 shadow-lg bg-slate-600 dark:bg-slate-800">
      <form action={formAction}>
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
              maxLength={120}
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
              maxLength={254}
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
              maxLength={200}
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
              maxLength={5000}
              className="w-full rounded-md border p-3 text-sm bg-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-y"
            />
          </div>

          {/* Honeypot: hide from people, but keep in in the form */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clipPath: "inset(50%)",
            }}
          >
            <label
              htmlFor="website"
              className="block mb-1.5 text-sm font-medium text-slate-100"
            >
              Leave this field empty
            </label>

            <input
              type="text"
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="w-full rounded-md border p-3 h-11 sm:h-12 text-sm bg-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {state.message && <p role="status">{state.message}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full sm:w-auto rounded px-6 py-2.5 text-sm font-medium text-black bg-[#FFB400] hover:bg-[#CF9B20] transition-colors cursor-pointer"
        >
          {pending ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
