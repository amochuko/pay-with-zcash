import { db } from "../lib/database/db";

export async function writeImgToDB(imgName: string, imgBuffer: Buffer) {
  try {
    const result = await db.query(
      `INSERT INTO logo_images (img_name, img_bin_data) 
                    VALUES ($1, $2)
                    RETURNING *`,
      [imgName, imgBuffer],
    );

    console.log("Logo image saved to database successfully.");

    return { success: true, data: result.rows[0] };
  } catch (err) {
    console.error("Error saving image: ", err);
    throw new Error("Error saving image");
  }
}

export async function readImgFromDB(imgId: string) {
  try {
    const result = await db.query(
      `SELECT img_name, img_bin_data FROM logo_images
                    WHERE logo_images.img_id = ($1)
                    `,
      [imgId],
    );

    if (result.rows.length > 0) {
      console.log("Logo fetched from database successfully.");

      return {
        success: true,
        data: result.rows[0].data,
        name: result.rows[0].img_name,
      };
    } else {
      return { success: false, data: null, name: "" };
    }
  } catch (err) {
    const msg = "Error fetching image";
    console.error(msg, err);
    throw new Error(msg);
  }
}
