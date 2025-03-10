import type {
  NetworkOutputTypes,
  NonTransparentFramingMethods,
  OutputTypes,
  TcpFramingMethods,
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
  | TcpOutputOptions
  | TlsOutputOptions;

export type OutputType = (typeof OutputTypes)[number];

export type NetworkOutputType = (typeof NetworkOutputTypes)[number];

interface PrimitiveOutputOptions {
  readonly type: OutputType;
  readonly path?: string | undefined;
}

export interface FileOutputOptions extends PrimitiveOutputOptions {
  readonly type: "file";
  readonly path: string;
  readonly size?: string | undefined;
}

interface NetworkOutputOptions extends PrimitiveOutputOptions {
  readonly type: NetworkOutputType;
  readonly address: string;
  readonly port: number;
  readonly eps: number;
}

export interface UdpOutputOptions extends NetworkOutputOptions {
  readonly type: "udp";
}

export type NonTransparentFramingMethod =
  (typeof NonTransparentFramingMethods)[number];
export type TcpFramingMethod = (typeof TcpFramingMethods)[number];

interface PrimitiveTcpOutputOptions extends NetworkOutputOptions {
  readonly type: "tcp";
  readonly framing: TcpFramingMethod;
}

interface TcpOctetCountingOutputOptions extends PrimitiveTcpOutputOptions {
  readonly framing: "octet-counting";
}

interface TcpNonFramingOutputOptions extends PrimitiveTcpOutputOptions {
  readonly framing: NonTransparentFramingMethod;
  readonly trailerReplacer: string;
}

export type TcpOutputOptions =
  | TcpOctetCountingOutputOptions
  | TcpNonFramingOutputOptions;

interface PrimitiveTlsOutputOptions extends NetworkOutputOptions {
  readonly type: "tls";
  readonly framing: TcpFramingMethod;
}

interface TlsOctetCountingOutputOptions extends PrimitiveTlsOutputOptions {
  readonly framing: "octet-counting";
}

interface TlsNonFramingOutputOptions extends PrimitiveTlsOutputOptions {
  readonly framing: NonTransparentFramingMethod;
  readonly trailerReplacer: string;
}

export type TlsOutputOptions =
  | TlsOctetCountingOutputOptions
  | TlsNonFramingOutputOptions;

// endregion
