/* eslint-disable */
// Generated from JSON Schema. Do not edit manually.

export type TcpOutput =
  | {
      type: "tcp";
      path?: string;
      address: string;
      port: number;
      eps?: number;
      framing?: "octet-counting";
    }
  | {
      type: "tcp";
      path?: string;
      address: string;
      port: number;
      eps?: number;
      framing: "lf";
      trailerReplacer?: string;
    };
