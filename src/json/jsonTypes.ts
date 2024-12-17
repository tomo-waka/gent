import type { JsonValueTypes } from "./jsonConsts.js";

export type JsonValueType = (typeof JsonValueTypes)[number];

export type JsonValue =
  | JsonObject
  | JsonArray
  | JsonString
  | JsonNumber
  | JsonBoolean
  | JsonNull;

export type JsonObject = {
  readonly [key: string]: JsonValue;
};
export type MutableJsonObject = {
  [key: string]: JsonValue;
};

export type JsonArray = readonly JsonValue[];
export type MutableJsonArray = JsonValue[];

export type JsonString = string;
export type JsonNumber = number;
export type JsonBoolean = boolean;
export type JsonNull = null;
