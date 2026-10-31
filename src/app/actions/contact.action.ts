import logger from "@/app/lib/logger";
import { ContactFormSchema } from "../(frontend)/contact-us/contact.validation";
import { submitContactMessage } from "../lib/services/contact.service";

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
) {
  const parsed = ContactFormSchema.safeParse({
    name: formData.get("contact_name"),
    email: formData.get("email_address"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    logger.debug("[ContactForm validatedFields.error]", parsed.error.flatten());

    return {
      success: false,
      message: "Please correct the highlighted fields",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Honeypot: silently accept automated submissions without storing them
  if (parsed.data.website) {
    return {
      success: true,
      message: "Your message has been received.",
    };
  }

  try {
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
