import { sql } from "../lib/database/sqlConnection";

export async function writeImgToDB(imgName: string, imgBuffer: Buffer) {
  const query = `INSERT INTO logo_images (img_name, data) 
                    VALUES ($1, $2)
                    RETURNING *`;
  const values = [imgName, imgBuffer];

  try {
    const result = await sql(query, values);
    console.log("Logo image saved to database successfully.");
    return { success: true, data: result.rows[0] };
  } catch (err) {
    console.error("Error saving image: ", err);
    throw new Error("Error saving image");
  }
}

export async function readImgFromDB(imgId: string) {
  const query = `SELECT img_name, data FROM logo_images
                    WHERE logo_images.img_id = ($1)
                    `;
  const values = [imgId];

  try {
    const result = await sql(query, values);

    if (result.rows.length > 0) {
      console.log("Logo fetched from database successfully.");
      const imgData = result.rows[0].data;

      return { success: true, data: imgData, name: result.rows[0].img_name };
    } else {
      return { success: false, data: null, name: "" };
    }
  } catch (err) {
    const msg = "Error fetching image";
    console.error(msg, err);
    throw new Error(msg);
  }
}
