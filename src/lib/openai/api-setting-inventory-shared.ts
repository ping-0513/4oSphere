export type LowerCategoryInventorySeed = {
  categoryId: string;
  id: string;
  japaneseName: string;
  officialName: string;
  shortDescription: string;
  status:
    | "admin"
    | "legacy"
    | "needs-confirmation"
    | "placeholder"
    | "unsupported";
  uiPlacement: string;
};

export const inventory = (
  categoryId: string,
  uiPlacement: string,
  status: LowerCategoryInventorySeed["status"],
  items: readonly (readonly [string, string, string, string])[],
) =>
  items.map(([id, officialName, japaneseName, shortDescription]) => ({
    categoryId,
    id: `${categoryId}-${id}`,
    japaneseName,
    officialName,
    shortDescription,
    status,
    uiPlacement,
  }));
