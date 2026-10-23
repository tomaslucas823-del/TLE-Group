import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
import {
  applyLocale,
  messages,
  resolveLocale,
  setLocale as persistLocale,
  type Locale,
  type Messages,
} from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  t: Messages;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");

  useEffect(() => {
    const next = resolveLocale();
    setLocaleState(next);
    applyLocale(next);
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    function setLocale(next: Locale) {
      persistLocale(next);
      setLocaleState(next);
    }
    function toggleLocale() {
      setLocale(locale === "pt" ? "en" : "pt");
    }
    return {
      locale,
      t: messages[locale] as Messages,
      setLocale,
      toggleLocale,
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
