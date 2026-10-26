import { MerchantRecord } from "@/app/lib/types/map.types";
import { useState } from "react";
import { safeHttpUrl, groupColor, DESIGN_TOKEN, ParsedMerchants } from "./helpers";

export function Avatar(props: { m: ParsedMerchants; size: number }) {
  const [failed, setFailed] = useState(false);

  const src = safeHttpUrl(props.m.logoUrl);
  const color = groupColor(props.m.categoryGroup);

  const box = {
    width: props.size,
    height: props.size,
    borderRadius: 8,
    flexShrink: 0,
    overflow: "hidden",
    border: `1px solid ${DESIGN_TOKEN.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as const;

  if (!src || failed) {
    return (
      <div
        style={{
          ...box,
          background: `${color}22`,
          color,
          fontSize: props.size * 0.45,
          fontWeight: 600,
        }}
        aria-hidden="true"
      >
        {(props.m.name.trim()[0] ?? "?").toUpperCase()}
      </div>
    );
  }

  return (
    <div style={{ ...box, background: DESIGN_TOKEN.bgCard }}>
      <img
        src={src}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
}
