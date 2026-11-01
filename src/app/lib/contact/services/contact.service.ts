import { ContactFormInput } from "@/app/(frontend)/contact-us/contact.validation";
import {
  createContactMessage,
  updateNotificationStatus,
} from "../repo/contact.repo";
import {
  sendContactDiscordNotification,
  sendContactEmail,
} from "./contact-notification.service";

export async function submitContactMessage(input: ContactFormInput) {
  const contact = await createContactMessage(input);

  const notifications = await Promise.allSettled([
    sendContactEmail(contact),
    sendContactDiscordNotification(contact),
  ]);

  const [emailResult, discordResult] = notifications;

  await Promise.allSettled([
    updateNotificationStatus(
      contact.id,
      "email",
      emailResult.status === "fulfilled" ? "sent" : "failed",
    ),
    updateNotificationStatus(
      contact.id,
      "discord",
      discordResult.status === "fulfilled" ? "sent" : "failed",
    ),
  ]);

  return {
    success: true,
    id: contact.id,
    notifications: {
      email: emailResult.status === "fulfilled",
      discord: discordResult.status === "fulfilled",
    },
  };
}
