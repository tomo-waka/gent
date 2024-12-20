import type { AbstractJsonable } from "./abstractJsonable.js";
import type {
  JsonBoolean,
  JsonNull,
  JsonNumber,
  JsonString,
  JsonValue,
} from "./jsonTypes.js";

export type JsonableValue =
  | JsonableObject
  | JsonableArray
  | AbstractJsonable
  | JsonString
  | JsonNumber
  | JsonBoolean
  | JsonNull;

export type JsonableObject = {
  readonly [key: string]: JsonableValue;
};
export type MutableJsonableObject = {
  [key: string]: JsonableValue;
};

export type JsonableArray = readonly JsonableValue[];
export type MutableJsonableArray = JsonableValue[];

export interface JsonableTransformer {
  (value: JsonValue): JsonableValue | undefined;
}
