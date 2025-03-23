// import categoriesJson from "./data/category.json";
import sql from "../../app/lib/database/sqlConnection";
import CategoryService from "../../app/lib/service/category.service";
import MerchantService from "../../app/lib/service/merchant.service";

export default class DatabaseSeeding {
  merchantService: MerchantService;
  categoryService: CategoryService;

  constructor() {
    this.merchantService = new MerchantService();
    this.categoryService = new CategoryService();
  }

  async dbConnectionTest() {
    try {
      const dbTime = await sql`SELECT now()`;
      console.log("Current time of DB Server: ", dbTime[0], "\n");
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("DB connection test failed!");
    }
  }

  async _createCategoryTable() {
    try {
      await sql`DROP TABLE IF EXISTS categories;`;

      await sql`
        CREATE TABLE IF NOT EXISTS categories(
            category_id uuid NOT NULL DEFAULT gen_random_uuid(),
            name VARCHAR(120) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP,

            CONSTRAINT category_pkey PRIMARY KEY (category_id)
        );
      `;

      console.log("Categories table created successfully")
      return true;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw Error("Failed to created Categories table");
    }
  }

  async seedCategoryTable() {
    try {
      await this._createCategoryTable();
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw Error("Failed to created Categories table");
    }
  }

  async closeConnection(time_in_seconds: number) {
    await sql.end({ timeout: time_in_seconds });
  }
}
