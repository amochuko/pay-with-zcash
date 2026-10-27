import { CategoryGroup, GeoPrecision, GROUPS } from "@/app/lib/types/map.types";
import { ApproxBadge } from "./ApproxBadge";
import { Avatar } from "./Avatar";
import {
  DESIGN_TOKEN,
  groupColor,
  ParsedMerchants,
  placeLabel,
} from "./helpers";

export function MerchantItem(props: {
  m: ParsedMerchants;
  active: boolean;
  onClick: () => void;
}) {
  const { m, active, onClick } = props;

  return (
    <div
      id={`zmm-${props.m.id}`}
      className="zmm-item"
      role="listitem"
      tabIndex={0}
      aria-current={true}
      onClick={onClick}
      style={{
        padding: "10px 14px",
        cursor: "pointer",
        display: "flex",
        gap: 10,
        alignItems: "center",
        borderBottom: `1px solid ${DESIGN_TOKEN.border}`,
        borderLeft: `2px solid ${active ? DESIGN_TOKEN.accent : "transparent"}`,
        background: active ? DESIGN_TOKEN.bgCard : "transparent",
        outline: "none",
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Avatar m={m} size={34} />

      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: DESIGN_TOKEN.textPrimary,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {m.name}
        </div>
        <div
          style={{
            fontSize: 11,
            color: DESIGN_TOKEN.textMuted,
            margin: "1px 0 5px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {placeLabel(m)}
        </div>

        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 10,
              color: DESIGN_TOKEN.textMuted,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: groupColor(m.categoryGroup),
              }}
            />
            {GROUPS[m.categoryGroup as CategoryGroup].label}
          </span>

          <ApproxBadge precision={m.precision as GeoPrecision} />
        </div>
      </div>
    </div>
  );
}
