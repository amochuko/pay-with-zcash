"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Category } from "./models/Category";
import { Merchant } from "./models/Merchant";
import { getMetadata } from "./scrapping/metadata";
import categoryService from "./service/category.service";
import merchantService from "./service/merchant.service";
import { POST_STATUS_ENUM } from "./typings";
import { writeLogoToDisk } from "./utils/fs";

const MerchantSchema = z.object({
  merchant_name: z
    .string({
      required_error: "Business Name is required.",
      invalid_type_error: "Must be a string",
    })
    .min(5, { message: "Must be 5 or more characters long" })
    .trim(),
  merchant_id: z.string().uuid(),
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
  post_status: z.string().optional(),
});

// MERCHANTS

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

    const merchant: Merchant = {
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

    merchant.logo_url = await writeLogoToDisk(merchant);

    const res = await merchantService.create(merchant);
    revalidatePath("/");

    return res;
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      throw err.message;
    }

    throw new Error("Failed to add Merchant!");
  }
}

export async function getMerchants(): Promise<Merchant[]> {
  try {
    return await merchantService.getMerchants();
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Failed fetching Merchant list");
  }
}

export async function getMerchantsBy(
  status: POST_STATUS_ENUM
): Promise<Merchant[]> {
  try {
    return await merchantService.getMerchantsBy(status);
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Failed fetching Merchant list");
  }
}

export async function approveMerchantById(
  prevState: unknown,
  formData: FormData
) {
  
  const validatedFields = MerchantSchema.pick({
    merchant_id: true,
    post_status: true,
  }).safeParse({
    merchant_id: formData.get("merchant_id"),
    post_status: formData.get("post_status"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.message,
    };
  }

  const result = await merchantService.approveById(
    String(validatedFields.data?.merchant_id),
    String(validatedFields.data?.post_status) as POST_STATUS_ENUM
  );

  if (result.rowCount === 1) {
    revalidatePath("/dashboard/merchants");
  }
}

export async function deleteMerchantById(id: string) {
  try {
    const result = await merchantService.deleteById(id);

    if (result) {
      revalidatePath("/dashboard/merchants");
    }
  } catch (err) {
    if (err instanceof Error) {
      throw err.message;
    }

    throw new Error("Faild with access");
  }
}

export async function upvoteMerchant(merchantId: string): Promise<number> {
  try {
    return await merchantService.upvote(merchantId);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// CATEGORY

const CategorySchema = z.object({
  category_name: z
    .string({
      required_error: "Category Name is required.",
      invalid_type_error: "Must be a string",
    })
    .min(5, { message: "Must be 5 or more characters long" })
    .trim(),
  category_id: z.string().optional(),
});
export async function addCategory(prevState: unknown, formData: FormData) {
  const validatedFields = CategorySchema.safeParse({
    category_name: formData.get("category_name"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.message,
    };
  }

  const result = await categoryService.create(
    String(validatedFields.data?.category_name)
  );

  if (result.rowCount === 1) {
    revalidatePath("/dashboard/categories");
    console.log(result.rows[0]);
  }
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

export async function deleteCategoryById(id: string): Promise<void> {
  try {
    const result = await categoryService.deleteById(id);

    if (result) {
      revalidatePath("/dashboard/categories");
    }
  } catch (err) {
    if (err instanceof Error) {
      throw err.message;
    }

    throw new Error("Faild with access");
  }
}

export async function editCategoryById(prevState: unknown, formData: FormData) {
  const validatedFields = CategorySchema.safeParse({
    category_id: formData.get("category_id"),
    category_name: formData.get("category_name"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.message,
    };
  }

  const result = await categoryService.updateById(
    String(validatedFields.data?.category_name),
    String(validatedFields.data?.category_id)
  );

  if (result.rowCount === 1) {
    revalidatePath("/dashboard/categories");
    console.log(result.rows[0]);
  }
}
