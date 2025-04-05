"use server";

import { revalidatePath } from "next/cache";
import { Merchant } from "../lib/models/Merchant";
import { getMetadata } from "../lib/scrapping/metadata";
import merchantService from "../lib/service/merchant.service";
import { MerchantSchema, POST_STATUS_ENUM } from "../lib/typings";
import {
  addExtensionToImageFile,
  fetchLogo,
  writeLogoToDisk,
} from "../lib/utils/fs";
import { writeImgToDB } from "./image.action";

export async function addMerchant(prevState: unknown, formData: FormData) {
  const validatedFields = MerchantSchema.pick({
    merchant_name: true,
    email_address: true,
    category_id: true,
    website_url: true,
  }).safeParse({
    merchant_name: formData.get("merchant_name"),
    email_address: formData.get("email_address"),
    category_id: formData.get("category_id"),
    website_url: formData.get("website_url"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors,
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
      logo_img_id: "",
    };

    const { imgUrlWithExt, imgExt } = addExtensionToImageFile(
      merchant.logo_url
    );
    const logoImgArrBuffer = await fetchLogo(imgUrlWithExt);
    const logoName = merchant.merchant_name.toLowerCase().split(" ").join("_");
    console.log({ logoName, imgUrlWithExt });

    // return;
    const imgToDBResult = await writeImgToDB(
      `${logoName}${imgExt}`,
      Buffer.from(logoImgArrBuffer)
    );
    console.log({ imgToDBResult });

    merchant.logo_url = await writeLogoToDisk(merchant);
    merchant.logo_img_id = imgToDBResult.data.img_id;

    const result = await merchantService.create(merchant);

    if (result.rowCount === 1) {
      revalidatePath("/dashboard/merchants");
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

export async function getMerchantsPublished(): Promise<Merchant[]> {
  try {
    return await merchantService.getMerchantsByPublishStatus();
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

  try {
    const result = await merchantService.approveById(
      String(validatedFields.data?.merchant_id),
      String(validatedFields.data?.post_status) as POST_STATUS_ENUM
    );

    if (result.rowCount === 1) {
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }

    console.error(err);
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
