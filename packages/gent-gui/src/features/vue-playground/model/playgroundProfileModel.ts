export type PlaygroundTone = "formal" | "casual";

export type PlaygroundProfile = {
  title: string;
  tone: PlaygroundTone;
  includeTimestamp: boolean;
  tags: string[];
};

// Learning note:
// Model factory centralizes default values so UI components do not duplicate them.
export const createInitialPlaygroundProfile = (): PlaygroundProfile => ({
  title: "",
  tone: "formal",
  includeTimestamp: false,
  tags: [],
});
