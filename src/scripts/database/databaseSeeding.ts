import sql from "../../app/lib/database/sqlConnection";
import categoriesJson from "./data/category.json";
import merchantsJson from "./data/squirrel_selected_merchants_with_logo_url_sorted.json";

export default class DatabaseSeeding {

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
        DROP TABLE IF EXISTS categories CASCADE;
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

  private async _createMerchantsTable() {
    try {
      await sql`
          DROP TYPE IF EXISTS post_status_enum CASCADE;
          CREATE TYPE post_status_enum AS ENUM ('publish', 'review', 'draft');
          DROP TABLE IF EXISTS merchants;
          CREATE TABLE IF NOT EXISTS merchants(
          merchant_id uuid NOT NULL DEFAULT gen_random_uuid(),
          name VARCHAR(50) UNIQUE NOT NULL,
          category_id uuid NOT NULL,
          website_url VARCHAR NOT NULL,
          email_address VARCHAR(100),
          subtitle VARCHAR(255),
          description VARCHAR,
          logo_url VARCHAR(255) NOT NULL,
          upvote_count INT DEFAULT 0,
          tags TEXT[],
          post_status post_status_enum,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP,
          CONSTRAINT merchant_pkey PRIMARY KEY (merchant_id),
          CONSTRAINT fkey_category FOREIGN KEY (category_id)
              REFERENCES categories (category_id) 
              ON DELETE CASCADE 
              ON UPDATE NO ACTION
          );`.simple();

      console.log("Creating Merchants table was successful!");
      return true;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error("_createMerchantsTable failed");
    }
  }

  async _seedMerchantTable() {
    try {
      await sql`INSERT INTO merchants ${sql(
        merchantsJson,
        "name",
        "category_id",
        "website_url",
        "email_address",
        "subtitle",
        "description",
        "logo_url",
        "upvote_count",
        // 'tags',
        "post_status"
      )}`;
      console.log("Seeding Category table was successful!");
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error("_seedMerchantTable failed");
    }
  }

  async seedCategoryTable() {
    try {
      const result = await this._createCategoryTable();

      if (result) {
        await this._addDataToCategoryTable();
        await this._createMerchantsTable();
        await this._seedMerchantTable();
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
