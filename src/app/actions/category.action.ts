'use server'
import { revalidatePath } from "next/cache"; 
import { z } from "zod";
import categoryService from "../lib/service/category.service";
import { Category } from "../lib/models/Category";

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
  }
}
