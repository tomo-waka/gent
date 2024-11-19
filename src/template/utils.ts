import type { TemplateFragment } from "./types.js";

export function isStringOnlyTemplateFragments(
  templateFragments: readonly TemplateFragment[],
): boolean {
  return templateFragments.every(
    (documentFragment) => typeof documentFragment === "string",
  );
}
