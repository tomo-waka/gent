import { ProgramOptions } from "./programOptions.js";

export interface Run {
  (programOptions: ProgramOptions): Promise<void>;
}
