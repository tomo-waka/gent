import { initialGenerationProfile } from "../../../core/profile/initialGenerationProfile";

export type GenerationProfile = Record<string, unknown>;

export const createInitialGenerationProfile = (): GenerationProfile =>
  structuredClone(initialGenerationProfile) as GenerationProfile;
