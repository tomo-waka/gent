/* eslint-disable */
// Generated from JSON Schema. Do not edit manually.

export type PathToOutputFile = string;
export type SizeToRotateTheFile = string;

export interface RotatingFileOutput {
  type: "file";
  path: PathToOutputFile;
  size?: SizeToRotateTheFile;
}
