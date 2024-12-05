import type {
  NetworkOutputTypes,
  NonTransparentFramingTypes,
  OutputTypes,
  TcpFramingTypes,
  TemplateModes,
} from "./consts.js";

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

export type OutputOptions =
  | FileOutputOptions
  | UdpOutputOptions
  | TcpOutputOptions;

export type OutputType = (typeof OutputTypes)[number];

export type NetworkOutputType = (typeof NetworkOutputTypes)[number];

interface PrimitiveOutputOptions {
  readonly type: OutputType;
  readonly path: string;
}

export interface FileOutputOptions extends PrimitiveOutputOptions {
  readonly type: "file";
  readonly size?: string;
}

interface NetworkOutputOptions extends PrimitiveOutputOptions {
  readonly type: NetworkOutputType;
  readonly address: string;
  readonly port: number;
}

export interface UdpOutputOptions extends NetworkOutputOptions {
  readonly type: "udp";
}

export type NonTransparentFramingType =
  (typeof NonTransparentFramingTypes)[number];
export type TcpFramingType = (typeof TcpFramingTypes)[number];

interface PrimitiveTcpOutputOptions extends NetworkOutputOptions {
  readonly type: "tcp";
  readonly framing: TcpFramingType;
}

interface TcpOctetCountingOutputOptions extends PrimitiveTcpOutputOptions {
  readonly type: "tcp";
  readonly framing: "octet-counting";
}

interface TcpNonFramingOutputOptions extends PrimitiveTcpOutputOptions {
  readonly type: "tcp";
  readonly framing: NonTransparentFramingType;
  readonly trailerReplacer: string;
}

export type TcpOutputOptions =
  | TcpOctetCountingOutputOptions
  | TcpNonFramingOutputOptions;

// endregion
