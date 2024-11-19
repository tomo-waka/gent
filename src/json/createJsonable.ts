import { assertNever } from "../utils.js";
import { AbstractJsonable } from "./abstractJsonable.js";
import { ArrayJsonable } from "./jsonableClasses/arrayJsonable.js";
import { BooleanJsonable } from "./jsonableClasses/booleanJsonable.js";
import type { JsonableValueParameters } from "./jsonableParametersTypes.js";
import { NullJsonable } from "./jsonableClasses/nullJsonable.js";
import { NumberJsonable } from "./jsonableClasses/numberJsonable.js";
import { ObjectJsonable } from "./jsonableClasses/objectJsonable.js";
import { StringJsonable } from "./jsonableClasses/stringJsonable.js";

export function createJsonable(
  parameters: JsonableValueParameters,
): AbstractJsonable | undefined {
  if (parameters.type === "object") {
    return new ObjectJsonable(
      parameters.content,
      parameters.probability,
      parameters.weight,
    );
  } else if (parameters.type === "array") {
    return new ArrayJsonable(
      parameters.content,
      parameters.length,
      parameters.probability,
      parameters.weight,
    );
  } else if (parameters.type === "string") {
    return new StringJsonable(
      parameters.content,
      parameters.probability,
      parameters.weight,
    );
  } else if (parameters.type === "number") {
    return new NumberJsonable(
      parameters.content,
      parameters.probability,
      parameters.weight,
    );
  } else if (parameters.type === "boolean") {
    return new BooleanJsonable(
      parameters.content,
      parameters.probability,
      parameters.weight,
    );
  } else if (parameters.type === "null") {
    return new NullJsonable(parameters.probability, parameters.weight);
  } else {
    return assertNever(parameters);
  }
}
