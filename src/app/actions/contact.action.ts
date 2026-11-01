import logger from "@/app/lib/logger";
import { headers } from "next/headers";
import { ContactFormSchema } from "../(frontend)/contact-us/contact.validation";
import { submitContactMessage } from "../lib/contact/services/contact.service";
import { checkContactRateLimit } from "../lib/contact/services/ratelimit.service";

export interface ContactFormState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 *
 * @param prevState unknown
 * @param formData The merchant information
 * @returns added merchant {Merchant}
 */
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Treat a filled honeypot as a successful-looking submission.
  // Do not save it or send notifications.
  const website = formData.get("website");
  if (typeof website === "string" && website.trim() !== "") {
    // Honeypot: silently accept automated submissions without storing them

    return {
      success: true,
      message: "Your message has been received.",
    };
  }

  const parsed = ContactFormSchema.safeParse({
    name: formData.get("contact_name"),
    email: formData.get("email_address"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    website: website ?? "",
  });

  if (!parsed.success) {
    logger.debug("[ContactForm validatedFields.error]", parsed.error.flatten());

    return {
      success: false,
      message: "Please correct the highlighted fields",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const requestHeaders = await headers();

    // Vercel normally provides x-real-ip. Use the forwarded
    // header as a fallback when running behind another proxy.
    const ip =
      requestHeaders.get("x-real-ip") ??
      requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();

    if (!ip) {
      throw new Error("Unable to determine client IP address");
    }

    const limit = await checkContactRateLimit(ip);

    if (!limit.allowed) {
      return {
        success: false,
        message: `Too many submissions. Please try again in ${Math.ceil(limit.retriesAfterSeconds / 60)} minutes.`,
      };
    }

    await submitContactMessage(parsed.data);

    return {
      success: true,
      message: "Your message has been received. Thank you for contacting us!",
    };
  } catch (err: any) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error("[MerchantAction.addMerchant]: ", msg);

    return {
      message: "We couldn't submit your message. Please try again.",
      success: false,
    };
  }
}
