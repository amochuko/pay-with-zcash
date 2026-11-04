"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authenticated } from "../lib/authenticated";
import categoryService from "../lib/repo/category.repo";
import { Category } from "../lib/types/category.type";

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
  const session = await authenticated();

  if (session?.userRole !== "admin") {
    return {
      message: "Unauthorized",
    };
  }

  const validatedFields = CategorySchema.safeParse({
    category_name: formData.get("category_name"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.message,
    };
  }

  const result = await categoryService.create(
    String(validatedFields.data?.category_name),
  );

  if (result.rowCount === 1) {
    revalidatePath("/dashboard/categories");
  }
}

export async function getAllCategory(): Promise<Category[] | []> {
  return await categoryService.getAll();
}

export async function getCategoryById(id: string): Promise<Category | string> {
  try {
    return await categoryService.getById(id);
  } catch (err) {
    if (err instanceof Error) {
      throw err.message;
    }

    throw new Error("Failed with access");
  }
}

export async function deleteCategoryById(id: string) {
  const session = await authenticated();

  if (session?.userRole !== "admin") {
    return {
      message: "Unauthorized",
    };
  }

  try {
    const result = await categoryService.deleteById(id);

    if (result) {
      revalidatePath("/dashboard/categories");

      return {
        message: "Unauthorized",
      };
    }
  } catch (err) {
    console.error(err);

    return {
      message: "Unauthorized",
    };
  }
}

export async function editCategoryById(prevState: unknown, formData: FormData) {
   const session = await authenticated();

   if (session?.userRole !== "admin") {
     return {
       message: "Unauthorized",
     };
   }
   
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
    String(validatedFields.data?.category_id),
  );

  if (result.rowCount === 1) {
    revalidatePath("/dashboard/categories");
  }
}
