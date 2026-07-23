import { createContext, useCallback, useContext, useMemo, useState, memo } from "react";
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
  const t = useCallback((key: TranslationKey) => translations[language][key], [language]);
  const translateDish = useCallback(<T extends { id: number; name: string; description?: string | null }>(dish: T): T => {
    if (language === "en") return dish;
    const translation = menuContentTranslations.dishes[dish.id]?.[language];
    if (!translation) return dish;
    return { ...dish, ...translation };
  }, [language]);
  const translateCategory = useCallback(<T extends { id: number; name: string }>(category: T): T => {
    if (language === "en") return category;
    const translation = menuContentTranslations.categories[category.id]?.[language];
    return translation ? { ...category, name: translation } : category;
  }, [language]);
  const value = useMemo<LanguageContextValue>(() => ({
    language, setLanguage, t, translateDish, translateCategory
  }), [language, setLanguage, t, translateDish, translateCategory]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
