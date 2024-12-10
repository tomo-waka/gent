import type { NonTransparentFramingType, TcpFramingType } from "./types.js";

export const DEFAULT_TEMPLATE_WEIGHT = 1;
export const TemplateModes = ["text", "json"] as const;
export const NetworkOutputTypes = ["udp", "tcp"] as const;
export const OutputTypes = ["file", ...NetworkOutputTypes] as const;

export const DefaultEps = 3000;

export const OctetCounting = "octet-counting" as const;
export const NonTransparentFramingTypes = ["lf"] as const;
export const TcpFramingTypes = [
  OctetCounting,
  ...NonTransparentFramingTypes,
] as const;

export const DefaultTcpFraming: TcpFramingType = "lf";
export const DefaultTrailerReplacer = " " as const;
export const TrailerMap: { [Key in NonTransparentFramingType]: string } = {
  lf: "\n",
} as const;
