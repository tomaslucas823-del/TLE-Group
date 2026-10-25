import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ProjectCard } from "@/components/project-card";
import { QuoteForm } from "@/components/quote-form";
import { Reveal } from "@/components/reveal";
import type { Draft } from "@/components/simulator";
import { projects } from "@/data/projects";
import { site } from "@/lib/site";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "TLE Arquitetura" },
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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlayHero(false);
  }, []);

  return (
    <main>
      {/* Hero — single media layer (no poster+video ghost) */}
      <section className="relative flex min-h-[70svh] items-center justify-center overflow-hidden bg-black text-white md:min-h-[78svh]">
        <div className="absolute inset-0">
          {playHero ? (
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/media/hero-poster.jpg"
            >
              <source src="/media/hero.mp4" type="video/mp4" />
            </video>
          ) : (
            <img
              src="/media/hero-poster.jpg"
              alt=""
              className="h-full w-full object-cover"
              width={1920}
              height={1080}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/20" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">
          <p className="text-sm tracking-[0.2em] text-white/70 uppercase">{t.hero.kicker}</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] font-normal text-balance md:text-7xl">
            {t.hero.title}
          </h1>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/simulador" className="btn-cta">
              {t.hero.cta}
              <span className="btn-cta__icon" aria-hidden>
                →
              </span>
            </Link>
            <Link to="/portfolio" className="text-sm text-white/80 underline-offset-4 hover:underline">
              {t.hero.projects}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Reveal>
          <p className="text-sm text-mute">{t.featured.kicker}</p>
          <h2 className="mt-2 font-display text-4xl font-normal md:text-5xl">{t.featured.title}</h2>
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {featured.map((project, i) => (
            <Reveal key={project.slug} delay={i * 80}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
        <div className="mt-12">
          <Link to="/portfolio" className="text-sm underline-offset-4 hover:underline">
            {t.featured.all}
          </Link>
        </div>
      </section>

      <section className="border-y border-line bg-stone py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-sm text-mute">{t.services.kicker}</p>
            <h2 className="mt-2 font-display text-4xl font-normal md:text-5xl">{t.services.title}</h2>
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {t.services.paths.map((path, i) => (
              <Reveal key={path.title} delay={i * 60}>
                <article className="border border-line bg-paper p-6">
                  <h3 className="font-display text-2xl font-semibold">{path.title}</h3>
                  <p className="mt-3 text-sm text-mute">{path.text}</p>
                  <Link to="/simulador" className="mt-6 inline-block text-sm underline-offset-4 hover:underline">
                    {path.cta}
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Reveal>
          <p className="text-sm text-mute">{t.method.kicker}</p>
          <h2 className="mt-2 max-w-xl font-display text-4xl font-normal md:text-5xl">{t.method.title}</h2>
        </Reveal>
        <ol className="mt-12 grid gap-6 md:grid-cols-4">
          {t.method.steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 50}>
              <li>
                <p className="text-sm text-mute">{step.n}</p>
                <h3 className="mt-2 font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-mute">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section id="cotacao" className="border-t border-line bg-stone py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-2 md:items-start">
          <Reveal>
            <p className="text-sm text-mute">{t.quote.kicker}</p>
            <h2 className="mt-2 font-display text-4xl font-normal md:text-5xl">{t.quote.title}</h2>
            <p className="mt-4 max-w-md text-mute">{t.quote.lead}</p>
            <p className="mt-8 text-sm text-mute">
              {site.city} · {site.email}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <QuoteForm draft={defaultDraft} />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Reveal>
          <p className="text-sm text-mute">{t.faq.kicker}</p>
          <h2 className="mt-2 font-display text-4xl font-normal md:text-5xl">{t.faq.title}</h2>
        </Reveal>
        <dl className="mt-12 divide-y divide-line border-t border-line">
          {t.faq.items.map((item) => (
            <div key={item.q} className="py-6 md:grid md:grid-cols-[1fr_1.4fr] md:gap-8">
              <dt className="font-medium">{item.q}</dt>
              <dd className="mt-2 text-sm text-mute md:mt-0">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
