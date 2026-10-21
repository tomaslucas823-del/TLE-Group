import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { site, waHref } from "@/lib/site";

const NAV = [
  { to: "/portfolio", label: "Projetos", hash: undefined },
  { to: "/", label: "Serviços", hash: "servicos" },
  { to: "/", label: "Método", hash: "metodo" },
  { to: "/simulador", label: "Estimativa", hash: undefined },
  { to: "/portal", label: "Portal", hash: undefined },
] as const;

function AuthSlot({ light }: { light: boolean }) {
  const [mounted, setMounted] = useState(false);
  const { user, isPending } = useCurrentUserState();
  useEffect(() => setMounted(true), []);
  if (!mounted || isPending) return <span className="inline-block h-4 w-12" aria-hidden />;
  if (!user) {
    return (
      <Link to="/login" className={cn("text-sm transition-colors", light ? "text-paper" : "text-ink")}>
        Entrar
      </Link>
    );
  }
  return <UserButton />;
}

export function SiteHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
                "text-[13px] transition-colors duration-200",
                light ? "text-paper/80 hover:text-paper" : "text-mute hover:text-ink",
                pathname === item.to && !item.hash && (light ? "text-paper" : "text-ink"),
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-5 md:flex">
          <AuthSlot light={light} />
          <Link
            to="/"
            hash="orcamento"
            className={cn(
              "btn btn-shine inline-flex min-h-10 items-center px-4 text-[13px] font-medium",
              light ? "btn-solid-invert" : "btn-solid",
            )}
          >
            Pedir cotação
          </Link>
        </div>
        <button
          type="button"
          className="text-sm md:hidden"
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Fechar" : "Menu"}
        </button>
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
              Estúdio
            </Link>
            <Link
              to="/"
              hash="orcamento"
              className="btn btn-solid btn-shine mt-4 inline-flex min-h-12 items-center justify-center px-4 text-sm"
              onClick={() => setOpen(false)}
            >
              Pedir cotação
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
            <p className="text-mute">Contacto</p>
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
            <p className="text-mute">Projetos e serviços</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/portfolio" className="hover:underline">
                  Projetos
                </Link>
              </li>
              <li>
                <Link to="/" hash="servicos" className="hover:underline">
                  Serviços
                </Link>
              </li>
              <li>
                <Link to="/simulador" className="hover:underline">
                  Estimativa
                </Link>
              </li>
              <li>
                <Link to="/" hash="duvidas" className="hover:underline">
                  Dúvidas
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-mute">Estúdio</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/portal" className="hover:underline">
                  Portal do cliente
                </Link>
              </li>
              <li>
                <Link to="/estudio" className="hover:underline">
                  Área do estúdio
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="hover:underline">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-mute">Redes</p>
            <ul className="mt-3 space-y-2">
              <li>{site.instagram ? <a href={site.instagram}>Instagram</a> : "Instagram — a indicar"}</li>
              <li>{site.facebook ? <a href={site.facebook}>Facebook</a> : "Facebook — a indicar"}</li>
              <li>{site.linkedin ? <a href={site.linkedin}>LinkedIn</a> : "LinkedIn — a indicar"}</li>
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
  if (!waHref) return null;
  return (
    <a
      href={waHref}
      className="no-print float-in btn btn-outline-ink fixed right-5 bottom-5 z-40 px-3 py-2 text-sm"
      aria-label="Falar no WhatsApp"
    >
      WhatsApp
    </a>
  );
}

export function ScrollTopButton() {
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
        "no-print float-in btn btn-outline-ink fixed right-5 z-40 flex h-10 w-10 items-center justify-center text-sm",
        waHref ? "bottom-20" : "bottom-5",
        "md:bottom-5",
      )}
      aria-label="Voltar ao topo"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      ↑
    </button>
  );
}

export function CookieBanner() {
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
          Cookies só para medir o acesso, e apenas com o seu aceite.{" "}
          <Link to="/privacidade" className="underline">
            Privacidade
          </Link>
          .
        </p>
        <div className="flex gap-4 text-sm">
          <button type="button" className="underline underline-offset-4" onClick={() => choose("accepted")}>
            Aceitar
          </button>
          <button type="button" className="text-mute underline underline-offset-4" onClick={() => choose("rejected")}>
            Recusar
          </button>
        </div>
      </div>
    </aside>
  );
}
