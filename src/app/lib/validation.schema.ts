import sanitize from "sanitize-html";
import { z } from "zod";

// Sanitize text
const plainTextSchema = z.string().transform((value) =>
  sanitize(value, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim(),
);

export const SignupFormSchema = z.object({
  name: plainTextSchema.pipe(
    z.string().min(2, { message: "Name must be at least 2 character long" }),
  ),
  email: plainTextSchema.pipe(
    z
      .string()
      .max(150, { message: "Email can not be longer than 150 characters." })
      .email({ message: "Please enter a valid email." }),
  ),
  password: plainTextSchema.pipe(
    z
      .string()
      .min(8, { message: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number" })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      }),
  ),
});

export const LoginFormSchema = z.object({
  email: plainTextSchema.pipe(
    z.string().email({ message: "Invalid email address" }),
  ),
  password: plainTextSchema.pipe(
    z.string().min(8, { message: "Password must be a least 8 characters" }),
  ),
});

export const SignInSchema = z.object({
  email: plainTextSchema.pipe(z.string().email("Invalid email").optional()),
  password: plainTextSchema.pipe(
    z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required")
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
  ),
});

// MERCHANTS
export const MerchantSchema = z.object({
  merchant_name: plainTextSchema.pipe(
    z
      .string({
        required_error: "Business Name is required.",
        invalid_type_error: "Must be a string",
      })
      .min(2, { message: "Must be 2 or more characters long" })
      .toLowerCase(),
  ),
  merchant_id: z.string().uuid(),
  category_id: z.string().uuid(),
  logo_img_id: z.string().uuid().optional(),
  website_url: plainTextSchema.pipe(
    z
      .string({
        required_error: "Website URL is required.",
        invalid_type_error: "Must be a string",
      })
      .url({ message: "Invalid url. " })
      .startsWith("https://", { message: "Must provide secure URL. " }),
  ),
  logo_url: plainTextSchema.pipe(z.optional(z.string())),
  upvote_count: plainTextSchema.pipe(z.optional(z.string())),
  tags: plainTextSchema.pipe(z.optional(z.string())),
  subtitle: plainTextSchema.pipe(z.string().optional()),
  post_status: plainTextSchema.pipe(z.string().optional()),
  country: plainTextSchema.pipe(z.string()),
  state: plainTextSchema.pipe(z.string()),
  city: plainTextSchema.pipe(z.string()),
  accepts_shielded: plainTextSchema.pipe(z.string()),
});

// PRIVACY POLICY
export const PrivacyPolicySchema = z.object({
  policy_id: plainTextSchema.pipe(z.string().uuid({ message: "Invalid id" })),
  title: plainTextSchema.pipe(
    z.string({
      required_error: "Policy title is required.",
      invalid_type_error: "Must be a string",
    }),
  ),
  description: plainTextSchema.pipe(
    z.string({
      required_error: "Description is required.",
      invalid_type_error: "Must be a string",
    }),
  ),
});
