import type { PlaygroundProfile } from "../model/playgroundProfileModel";

export type PlaygroundProgress = {
  completed: number;
  total: number;
};

export const toPlaygroundProfileJson = (profile: PlaygroundProfile): string =>
  JSON.stringify(profile, null, 2);

// Learning note:
// Keep UI progress logic as a pure function so behavior is easy to test/debug.
export const getPlaygroundProgress = (
  profile: PlaygroundProfile,
): PlaygroundProgress => {
  let completed = 0;

  if (profile.title.trim().length > 0) {
    completed += 1;
  }
  if (profile.tags.length > 0) {
    completed += 1;
  }

  return {
    completed,
    total: 2,
  };
};

export const toTagList = (tagInput: string): string[] =>
  tagInput
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

// Learning note:
// toTagList and toTagInput are intentional inverse-like helpers for the form UI.
export const toTagInput = (tags: string[]): string => tags.join(", ");
