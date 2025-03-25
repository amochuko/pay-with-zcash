import sql from "../database/sqlConnection";
import { Category } from "../models/Category";

export default class CategoryService {
  //

  async getAll() {
    try {
      const categories = await sql<
        Category[] | []
      >`SELECT name FROM categories`;
      return categories.sort((a, b) => {
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        }

        return 0;
      });
    } catch (err) {
      if (err instanceof Error) {
        throw err.message;
      }

      throw new Error("Failed to fetch categories");
    }
  }

  async create(catgoryName: string) {
    try {
      return await sql`INSERT INTO categories (name)
                VALUES (${catgoryName})
              RETURNING *
            `;
    } catch (err) {
      if (err instanceof Error) {
        throw err.message;
      }

      throw new Error("Failed to insert to table");
    }
  }

  async deleteById(catgoryId: string) {
    try {
      return await sql`
                      DELETE FROM categories
                      WHERE id =  (${catgoryId})
              RETURNING *
            `;
    } catch (err) {
      if (err instanceof Error) {
        throw err.message;
      }

      throw new Error("Failed to delete data");
    }
  }

  async updateById(catgoryId: string, name: string) {
    try {
      return await sql`
                      UPDATE categories
                      SET name = (${name})
                      WHERE id =  (${catgoryId})
              RETURNING *
            `;
    } catch (err) {
      if (err instanceof Error) {
        throw err.message;
      }

      throw new Error("Failed to update data");
    }
  }
}
