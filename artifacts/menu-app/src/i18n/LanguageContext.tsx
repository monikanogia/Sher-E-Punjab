import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { getActiveLanguage, setLanguage as persistLanguage, type Language } from "./languages";
import { translations, type TranslationKey } from "./translations";
import { menuContentTranslations } from "./menuContentTranslations";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
  translateDish: <T extends { id: number; name: string; description?: string | null }>(dish: T) => T;
  translateCategory: <T extends { id: number; name: string }>(category: T) => T;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setCurrentLanguage] = useState<Language>(() => getActiveLanguage());
  const setLanguage = useCallback((nextLanguage: Language) => { persistLanguage(nextLanguage); setCurrentLanguage(nextLanguage); }, []);
  const value = useMemo<LanguageContextValue>(() => ({
    language, setLanguage,
    t: (key) => translations[language][key],
    translateDish: (dish) => ({ ...dish, ...menuContentTranslations.dishes[dish.id]?.[language] }),
    translateCategory: (category) => ({ ...category, name: menuContentTranslations.categories[category.id]?.[language] ?? category.name }),
  }), [language, setLanguage]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
