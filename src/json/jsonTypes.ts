export type JsonValue =
  | JsonObject
  | JsonValue[]
  | JsonString
  | JsonNumber
  | JsonBoolean
  | JsonNull;
export type JsonObject = {
  [key: string]: JsonValue;
};
export type JsonString = string;
export type JsonNumber = number;
export type JsonBoolean = boolean;
export type JsonNull = null;
