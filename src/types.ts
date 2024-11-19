import type { OutputTypes, TemplateModes } from "./consts.js";

// region common

export interface TypeTaggedStructure {
  readonly type: string;
}

// endregion

// region program

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

export type OutputOptions = FileOutputOptions;

export type OutputType = (typeof OutputTypes)[number];

interface PrimitiveOutputOptions {
  readonly type: OutputType;
}

export interface FileOutputOptions extends PrimitiveOutputOptions {
  readonly type: "file";
  readonly path: string;
  readonly size?: string;
}

// endregion
