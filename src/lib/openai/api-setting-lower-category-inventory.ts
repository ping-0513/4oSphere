import { API_SETTING_INVENTORY_10_14_SEEDS } from "@/lib/openai/api-setting-inventory-10-14";
import { API_SETTING_INVENTORY_15_18_SEEDS } from "@/lib/openai/api-setting-inventory-15-18";
import { API_SETTING_INVENTORY_19_24_SEEDS } from "@/lib/openai/api-setting-inventory-19-24";
import { CHAT_COMPLETIONS_INVENTORY_SEEDS } from "@/lib/openai/api-setting-inventory-chat-completions";

export type { LowerCategoryInventorySeed } from "@/lib/openai/api-setting-inventory-shared";

export const LOWER_CATEGORY_INVENTORY_SEEDS = [
  ...CHAT_COMPLETIONS_INVENTORY_SEEDS,
  ...API_SETTING_INVENTORY_10_14_SEEDS,
  ...API_SETTING_INVENTORY_15_18_SEEDS,
  ...API_SETTING_INVENTORY_19_24_SEEDS,
];
