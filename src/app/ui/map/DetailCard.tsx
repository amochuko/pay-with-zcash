import { CategoryGroup, GROUPS } from "@/app/lib/types/map.types";
import { Avatar } from "./Avatar";
import {
  DESIGN_TOKEN,
  hostOf,
  ParsedMerchants,
  placeLabel,
  safeHttpUrl,
} from "./helpers";

export function DetailCard(props: {
  m: ParsedMerchants | null;
  onClose: () => void;
  mobile: boolean;
}) {
  const { m, onClose, mobile } = props;

  if (!m) return null;
  const site = safeHttpUrl(m.website);

  return (
    <div
      role="dialog"
      aria-label={m.name}
      style={{
        position: "absolute",
        zIndex: 900,
        boxSizing: "border-box",
        ...(mobile
          ? { left: 10, right: 10, bottom: 10, minHeight: 320 }
          : { right: 14, bottom: 14, width: 290 }),
        background: DESIGN_TOKEN.bgCard,
        border: `1px solid ${DESIGN_TOKEN.borderStrong}`,
        borderRadius: 10,
        padding: "13px 14px 14px",
        maxHeight: mobile ? "55%" : undefined,
        overflowX: "auto",
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: DESIGN_TOKEN.textMuted,
          fontSize: 14,
          lineHeight: 1,
          padding: 6,
        }}
      >
        x
      </button>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          padding: 8,
          marginBottom: 4,
        }}
      >
        <Avatar m={m} size={40} />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: DESIGN_TOKEN.textPrimary,
              lineHeight: 1.3,
              overflow: "anywhere",
            }}
          >
            {m.name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: DESIGN_TOKEN.textMuted,
              marginTop: 2,
              lineHeight: 1.5,
            }}
          >
            {m.category || GROUPS[m.categoryGroup as CategoryGroup].label} -{" "}
            <span>{placeLabel(m)}</span>
          </div>
        </div>

        {m.description && (
          <p
            style={{
              fontSize: 12,
              color: DESIGN_TOKEN.textMuted,
              lineHeight: 1.55,
              margin: "0 0 10px",
            }}
          >
            {m.description.length > 250
              ? m.description.slice(0, 200) + "..."
              : m.description}
          </p>
        )}

        {m.precision !== "city" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              alignItems: "flex-start",
              margin: "8px 0",
              padding: "8px 10px",
              borderRadius: 8,
              background: DESIGN_TOKEN.amberBg,
              fontSize: 11,
              lineHeight: 1.5,
              color: DESIGN_TOKEN.textMuted,
            }}
          >
            <span style={{ color: DESIGN_TOKEN.amberText, fontWeight: 600 }}>
              Approximate
            </span>

            <span>
              Placed at the center of{" "}
              {m.precision === "state" ? "the state/region" : "the country"},
              not at an address. Owner?{" "}
              <a
                href={process.env.NEXT_PUBLIC_LISTING_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: DESIGN_TOKEN.accentText,
                  textDecoration: "underline",
                }}
              >
                Add your city
              </a>
              .
            </span>
          </div>
        )}

        <div
          style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}
        >
          {site && (
            <a
              href={site}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12,
                fontWeight: 500,
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: 7,
                background: DESIGN_TOKEN.accentBg,
                color: DESIGN_TOKEN.accentText,
                border: `1px solid ${DESIGN_TOKEN.accentBorder}`,
              }}
            >
              Visit {hostOf(site)} ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
