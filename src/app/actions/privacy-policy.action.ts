"use server";

import { revalidatePath } from "next/cache";
import PrivacyPolicy from "../lib/models/PrivacyPolicy";
import privacyPolicyService from "../lib/service/privacy-policy.service";
import { PrivacyPolicySchema } from "../lib/typings";

const REVALIDATE_PATH = "/dashboard/privacy-policy";

export async function getPolicies(): Promise<{
  data: PrivacyPolicy[];
  message: string;
}> {
  try {
    const result = await privacyPolicyService.getPolicies();
    
    if (result.length > 0) {
      return { data: result, message: "" };
    }
    
    revalidatePath("/privacy-policy");

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
      revalidatePath(REVALIDATE_PATH);
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

export async function deleteById(policy_id: string) {
  const validatedFields = PrivacyPolicySchema.pick({
    policy_id: true,
  }).safeParse({ policy_id });

  if (!validatedFields.success) {
    return {
      data: [],
      message: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const deletedPolicy = await privacyPolicyService.deleteById(
      validatedFields.data.policy_id
    );

    if (deletedPolicy) {
      revalidatePath(REVALIDATE_PATH);
      return { data: deletedPolicy, message: "" };
    }

    return {
      data: [],
      message: "Something went wrong during policy deletion",
    };
  } catch (err) {
    console.error("DeleteById: ", err);
    return {
      data: [],
      message: String(err),
    };
  }
}
