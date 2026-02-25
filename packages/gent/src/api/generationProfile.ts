import type { OutputOptions } from "./outputOptions.js";
import { ShorthandOutputOptions, TemplateMode } from "./programOptions.js";

export type GenerationProfile = {
  readonly debug?: boolean;
  readonly from?: string;
  readonly to?: string;
  readonly count?: number;
  readonly out: OutputOptions | ShorthandOutputOptions;
  readonly templates: readonly {
    readonly mode?: TemplateMode;
    readonly path: string;
    readonly weight?: number;
  }[];
};
