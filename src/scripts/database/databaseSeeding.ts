import sql from "../../app/lib/database/sqlConnection";
import CategoryService from "../../app/lib/service/category.service";
import MerchantService from "../../app/lib/service/merchant.service";
import categoriesJson from "./data/category.json";

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
      await sql`
        DROP TABLE IF EXISTS categories;
        CREATE TABLE IF NOT EXISTS categories(
            category_id uuid NOT NULL DEFAULT gen_random_uuid(),
            name VARCHAR(120) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP,

            CONSTRAINT category_pkey PRIMARY KEY (category_id)
        );
      `.simple() /** Executing two statement at once with `.simple()` */;

      console.log("Categories table created successfully");
      return true;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw Error("Failed to created Categories table");
    }
  }

  async _addDataToCategoryTable() {
    const catObjArr: Record<string, string>[] = [];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(categoriesJson).map(([_, value]) => {
      catObjArr.push({ name: value });
    });

    console.log("Seeding Category table with: \n", catObjArr);

    try {
      await sql`insert into categories ${sql(catObjArr, "name")}`;
      console.log("Seeding Category table was successful!");
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error("Seeding Category failed with");
    }
  }

  async seedCategoryTable() {
    try {
      const result = await this._createCategoryTable();

      if (result) {
        await this._addDataToCategoryTable();
      }
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
