import { z } from "zod";
export enum POST_STATUS_ENUM {
  PUBLISH = "publish",
  REVIEW = "review",
  DRAFT = "draft",
}

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 character long" })
    .trim(),
  email: z
    .string()
    .max(150, { message: "Email can not be longer than 150 characters." })
    .email({ message: "Please enter a valid email." })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one speacial character.",
    })
    .trim(),
});

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be a least 8 characters" })
    .trim(),
});

export type SignupFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type LoginStateForm =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export const signInSchema = z.object({
  email: z.string().email("Invalid email").optional(),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

// MERCHANTS
export const MerchantSchema = z.object({
  merchant_name: z
    .string({
      required_error: "Business Name is required.",
      invalid_type_error: "Must be a string",
    })
    .min(2, { message: "Must be 2 or more characters long" })
    .trim(),
  merchant_id: z.string().uuid(),
  category_id: z.string().uuid(),
  logo_img_id: z.string().uuid().optional(),
  website_url: z
    .string({
      required_error: "Website URL is required.",
      invalid_type_error: "Must be a string",
    })
    .trim()
    .url({ message: "Invalid url. " })
    .startsWith("https://", { message: "Must provide secure URL. " }),
  logo_url: z.optional(z.string()),
  upvote_count: z.optional(z.string()),
  tags: z.optional(z.string()),
  subtitle: z.string().optional(),
  post_status: z.string().optional(),
});

// PRIVACY POLICY
export const PrivacyPolicySchema = z.object({
  policy_id: z.string().uuid({ message: "Invalid id" }),
  title: z
    .string({
      required_error: "Policy title is required.",
      invalid_type_error: "Must be a string",
    })
    .trim(),
  description: z
    .string({
      required_error: "Description is required.",
      invalid_type_error: "Must be a string",
    })
    .trim(),
});
