"use server";

import { revalidatePath } from "next/cache";
import PrivacyPolicy from "../lib/models/PrivacyPolicy";
import privacyPolicyService from "../lib/service/privacy-policy.service";
import { PrivacyPolicySchema } from "../lib/typings";

export async function getPolicies(): Promise<{
  data: PrivacyPolicy[];
  message: string;
}> {
  try {
    const result = await privacyPolicyService.getPolicies();

    if (result.length > 0) {
      return { data: result, message: "" };
    }
    
    revalidatePath("/dashboard/privacy-policy");

    return {
      message: "No policies available.",
      data: [],
    };
  } catch (err) {
    return {
      message: err instanceof Error ? err.message : String(err),
      data: [],
    };
  }
}

export async function createPolicy(prevState: unknown, formData: FormData) {
  const validatedFields = PrivacyPolicySchema.pick({
    title: true,
    description: true,
  }).safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      data: [],
      message: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await privacyPolicyService.create(validatedFields.data);

    if (result && result.rowCount === 1) {
      revalidatePath("/dashboard/privacy-policy");
      return { data: result.rows[0], message: "" };
    }

    return {
      data: [],
      message: "Something went wrong during policy creation",
    };
  } catch (err) {
    return {
      data: [],
      message: String(err),
    };
  }
}

export async function deleteById(policyId: string) {
  console.log({ policyId });

  const validatedFields = PrivacyPolicySchema.pick({
    id: true,
  }).safeParse(policyId);

  console.log(validatedFields.error);

  if (!validatedFields.success) {
    return {
      data: [],
      message: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await privacyPolicyService.deleteById(
      validatedFields.data.id
    );

    if (result && result.rowCount === 1) {
      revalidatePath("/dashboard/privacy-policy");
      return { data: result.rows[0], message: "" };
    }

    return {
      data: [],
      message: "Something went wrong during policy deletion",
    };
  } catch (err) {
    return {
      data: [],
      message: String(err),
    };
  }
}

