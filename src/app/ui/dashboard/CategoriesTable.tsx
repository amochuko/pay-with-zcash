

'use client'

import { Category } from "@/app/lib/models/Category"

{/* Categories Table */}

type CategoriesTableProps ={
    categories: Category[]
}
export const CategoriesTable = (props: CategoriesTableProps) => {
    return (
      <div className="bg-slate-700 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-slate-900">
                <th className="px-4 py-2 text-left">S/N</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {props.categories &&
                props.categories.slice(0, 8).map((category, i) => (
                  <tr key={category.category_id}>
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">{category.category_name}</td>
                    <td className="px-4 py-2">{category.created_at}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
}


export default CategoriesTable
