import { useState, useCallback, memo } from "react";
import { Check, Languages } from "lucide-react";
import { languages } from "@/i18n/languages";
import { useLanguage } from "@/i18n/LanguageContext";

export const LanguageSelector = memo(function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  
  const toggleOpen = useCallback(() => setOpen((value) => !value), []);
  const handleSelect = useCallback((code: typeof language) => {
    setLanguage(code);
    setOpen(false);
  }, [setLanguage]);
  
  return <div className="relative">
    <button type="button" onClick={toggleOpen} aria-haspopup="listbox" aria-expanded={open} className={compact ? "rounded-full p-2 hover:bg-muted" : "mt-1 flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2"}>
      {compact ? <Languages className="h-5 w-5" aria-label={t("chooseLanguage")} /> : <><span>{t("chooseLanguage")}</span><Languages className="h-4 w-4" /></>}
    </button>
    {open && <div role="listbox" aria-label={t("chooseLanguage")} className="absolute right-0 z-[70] mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-xl">
      {languages.map((item) => <button type="button" role="option" aria-selected={language === item.code} key={item.code} onClick={() => handleSelect(item.code)} className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted">
        {item.label}{language === item.code && <Check className="h-4 w-4 text-primary" />}
      </button>)}
    </div>}
  </div>;
});
