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
  if (!mounted || isPending) return <span className="inline-block h-4 w-12" aria-hidden />;
  if (!user) {
    return (
      <Link to="/login" className={cn("text-sm transition-colors", light ? "text-paper" : "text-ink")}>
        {t.nav.login}
      </Link>
    );
  }
  return <UserButton />;
}

export function SiteHeader() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const NAV = [
    { to: "/portfolio" as const, label: t.nav.projects, hash: undefined },
    { to: "/" as const, label: t.nav.services, hash: "servicos" },
    { to: "/" as const, label: t.nav.method, hash: "metodo" },
    { to: "/simulador" as const, label: t.nav.estimate, hash: undefined },
    { to: "/portal" as const, label: t.nav.portal, hash: undefined },
  ];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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

  return (
    <header
      className={cn(
        "no-print fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        light
          ? "bg-transparent text-paper"
          : "border-b border-line bg-paper/90 text-ink backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-5">
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
          <span className="font-display text-[1.25rem] leading-none font-medium tracking-[0.14em]">TLE</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              hash={item.hash}
              className={cn(
                "link-underline text-[13px] transition-colors duration-200",
                light ? "text-paper/80 hover:text-paper" : "text-mute hover:text-ink",
                pathname === item.to && !item.hash && (light ? "text-paper" : "text-ink"),
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <LangToggle light={light} />
          <ThemeToggle light={light} />
          <AuthSlot light={light} />
          <Link
            to="/"
            hash="orcamento"
            className={cn(
              "btn inline-flex min-h-10 items-center px-4 text-[13px] font-medium",
              light ? "btn-solid-invert" : "btn-solid",
            )}
          >
            {t.nav.quote}
          </Link>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <LangToggle light={light} />
          <ThemeToggle light={light} />
          <button
            type="button"
            className="text-sm"
            aria-expanded={open}
            aria-label={open ? t.nav.close : t.nav.menu}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? t.nav.close : t.nav.menu}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-line bg-paper px-5 py-8 text-ink md:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                hash={item.hash}
                className="flex min-h-12 items-center font-display text-3xl font-normal"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/estudio"
              className="flex min-h-12 items-center font-display text-3xl font-normal"
              onClick={() => setOpen(false)}
            >
              {t.nav.studio}
            </Link>
            <Link
              to="/"
              hash="orcamento"
              className="btn btn-solid mt-4 inline-flex min-h-12 items-center justify-center px-4 text-sm"
              onClick={() => setOpen(false)}
            >
              {t.nav.quote}
            </Link>
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
                <Link to="/" hash="servicos" className="hover:underline">
                  {t.nav.services}
                </Link>
              </li>
              <li>
                <Link to="/simulador" className="hover:underline">
                  {t.nav.estimate}
                </Link>
              </li>
              <li>
                <Link to="/" hash="duvidas" className="hover:underline">
                  {t.footer.faq}
                </Link>
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

/** Sticky CTA — inspirado no botão flutuante de referência, cantos quadrados. */
export function WhatsAppButton() {
  const { t } = useI18n();
  if (!waHref) return null;
  return (
    <a
      href={waHref}
      target="_blank"
      rel="noreferrer"
      className="no-print float-in btn btn-solid fixed right-5 bottom-5 z-40 min-h-11 px-4 text-sm font-medium shadow-lg"
      aria-label="WhatsApp"
    >
      {t.nav.quote}
      <span className="ml-2 opacity-70" aria-hidden>
        →
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
        "no-print float-in btn btn-outline-ink fixed z-40 flex h-10 w-10 items-center justify-center text-sm",
        waHref ? "right-5 bottom-[4.75rem]" : "right-5 bottom-5",
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
