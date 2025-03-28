import { dbClient, sql } from "../../app/lib/database/sqlConnection";
import categoriesJson from "./data/categories_with_id.json";
import merchantsJson from "./data/updatedMerchantsWithLogoRelativePath_Fri Mar 28 2025 05:18:31 GMT+0100 (West Africa Standard Time).json";

export default class DatabaseSeeding {
  async dbConnectionTest() {
    try {
      const result = await sql(`SELECT now()`);
      console.log("Current time of DB Server: ", result.rows[0], "\n");
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("DB connection test failed!");
    }
  }

  async _createCategoryTable() {
    try {
      await sql(`
        DROP TABLE IF EXISTS categories CASCADE;
        CREATE TABLE IF NOT EXISTS categories(
            category_id uuid NOT NULL DEFAULT gen_random_uuid(),
            category_name VARCHAR(120) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP,

            CONSTRAINT category_pkey PRIMARY KEY (category_id)
        );
      `);

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
    const client = await dbClient.connect();

    try {
      const queryText = `INSERT INTO categories (category_name) VALUES ($1)`;
      await client.query("BEGIN");

      // Loop through objArr and add each object to the batch
      for (const obj of categoriesJson) {
        console.log("Seeding Category table with: \n", obj.category_name);

        await dbClient.query(queryText, [obj.category_name]);
      }

      // Commit the txn
      await client.query("COMMIT");
      console.log("Seeding Category table was successful!");
    } catch (err) {
      await dbClient.query("ROLLBACK");

      if (err instanceof Error) {
        console.error(err.message);
        throw err;
      }

      throw new Error("Seeding Category failed with");
    } finally {
      client.release();
    }
  }

  async createMerchantsTable() {
    try {
      await sql(`
          DROP TYPE IF EXISTS post_status_enum CASCADE;
          CREATE TYPE post_status_enum AS ENUM ('publish', 'review', 'draft');
          DROP TABLE IF EXISTS merchants;

          CREATE TABLE IF NOT EXISTS merchants(
            merchant_id uuid NOT NULL DEFAULT gen_random_uuid(),
            merchant_name VARCHAR(50) UNIQUE NOT NULL,
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
          )`);

      console.log("Creating Merchants table was successful!");
      return true;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error("_createMerchantsTable failed");
    }
  }

  async seedMerchantTable() {
    try {
      await dbClient.query("BEGIN");

      const query = `INSERT INTO merchants (merchant_name, category_id,website_url,email_address,subtitle,description,logo_url,upvote_count,post_status,tags)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;

      let counter = 0;
      console.log("Seeding started...");
      for (const m of merchantsJson) {
        counter++;
        const values = [
          m.merchant_name,
          m.category_id,
          m.website_url,
          m.email_address,
          m.subtitle,
          m.description,
          m.logo_url_relative_path,
          m.upvote_count,
          m.post_status,
          m.tags
        ];

        try {
          await dbClient.query(query, values);
          console.log(`Row seeded: ${counter} : with Merchant: ${m.merchant_name}`);
        } catch (err) {
          console.error(`Error inserting merchant ${m.merchant_name}:`, err);
          throw err; // If one insertion fails, rollback the entire transaction
        }
      }

      // Commit the transaction after all inserts
      await dbClient.query("COMMIT");
      console.log("\nSeeding Merchant table was successful!");
    } catch (err) {
      await dbClient.query("ROLLBACK");

      if (err instanceof Error) {
        throw err;
      }
      throw new Error("_seedMerchantTable failed");
    } finally {
      await dbClient.end();
    }
  }
}
