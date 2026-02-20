import type {
  NonTransparentFramingMethod,
  TcpFramingMethod,
} from "./api/outputOptions.js";

export const DEFAULT_TEMPLATE_WEIGHT = 1;

export const DefaultEps = 3000;
export const MaxEps = Number.MAX_SAFE_INTEGER;

export const DefaultTcpFramingMethod: TcpFramingMethod = "lf";
export const DefaultTrailerReplacer = " " as const;
export const TrailerMap: { [Key in NonTransparentFramingMethod]: string } = {
  lf: "\n",
} as const;
