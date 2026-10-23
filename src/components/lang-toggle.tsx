import { cn } from "@/lib/cn";
import { useI18n } from "@/components/i18n-provider";

export function LangToggle({ light }: { light?: boolean }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 text-[12px] tracking-wide",
        light ? "text-paper/70" : "text-mute",
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale("pt")}
        className={cn(
          "px-1.5 py-1 transition-colors",
          locale === "pt"
            ? light
              ? "text-paper"
              : "text-ink"
            : light
              ? "hover:text-paper"
              : "hover:text-ink",
        )}
        aria-pressed={locale === "pt"}
        aria-label={t.a11y.langToPt}
      >
        PT
      </button>
      <span aria-hidden className="opacity-40">
        /
      </span>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={cn(
          "px-1.5 py-1 transition-colors",
          locale === "en"
            ? light
              ? "text-paper"
              : "text-ink"
            : light
              ? "hover:text-paper"
              : "hover:text-ink",
        )}
        aria-pressed={locale === "en"}
        aria-label={t.a11y.langToEn}
      >
        EN
      </button>
    </div>
  );
}
