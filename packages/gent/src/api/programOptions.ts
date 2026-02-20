import type { OutputOptions } from "./outputOptions.js";

export type MetaTemplateJson = {
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

export const TemplateModes = ["text", "json"] as const;

export type TemplateMode = (typeof TemplateModes)[number];

export interface ProgramOptions {
  readonly debug: boolean;
  readonly from: Date;
  readonly to: Date;
  readonly count: number;
  readonly out: OutputOptions;
  readonly templates: readonly TemplateOptions[];
}

export interface TemplateOptions {
  readonly mode: TemplateMode;
  readonly path: string;
  readonly weight: number;
}

export type ShorthandOutputOptions = string;
