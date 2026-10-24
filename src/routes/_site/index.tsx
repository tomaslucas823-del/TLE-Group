import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ProjectCard } from "@/components/project-card";
import { QuoteForm } from "@/components/quote-form";
import { Reveal, useHeroParallax } from "@/components/reveal";
import { Simulator, type Draft } from "@/components/simulator";
import { projects } from "@/data/projects";
import { clampArea, isStyle, isTier } from "@/lib/estimate";
import { site } from "@/lib/site";

type HomeSearch = {
  area?: number;
  estilo?: string;
  entrega?: string;
};

export const Route = createFileRoute("/_site/")({
  validateSearch: (search: Record<string, unknown>): HomeSearch => ({
    area: typeof search.area === "number" || typeof search.area === "string" ? Number(search.area) : undefined,
    estilo: typeof search.estilo === "string" ? search.estilo : undefined,
    entrega: typeof search.entrega === "string" ? search.entrega : undefined,
  }),
  head: () => ({
    meta: [
      { title: "TLE Arquitetura - a casa, antes da primeira parede" },
      {
        name: "description",
        content:
          "Visualização residencial em Maputo. Estudo visual, projecto executivo e imagens finais em meticais, antes da obra.",
      },
    ],
  }),
  component: HomePage,
});

const featured = projects.slice(0, 3);
const [featuredMain, ...featuredSide] = featured;

function HomePage() {
  const { t } = useI18n();
  const search = Route.useSearch();
  const [draft, setDraft] = useState<Draft>(() => ({
    area: clampArea(search.area),
    style: isStyle(search.estilo) ? search.estilo : "pedra",
    tier: isTier(search.entrega) ? search.entrega : "estudo",
  }));
  const [playHero, setPlayHero] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const parallaxRef = useHeroParallax(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlayHero(false);
  }, []);

  const PATHS = [
    { ...t.services.paths[0], href: "/simulador" },
    { ...t.services.paths[1], href: "/#orcamento" },
    { ...t.services.paths[2], href: "/#orcamento" },
  ];

  return (
    <main>
      <section className="relative h-svh min-h-[32rem] overflow-hidden bg-ink text-paper">
        <div ref={parallaxRef} className="parallax-layer absolute inset-0">
          <img
            src="/hero-poster.webp"
            alt=""
            width={1600}
            height={900}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {playHero ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="/hero-poster.webp"
              preload="metadata"
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>
          ) : null}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-ink/40" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(to_top,rgb(0,0,0,0.85),transparent)]" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-16 md:pb-24">
          <p className="hero-enter hero-enter-delay-1 text-[12px] font-medium tracking-[0.14em] text-paper/65 uppercase">
            {t.hero.kicker}
          </p>
          <h1 className="hero-enter hero-enter-delay-2 mt-3 max-w-[15ch] font-display text-[2.85rem] leading-[1.02] font-semibold tracking-[-0.035em] text-balance sm:text-6xl md:text-7xl lg:text-[5.25rem]">
            {t.hero.title}
          </h1>
          <div className="hero-enter hero-enter-delay-3 mt-9 flex flex-wrap items-center gap-3">
            <a href="#orcamento" className="btn-cta">
              {t.hero.cta}
              <span className="btn-cta__icon" aria-hidden>
                →
              </span>
            </a>
            <Link to="/portfolio" className="btn btn-outline min-h-11 px-5 text-[15px] text-paper">
              {t.hero.projects}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <Reveal variant="up" className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[12px] font-medium tracking-[0.14em] text-mute uppercase">{t.featured.kicker}</p>
              <h2 className="mt-3 max-w-xl font-display text-[2rem] leading-[1.08] font-semibold tracking-[-0.03em] md:text-[2.75rem]">
                {t.featured.title}
              </h2>
              <span className="accent-line mt-5" />
            </div>
            <Link to="/portfolio" className="btn btn-outline-ink min-h-10 px-4 text-[15px]">
              {t.featured.all}
            </Link>
          </Reveal>

          {featuredMain ? (
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
              <Reveal as="div" variant="up" delay={40} className="sm:col-span-2 lg:col-span-1">
                <ProjectCard project={featuredMain} aspect="aspect-[4/3]" />
              </Reveal>
              {featuredSide.map((project, i) => (
                <Reveal key={project.slug} variant="up" delay={(i + 1) * 90}>
                  <ProjectCard project={project} aspect="aspect-[4/3]" />
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section id="servicos" className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <Reveal variant="up">
            <p className="text-[12px] font-medium tracking-[0.14em] text-paper/45 uppercase">{t.services.kicker}</p>
            <h2 className="mt-3 max-w-2xl font-display text-[2rem] leading-[1.08] font-semibold tracking-[-0.03em] text-balance md:text-[2.75rem]">
              {t.services.title}
            </h2>
            <span className="accent-line mt-5 bg-paper" />
          </Reveal>
          <ul className="mt-12 grid gap-10 border-t border-paper/15 pt-12 md:grid-cols-3 md:gap-12">
            {PATHS.map((path, i) => (
              <Reveal key={path.title} as="li" variant="up" delay={i * 80} className="step-card flex flex-col">
                <span className="text-[13px] font-medium tracking-[0.08em] text-paper/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-[1.35rem] font-semibold tracking-[-0.02em] md:text-[1.5rem]">
                  {path.title}
                </h3>
                <p className="mt-3 flex-1 text-[15px] leading-[1.55] text-paper/60">{path.text}</p>
                {path.href.startsWith("/#") ? (
                  <a href={path.href} className="link-underline mt-6 text-[15px] text-paper/80">
                    {path.cta}
                  </a>
                ) : (
                  <Link to={path.href} className="link-underline mt-6 text-[15px] text-paper/80">
                    {path.cta}
                  </Link>
                )}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="metodo" className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <Reveal variant="up" className="max-w-2xl">
            <p className="text-[12px] font-medium tracking-[0.14em] text-mute uppercase">{t.method.kicker}</p>
            <h2 className="mt-3 font-display text-[2rem] leading-[1.08] font-semibold tracking-[-0.03em] md:text-[2.75rem]">
              {t.method.title}
            </h2>
            <span className="accent-line mt-5" />
          </Reveal>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {t.method.steps.map((step, i) => (
              <Reveal key={step.n} as="li" variant="up" delay={i * 70} className="step-card">
                <p className="text-[13px] font-medium tracking-[0.08em] text-mute">{step.n}</p>
                <h3 className="mt-3 font-display text-[1.25rem] font-semibold tracking-[-0.02em]">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.55] text-mute">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="overflow-hidden bg-ink">
        <Reveal variant="zoom" slow>
          <img
            src="/renders/pavilhao-dia.webp"
            alt=""
            width={1600}
            height={900}
            loading="lazy"
            className="aspect-[16/9] w-full object-cover md:aspect-[21/9]"
          />
        </Reveal>
      </section>

      <section className="bg-stone">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <Reveal variant="up" className="max-w-2xl">
            <p className="text-[12px] font-medium tracking-[0.14em] text-mute uppercase">{t.estimate.kicker}</p>
            <h2 className="mt-3 font-display text-[2rem] leading-[1.08] font-semibold tracking-[-0.03em] md:text-[2.75rem]">
              {t.estimate.title}
            </h2>
            <p className="mt-4 max-w-lg text-[17px] leading-[1.5] text-mute">{t.estimate.lead}</p>
          </Reveal>
          <Reveal className="mt-12" variant="up" delay={80}>
            <Simulator draft={draft} onChange={setDraft} />
          </Reveal>
        </div>
      </section>

      <section id="duvidas" className="bg-paper">
        <div className="mx-auto max-w-2xl px-5 py-16 md:py-24">
          <Reveal variant="up">
            <p className="text-[12px] font-medium tracking-[0.14em] text-mute uppercase">{t.faq.kicker}</p>
            <h2 className="mt-3 font-display text-[2rem] font-semibold tracking-[-0.03em] md:text-[2.75rem]">
              {t.faq.title}
            </h2>
            <span className="accent-line mt-5" />
          </Reveal>
          <ul className="mt-12 border-t border-line">
            {t.faq.items.map((item, index) => {
              const open = openFaq === index;
              return (
                <li key={item.q} className="border-b border-line">
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-6 py-6 text-left transition-opacity hover:opacity-70"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : index)}
                  >
                    <span className="font-display text-[1.15rem] font-semibold tracking-[-0.02em] md:text-[1.3rem]">
                      {item.q}
                    </span>
                    <span
                      className="mt-1 shrink-0 text-mute transition-transform duration-300"
                      style={{ transform: open ? "rotate(45deg)" : "none" }}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-400 ease-out"
                    style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 text-[15px] leading-[1.55] text-mute">{item.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="orcamento" className="border-t border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2 md:gap-16 md:py-24">
          <Reveal variant="left">
            <p className="text-[12px] font-medium tracking-[0.14em] text-mute uppercase">{t.quote.kicker}</p>
            <h2 className="mt-3 font-display text-[2rem] leading-[1.08] font-semibold tracking-[-0.03em] md:text-[2.75rem]">
              {t.quote.title}
            </h2>
            <p className="mt-4 max-w-md text-[17px] leading-[1.5] text-mute">{t.quote.lead}</p>
            <dl className="mt-10 max-w-sm space-y-0 text-[15px]">
              <div className="border-t border-line py-4">
                <dt className="text-[12px] font-medium tracking-[0.1em] text-mute uppercase">{t.quote.phone}</dt>
                <dd className="mt-1.5">{site.phoneDisplay}</dd>
              </div>
              <div className="border-t border-line py-4">
                <dt className="text-[12px] font-medium tracking-[0.1em] text-mute uppercase">{t.quote.email}</dt>
                <dd className="mt-1.5">
                  <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div className="border-t border-b border-line py-4">
                <dt className="text-[12px] font-medium tracking-[0.1em] text-mute uppercase">{t.quote.address}</dt>
                <dd className="mt-1.5">
                  {site.address}
                  <br />
                  {site.city}, {site.country}
                </dd>
              </div>
            </dl>
          </Reveal>
          <Reveal variant="right" delay={80}>
            <QuoteForm draft={draft} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
