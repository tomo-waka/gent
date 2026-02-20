/* eslint-disable */
// Generated from JSON Schema. Do not edit manually.

export type GenTTcpOutputOptions =
  | {
      type: "tcp";
      path?: string;
      address: string;
      port: number | string;
      eps?: number | string;
      framing?: "octet-counting";
    }
  | {
      type: "tcp";
      path?: string;
      address: string;
      port: number | string;
      eps?: number | string;
      framing: "lf";
      trailerReplacer?: string;
    };
