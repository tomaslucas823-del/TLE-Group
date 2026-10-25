import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { LangToggle } from "@/components/lang-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { site, waHref } from "@/lib/site";

function AuthSlot({ light }: { light: boolean }) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const { user, isPending } = useCurrentUserState();
  useEffect(() => setMounted(true), []);
  if (!mounted || isPending) return <span className="inline-block h-4 w-10" aria-hidden />;
  if (!user) {
    return (
      <Link to="/login" className={cn("text-[13px] transition-opacity hover:opacity-70", light ? "text-paper" : "text-ink")}>
        {t.nav.login}
      </Link>
    );
  }
  return <UserButton />;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function SiteHeader() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const NAV = [
    { id: "projects", label: t.nav.projects, href: "/portfolio" },
    { id: "services", label: t.nav.services, href: "/#servicos" },
    { id: "contact", label: t.quote.kicker, href: "/#contacto" },
  ];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onHome = pathname === "/" || pathname === "";
  const light = onHome && !scrolled && !open;

  return (
    <header
      className={cn(
        "no-print fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        light ? "bg-transparent text-paper" : "border-b border-line bg-paper/95 text-ink backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between gap-4 px-5 md:h-11">
        <Link to="/" className="text-[15px] font-semibold tracking-[0.04em]" onClick={() => setOpen(false)}>
          TLE Group
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) =>
            item.href.startsWith("/#") ? (
              <a
                key={item.id}
                href={item.href}
                className="text-[13px] transition-opacity hover:opacity-70"
                onClick={(event) => {
                  if (onHome) {
                    event.preventDefault();
                    scrollToId(item.href.slice(2));
                  }
                }}
              >
                {item.label}
              </a>
            ) : (
              <Link key={item.id} to={item.href} className="text-[13px] transition-opacity hover:opacity-70">
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LangToggle />
          <ThemeToggle />
          <AuthSlot light={light} />
        </div>

        <button
          type="button"
          className="text-[13px] md:hidden"
          aria-expanded={open}
          aria-label={open ? t.nav.close : t.nav.menu}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? t.nav.close : t.nav.menu}
        </button>
      </div>

      {open ? (
        <div className="border-t border-line bg-paper px-5 py-6 text-ink md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV.map((item) =>
              item.href.startsWith("/#") ? (
                <a
                  key={item.id}
                  href={item.href}
                  className="text-[15px]"
                  onClick={(event) => {
                    setOpen(false);
                    if (onHome) {
                      event.preventDefault();
                      scrollToId(item.href.slice(2));
                    }
                  }}
                >
                  {item.label}
                </a>
              ) : (
                <Link key={item.id} to={item.href} className="text-[15px]" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ),
            )}
          </nav>
          <div className="mt-6 flex items-center gap-4">
            <LangToggle />
            <ThemeToggle />
            <AuthSlot light={false} />
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="no-print border-t border-line bg-paper text-ink">
      <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[15px] font-semibold tracking-[0.04em]">TLE Group</p>
            <p className="mt-2 max-w-xs text-[13px] text-mute">
              Total Link Engenharia & Construções
            </p>
            <p className="mt-2 text-[13px] text-mute">
              {site.city}, {site.country}
            </p>
            <div className="mt-4 space-y-1 text-[13px]">
              <p>
                <a href={`tel:${site.phoneDisplay.replace(/\s/g, "")}`} className="hover:underline">
                  {site.phoneDisplay}
                </a>
              </p>
              {waHref ? (
                <p>
                  <a href={waHref} target="_blank" rel="noreferrer" className="hover:underline">
                    WhatsApp
                  </a>
                  <span className="text-mute"> · </span>
                  <span className="text-mute">e-Mola {site.emolaDisplay}</span>
                </p>
              ) : (
                <p className="text-mute">e-Mola {site.emolaDisplay}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-[13px]">
            <Link to="/portfolio" className="hover:underline">
              {t.nav.projects}
            </Link>
            <a href="/#servicos" className="hover:underline">
              {t.nav.services}
            </a>
            <a href="/#contacto" className="hover:underline">
              {t.quote.kicker}
            </a>
            <Link to="/privacidade" className="hover:underline">
              {t.footer.privacy}
            </Link>
            <Link to="/termos" className="hover:underline">
              {t.footer.terms}
            </Link>
          </div>
        </div>
        <p className="mt-10 text-[11px] text-mute">
          {site.legalName}
        </p>
      </div>
    </footer>
  );
}

/** Floating WhatsApp — usa /brand/whatsapp.svg (ícone oficial já no repo) */
export function WhatsAppButton() {
  if (!waHref) return null;
  return (
    <a
      href={waHref}
      target="_blank"
      rel="noreferrer"
      className="no-print fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition hover:scale-105 hover:opacity-95 active:scale-100"
      aria-label="WhatsApp TLE Group"
      title="WhatsApp"
    >
      <img
        src="/brand/whatsapp.svg"
        alt=""
        width={56}
        height={56}
        className="h-14 w-14 object-contain"
        decoding="async"
      />
    </a>
  );
}

export function ScrollTopButton() {
  return null;
}

export function CookieBanner() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("tle-consent")) setVisible(true);
  }, []);

  function choose(value: "accepted" | "rejected") {
    localStorage.setItem("tle-consent", value);
    setVisible(false);
    if (value === "accepted" && site.gaId) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${site.gaId}`;
      document.head.appendChild(script);
      const inline = document.createElement("script");
      inline.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.gaId}',{anonymize_ip:true});`;
      document.head.appendChild(inline);
    }
  }

  if (!visible) return null;

  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper px-5 py-4 text-ink shadow-lg">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-mute">{t.cookies.text}</p>
        <div className="flex gap-3">
          <button type="button" className="text-[13px] underline" onClick={() => choose("rejected")}>
            {t.cookies.reject}
          </button>
          <button type="button" className="text-[13px] font-medium" onClick={() => choose("accepted")}>
            {t.cookies.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
