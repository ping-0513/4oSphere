import type { Gpt4oApiModelId, Gpt4oSnapshotLabel } from "@/types/chat";

export const GPT_4O_MODEL_OPTIONS = [
  {
    label: "4o-0513",
    apiModelId: "gpt-4o-2024-05-13",
  },
  {
    label: "4o-0806",
    apiModelId: "gpt-4o-2024-08-06",
  },
  {
    label: "4o-1120",
    apiModelId: "gpt-4o-2024-11-20",
  },
] as const satisfies readonly {
  label: Gpt4oSnapshotLabel;
  apiModelId: Gpt4oApiModelId;
}[];

export const DEFAULT_GPT_4O_SNAPSHOT: Gpt4oSnapshotLabel = "4o-1120";

export function isGpt4oSnapshotLabel(
  value: string,
): value is Gpt4oSnapshotLabel {
  return GPT_4O_MODEL_OPTIONS.some((option) => option.label === value);
}

export function getGpt4oApiModelId(
  snapshot: Gpt4oSnapshotLabel,
): Gpt4oApiModelId {
  const option = GPT_4O_MODEL_OPTIONS.find(
    (candidate) => candidate.label === snapshot,
  );

  if (!option) {
    throw new Error("Unsupported GPT-4o snapshot.");
  }

  return option.apiModelId;
}
