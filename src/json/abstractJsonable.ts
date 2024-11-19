import { faker } from "@faker-js/faker";
import type { DocumentContext } from "../document/index.js";
import {
  MAX_PROBABILITY,
  MIN_PROBABILITY,
} from "./jsonableParametersConsts.js";
import type { JsonValueType } from "./jsonableTypes.js";
import type { JsonValue } from "./jsonTypes.js";

export abstract class AbstractJsonable {
  public abstract readonly type: JsonValueType;

  protected constructor(
    public readonly probability: number | undefined,
    public readonly weight: number | undefined,
  ) {}

  protected testProbability(
    keyOrIndex: string | number,
    context: DocumentContext,
  ): boolean {
    if (this.probability === undefined) {
      return true;
    }
    if (this.probability <= MIN_PROBABILITY) {
      return false;
    }
    if (this.probability >= MAX_PROBABILITY) {
      return true;
    }
    const diceValue = faker.number.float({
      min: MIN_PROBABILITY,
      max: MAX_PROBABILITY,
    });
    return diceValue < this.probability;
  }

  protected abstract toJSONImpl(
    keyOrIndex: string | number,
    context: DocumentContext,
  ): JsonValue | undefined;

  public toJSON(
    keyOrIndex: string | number,
    context: DocumentContext,
  ): JsonValue | undefined {
    if (!this.testProbability(keyOrIndex, context)) {
      return undefined;
    }
    return this.toJSONImpl(keyOrIndex, context);
  }
}
