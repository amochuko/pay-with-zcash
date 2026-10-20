"use server";

import { revalidatePath } from "next/cache";
import { notifyDiscordSignup } from "../lib/discord";
import logger from "../lib/logger";
import { getRequiredWebsiteMetadata } from "../lib/scrapping/metadata";
import merchantService from "../lib/service/merchant.service";
import { Merchant } from "../lib/types/Merchant";
import { MerchantSchema, POST_STATUS_ENUM } from "../lib/typings";
import { saveLogoToBlob } from "../lib/utils/fs";

/**
 *
 * @param prevState unknown
 * @param formData The merchant information
 * @returns added merchant {Merchant}
 */
export async function addMerchant(prevState: unknown, formData: FormData) {
  const validatedFields = MerchantSchema.pick({
    merchant_name: true,
    category_id: true,
    website_url: true,
    country: true,
    state: true,
    city: true,
  }).safeParse({
    merchant_name: formData.get("merchant_name"),
    category_id: formData.get("category_id"),
    website_url: formData.get("website_url"),
    country: formData.get("country"),
    state: formData.get("state"),
    city: formData.get("city"),
  });

  if (!validatedFields.success) {
    logger.debug("[validatedFields.error]", validatedFields.error.flatten());

    return {
      message: validatedFields.error.flatten(),
    };
  }

  try {
    const metadata = await getRequiredWebsiteMetadata(
      validatedFields.data.website_url,
    );

    const blob = await saveLogoToBlob(
      String(metadata?.logo_url),
      metadata.title || metadata.subtitle,
    );

    const merchant: Omit<Merchant, "merchant_id"> = {
      ...validatedFields.data,
      subtitle: metadata?.subtitle || "",
      description: metadata?.description || "",
      logo_url: blob.url,
      post_status: POST_STATUS_ENUM.DRAFT,
      tags: metadata?.keywords || [],
      upvote_count: 0,
    };

    const result = await merchantService.create(merchant);

    if (result.rowCount === 1) {
      await notifyDiscordSignup({
        name: result.rows[0].merchant_name,
        website: result.rows[0].website_url,
      });

      revalidatePath("/dashboard/merchants");
      return { data: result.rows[0], message: undefined };
    }

    return {
      message: "Some went wrong during merchant creation",
      data: undefined,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    logger.error("[addMerchant]: ", err);

    if (err.code === "23505") {
      return {
        message: "A merchant with this name already exists.",
        data: undefined,
      };
    }

    return { message: "An unexpected error occurred.", data: undefined };
  }
}

/**
 *
 * @param published Boolean to list only published merchants
 * @returns list of merchants {Merchant[]}
 */
export async function getMerchants() {
  try {
    const merchants = await merchantService.getMerchants();

    if (merchants.length > 0) {
      return { data: merchants, message: undefined };
    }

    // revalidatePath("/");

    return {
      message: "Some went wrong during merchant creation",
      data: [],
    };
  } catch (err) {
    const msg = "[getMerchants] fetching Merchants relation: ";

    logger.error(msg, err);

    return { data: [], message: "An unexpected error occurred." };
  }
}

export async function getMerchantsBy(
  status: POST_STATUS_ENUM,
): Promise<Merchant[]> {
  try {
    return await merchantService.getMerchantsBy(status);
  } catch (err) {
    logger.error("[getMerchantsBy]", err);

    throw new Error("Failed fetching Merchant list");
  }
}

export async function approveMerchantById(
  prevState: unknown,
  formData: FormData,
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

  try {
    const result = await merchantService.approveById(
      String(validatedFields.data?.merchant_id),
      String(validatedFields.data?.post_status) as POST_STATUS_ENUM,
    );

    if (result.rowCount === 1) {
    }
  } catch (err) {
    logger.error("[approveMerchantById]", err);
    
    return {
      message: `Publish approval failed for Merchant id: ${validatedFields.data.merchant_id}`,
    };
  }

  revalidatePath("/dashboard/merchants");
}

export async function deleteMerchantById(id: string) {
  try {
    const result = await merchantService.deleteById(id);

    if (result) {
      revalidatePath("/dashboard/merchants");
    }
  } catch (err) {
    logger.error("[deleteMerchantById]", err);

    return {
      message: `Failed to delete merchant: ${id}`,
    };
  }
}

export async function upvoteMerchant(
  merchantId: string,
): Promise<number | null> {
  try {
    return await merchantService.upvote(merchantId);
  } catch (err) {
    logger.error("[upvoteMerchant]", err);

    return null;
  }
}
