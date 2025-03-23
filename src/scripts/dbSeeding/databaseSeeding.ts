// import categoriesJson from "./seed_data/category.json";
import MerchantService from "../../app/lib/service/merchant.service";
import CategoryService from "../../app/lib/service/category.service";
import sql from "../../app/lib/database/sqlConnection";

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

  async closeConnection(time_in_seconds: number) {
    await sql.end({ timeout: time_in_seconds });
  }
}
