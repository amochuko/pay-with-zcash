import { plainTextSchema } from "@/app/lib/validation.schema";
import { z } from "zod";

export const contactFormSchema = z.object({
  name: plainTextSchema.pipe(z.string().min(2).max(120)),
  email: plainTextSchema.pipe(
    z
      .string()
      .email()
      .max(254)
      .transform((v) => v.toLowerCase()),
  ),
  subject: plainTextSchema.pipe(z.string().min(3).max(200)),
  message: plainTextSchema.pipe(z.string().min(10).max(5000)),
});
