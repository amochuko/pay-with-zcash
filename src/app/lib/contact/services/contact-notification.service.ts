import { Resend } from "resend";
import { serverEnv } from "../../server-env";
import type { ContactMessage } from "../repo/contact.repo";

interface Notification extends ContactMessage {
  contact_message_id: string;
  channel: "email" | "discord";
  attempts: number;
}

export async function sendEmail(job: Notification) {
  const resend = new Resend(serverEnv.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: serverEnv.CONTACT_FROM_EMAIL!,
    to: serverEnv.CONTACT_NOTIFICATION_EMAIL!,
    replyTo: job.email,
    subject: `Contact form: ${job.subject}`,
    text: `
   New contact form submission
   
   Name: ${job.name}
   Email: ${job.email}
   Subject: ${job.subject}
   
   Message:
   ${job.message}
   
   Submission ID: ${job.id}`,
  });

  if (error) {
    throw error.message;
  }
}

export async function sendDiscordNotification(job: Notification) {
  const webhookUrl = serverEnv.DISCORD_WEBHOOK_URL;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      allowed_mentions: {
        parse: [],
      },
      embed: [
        {
          title: "New Contact Message",
          color: 5793266,
          fields: [
            {
              name: "Name",
              value: job.name.slice(0, 256),
              inline: true,
            },
            {
              name: "Email",
              value: job.email.slice(0, 256),
              inline: true,
            },
            {
              name: "Subject",
              value: job.subject.slice(0, 256),
              inline: true,
            },
            {
              name: "Message",
              value: job.message.slice(0, 1024),
              inline: true,
            },
            {
              name: "Submission ID",
              value: job.id,
            },
          ],
          timestamp: job.created_at.toISOString(),
        },
      ],
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Discord notification failed: ${response.status}`);
  }
}

export async function deliverNotification(job: Notification) {
  switch (job.channel) {
    case "email":
      return sendEmail(job);

    case "discord":
      return sendDiscordNotification(job);
  }
}
