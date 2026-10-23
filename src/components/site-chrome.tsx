import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  if (!mounted || isPending) return <span className="inline-block h-4 w-12" aria-hidden />;
  if (!user) {
    return (
      <Link to="/login" className={cn("text-sm transition-colors", light ? "text-paper/80" : "text-ink")}>
        {t.nav.login}
      </Link>
    );
  }
  return <UserButton />;
}

function CtaArrow() {
  return (
    <span className="btn-cta__icon" aria-hidden>
      →
    </span>
  );
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

type NavItem = {
  id: string;
  to: "/" | "/portfolio" | "/simulador";
  label: string;
  hash?: string;
  home?: boolean;
};

function resolveActiveId(pathname: string): string {
  if (pathname.startsWith("/portfolio")) return "projects";
  if (pathname.startsWith("/simulador")) return "estimate";
  if (pathname === "/") {
    const h = typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") : "";
    if (h === "servicos") return "services";
    if (h === "metodo") return "method";
    return "home";
  }
  return "";
}

export function SiteHeader() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("home");
  /** When true, location-sync effect must not overwrite a fresh click. */
  const lockActive = useRef(false);

  const NAV: NavItem[] = [
    { id: "home", to: "/", label: "Início", home: true },
    { id: "projects", to: "/portfolio", label: t.nav.projects },
    { id: "services", to: "/", label: t.nav.services, hash: "servicos" },
    { id: "method", to: "/", label: t.nav.method, hash: "metodo" },
    { id: "estimate", to: "/simulador", label: t.nav.estimate },
  ];

  // Sync from URL only when not locked by a click
  useEffect(() => {
    if (lockActive.current) return;
    setActiveId(resolveActiveId(pathname));
  }, [pathname]);

  useEffect(() => {
    const sync = () => {
      if (lockActive.current) return;
      setActiveId(resolveActiveId(window.location.pathname));
    };
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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

  const light = pathname === "/" && !scrolled && !open;

  function selectNav(item: NavItem) {
    lockActive.current = true;
    setActiveId(item.id);
    setOpen(false);
    // Release lock after navigation/hash settles
    window.setTimeout(() => {
      lockActive.current = false;
    }, 400);
  }

  async function onNavClick(item: NavItem, event: React.MouseEvent) {
    event.preventDefault();
    selectNav(item);

    if (item.hash) {
      // Always update the real URL hash so resolveActiveId stays correct
      if (pathname === "/") {
        window.history.pushState(null, "", `/#${item.hash}`);
        scrollToId(item.hash);
      } else {
        await navigate({ to: "/", hash: item.hash });
        window.setTimeout(() => scrollToId(item.hash!), 120);
      }
      return;
    }

    if (item.home) {
      await navigate({ to: "/" });
      window.history.replaceState(null, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    await navigate({ to: item.to });
  }

  return (
    <header className="no-print fixed inset-x-0 top-0 z-50 bg-transparent">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link
          to="/"
          className={cn(
            "relative z-10 flex items-center rounded-full px-1 py-1 transition-colors",
            light ? "text-paper" : "text-ink",
          )}
          onClick={() => selectNav({ id: "home", to: "/", label: "Início", home: true })}
        >
          <span className="font-display text-[1.2rem] leading-none font-medium tracking-[0.16em]">TLE</span>
        </Link>

        <nav
          className={cn("nav-pills relative z-10 hidden md:inline-flex", !light && "nav-pills--solid")}
          aria-label="Principal"
        >
          {NAV.map((item) => {
            const active = activeId === item.id;
            return (
              <a
                key={item.id}
                href={item.hash ? `/#${item.hash}` : item.to}
                className={cn("nav-pill", active && "nav-pill--active")}
                aria-current={active ? "page" : undefined}
                data-active={active ? "true" : "false"}
                onClick={(e) => onNavClick(item, e)}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="relative z-10 hidden items-center gap-2 md:flex">
          <div className={cn("nav-pills", !light && "nav-pills--solid")}>
            <LangToggle light={light} />
            <ThemeToggle light={light} />
          </div>
          <AuthSlot light={light} />
          <a
            href="/#orcamento"
            className="btn-cta"
            onClick={(e) => {
              e.preventDefault();
              selectNav({ id: "home", to: "/", label: "Início", home: true });
              if (pathname === "/") {
                window.history.pushState(null, "", "/#orcamento");
                scrollToId("orcamento");
              } else {
                void navigate({ to: "/", hash: "orcamento" }).then(() =>
                  window.setTimeout(() => scrollToId("orcamento"), 120),
                );
              }
            }}
          >
            {t.nav.quote}
            <CtaArrow />
          </a>
        </div>

        <div className="relative z-10 flex items-center gap-2 md:hidden">
          <LangToggle light={light} />
          <ThemeToggle light={light} />
          <button
            type="button"
            className={cn("nav-pill", light ? "bg-white/10 text-paper" : "bg-ink/5 text-ink")}
            aria-expanded={open}
            aria-label={open ? t.nav.close : t.nav.menu}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? t.nav.close : t.nav.menu}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-paper/95 px-5 py-8 text-ink backdrop-blur-md md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={item.hash ? `/#${item.hash}` : item.to}
                className={cn(
                  "flex min-h-12 items-center font-display text-3xl font-normal",
                  activeId === item.id && "text-timber",
                )}
                onClick={(e) => onNavClick(item, e)}
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/estudio"
              className="flex min-h-12 items-center font-display text-3xl font-normal"
              onClick={() => setOpen(false)}
            >
              {t.nav.studio}
            </Link>
            <a
              href="/#orcamento"
              className="btn-cta mt-4 self-start"
              onClick={(e) => {
                e.preventDefault();
                selectNav({ id: "home", to: "/", label: "Início", home: true });
                if (pathname === "/") {
                  window.history.pushState(null, "", "/#orcamento");
                  scrollToId("orcamento");
                } else {
                  void navigate({ to: "/", hash: "orcamento" }).then(() =>
                    window.setTimeout(() => scrollToId("orcamento"), 120),
                  );
                }
              }}
            >
              {t.nav.quote}
              <CtaArrow />
            </a>
          </nav>
          <div className="mt-8">
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
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex items-end justify-between gap-6">
          <p className="font-display text-4xl leading-none font-normal">TLE</p>
          <p className="text-sm text-mute">
            {site.city}
            <span className="text-line"> · </span>
            {site.country}
          </p>
        </div>
        <div className="mt-10 grid gap-10 text-sm md:grid-cols-4">
          <div>
            <p className="text-mute">{t.footer.contact}</p>
            <ul className="mt-3 space-y-2">
              <li>{site.phoneDisplay}</li>
              <li>
                <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">
                  {site.email}
                </a>
              </li>
              <li>
                {site.address}
                <br />
                {site.city}
              </li>
            </ul>
          </div>
          <div>
            <p className="text-mute">{t.footer.projectsServices}</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/portfolio" className="hover:underline">
                  {t.nav.projects}
                </Link>
              </li>
              <li>
                <a href="/#servicos" className="hover:underline">
                  {t.nav.services}
                </a>
              </li>
              <li>
                <Link to="/simulador" className="hover:underline">
                  {t.nav.estimate}
                </Link>
              </li>
              <li>
                <a href="/#duvidas" className="hover:underline">
                  {t.footer.faq}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-mute">{t.footer.studio}</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/portal" className="hover:underline">
                  {t.footer.clientPortal}
                </Link>
              </li>
              <li>
                <Link to="/estudio" className="hover:underline">
                  {t.footer.studioArea}
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="hover:underline">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link to="/termos" className="hover:underline">
                  {t.footer.terms}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-mute">{t.footer.social}</p>
            <ul className="mt-3 space-y-2">
              <li>{site.instagram ? <a href={site.instagram}>Instagram</a> : t.footer.igPending}</li>
              <li>{site.facebook ? <a href={site.facebook}>Facebook</a> : t.footer.fbPending}</li>
              <li>{site.linkedin ? <a href={site.linkedin}>LinkedIn</a> : t.footer.liPending}</li>
            </ul>
          </div>
        </div>
        <p className="mt-12 text-xs text-mute">
          {site.legalName} · NUIT {site.nuit}
        </p>
      </div>
    </footer>
  );
}

export function WhatsAppButton() {
  const { t } = useI18n();
  if (!waHref) return null;
  return (
    <a
      href={waHref}
      target="_blank"
      rel="noreferrer"
      className="no-print float-in float-bar fixed right-5 bottom-5 z-40"
      aria-label="WhatsApp"
    >
      <span className="float-bar__mark">TLE</span>
      <span className="btn-cta" style={{ padding: "0.3rem 0.35rem 0.3rem 0.95rem" }}>
        {t.nav.quote}
        <CtaArrow />
      </span>
    </a>
  );
}

export function ScrollTopButton() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className={cn(
        "no-print float-in btn btn-outline-ink fixed z-40 flex h-10 w-10 items-center justify-center rounded-full text-sm",
        waHref ? "right-5 bottom-[5.25rem]" : "right-5 bottom-5",
      )}
      aria-label={t.a11y.backTop}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      ↑
    </button>
  );
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
    <aside
      className={cn(
        "no-print fixed inset-x-0 z-40 border-t border-line bg-paper px-5 py-3",
        waHref ? "bottom-16" : "bottom-0",
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="max-w-xl text-[13px] text-charcoal">
          {t.cookies.text}{" "}
          <Link to="/privacidade" className="underline">
            {t.cookies.privacy}
          </Link>
          .
        </p>
        <div className="flex gap-4 text-sm">
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
