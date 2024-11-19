import type { DocumentContext } from "../../document/index.js";
import { AbstractJsonable } from "../abstractJsonable.js";
import type { JsonNull } from "../jsonTypes.js";

export class NullJsonable extends AbstractJsonable {
  public readonly type = "null" as const;

  constructor(probability: number | undefined, weight: number | undefined) {
    super(probability, weight);
  }

  protected toJSONImpl(
    keyOrIndex: string | number,
    context: DocumentContext,
  ): JsonNull | undefined {
    return null;
  }
}
