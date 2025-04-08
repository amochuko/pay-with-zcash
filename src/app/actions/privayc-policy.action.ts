"use server";

import { revalidatePath } from "next/cache";
import privacyPolicyService from "../lib/service/privacy-policy.service";
import { PrivacyPolicySchema } from "../lib/typings";

export async function getPolicies() {
  try {
    const result = await privacyPolicyService.getPolicies();

    if (result.length > 1) {
      revalidatePath("/dashboard/privacy-policy");
      return { data: result, message: undefined };
    }

    return {
      message: "Some went wrong fetch policies",
      data: undefined,
    };
  } catch (err) {
    console.error("Error fetching policies: ", err);
    return { message: "An unexpected error occurred.", data: undefined };
  }
}

export async function createPolicy(prevState: unknown, formData: FormData) {
  const validatedFields = PrivacyPolicySchema.pick({
    title: true,
    description: true,
  }).safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await privacyPolicyService.create(validatedFields.data);

    if (result.rowCount === 1) {
      revalidatePath("/dashboard/privacy-policy");
      return { data: result.rows[0], message: undefined };
    }

    return {
      message: "Some went wrong during merchant creation",
      data: undefined,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.code === "23505") {
      return {
        message: "A merchant with this name already exists.",
        data: undefined,
      };
    }

    return { message: "An unexpected error occurred.", data: undefined };
  }
}
