export type OutputOptions =
  | FileOutputOptions
  | UdpOutputOptions
  | TcpOutputOptions
  | TlsOutputOptions;

export const NetworkOutputTypes = ["udp", "tcp", "tls"] as const;

export type NetworkOutputType = (typeof NetworkOutputTypes)[number];

export const OutputTypes = ["file", ...NetworkOutputTypes] as const;

export type OutputType = (typeof OutputTypes)[number];

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

export const OctetCounting = "octet-counting" as const;
export const NonTransparentFramingMethods = ["lf"] as const;
export const TcpFramingMethods = [
  OctetCounting,
  ...NonTransparentFramingMethods,
] as const;

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
