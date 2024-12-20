import { type DocumentContext } from "../../document/index.js";
import { AbstractJsonable } from "../abstractJsonable.js";
import type { JsonableObject } from "../jsonableTypes.js";
import type { JsonObject } from "../jsonTypes.js";
import { transformJsonableObjectIntoJsonObject } from "../stringifyJsonable.js";

export class ObjectJsonable extends AbstractJsonable {
  public readonly type = "object" as const;

  constructor(
    private readonly content: JsonableObject,
    probability: number | undefined,
    weight: number | undefined,
  ) {
    super(probability, weight);
  }

  protected toJSONImpl(
    keyOrIndex: string | number,
    context: DocumentContext,
  ): JsonObject | undefined {
    return transformJsonableObjectIntoJsonObject(
      this.content,
      keyOrIndex,
      context,
    );
  }
}
