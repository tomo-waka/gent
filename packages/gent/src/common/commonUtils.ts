import {
  type NetworkOutputType,
  NetworkOutputTypes,
  type OutputType,
  OutputTypes,
  type TcpFramingMethod,
  TcpFramingMethods,
} from "../api/outputOptions.js";
import { type TemplateMode, TemplateModes } from "../api/programOptions.js";
import { getExtension } from "./ioUtils.js";

// #region type guards

export function isTemplateMode(value: unknown): value is TemplateMode {
  if (typeof value !== "string") {
    return false;
  }
  const candidates: readonly string[] = TemplateModes;
  return candidates.includes(value);
}

export function isOutputType(value: unknown): value is OutputType {
  if (typeof value !== "string") {
    return false;
  }
  const candidates: readonly string[] = OutputTypes;
  return candidates.includes(value);
}

export function isNetworkOutputType(
  value: unknown,
): value is NetworkOutputType {
  if (typeof value !== "string") {
    return false;
  }
  const candidates: readonly string[] = NetworkOutputTypes;
  return candidates.includes(value);
}

export function isTcpFramingType(value: unknown): value is TcpFramingMethod {
  if (typeof value !== "string") {
    return false;
  }
  const candidates: readonly string[] = TcpFramingMethods;
  return candidates.includes(value);
}

// #endregion

// #region misc

export function determineTemplateModeByFile(filePath: string): TemplateMode {
  return getExtension(filePath) === ".json" ? "json" : "text";
}

// #endregion
