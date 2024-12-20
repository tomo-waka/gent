import { type DocumentContext } from "../../document/index.js";
import { AbstractJsonable } from "../abstractJsonable.js";
import type { JsonableValue } from "../jsonableTypes.js";
import type { JsonString } from "../jsonTypes.js";
import { stringifyJsonable } from "../stringifyJsonable.js";

export class JsonStringJsonable extends AbstractJsonable {
  public readonly type = "string" as const;

  constructor(
    private readonly content: JsonableValue,
    probability: number | undefined,
    weight: number | undefined,
  ) {
    super(probability, weight);
  }

  protected toJSONImpl(
    keyOrIndex: string | number,
    context: DocumentContext,
  ): JsonString | undefined {
    const output = stringifyJsonable(this.content, keyOrIndex, context);
    return output;
  }
}
