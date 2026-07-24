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
  
  return <div className="relative flex-none">
    <button type="button" onClick={toggleOpen} aria-label={t("chooseLanguage")} aria-haspopup="listbox" aria-expanded={open} data-testid="button-language-selector" className={compact ? "inline-flex h-9 items-center gap-1 rounded-full border border-border bg-card px-2 text-foreground shadow-sm hover:bg-muted" : "mt-1 flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2"}>
      {compact ? <><Languages className="h-4 w-4" aria-hidden="true" /><span className="text-xs font-semibold">भाषा</span></> : <><span>{t("chooseLanguage")}</span><Languages className="h-4 w-4" /></>}
    </button>
    {open && <div role="listbox" aria-label={t("chooseLanguage")} className="absolute right-0 z-[70] mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-xl">
      {languages.map((item) => <button type="button" role="option" aria-selected={language === item.code} key={item.code} onClick={() => handleSelect(item.code)} className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted">
        {item.label}{language === item.code && <Check className="h-4 w-4 text-primary" />}
      </button>)}
    </div>}
  </div>;
});
