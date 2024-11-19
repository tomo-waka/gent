import type { JsonableTransformer, JsonableValue } from "./jsonableTypes.js";
import type { JsonValue } from "./jsonTypes.js";

export function parseJsonable(
  input: string,
  jsonableTransformer: JsonableTransformer,
): JsonableValue | undefined {
  let jsonValue: JsonValue | undefined;
  try {
    jsonValue = JSON.parse(input);
  } catch (error) {
    console.error(error);
    jsonValue = undefined;
  }

  if (jsonValue === undefined) {
    return undefined;
  }

  const jsonableValue = jsonableTransformer(jsonValue);
  if (jsonableValue === undefined) {
    return undefined;
  }

  return jsonableValue;
}
