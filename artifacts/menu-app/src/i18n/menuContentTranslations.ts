import type { Language } from "./languages";

type LocalizedContent = { name?: string; description?: string };

// Add verified, human-reviewed menu translations here. Unknown content falls back to API text.
export const menuContentTranslations: {
  dishes: Record<number, Partial<Record<Language, LocalizedContent>>>;
  categories: Record<number, Partial<Record<Language, string>>>;
} = { dishes: {}, categories: {} };
