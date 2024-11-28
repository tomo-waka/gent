import { EscapeStyles } from "./consts.js";
import type { EscapeStyle } from "./type.js";

export function isEscapeStyle(value: unknown): value is EscapeStyle {
  if (typeof value !== "string") {
    return false;
  }
  const candidates: readonly string[] = EscapeStyles;
  return candidates.includes(value);
}
