import type { NonTransparentFramingMethod, TcpFramingMethod } from "./types.js";

export const DEFAULT_TEMPLATE_WEIGHT = 1;
export const TemplateModes = ["text", "json"] as const;
export const NetworkOutputTypes = ["udp", "tcp"] as const;
export const OutputTypes = ["file", ...NetworkOutputTypes] as const;

export const DefaultEps = 3000;
export const MaxEps = Number.MAX_SAFE_INTEGER;

export const OctetCounting = "octet-counting" as const;
export const NonTransparentFramingMethods = ["lf"] as const;
export const TcpFramingMethods = [
  OctetCounting,
  ...NonTransparentFramingMethods,
] as const;

export const DefaultTcpFramingMethod: TcpFramingMethod = "lf";
export const DefaultTrailerReplacer = " " as const;
export const TrailerMap: { [Key in NonTransparentFramingMethod]: string } = {
  lf: "\n",
} as const;
