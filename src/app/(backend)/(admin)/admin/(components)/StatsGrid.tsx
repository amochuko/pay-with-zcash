import StatsCard, { StatsCardProps } from "./StatsCard";

export interface StatsGridProps {
  items: StatsCardProps[];
}

export default function StatsGrid({ items }: StatsGridProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {
        items.map(itm => (
          <StatsCard key={itm.label} {...itm}/>
        ))
      }
    </section>
  )
}
