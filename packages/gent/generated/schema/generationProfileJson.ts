/* eslint-disable */
// Generated from JSON Schema. Do not edit manually.

/**
 * for dev.
 */
export type DebugFlag = boolean;
export type FromDateTime = string;
export type ToDateTime = string;
export type CountOfEntries = number;
export type GenerationOutput =
  | SimpleFileOutput
  | RotatingFileOutput
  | UdpOutput
  | TcpOutput
  | TlsOutput;
export type SimpleFileOutput = string;
export type PathToOutputFile = string;
export type SizeToRotateTheFile = string;
export type FramingMethod = "lf" | "octet-counting";
export type FramingMethod1 = "lf" | "octet-counting";
export type TemplateMode = "text" | "json";
export type WeightForRandomSelection = number;

export interface GenTGenerationProfile {
  debug?: DebugFlag;
  from?: FromDateTime;
  to?: ToDateTime;
  count?: CountOfEntries;
  out: GenerationOutput;
  /**
   * @minItems 1
   */
  templates: [TemplateOptions, ...TemplateOptions[]];
}
export interface RotatingFileOutput {
  type: "file";
  path: PathToOutputFile;
  size?: SizeToRotateTheFile;
}
export interface UdpOutput {
  type: "udp";
  path?: string;
  address: string;
  port: number;
  eps?: number;
}
export interface TcpOutput {
  type: "tcp";
  path?: string;
  address: string;
  port: number;
  eps?: number;
  framing: FramingMethod;
  [k: string]: any;
}
export interface TlsOutput {
  type: "tls";
  path?: string;
  address: string;
  port: number;
  eps?: number;
  framing: FramingMethod1;
  [k: string]: any;
}
export interface TemplateOptions {
  mode?: TemplateMode;
  path: string;
  weight?: WeightForRandomSelection;
}
