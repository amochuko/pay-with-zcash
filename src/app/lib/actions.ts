"use server";

import sql from "@/app/lib/database/sqlConnection";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Category } from "./models/Category";
import categoryService from "./service/category.service";

// import { redirect } from "next/navigation";

const postMerchantListingSchema = z.object({
  email: z.string({
    invalid_type_error: "Invalid Email",
  }),
  name: z.string({}),
});

export async function postMerchantListing(
  prevState: unknown,
  formData: FormData
) {
  const _formData = Object.fromEntries(formData);
  console.log(_formData);

  const validatedFields = postMerchantListingSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const time = await sql`SELECT NOW()`;
    // const result = await sql`CREATE TABLE IF NOW EXISTS merchant_listing (
    //     id SERIAL PRIMARY KEY,
    //     business_name VARCHAR(50) NOT NULL,

    // )`;

    console.log("time: ", time);
  } catch (err) {
    console.error(err);
    // throw err;
  }

  revalidatePath("/"); //  revalidate the Next.js Cache
  // redirect("/");
}

export async function getAllCategory(): Promise<Category[] | []> {
  try {
    return await categoryService.getAll();
  } catch (err) {
    console.error(err);
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
