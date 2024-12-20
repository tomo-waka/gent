export type TransformMode = "object" | "buffer";

interface PrimitiveDocumentTransformOptions {
  readonly transformMode: TransformMode;
  readonly eps: number;
}

export interface DocumentObjectTransformOptions
  extends PrimitiveDocumentTransformOptions {
  readonly transformMode: "object";
}

export type FramingMethod = "octet-counting" | "non-transparent";

interface DocumentBufferTransformOptions
  extends PrimitiveDocumentTransformOptions {
  readonly transformMode: "buffer";
  readonly framing: FramingMethod;
}

export interface DocumentOctetCountingTransformOptions
  extends DocumentBufferTransformOptions {
  readonly transformMode: "buffer";
  readonly framing: "octet-counting";
}

export interface DocumentNonTransparentTransformOptions
  extends DocumentBufferTransformOptions {
  readonly transformMode: "buffer";
  readonly framing: "non-transparent";
  readonly trailer: string;
  readonly trailerReplacer: string | undefined;
}

export type DocumentTransformOptions =
  | DocumentObjectTransformOptions
  | DocumentOctetCountingTransformOptions
  | DocumentNonTransparentTransformOptions;
