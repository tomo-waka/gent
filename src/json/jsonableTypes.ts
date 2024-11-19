import type { AbstractJsonable } from "./abstractJsonable.js";
import type { JsonValueTypes } from "./jsonConsts.js";
import type {
  JsonBoolean,
  JsonNull,
  JsonNumber,
  JsonString,
  JsonValue,
} from "./jsonTypes.js";

export type JsonValueType = (typeof JsonValueTypes)[number];
export type JsonableValue =
  | AbstractJsonable
  | JsonableObject
  | JsonableValue[]
  | JsonString
  | JsonNumber
  | JsonBoolean
  | JsonNull;
export type JsonableObject = {
  [key: string]: JsonableValue;
};

export interface JsonableTransformer {
  (value: JsonValue): JsonableValue | undefined;
}
