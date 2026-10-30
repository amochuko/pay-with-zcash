"use server";

import { PutBlobResult } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { notifyDiscordSignup } from "../lib/discord";
import { createGeocoderFromEnv } from "../lib/geocode";
import { geocodeMerchant } from "../lib/geocode/geocode.merchant";
import logger from "../lib/logger";
import merchantRepo from "../lib/repo/merchant.repo";
import { getRequiredWebsiteMetadata } from "../lib/scrapping/metadata";
import { serverEnv } from "../lib/server-env";
import {
  mapToMerchantGeoDomain,
  MerchantRow,
} from "../lib/types/merchant.types";
import { POST_STATUS_ENUM } from "../lib/typings";
import { saveLogoToBlob } from "../lib/utils/helpers";
import { MerchantSchema } from "../lib/validation.schema";
import { sanitizeContent } from "../lib/sanitize";

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
    accepts_shielded: true,
  }).safeParse({
    merchant_name: formData.get("merchant_name"),
    category_id: formData.get("category_id"),
    website_url: formData.get("website_url"),
    country: formData.get("country"),
    state: formData.get("state"),
    city: formData.get("city"),
    accepts_shielded: formData.get("accepts_shielded"),
  });

  if (!validatedFields.success) {
    logger.debug("[validatedFields.error]", validatedFields.error.flatten());

    return {
      message: validatedFields.error.flatten(),
    };
  }

  try {
    const merchantExists = await merchantRepo.find(
      validatedFields.data.merchant_name,
      validatedFields.data.website_url,
    );

    if (merchantExists) {
      throw new Error("Business already listed");
    }

    const metadata = await getRequiredWebsiteMetadata(
      validatedFields.data.website_url,
    );

    const blob =
      serverEnv.NODE_ENV === "production"
        ? await saveLogoToBlob(
            String(metadata?.logo_url),
            validatedFields.data.merchant_name,
          )
        : ({ url: "dev_img_url" } as PutBlobResult);

    const args: Omit<MerchantRow, "merchant_id"> = {
      ...validatedFields.data,
      subtitle: sanitizeContent(metadata?.subtitle) || "",
      description: sanitizeContent(metadata?.description) || "",
      logo_url: blob.url,
      logo_content_type: blob.contentType,
      post_status: POST_STATUS_ENUM.REVIEW,
      tags: metadata?.keywords.map(sanitizeContent) || [],
      upvote_count: 0,
      geo_status: "unknown",
    };

    const m = await merchantRepo.create(args);

    const geocoder = createGeocoderFromEnv();
    await geocodeMerchant(
      {
        id: m.merchant_id,
        country: m.country,
        city: m.city,
        state: m.state,
      },
      geocoder,
      merchantRepo,
    );

    if (m.category_id && serverEnv.NODE_ENV != "production") {
      await notifyDiscordSignup({
        name: m.merchant_name,
        website: m.website_url,
      });

      revalidatePath("/dashboard/merchants");

      return { data: m, message: undefined };
    }

    return {
      message: "Some went wrong during merchant creation",
      data: undefined,
    };
  } catch (err: any) {
    logger.error("[MerchantAction.addMerchant]: ", err);

    const msg = err instanceof Error ? err.message : String(err);

    return { message: msg, data: undefined };
  }
}

/**
 *
 * @param published Boolean to list only published merchants
 * @returns list of merchants {Merchant[]}
 */
export async function getMerchants() {
  try {
    const merchants = await merchantRepo.getMerchants();

    if (merchants.length > 0) {
      return { data: mapToMerchantGeoDomain(merchants), message: undefined };
    }

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

export async function getMerchantsBy(status: POST_STATUS_ENUM) {
  try {
    const merchant = await merchantRepo.getMerchantsBy(status);

    return merchant;
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
    const approved = await merchantRepo.approveById(
      String(validatedFields.data?.merchant_id),
      String(validatedFields.data?.post_status) as POST_STATUS_ENUM,
    );

    revalidatePath("/dashboard/merchants", "layout");

    return { message: null, approved };
  } catch (err) {
    logger.error("[approveMerchantById]", err);

    return {
      message: `Publish approval failed for Merchant id: ${validatedFields.data.merchant_id}`,
    };
  }
}

export async function deleteMerchantById(id: string) {
  try {
    const result = await merchantRepo.deleteById(id);

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

export async function upvoteMerchant(merchantId: string): Promise<number> {
  try {
    return await merchantRepo.upvote(merchantId);
  } catch (err) {
    logger.error("[upvoteMerchant]", err);

    return 0;
  }
}
