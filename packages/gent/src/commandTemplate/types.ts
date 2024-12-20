import type { StructuredCommandExpression } from "../command/index.js";
import type { StringTemplateFragment } from "../template/index.js";

export type CommandParsedTemplateFragment =
  | StringTemplateFragment
  | StructuredCommandExpression;
