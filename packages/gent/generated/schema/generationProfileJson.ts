/* eslint-disable */
// Generated from JSON Schema. Do not edit manually.

export type OutputOptions =
  | string
  | GenTFileOutputOptions
  | GenTUdpOutputOptions
  | GenTTcpOutputOptions
  | GenTTlsOutputOptions;
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

export interface GenTGenerationProfile {
  debug?: boolean;
  from?: string;
  to?: string;
  count?: number | string;
  out: OutputOptions;
  /**
   * @minItems 1
   */
  templates: [TemplateOptions, ...TemplateOptions[]];
}
export interface GenTFileOutputOptions {
  type: "file";
  path: string;
  size?: string;
}
export interface GenTUdpOutputOptions {
  type: "udp";
  path?: string;
  address: string;
  port: number | string;
  eps?: number | string;
}
export interface TemplateOptions {
  mode?: "text" | "json";
  path: string;
  weight?: number | string;
}
