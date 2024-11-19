import type { TemplateFragment } from "../types.js";
import { toAstVisitor } from "./visitor.js";

export function parseTemplate(input: string): TemplateFragment[] {
  const parsedTemplate = toAstVisitor(input);
  if (Array.isArray(parsedTemplate)) {
    return parsedTemplate;
  } else {
    return [parsedTemplate];
  }
}
