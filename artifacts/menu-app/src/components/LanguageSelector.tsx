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
    <button type="button" onClick={toggleOpen} aria-label={t("chooseLanguage")} aria-haspopup="listbox" aria-expanded={open} data-testid="button-language-selector" className={compact ? "inline-flex h-9 items-center gap-1 rounded-full border border-[#c9a35f] bg-[#fffaf4] px-2 text-[#2b1d17] shadow-sm hover:bg-[#f5efe6]" : "mt-1 flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2"}>
      {compact ? <><Languages className="h-4 w-4" aria-hidden="true" /><span className="text-xs font-semibold">भाषा</span></> : <><span>{t("chooseLanguage")}</span><Languages className="h-4 w-4" /></>}
    </button>
    {open && <div role="listbox" aria-label={t("chooseLanguage")} className="fixed inset-x-4 z-[70] mt-2 max-h-[min(24rem,calc(100dvh-2rem))] overflow-y-auto rounded-xl border border-[#d8c7ad] bg-[#fffaf4] py-1 text-[#2b1d17] shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:w-52">
      {languages.map((item) => <button type="button" role="option" aria-selected={language === item.code} key={item.code} onClick={() => handleSelect(item.code)} className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-[#2b1d17] hover:bg-[#f5efe6]">
        {item.label}{language === item.code && <Check className="h-4 w-4 text-primary" />}
      </button>)}
    </div>}
  </div>;
});
