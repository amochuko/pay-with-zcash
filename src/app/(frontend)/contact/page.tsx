import Link from "next/link";
import { ContactForm } from "./ContactForm";
import { submitContactAction } from "@/app/actions/contact.action";

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

      <ContactForm submitContactAction={submitContactAction} />
    </div>
  );
}
