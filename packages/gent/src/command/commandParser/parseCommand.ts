import type { StructuredCommandExpression } from "../type.js";
import { toAstVisitor } from "./visitor.js";

export function parseCommand(input: string): StructuredCommandExpression {
  const commandExpressionFragment = toAstVisitor(input);
  let structuredCommandExpression: StructuredCommandExpression;
  if (commandExpressionFragment !== undefined) {
    structuredCommandExpression = {
      expression: input,
      ...commandExpressionFragment,
    };
  } else {
    structuredCommandExpression = {
      expression: input,
      name: "invalid",
    };
  }
  return structuredCommandExpression;
}
