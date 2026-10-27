import { GeoPrecision } from "@/app/lib/types/map.types";
import { DESIGN_TOKEN } from "./helpers";

 function Badge(props: { label: string; bg: string; color: string }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 500,
        padding: "2px 7px",
        borderRadius: 10,
        background: props.bg,
        color: props.color,
        flexShrink: 0,
        lineHeight: 1.6,
        whiteSpace: "nowrap",
      }}
    >
      {props.label}
    </span>
  );
}


export function ApproxBadge(props: { precision: GeoPrecision }) {
  return props.precision === "city" ? null : (
    <Badge
      label={
        props.precision === "state" ? "Approx · state" : "Approx · country"
      }
      bg={DESIGN_TOKEN.amberBg}
      color={DESIGN_TOKEN.amberText}
    />
  );
}
