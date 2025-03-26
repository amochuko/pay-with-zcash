"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Category } from "./models/Category";
import { Merchant } from "./models/Merchant";
import { getMetadata } from "./scrapping/metadata";
import categoryService from "./service/category.service";
import merchantService from "./service/merchant.service";
import { POST_STATUS_ENUM } from "./typings";

const MerchantSchema = z.object({
  merchant_name: z
    .string({
      required_error: "Business Name is required.",
      invalid_type_error: "Must be a string",
    })
    .min(5, { message: "Must be 5 or more characters long" })
    .trim(),
  category_id: z.string().uuid(),
  website_url: z
    .string({
      required_error: "Website URL is required.",
      invalid_type_error: "Must be a string",
    })
    .trim()
    .url({ message: "Invalid url" })
    .startsWith("https://", { message: "Must provide secure URL" }),
  email_address: z
    .string({
      required_error: "Email is required.",
      invalid_type_error: "Must be a valid email format",
    })
    .trim()
    .min(5)
    .email({ message: "Invalid email address" }),
  logo_url: z.optional(z.string()),
  upvote_count: z.optional(z.string()),
  tags: z.optional(z.string()),
  subtitle: z.string().optional(),
});

export async function addMerchant(prevState: unknown, formData: FormData) {
  const validatedFields = MerchantSchema.safeParse({
    merchant_name: formData.get("merchant_name"),
    email_address: formData.get("email_address"),
    category_id: formData.get("category_id"),
    website_url: formData.get("website_url"),
  });

  if (!validatedFields.success) {
    console.log(
      "Error validating formData: ",
      validatedFields.error.flatten().fieldErrors
    );

    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const metadata = await getMetadata(validatedFields.data.website_url);

    const data: Merchant = {
      ...validatedFields.data,
      subtitle: metadata?.subtitle || "",
      description: metadata?.description || "",
      logo_url: metadata?.logo_url
        ? metadata.logo_url
        : metadata?.favicons[0] || "",
      post_status: POST_STATUS_ENUM.DRAFT,
      tags: metadata?.keywords || [],
      upvote_count: 0,
    };

    return await merchantService.create(data);
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      throw err.message;
    }
  }

  revalidatePath("/");
}

export async function getAllCategory(): Promise<Category[] | []> {
  try {
    return await categoryService.getAll();
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      throw err.message;
    }

    return [];
  }
}

export async function getCategoryById(id: string): Promise<Category | string> {
  try {
    return await categoryService.getById(id);
  } catch (err) {
    if (err instanceof Error) {
      throw err.message;
    }

    throw new Error("Faild with access");
  }
}

export async function approveMerchant(formData: FormData) {
  console.log(formData);
}

export async function deleteMerchant(formData: FormData) {
  console.log(formData);
}
