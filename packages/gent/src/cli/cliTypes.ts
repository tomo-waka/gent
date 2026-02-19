export type Succeeded = 0;
export type Failed = 1;
export type ResultCode = Succeeded | Failed;

/**
 * unknown version of OptionValues defined in Commander
 */
export type OptionValues = Record<string, unknown>;
