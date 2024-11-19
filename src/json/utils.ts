import type { JsonValueType } from "./jsonableTypes.js";
import { JsonValueTypes } from "./jsonConsts.js";

export function isJsonValueType(value: unknown): value is JsonValueType {
  if (typeof value !== "string") {
    return false;
  }
  const candidates: readonly string[] = JsonValueTypes;
  return candidates.includes(value);
}
