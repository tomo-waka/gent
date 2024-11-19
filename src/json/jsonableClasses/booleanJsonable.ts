import {
  type DocumentContent,
  type DocumentContext,
  stampDocumentContent,
} from "../../document/index.js";
import { AbstractJsonable } from "../abstractJsonable.js";

export class BooleanJsonable extends AbstractJsonable {
  public readonly type = "boolean" as const;

  constructor(
    private readonly content: DocumentContent,
    probability: number | undefined,
    weight: number | undefined,
  ) {
    super(probability, weight);
  }

  protected toJSONImpl(
    keyOrIndex: string | number,
    context: DocumentContext,
  ): string | undefined {
    const output = Boolean(stampDocumentContent(this.content, context));
    return output ? "true" : "false";
  }
}
