export interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;

}

export default function StatsCard(props: StatsCardProps) {
return (
    <div className="bg-white rounded-sm shadow-sm p-4">
        <div className="text-xs text-gray-500">{props.label}</div>
    </div>
)
}
