import sql from "../database/sqlConnection";
import { Category } from "../models/Category";

class CategoryService {
  //

  async getAll() {
    try {
      const categories = await sql<
        Category[] | []
      >`SELECT name, category_id FROM categories`;
      return categories.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
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

  async getById(catgoryId: string) {
    try {
      const categories = await sql<
        Category[]
      >`SELECT name FROM categories WHERE id = ${catgoryId}`;

      if (!categories.length) {
        throw new Error("Not found");
      }
      return categories[0];
    } catch (err) {
      if (err instanceof Error) {
        throw err.message;
      }

      throw new Error("Failed to fetch data");
    }
  }
}

const categoryService = new CategoryService(); // using Singleton pattern
export default categoryService;
