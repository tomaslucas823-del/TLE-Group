import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ProjectCard } from "@/components/project-card";
import { QuoteForm } from "@/components/quote-form";
import { Reveal, useHeroParallax } from "@/components/reveal";
import type { Draft } from "@/components/simulator";
import { projects } from "@/data/projects";
import { site } from "@/lib/site";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "TLE Arquitetura — a casa, antes da primeira parede" },
      {
        name: "description",
        content:
          "Visualização residencial em Maputo. A casa vista inteira antes da obra.",
      },
    ],
  }),
  component: HomePage,
});

const featured = projects.slice(0, 3);
const defaultDraft: Draft = { area: 180, style: "pedra", tier: "estudo" };

function HomePage() {
  const { t } = useI18n();
  const [playHero, setPlayHero] = useState(true);
  const parallaxRef = useHeroParallax(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlayHero(false);
  }, []);

  return (
    <main>
      <section className="relative flex min-h-[92svh] items-center justify-center overflow-hidden bg-ink text-paper">
        <div ref={parallaxRef} className="parallax-layer absolute inset-0">
          <img
            src="/hero-poster.webp"
            alt=""
            width={1600}
            height={900}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
          {playHero ? (
            <video
              className="absolute inset-0 h-full w-full object-cover opacity-70"
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
        <div className="pointer-events-none absolute inset-0 bg-black/35" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h1 className="hero-enter font-display text-[2.6rem] leading-[1.05] font-semibold tracking-[-0.04em] text-balance sm:text-5xl md:text-6xl">
            {t.hero.title}
          </h1>
          <p className="hero-enter hero-enter-delay-1 mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-paper/75">
            {t.hero.kicker}
          </p>
          <div className="hero-enter hero-enter-delay-2 mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#contacto" className="btn btn-solid-invert min-h-11 px-6 text-[15px]">
              {t.hero.cta}
            </a>
            <Link to="/portfolio" className="text-[15px] text-paper/85 underline-offset-4 hover:underline">
              {t.hero.projects}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <Reveal variant="up" className="text-center">
            <h2 className="font-display text-[2rem] font-semibold tracking-[-0.03em] md:text-[2.5rem]">
              {t.featured.title}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project, i) => (
              <Reveal key={project.slug} variant="up" delay={i * 70}>
                <ProjectCard project={project} aspect="aspect-[4/3]" />
              </Reveal>
            ))}
          </div>
          <Reveal variant="up" className="mt-12 text-center">
            <Link to="/portfolio" className="text-[15px] text-ink underline-offset-4 hover:underline">
              {t.featured.all}
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="servicos" className="bg-stone">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <Reveal variant="up" className="text-center">
            <h2 className="font-display text-[2rem] font-semibold tracking-[-0.03em] md:text-[2.5rem]">
              {t.services.title}
            </h2>
          </Reveal>
          <ul className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
            {t.services.paths.map((path, i) => (
              <Reveal key={path.title} as="li" variant="up" delay={i * 60} className="text-center md:text-left">
                <h3 className="font-display text-[1.25rem] font-semibold tracking-[-0.02em]">{path.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-mute">{path.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="overflow-hidden bg-ink">
        <img
          src="/renders/pavilhao-dia.webp"
          alt=""
          width={1600}
          height={900}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover md:aspect-[21/9]"
        />
      </section>

      <section id="contacto" className="bg-paper">
        <div className="mx-auto grid max-w-5xl gap-14 px-6 py-20 md:grid-cols-2 md:gap-16 md:py-28">
          <Reveal variant="up">
            <h2 className="font-display text-[2rem] font-semibold tracking-[-0.03em] md:text-[2.5rem]">
              {t.quote.title}
            </h2>
            <p className="mt-4 max-w-sm text-[17px] leading-relaxed text-mute">{t.quote.lead}</p>
            <div className="mt-10 space-y-4 text-[15px]">
              <p>{site.phoneDisplay}</p>
              <p>
                <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">
                  {site.email}
                </a>
              </p>
              <p className="text-mute">
                {site.city}, {site.country}
              </p>
            </div>
          </Reveal>
          <Reveal variant="up" delay={60}>
            <QuoteForm draft={defaultDraft} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
