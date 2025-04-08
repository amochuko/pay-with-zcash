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
