import { type CommandManager, parseCommand } from "../command/index.js";
import { buildCommandDocumentFragments } from "../commandDocument/index.js";
import {
  type CommandParsedTemplateFragment,
  parseAndEmbedCommandExpression,
} from "../commandTemplate/index.js";
import { isReadonlyArray } from "../common/utils.js";
import { normalizeWeight } from "../common/weightedItemFeeder.js";
import type {
  DocumentContent,
  DocumentFragment,
  DocumentOptions,
} from "../document/index.js";
import {
  EXPRESSION_BLOCK_END,
  EXPRESSION_BLOCK_START,
  isStringOnlyTemplateFragments,
  parseTemplate,
} from "../template/index.js";
import {
  isNonNullObject,
  parseNonNaNFloat,
  parseNonNaNInteger,
} from "../utils.js";
import { createJsonable } from "./createJsonable.js";
import {
  JsonableContentParameterName,
  JsonableLengthParameterName,
  JsonableProbabilityParameterName,
  JsonableTypeParameterName,
  JsonableWeightParameterName,
  MAX_PROBABILITY,
  MIN_PROBABILITY,
} from "./jsonableParametersConsts.js";
import type {
  ArrayJsonableParameters,
  JsonableValueParameters,
  PrimitiveJsonableParameters,
} from "./jsonableParametersTypes.js";
import type {
  JsonableArray,
  JsonableObject,
  JsonableTransformer,
  JsonableValue,
  MutableJsonableObject,
} from "./jsonableTypes.js";
import type {
  JsonArray,
  JsonObject,
  JsonValue,
  JsonValueType,
  MutableJsonArray,
  MutableJsonObject,
} from "./jsonTypes.js";
import { isJsonValueType } from "./utils.js";

interface CommandDocumentFragmentsBuilder {
  (
    parsedTemplateFragments: readonly CommandParsedTemplateFragment[],
  ): DocumentFragment[];
}

export function createJsonableTransformer(
  commandManager: CommandManager,
  documentOptions: DocumentOptions,
): JsonableTransformer {
  const commandDocumentFragmentsBuilder: CommandDocumentFragmentsBuilder =
    function (
      parsedTemplateFragments: readonly CommandParsedTemplateFragment[],
    ): DocumentFragment[] {
      return buildCommandDocumentFragments(
        parsedTemplateFragments,
        commandManager,
        documentOptions,
      );
    };

  const jsonableTransformer: JsonableTransformer = function (
    value: JsonValue,
  ): JsonableValue | undefined {
    if (value === null) {
      // null
      return value;
    } else if (typeof value === "boolean") {
      // boolean
      return value;
    } else if (typeof value === "number") {
      // number
      return value;
    } else if (typeof value === "string") {
      // string
      const documentContent = parseDocumentContent(
        value,
        commandDocumentFragmentsBuilder,
      );
      if (typeof documentContent === "string") {
        return documentContent;
      } else {
        return createJsonable({
          type: "string",
          subType: "string",
          content: documentContent,
          probability: undefined,
          weight: undefined,
        });
      }
    } else if (isReadonlyArray(value)) {
      // array
      const arrayJsonableParameters = tryParseArrayJsonableParameters(
        value,
        commandDocumentFragmentsBuilder,
        jsonableTransformer,
      );
      if (arrayJsonableParameters !== undefined) {
        return createJsonable(arrayJsonableParameters);
      }
      return transformIntoJsonableArray(value, jsonableTransformer);
    } else {
      // object
      const jsonableValueParameters = tryParseJsonableParameters(
        value,
        commandDocumentFragmentsBuilder,
        jsonableTransformer,
      );
      if (jsonableValueParameters !== undefined) {
        return createJsonable(jsonableValueParameters);
      }
      return transformIntoJsonableObject(value, jsonableTransformer);
    }
  };
  return jsonableTransformer;
}

function transformIntoJsonableArray(
  content: JsonArray,
  jsonableTransformer: JsonableTransformer,
): JsonableValue[] {
  return content
    .map((item) => jsonableTransformer(item))
    .filter<JsonableValue>((jsonableValue) => jsonableValue !== undefined);
}

function transformIntoJsonableObject(
  jsonObject: JsonObject,
  jsonableTransformer: JsonableTransformer,
): JsonableObject {
  let jsonableObject: MutableJsonableObject = {};
  Object.keys(jsonObject).forEach((memberKey) => {
    const memberValue = jsonObject[memberKey];
    if (memberValue === undefined) {
      return;
    }
    const jsonableValue = jsonableTransformer(memberValue);
    if (jsonableValue === undefined) {
      return;
    }
    jsonableObject[memberKey] = jsonableValue;
  });
  return jsonableObject;
}

function tryParseArrayJsonableParameters(
  array: JsonArray,
  commandDocumentFragmentsBuilder: CommandDocumentFragmentsBuilder,
  jsonableTransformer: JsonableTransformer,
): ArrayJsonableParameters | undefined {
  const items: MutableJsonArray = [];
  let lengthContent: DocumentContent | undefined;
  array.forEach((item) => {
    const possibleExpression = tryExtractJsonableParameterExpression(item);

    if (possibleExpression !== undefined) {
      const parsedCommand = parseCommand(possibleExpression);
      if (parsedCommand.name === JsonableLengthParameterName) {
        lengthContent = commandDocumentFragmentsBuilder([parsedCommand]);
        return;
      }
    }

    items.push(item);
  });

  if (lengthContent === undefined) {
    return undefined;
  }

  return {
    type: "array",
    content: transformIntoJsonableArray(items, jsonableTransformer),
    length: lengthContent,
    probability: undefined,
    weight: undefined,
  };
}

function tryParseJsonableParameters(
  jsonObject: JsonObject,
  commandDocumentFragmentsBuilder: CommandDocumentFragmentsBuilder,
  jsonableTransformer: JsonableTransformer,
): JsonableValueParameters | undefined {
  let jsonValueType: JsonValueType | undefined;
  let contentValue: JsonValue | undefined;
  let lengthValue: JsonValue | undefined;
  let probabilityValue: JsonValue | undefined;
  let weightValue: JsonValue | undefined;
  let hasShorthandObjectJsonableTrigger = false;
  const otherMembers: MutableJsonObject = {};
  Object.keys(jsonObject).forEach((memberKey) => {
    const memberValue = jsonObject[memberKey];
    const possibleParameterName =
      tryExtractJsonableParameterExpression(memberKey);
    if (possibleParameterName === JsonableTypeParameterName) {
      // explicitly specified "type"
      if (!isJsonValueType(memberValue)) {
        return;
      }
      jsonValueType = memberValue;
    } else if (possibleParameterName === JsonableContentParameterName) {
      // specify "content" and also implicitly indicate "object" type
      contentValue = memberValue;
      hasShorthandObjectJsonableTrigger = true;
    } else if (possibleParameterName === JsonableProbabilityParameterName) {
      // specify "probability" and also implicitly indicate "object" type
      probabilityValue = memberValue;
      hasShorthandObjectJsonableTrigger = true;
    } else if (possibleParameterName === JsonableLengthParameterName) {
      lengthValue = memberValue;
    } else if (possibleParameterName === JsonableWeightParameterName) {
      // specify "weight" and also implicitly indicate "object" type
      weightValue = memberValue;
      hasShorthandObjectJsonableTrigger = true;
    } else if (memberValue !== undefined) {
      otherMembers[memberKey] = memberValue;
    }
  });

  let actualJsonValueType: JsonValueType;
  if (jsonValueType !== undefined) {
    // explicit type
    actualJsonValueType = jsonValueType;
  } else if (hasShorthandObjectJsonableTrigger) {
    // shorthand object (implicit type)
    actualJsonValueType = "object";
    contentValue = contentValue ?? otherMembers;
  } else {
    // => return undefined
    return undefined;
  }

  if (actualJsonValueType === "object") {
    // ## object case
    let jsonableObject: JsonableObject;
    if (isNonNullObject(contentValue)) {
      jsonableObject = transformIntoJsonableObject(
        contentValue,
        jsonableTransformer,
      );
    } else {
      jsonableObject = {};
    }
    // => return JsonableValueParameters
    return {
      type: "object",
      content: jsonableObject,
      ...createCommonJsonableParameters(probabilityValue, weightValue),
    };
  } else if (actualJsonValueType === "array") {
    // ## array case
    if (typeof lengthValue !== "string") {
      // => return undefined
      return undefined;
    }
    const lengthContent = parseDocumentContent(
      lengthValue,
      commandDocumentFragmentsBuilder,
    );
    let jsonableArray: JsonableArray;
    if (Array.isArray(contentValue)) {
      jsonableArray = transformIntoJsonableArray(
        contentValue,
        jsonableTransformer,
      );
    } else {
      jsonableArray = [];
    }
    // => return JsonableValueParameters
    return {
      type: actualJsonValueType,
      content: jsonableArray,
      length: lengthContent,
      ...createCommonJsonableParameters(probabilityValue, weightValue),
    };
  } else if (actualJsonValueType === "string") {
    // ## string case
    if (typeof contentValue !== "string") {
      if (contentValue === undefined) {
        // => return undefined
        return undefined;
      }
      // string-json
      let jsonableValue: JsonableValue | undefined;
      jsonableValue = jsonableTransformer(contentValue);
      if (jsonableValue === undefined) {
        // => return undefined
        return undefined;
      }
      // string-json
      return {
        type: actualJsonValueType,
        subType: "json",
        content: jsonableValue,
        ...createCommonJsonableParameters(probabilityValue, weightValue),
      };
    }
    // string-string
    const content = parseDocumentContent(
      contentValue,
      commandDocumentFragmentsBuilder,
    );
    // => return JsonableValueParameters
    return {
      type: actualJsonValueType,
      subType: "string",
      content: content,
      ...createCommonJsonableParameters(probabilityValue, weightValue),
    };
  } else if (
    actualJsonValueType === "number" ||
    actualJsonValueType === "boolean"
  ) {
    // ## number | boolean case
    if (typeof contentValue !== "string") {
      // => return undefined
      return undefined;
    }
    const content = parseDocumentContent(
      contentValue,
      commandDocumentFragmentsBuilder,
    );
    // => return JsonableValueParameters
    return {
      type: actualJsonValueType,
      content: content,
      ...createCommonJsonableParameters(probabilityValue, weightValue),
    };
  } else {
    // ## null case

    // => return JsonableValueParameters
    return {
      type: "null",
      ...createCommonJsonableParameters(probabilityValue, weightValue),
    };
  }
}

function parseDocumentContent(
  value: string,
  commandDocumentFragmentsBuilder: CommandDocumentFragmentsBuilder,
): DocumentContent {
  const templateFragments = parseTemplate(value);
  if (isStringOnlyTemplateFragments(templateFragments)) {
    return value;
  } else {
    const documentFragments = commandDocumentFragmentsBuilder(
      parseAndEmbedCommandExpression(templateFragments),
    );
    return documentFragments;
  }
}

function tryExtractJsonableParameterExpression(
  value: unknown,
): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  if (
    !value.startsWith(EXPRESSION_BLOCK_START) ||
    !value.endsWith(EXPRESSION_BLOCK_END)
  ) {
    return undefined;
  }
  return value.substring(
    EXPRESSION_BLOCK_START.length,
    value.length - EXPRESSION_BLOCK_END.length,
  );
}

type OptionalJsonableParameters = Omit<PrimitiveJsonableParameters, "type">;

function createCommonJsonableParameters(
  probabilityValue: JsonValue | undefined,
  weightValue: JsonValue | undefined,
): OptionalJsonableParameters {
  const probability = parseNonNaNFloat(probabilityValue);
  const normalizedProbability =
    probability !== undefined ? normalizeProbability(probability) : undefined;

  const weight = parseNonNaNInteger(weightValue);
  const normalizedWeight =
    weight !== undefined ? normalizeWeight(weight) : undefined;
  return {
    probability: normalizedProbability,
    weight: normalizedWeight,
  };
}

function normalizeProbability(value: number): number {
  return Math.min(Math.max(value, MIN_PROBABILITY), MAX_PROBABILITY);
}
