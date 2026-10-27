import Table from "./components/TableProps";

const columns = [
  { key: "name", label: "User" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
];

const data = [
  { name: "Alice", role: "Admin", status: "Active" },
  { name: "Bob", role: "Editor", status: "Active" },
  { name: "Charlie", role: "Viewer", status: "Suspended" },
];

interface UserRow {
  name: string;
  role: string;
  status: string;
  [key: string]: unknown;
}
export default async function AdminDashboardPage() {
  return (
    <>
      <Table<UserRow> columns={columns} data={data} />
    </>
  );
}
