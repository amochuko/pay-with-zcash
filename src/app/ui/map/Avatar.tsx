import { useEffect, useState } from "react";
import {
  DESIGN_TOKEN,
  groupColor,
  ParsedMerchants,
  safeHttpUrl,
} from "./helpers";

import { MerchantRecord } from "@/app/lib/types/map.types";
import Image from "next/image";

export function Avatar(props: {
  m: ParsedMerchants | MerchantRecord;
  size?: number;
  logoContentType?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  const src = safeHttpUrl(props.m.logoUrl) ?? props.m.logoUrl;
  const color = props.m?.categoryGroup ? groupColor(props.m.categoryGroup) : "";

  // Reset image state when the source changes
  useEffect(() => {
    setFailed(false);
  }, [src]);

  // Extract initials from merchant name.
  const getInitials = (name: string) => {
    const words = (name ?? "").trim().split(/\s+/).filter(Boolean);

    if (!words.length) return "?";

    return words.length > 1
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : words[0][0].toUpperCase();
  };

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
        className={props.className}
        style={{
          ...box,
          background: `${color}22`,
          color,
          fontSize: props.size ? props.size * 0.38 : 148,
          fontWeight: 600,
          letterSpacing: "0.02em",
        }}
        // aria-hidden="true"
        aria-label={`${props.m.name || "Unknown merchant"} avatar`}
        role="img"
      >
        {getInitials(props.m.name)}
      </div>
    );
  }

  return (
    <div style={{ ...box, background: DESIGN_TOKEN.bgCard }}>
      <Image
        src={src}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        width={256}
        height={256}
        className={
          props.className ? props.className : "h-15 w-15 object-contain"
        }
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        unoptimized={props.logoContentType}
      />
    </div>
  );
}
