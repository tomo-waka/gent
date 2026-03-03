import { generationProfileSchema } from "@gent-js/gent/generated/schema/generatedGenerationProfileSchema";
import type { JsonSchema } from "@jsonforms/core";

export const typedGenerationProfileSchema =
  generationProfileSchema as JsonSchema;
