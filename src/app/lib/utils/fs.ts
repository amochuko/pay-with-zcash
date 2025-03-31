import fs from "node:fs";
import path from "node:path";
import { Merchant } from "../models/Merchant";

async function saveLogo(imgUrl: string, saveToPath: string): Promise<string> {
  const saveToPathArr = saveToPath.split("/public");

  try {
    const response = await fetch(imgUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image. Status: ${response.status}`);
    }

    const arrBuffer = await response.arrayBuffer();

    return new Promise((res, rej) => {
      fs.writeFile(saveToPath, Buffer.from(arrBuffer), null, (err) => {
        if (err) {
          console.error("Error writing image: ", err);
          rej(err.message);
        } else {
          console.log(`Image saved to `, saveToPath);
          res(saveToPathArr[saveToPathArr.length - 1]);
        }
      });
    });
  } catch (err) {
    console.error("Error fetching or saving image:", err);
    throw err;
  }
}

export async function writeLogoToDisk(data: Merchant) {
  // TODO: write image to temp memory
  // and will write to disk 
  // on successful database transaction
  const logoPathArr = data.logo_url.split("/");
  const logoFileExt = logoPathArr[logoPathArr.length - 1].split(".")[1];
  const logoFileName = `${data.merchant_name
    .toLowerCase()
    .split(" ")
    .join("_")}_${Date.now()}.${logoFileExt}`;

  const filePath = path.join(process.cwd(), "public/images", logoFileName);
  const savedPath = await saveLogo(data.logo_url, filePath);
  return savedPath;
}
