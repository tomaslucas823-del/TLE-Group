import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
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
  const navigate = useNavigate();
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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onHero = pathname === "/" && !scrolled && !open;
  const bar = onHero
    ? "bg-black/40 text-paper backdrop-blur-xl"
    : "border-b border-line/80 bg-paper/85 text-ink backdrop-blur-xl";

  async function go(href: string) {
    setOpen(false);
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (pathname === "/") {
        window.history.pushState(null, "", href);
        scrollToId(id);
      } else {
        await navigate({ to: "/", hash: id });
        window.setTimeout(() => scrollToId(id), 120);
      }
      return;
    }
    await navigate({ to: href as "/portfolio" });
  }

  return (
    <header className={cn("no-print fixed inset-x-0 top-0 z-50 transition-colors", bar)}>
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between gap-4 px-5 md:h-11">
        <Link to="/" className="text-[15px] font-semibold tracking-[0.04em]" onClick={() => setOpen(false)}>
          TLE
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-[12px] opacity-80 transition-opacity hover:opacity-100"
              onClick={(e) => {
                e.preventDefault();
                void go(item.href);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LangToggle light={onHero} />
          <ThemeToggle light={onHero} />
          <AuthSlot light={onHero} />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LangToggle light={onHero} />
          <ThemeToggle light={onHero} />
          <button
            type="button"
            className="px-1 text-[12px] opacity-90"
            aria-expanded={open}
            aria-label={open ? t.nav.close : t.nav.menu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? t.nav.close : t.nav.menu}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-paper px-5 py-6 text-ink md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="flex min-h-11 items-center text-[17px]"
                onClick={(e) => {
                  e.preventDefault();
                  void go(item.href);
                }}
              >
                {item.label}
              </a>
            ))}
            <Link to="/login" className="flex min-h-11 items-center text-[17px]" onClick={() => setOpen(false)}>
              {t.nav.login}
            </Link>
          </nav>
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
            <p className="text-[15px] font-semibold tracking-[0.04em]">TLE</p>
            <p className="mt-2 text-[13px] text-mute">
              {site.city}, {site.country}
            </p>
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

/** Simple discreet WhatsApp link — no heavy floating bar */
export function WhatsAppButton() {
  if (!waHref) return null;
  return (
    <a
      href={waHref}
      target="_blank"
      rel="noreferrer"
      className="no-print fixed right-4 bottom-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-[13px] font-medium text-paper shadow-lg transition hover:opacity-90"
      aria-label="WhatsApp"
    >
      WA
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
    <aside className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-5 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="max-w-xl text-[12px] text-mute">
          {t.cookies.text}{" "}
          <Link to="/privacidade" className="underline">
            {t.cookies.privacy}
          </Link>
          .
        </p>
        <div className="flex gap-4 text-[13px]">
          <button type="button" className="underline underline-offset-4" onClick={() => choose("accepted")}>
            {t.cookies.accept}
          </button>
          <button type="button" className="text-mute underline underline-offset-4" onClick={() => choose("rejected")}>
            {t.cookies.reject}
          </button>
        </div>
      </div>
    </aside>
  );
}
