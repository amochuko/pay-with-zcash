import { Resend } from "resend";
import type { ContactMessage } from "../repo/contact.repo";
import { serverEnv } from "../server-env";

const resend = new Resend(serverEnv.RESEND_API_KEY);

export async function sendContactEmail(contact: ContactMessage) {
  const { error } = await resend.emails.send({
    from: serverEnv.CONTACT_FROM_EMAIL!,
    to: serverEnv.CONTACT_NOTIFICATION_EMAIL!,
    replyTo: contact.email,
    subject: `Contact form: ${contact.subject}`,
    text: `
   New contact form submission
   
   Name: ${contact.name}
   Email: ${contact.email}
   Subject: ${contact.subject}
   
   Message:
   ${contact.message}
   
   Submission ID: ${contact.id}`,
  });

  if (error) {
    throw new Error(error.message);
  }
}

