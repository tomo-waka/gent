import type { DocumentContent } from "../document/index.js";
import type { JsonableArray, JsonableObject } from "./jsonableTypes.js";
import type { JsonValueType } from "./jsonTypes.js";

export interface PrimitiveJsonableParameters {
  readonly type: JsonValueType;
  readonly probability: number | undefined;
  readonly weight: number | undefined;
}

export interface ObjectJsonableParameters extends PrimitiveJsonableParameters {
  readonly type: "object";
  readonly content: JsonableObject;
}

export interface ArrayJsonableParameters extends PrimitiveJsonableParameters {
  readonly type: "array";
  readonly content: JsonableArray;
  readonly length: DocumentContent;
}

export interface StringJsonableParameters extends PrimitiveJsonableParameters {
  readonly type: "string";
  readonly content: DocumentContent;
}

export interface NumberJsonableParameters extends PrimitiveJsonableParameters {
  readonly type: "number";
  readonly content: DocumentContent;
}

export interface BooleanJsonableParameters extends PrimitiveJsonableParameters {
  readonly type: "boolean";
  readonly content: DocumentContent;
}

export interface NullJsonableParameters extends PrimitiveJsonableParameters {
  readonly type: "null";
}

export type JsonableValueParameters =
  | ObjectJsonableParameters
  | ArrayJsonableParameters
  | StringJsonableParameters
  | NumberJsonableParameters
  | BooleanJsonableParameters
  | NullJsonableParameters;
