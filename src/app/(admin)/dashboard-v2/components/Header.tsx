import StatsGrid from "./StatsGrid";

export interface HeaderProps {
  title: string;
  items: { label: string; value: number | string }[];
}

export default function Header({ title, items }: HeaderProps) {
  return (
    <header className="p-4 border-b border-gray-200 bg-slate-600 rounded-sm space-y-4 text-white mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <StatsGrid items={items} />
    </header>
  );
}
