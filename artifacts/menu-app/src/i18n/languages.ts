export type Language = "en" | "hi" | "pa" | "gu" | "sd" | "mwr";

export const LANGUAGE_PREFERENCE_KEY = "menu_language_preference";
export const LANGUAGE_PREFERENCE_TTL = 24 * 60 * 60 * 1000;

export const languages: Array<{ code: Language; label: string }> = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "sd", label: "سنڌي" },
  { code: "mwr", label: "मारवाड़ी" },
];

export function getActiveLanguage(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const stored = JSON.parse(window.localStorage.getItem(LANGUAGE_PREFERENCE_KEY) ?? "null");
    if (!stored || !languages.some((language) => language.code === stored.code) || typeof stored.expiresAt !== "number" || stored.expiresAt <= Date.now()) {
      window.localStorage.removeItem(LANGUAGE_PREFERENCE_KEY);
      return "en";
    }
    return stored.code;
  } catch {
    window.localStorage.removeItem(LANGUAGE_PREFERENCE_KEY);
    return "en";
  }
}

export function setLanguage(language: Language): void {
  window.localStorage.setItem(LANGUAGE_PREFERENCE_KEY, JSON.stringify({ code: language, expiresAt: Date.now() + LANGUAGE_PREFERENCE_TTL }));
}

export function clearExpiredLanguage(): void {
  getActiveLanguage();
}
