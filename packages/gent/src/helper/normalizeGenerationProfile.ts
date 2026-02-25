import {
  ProgramOptions,
  type TemplateMode,
  type TemplateOptions,
} from "../api/programOptions.js";
import {
  assertNever,
  isNonNullObject,
  parseDate,
  parseNonNaNFloat,
  parseNonNaNInteger,
  parseString,
} from "../common/generalUtils.js";
import { normalizeWeight } from "../common/weightedItemFeeder.js";
import {
  DEFAULT_TEMPLATE_WEIGHT,
  DefaultEps,
  DefaultTcpFramingMethod,
  DefaultTrailerReplacer,
} from "../common/consts.js";
import {
  isTemplateMode,
  determineTemplateModeByFile,
  isNetworkOutputType,
  isOutputType,
  isTcpFramingType,
} from "../common/commonUtils.js";
import { parseAndResolveFilePath } from "../common/ioUtils.js";
import { GenerationProfileJson } from "./validateGenerationProfileJson.js";
import { OutputOptions } from "../api/outputOptions.js";

export function normalizeGenerationProfile(
  generationProfile: GenerationProfileJson,
  basePath: string,
): ProgramOptions | undefined {
  let from = parseDate(generationProfile.from);
  let to = parseDate(generationProfile.to);
  if (from === undefined || to === undefined) {
    const now = Date.now();
    from = new Date(now - 1000 * 60 * 60 * 24);
    to = new Date(now);
  }

  let count = parseNonNaNInteger(generationProfile.count);
  if (count === undefined) {
    count = 0;
  }

  let out = normalizeOutputOptions(generationProfile.out, basePath);
  if (out === undefined) {
    console.error(`Invalid out option. (${out})`);
    return undefined;
  }

  const debug = generationProfile.debug === true;

  const templateOptionsArray =
    generationProfile.templates.flatMap<TemplateOptions>(
      (possibleTemplateOptions) => {
        const possiblePath = possibleTemplateOptions.path;
        const path = parseString(possiblePath);
        if (path === undefined) {
          console.error(`invalid file path.(${possiblePath})`);
          return [];
        }
        const resolvedFilePath = parseAndResolveFilePath(path, basePath);
        if (resolvedFilePath === undefined) {
          console.error(`failed to resolve the file path.(${path})`);
          return [];
        }

        const possibleMode = possibleTemplateOptions.mode;
        let mode: TemplateMode;
        if (isTemplateMode(possibleMode)) {
          mode = possibleMode;
        } else {
          mode = determineTemplateModeByFile(resolvedFilePath);
        }

        const weight =
          parseNonNaNFloat(possibleTemplateOptions["weight"]) ??
          DEFAULT_TEMPLATE_WEIGHT;
        const normalizedWeight = normalizeWeight(weight);
        return {
          mode: mode,
          path: resolvedFilePath,
          weight: normalizedWeight,
        };
      },
    );
  if (templateOptionsArray.length === 0) {
    console.error("no effective template specified.");
    return undefined;
  }

  return {
    debug,
    from,
    to,
    count,
    out,
    templates: templateOptionsArray,
  };
}

export function normalizeOutputOptions(
  possibleOutputOptions: unknown,
  basePath: string,
): OutputOptions | undefined {
  if (typeof possibleOutputOptions === "string") {
    // shorthand
    return {
      type: "file",
      path: possibleOutputOptions,
    };
  }

  if (!isNonNullObject(possibleOutputOptions)) {
    return undefined;
  }

  const possibleType = parseString(possibleOutputOptions["type"]);
  if (!isOutputType(possibleType)) {
    console.error(`invalid output type.(${possibleType})`);
    return undefined;
  }
  const possiblePath = parseAndResolveFilePath(
    possibleOutputOptions["path"],
    basePath,
  );

  if (possibleType == "file") {
    if (possiblePath === undefined) {
      console.error(`output path must be specified.(${possiblePath})`);
      return undefined;
    }
    const possibleSize = parseString(possibleOutputOptions["size"]);
    return {
      type: possibleType,
      path: possiblePath,
      size: possibleSize,
    };
  } else if (isNetworkOutputType(possibleType)) {
    const possibleAddress = parseString(possibleOutputOptions["address"]);
    const possiblePort = parseNonNaNInteger(possibleOutputOptions["port"]);
    const possibleEps =
      parseNonNaNInteger(possibleOutputOptions["eps"]) ?? DefaultEps;
    if (possibleAddress === undefined || possiblePort === undefined) {
      console.error("invalid udp output options");
      return undefined;
    }
    if (possibleType === "udp") {
      return {
        type: possibleType,
        path: possiblePath,
        address: possibleAddress,
        port: possiblePort,
        eps: possibleEps,
      };
    } else if (possibleType === "tcp" || possibleType === "tls") {
      const possibleFraming =
        parseString(possibleOutputOptions["framing"]) ??
        DefaultTcpFramingMethod;
      if (!isTcpFramingType(possibleFraming)) {
        console.error(`invalid framing type.(${possibleFraming})`);
        return undefined;
      }
      if (possibleFraming === "octet-counting") {
        return {
          type: possibleType,
          path: possiblePath,
          address: possibleAddress,
          port: possiblePort,
          eps: possibleEps,
          framing: possibleFraming,
        };
      } else if (possibleFraming === "lf") {
        const possibleTrailerReplacer =
          parseString(possibleOutputOptions["trailerReplacer"]) ??
          DefaultTrailerReplacer;
        return {
          type: possibleType,
          path: possiblePath,
          address: possibleAddress,
          port: possiblePort,
          eps: possibleEps,
          framing: possibleFraming,
          trailerReplacer: possibleTrailerReplacer,
        };
      } else {
        assertNever(possibleFraming);
      }
    } else {
      assertNever(possibleType);
    }
  } else {
    return assertNever(possibleType);
  }
}
