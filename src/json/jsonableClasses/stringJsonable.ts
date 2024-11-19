import {
  type DocumentContent,
  type DocumentContext,
  stampDocumentContent,
} from "../../document/index.js";
import { AbstractJsonable } from "../abstractJsonable.js";
import type { JsonString } from "../jsonTypes.js";

export class StringJsonable extends AbstractJsonable {
  public readonly type = "string" as const;

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
  ): JsonString | undefined {
    const output = stampDocumentContent(this.content, context);
    return output;
  }
}
