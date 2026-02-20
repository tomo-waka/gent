/* eslint-disable */
// Generated from JSON Schema. Do not edit manually.

export type GenTTlsOutputOptions =
  | {
      type: "tls";
      path?: string;
      address: string;
      port: number | string;
      eps?: number | string;
      framing?: "octet-counting";
    }
  | {
      type: "tls";
      path?: string;
      address: string;
      port: number | string;
      eps?: number | string;
      framing: "lf";
      trailerReplacer?: string;
    };
