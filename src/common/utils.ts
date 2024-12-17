/**
 * ReadonlyArray のためのタイプガード
 * https://github.com/microsoft/TypeScript/issues/17002
 */
export function isReadonlyArray<T extends ReadonlyArray<unknown>>(
  value: T | unknown,
): value is T {
  return Array.isArray(value);
}
