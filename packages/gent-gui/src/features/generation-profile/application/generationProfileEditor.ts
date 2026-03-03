import type { ErrorObject } from "ajv";
import type { GenerationProfile } from "../model/generationProfileModel";

export type GenerationProfileEditorState = {
  profile: GenerationProfile;
  errors: ErrorObject[];
};

export const createGenerationProfileEditorState = (
  profile: GenerationProfile,
): GenerationProfileEditorState => ({
  profile,
  errors: [],
});

export const applyGenerationProfileFormChange = (
  nextProfile: unknown,
  nextErrors: ErrorObject[] | undefined,
): GenerationProfileEditorState => ({
  profile: (nextProfile ?? {}) as GenerationProfile,
  errors: nextErrors ?? [],
});

export const isGenerationProfileValid = (errors: ErrorObject[]): boolean =>
  errors.length === 0;

export const toGenerationProfileJson = (profile: GenerationProfile): string =>
  JSON.stringify(profile, null, 2);

export const getGenerationProfileIssueCountLabel = (
  errors: ErrorObject[],
): string => `${errors.length} issue(s)`;
