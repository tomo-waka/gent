import { z } from "zod";

const dateTimeSchema = z
  .string()
  .refine(isDateTimeString, "Invalid date-time format");

const numberLikeRegex = /^-?(?:\d+|\d+\.\d+|\.\d+)$/;

const numberLikeSchema = z.union([
  z.number(),
  z.string().regex(numberLikeRegex),
]);

const templateModeSchema = z.enum(["text", "json"]);

const templateOptionsSchema = z
  .object({
    mode: templateModeSchema.optional(),
    path: z.string().min(1),
    weight: numberLikeSchema.optional(),
  })
  .strict();

const fileOutputOptionsSchema = z
  .object({
    type: z.literal("file"),
    path: z.string().min(1),
    size: z.string().optional(),
  })
  .strict();

const udpOutputOptionsSchema = z
  .object({
    type: z.literal("udp"),
    path: z.string().min(1).optional(),
    address: z.string().min(1),
    port: numberLikeSchema,
    eps: numberLikeSchema.optional(),
  })
  .strict();

const tcpOutputOptionsSchema = z.union([
  z
    .object({
      type: z.literal("tcp"),
      path: z.string().min(1).optional(),
      address: z.string().min(1),
      port: numberLikeSchema,
      eps: numberLikeSchema.optional(),
      framing: z.literal("octet-counting").optional(),
    })
    .strict(),
  z
    .object({
      type: z.literal("tcp"),
      path: z.string().min(1).optional(),
      address: z.string().min(1),
      port: numberLikeSchema,
      eps: numberLikeSchema.optional(),
      framing: z.literal("lf"),
      trailerReplacer: z.string().optional(),
    })
    .strict(),
]);

const tlsOutputOptionsSchema = z.union([
  z
    .object({
      type: z.literal("tls"),
      path: z.string().min(1).optional(),
      address: z.string().min(1),
      port: numberLikeSchema,
      eps: numberLikeSchema.optional(),
      framing: z.literal("octet-counting").optional(),
    })
    .strict(),
  z
    .object({
      type: z.literal("tls"),
      path: z.string().min(1).optional(),
      address: z.string().min(1),
      port: numberLikeSchema,
      eps: numberLikeSchema.optional(),
      framing: z.literal("lf"),
      trailerReplacer: z.string().optional(),
    })
    .strict(),
]);

const outputOptionsSchema = z.union([
  z.string().min(1),
  fileOutputOptionsSchema,
  udpOutputOptionsSchema,
  tcpOutputOptionsSchema,
  tlsOutputOptionsSchema,
]);

function isDateTimeString(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

export const generationProfileJsonSchema = z
  .object({
    $schema: z.string().min(1).optional(),
    debug: z.boolean().optional(),
    from: dateTimeSchema.optional(),
    to: dateTimeSchema.optional(),
    count: numberLikeSchema.optional(),
    out: outputOptionsSchema,
    templates: z.array(templateOptionsSchema).min(1),
  })
  .strict();

export type GenerationProfileJson = z.output<
  typeof generationProfileJsonSchema
>;

export type GenerationProfileValidationResult =
  | {
      success: true;
      value: GenerationProfileJson;
    }
  | {
      success: false;
      errors: string[];
    };

export function validateGenerationProfileJson(
  input: unknown,
): GenerationProfileValidationResult {
  const parsed = generationProfileJsonSchema.safeParse(input);
  if (parsed.success) {
    return {
      success: true,
      value: parsed.data,
    };
  }

  return {
    success: false,
    errors: parsed.error.issues.map((issue) => {
      const issuePath =
        issue.path.length === 0 ? "(root)" : issue.path.join(".");
      return `${issuePath}: ${issue.message}`;
    }),
  };
}
