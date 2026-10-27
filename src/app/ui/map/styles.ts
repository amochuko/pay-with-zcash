import { DESIGN_TOKEN } from "./helpers";

export const fieldStyle = {
  width: "100%",
  padding: "7px 9px",
  fontSize: 13,
  borderRadius: 7,
  boxSizing: "border-box",
  border: `1px solid ${DESIGN_TOKEN.borderStrong}`,
  background: DESIGN_TOKEN.bgCard,
  color: DESIGN_TOKEN.textPrimary,
  outline: "none",
} as const;
