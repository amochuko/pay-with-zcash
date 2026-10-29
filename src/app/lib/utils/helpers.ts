import { put } from "@vercel/blob";
import logger from "../logger";

export async function saveLogoToBlob(logoUrl: string, name: string) {
  try {
    const response = await fetch(logoUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image. Status: ${response.status}`);
    }

    const image = await response.blob();
    const contentType = image.type;

    if (!contentType.startsWith("image/")) {
      throw new Error(
        `Excepted an image, received: ${contentType || "unknown"}`,
      );
    }

    const result = await put(`logos/${name}_${crypto.randomUUID()}`, image, {
      access: "public",
      contentType,
      addRandomSuffix: true,
    });

    return result;
  } catch (err) {
    logger.error('[saveLogoToBlob]', err)
    
    throw new Error("Error saving image");
  }
}

export function convertToTitleCase(str: string) {
  return str
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export function trimText(txt: string, length: number) {
  return txt && txt.slice(0, length) + "...";
}

export function formatDateToHumanReadable(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
