import { useState, useCallback, useEffect, useRef, memo } from "react";
import { createPortal } from "react-dom";
import { Check, Languages } from "lucide-react";
import { languages } from "@/i18n/languages";
import { useLanguage } from "@/i18n/LanguageContext";

const VIEWPORT_MARGIN = 16;
const DROPDOWN_WIDTH = 208;

export const LanguageSelector = memo(function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: VIEWPORT_MARGIN, top: 0, width: DROPDOWN_WIDTH });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { language, setLanguage, t } = useLanguage();

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const width = Math.min(DROPDOWN_WIDTH, window.innerWidth - VIEWPORT_MARGIN * 2);
    
    // Try right-aligning first (dropdown right edge aligns with button right edge)
    let left = rect.right - width;
    
    // If that would overflow left, switch to left-align (dropdown left edge aligns with button left edge)
    if (left < VIEWPORT_MARGIN) {
      left = rect.left;
    }
    
    // If still overflowing right, clamp to viewport
    if (left + width > window.innerWidth - VIEWPORT_MARGIN) {
      left = window.innerWidth - width - VIEWPORT_MARGIN;
    }
    
    // Final safety: ensure we never go below the left margin
    left = Math.max(VIEWPORT_MARGIN, left);

    setPosition({ left, top: rect.bottom + 8, width });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  const toggleOpen = useCallback(() => {
    setOpen((value) => {
      if (!value) updatePosition();
      return !value;
    });
  }, [updatePosition]);

  const handleSelect = useCallback((code: typeof language) => {
    setLanguage(code);
    setOpen(false);
  }, [setLanguage]);

  const dropdown = open && typeof document !== "undefined" ? createPortal(
    <div
      role="listbox"
      aria-label={t("chooseLanguage")}
      className="fixed z-[100] max-h-[calc(100dvh-2rem)] overflow-x-hidden overflow-y-auto rounded-xl border border-[#d8c7ad] bg-[#fffaf4] py-1 text-[#2b1d17] shadow-xl"
      style={{ left: position.left, top: position.top, width: position.width, maxWidth: `calc(100vw - ${VIEWPORT_MARGIN * 2}px)` }}
    >
      {languages.map((item) => (
        <button
          type="button"
          role="option"
          aria-selected={language === item.code}
          key={item.code}
          onClick={() => handleSelect(item.code)}
          className="flex w-full min-w-0 items-center justify-between gap-3 px-3 py-2 text-left text-sm text-[#2b1d17] hover:bg-[#f5efe6]"
        >
          <span className="min-w-0 break-words">{item.label}</span>
          {language === item.code && <Check className="h-4 w-4 flex-none text-primary" />}
        </button>
      ))}
    </div>,
    document.body,
  ) : null;

  return <div className="relative flex-none">
    <button ref={triggerRef} type="button" onClick={toggleOpen} aria-label={t("chooseLanguage")} aria-haspopup="listbox" aria-expanded={open} data-testid="button-language-selector" className={compact ? "inline-flex h-9 items-center gap-1 rounded-full border border-[#c9a35f] bg-[#fffaf4] px-2 text-[#2b1d17] shadow-sm hover:bg-[#f5efe6]" : "mt-1 flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2"}>
      {compact ? <><Languages className="h-4 w-4" aria-hidden="true" /><span className="text-xs font-semibold">भाषा</span></> : <><span>{t("chooseLanguage")}</span><Languages className="h-4 w-4" /></>}
    </button>
    {dropdown}
  </div>;
});