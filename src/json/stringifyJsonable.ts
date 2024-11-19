import type { DocumentContext } from "../document/index.js";
import { AbstractJsonable } from "./abstractJsonable.js";
import type { JsonableObject, JsonableValue } from "./jsonableTypes.js";
import type { JsonObject, JsonValue } from "./jsonTypes.js";

export function stringifyJsonable(
  value: JsonableValue,
  keyOrIndex: string | number,
  context: DocumentContext,
): string | undefined {
  const jsonValue = transformJsonableIntoJsonValue(value, keyOrIndex, context);
  if (jsonValue === undefined) {
    return "";
  }
  return JSON.stringify(jsonValue);
}

export function transformJsonableIntoJsonValue(
  value: JsonableValue,
  keyOrIndex: string | number,
  context: DocumentContext,
): JsonValue | undefined {
  if (value instanceof AbstractJsonable) {
    return value.toJSON(keyOrIndex, context);
  } else if (
    value === null ||
    typeof value === "boolean" ||
    typeof value === "number" ||
    typeof value === "string"
  ) {
    return value;
  } else if (Array.isArray(value)) {
    return value
      .map((item) => transformJsonableIntoJsonValue(item, keyOrIndex, context))
      .filter((jsonValue) => jsonValue !== undefined);
  } else {
    return transformJsonableObjectIntoJsonObject(value, keyOrIndex, context);
  }
}

export function transformJsonableObjectIntoJsonObject(
  jsonableObject: JsonableObject,
  keyOrIndex: string | number,
  context: DocumentContext,
): JsonObject | undefined {
  let jsonObject: JsonObject = {};
  Object.keys(jsonableObject).forEach((memberKey) => {
    const memberValue = jsonableObject[memberKey];
    if (memberValue === undefined) {
      return;
    }
    const memberJsonValue = transformJsonableIntoJsonValue(
      memberValue,
      memberKey,
      context,
    );
    if (memberJsonValue === undefined) {
      return;
    }
    jsonObject[memberKey] = memberJsonValue;
  });
  return jsonObject;
}
