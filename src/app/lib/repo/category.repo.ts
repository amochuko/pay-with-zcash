import { db } from "../database/db";
import { Category } from "../types/category.type";

class CategoryService {
  //

  async getAll(): Promise<Category[] | []> {
    try {
      const result = await db.query(`SELECT * FROM pwz.categories`);

      const categories = result.rows as Category[];

      return categories.sort((a, b) => {
        if (a.category_name < b.category_name) {
          return -1;
        } else if (a.category_name > b.category_name) {
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

  async create(categoryName: string) {
    try {
      return await db.query(
        `INSERT INTO pwz.categories (category_name)
                VALUES ($1)
              RETURNING category_id
            `,
        [categoryName],
      );
    } catch (err) {
      if (err instanceof Error) {
        throw err.message;
      }

      throw new Error("Failed to insert to table");
    }
  }

  async deleteById(categoryId: string) {
    try {
      const result = await db.query(
        `DELETE FROM pwz.categories
          WHERE category_id = ($1)
          RETURNING *
            `,
        [categoryId],
      );

      if (result.rowCount === 0) {
        throw new Error("Category not found.");
      }

      return result.rows[0];
    } catch (err) {
      if (err instanceof Error) {
        throw err.message;
      }

      throw new Error("Failed to delete data");
    }
  }

  async updateById(categoryId: string, name: string) {
    try {
      return await db.query(
        `UPDATE pwz.categories
               SET category_name = ($1)
               WHERE category_id = ($2)
              RETURNING *
            `,
        [categoryId, name],
      );
    } catch (err) {
      if (err instanceof Error) {
        throw err.message;
      }

      throw new Error("Failed to update data");
    }
  }

  async getById(categoryId: string): Promise<Category> {
    try {
      const result = await db.query(
        `SELECT category_name FROM pwz.categories WHERE id = ($1)`,
        [categoryId],
      );

      if (!result.rows.length) {
        throw new Error("Not found");
      }
      return result.rows[0];
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
