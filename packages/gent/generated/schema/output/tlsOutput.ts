/* eslint-disable */
// Generated from JSON Schema. Do not edit manually.

export type FramingMethod = "lf" | "octet-counting";

export interface TlsOutput {
  type: "tls";
  path?: string;
  address: string;
  port: number;
  eps?: number;
  framing: FramingMethod;
  [k: string]: any;
}
