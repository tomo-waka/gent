import {
  type DocumentContent,
  type DocumentContext,
  stampDocument,
} from "../../document/index.js";
import { AbstractJsonable } from "../abstractJsonable.js";
import type { JsonNumber } from "../jsonTypes.js";

export class NumberJsonable extends AbstractJsonable {
  public readonly type = "number" as const;

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
  ): JsonNumber | undefined {
    const output = Number(stampDocument(this.content, context));
    if (Number.isNaN(output)) {
      return undefined;
    }
    return output;
  }
}
