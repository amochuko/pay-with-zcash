"use server";

import { z } from "zod";
import { env } from "./env";

const signupSchema = z.object({
  name: z.string(),
  website: z.string(),
});

export async function notifyDiscordSignup(data: {
  website: string;
  name: string;
}) {
  const validatedFields = signupSchema.safeParse(data);

  if (!validatedFields.success) {
    console.error("ValidationErrors: ", validatedFields.error);
    return;
  }

  if (!env.DISCORD_WEBHOOK_URL) {
    throw new Error("Missing Discord webhook URL");
  }

  const message = {
    content: `🎉 New merchant signup!\n\n**Name**: ${validatedFields.data.name}\n**Website**: ${validatedFields.data.website}`,
  };

  await fetch(env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  await fetch(env.ZECHUB_DISCORD_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
}
