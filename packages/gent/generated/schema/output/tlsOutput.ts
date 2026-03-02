/* eslint-disable */
// Generated from JSON Schema. Do not edit manually.

export type TlsOutput =
  | {
      type: "tls";
      path?: string;
      address: string;
      port: number;
      eps?: number;
      framing?: "octet-counting";
    }
  | {
      type: "tls";
      path?: string;
      address: string;
      port: number;
      eps?: number;
      framing: "lf";
      trailerReplacer?: string;
    };
