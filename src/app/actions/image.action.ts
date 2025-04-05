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
