export interface Column<T> {
  key: keyof T;
  label: string;
}

export interface TableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
}

export default function Table<T extends Record<string, unknown>>({
  columns,
  data,
}: TableProps<T>) {
  return (
    <div className="bg-white rounded-sm shadow-sm overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="text-left px-4 py-2 text-gray-600 font-semibold"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-t">
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-2">
                  {String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
