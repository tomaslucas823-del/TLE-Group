import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { resolveTheme, setTheme, type ThemeMode } from "@/lib/theme";

export function ThemeToggle({ light }: { light?: boolean }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMode(resolveTheme());
    setReady(true);
  }, []);

  function onToggle() {
    const next: ThemeMode = mode === "dark" ? "light" : "dark";
    setTheme(next);
    setMode(next);
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center text-sm transition-opacity hover:opacity-80",
        light ? "text-paper" : "text-ink",
      )}
      aria-label={mode === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      title={mode === "dark" ? "Modo claro" : "Modo escuro"}
    >
      {!ready ? (
        <span className="block h-4 w-4" aria-hidden />
      ) : mode === "dark" ? (
        <SunIcon />
      ) : (
        <MoonIcon />
      )}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 14.3A8.5 8.5 0 0 1 9.7 3a7 7 0 1 0 11.3 11.3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M18.4 5.6l-1.1 1.1M6.7 17.3l-1.1 1.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
