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

export async function sendContactDiscordNotification(contact: ContactMessage) {
  const webhookUrl = serverEnv.DISCORD_WEBHOOK_URL;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      embed: [
        {
          title: "New Contact Message",
          color: 5793266,
          fields: [
            {
              name: "Name",
              value: contact.name.slice(0, 256),
              inline: true,
            },
            {
              name: "Email",
              value: contact.email.slice(0, 256),
              inline: true,
            },
            {
              name: "Subject",
              value: contact.subject.slice(0, 256),
              inline: true,
            },
            {
              name: "Message",
              value: contact.message.slice(0, 1024),
              inline: true,
            },
            {
              name: "Submission ID",
              value: contact.id,
            },
          ],
          timestamp: contact.created_at.toISOString(),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Discord notification failed: ${response.status}`);
  }
}
