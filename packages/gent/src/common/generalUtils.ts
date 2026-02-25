// #region type guards

export function isString(value: unknown) {
  return typeof value === "string";
}

export function isNonNullObject(
  value: unknown,
): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return true;
}

/**
 * ReadonlyArray のためのタイプガード
 * https://github.com/microsoft/TypeScript/issues/17002
 */
export function isReadonlyArray<T extends ReadonlyArray<unknown>>(
  value: T | unknown,
): value is T {
  return Array.isArray(value);
}

// #endregion

// #region parsers

export function parseString(value: unknown): string | undefined {
  if (!isString(value)) {
    return undefined;
  }
  return value;
}

export function parseNonNaNInteger(value: unknown): number | undefined {
  if (Number.isInteger(value)) {
    return value as number;
  }
  if (typeof value !== "string") {
    return undefined;
  }
  const numValue = Number.parseInt(value);
  if (Number.isNaN(numValue)) {
    return undefined;
  }
  return numValue;
}

export function parseNonNaNFloat(value: unknown): number | undefined {
  if (typeof value === "number") {
    if (Number.isNaN(value)) {
      return undefined;
    }
    return value;
  }
  if (typeof value !== "string") {
    return undefined;
  }
  const numValue = Number.parseFloat(value);
  if (Number.isNaN(numValue)) {
    return undefined;
  }
  return numValue;
}

export function parseDate(value: unknown): Date | undefined {
  if (!isString(value)) {
    return undefined;
  }
  const dateNumber = Date.parse(value);
  if (Number.isNaN(dateNumber)) {
    return undefined;
  }
  return new Date(dateNumber);
}

// #endregion

// #region misc

export function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${x}`);
}
export function pickMany<T>(input: T | T[] | undefined): T[] {
  if (input === undefined) {
    return [];
  } else if (Array.isArray(input)) {
    return input;
  } else {
    return [input];
  }
}

export function pickFirst<T>(input: T | T[] | undefined): T | undefined {
  if (input === undefined) {
    return undefined;
  } else if (Array.isArray(input)) {
    return input[0];
  } else {
    return input;
  }
}

// #endregion
