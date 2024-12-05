export interface SharedDocumentOptions {
  readonly from: Date;
  readonly to: Date;
  readonly total: number;
}

export interface DocumentOptions {
  readonly shared: SharedDocumentOptions;
  readonly path: string;
}

export interface DocumentContext {
  readonly index: number;
}

export interface ContextualStringOut {
  (context: DocumentContext): string;
}

export interface ContextualDocumentFragment {
  toString(context: DocumentContext): string;
}

export type DocumentFragment = string | ContextualDocumentFragment;

export type DocumentContent = readonly DocumentFragment[] | string;
