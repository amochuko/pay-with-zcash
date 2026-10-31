import { ContactFormInput } from "@/app/(frontend)/contact-us/contact.validation";
import { db } from "../database/db";

export interface ContactMessage {
  id: string;
  email: string;
  name: string;
  subject: string;
  message: string;
  created_at: Date;
}

export async function createContactMessage(
  args: ContactFormInput,
): Promise<ContactMessage> {
  const result = await db.query(
    `INSERT INTO pwz.contact_message (name, email, subject, message)
        VALUES ($1,$2,$3,$4)
        RETURNING id, name, email, subject, message, created_at`,
    [args.name, args.email, args.subject, args.message],
  );

  return result.rows[0];
}

