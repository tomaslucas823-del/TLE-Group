import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ProjectCard } from "@/components/project-card";
import { QuoteForm } from "@/components/quote-form";
import { Reveal } from "@/components/reveal";
import { projects } from "@/data/projects";
import { site } from "@/lib/site";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "TLE Group" },
      {
        name: "description",
        content:
          "TLE Group — Total Link Engenharia & Construções. Soluções técnicas em construção civil em Inhambane.",
      },
    ],
  }),
  component: HomePage,
});

const featured = projects.slice(0, 3);

function HomePage() {
  const { t } = useI18n();
  const [playHero, setPlayHero] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlayHero(false);
  }, []);

  return (
    <main>
      <section className="relative flex min-h-[70svh] items-center justify-center overflow-hidden bg-black text-white md:min-h-[78svh]">
        <div className="absolute inset-0">
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
          ) : (
            <img
              src="/hero-poster.webp"
              alt=""
              width={1600}
              height={900}
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 mx-auto max-w-[680px] px-4 text-center">
          <h1 className="hero-enter font-display text-[2.4rem] leading-[1.08] font-semibold tracking-[-0.035em] text-balance sm:text-5xl md:text-[3.5rem]">
            {t.hero.title}
          </h1>
          <p className="hero-enter hero-enter-delay-1 mx-auto mt-3 max-w-sm text-[17px] leading-snug text-white/75">
            {t.hero.kicker}
          </p>
          <div className="hero-enter hero-enter-delay-2 mt-6 flex flex-wrap items-center justify-center gap-5">
            <a href="#contacto" className="btn btn-solid-invert min-h-10 px-5 text-[14px]">
              {t.hero.cta}
            </a>
            <Link to="/portfolio" className="text-[14px] text-white/85 underline-offset-4 hover:underline">
              {t.hero.projects}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-[980px] px-4 py-12 md:py-16">
          <Reveal variant="up" className="text-center">
            <h2 className="font-display text-[1.75rem] font-semibold tracking-[-0.03em] md:text-[2.25rem]">
              {t.featured.title}
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3">
            {featured.map((project, i) => (
              <Reveal key={project.slug} variant="up" delay={i * 50}>
                <ProjectCard project={project} aspect="aspect-[4/3]" />
              </Reveal>
            ))}
          </div>
          <Reveal variant="up" className="mt-8 text-center">
            <Link to="/portfolio" className="text-[14px] text-ink underline-offset-4 hover:underline">
              {t.featured.all}
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="servicos" className="bg-stone">
        <div className="mx-auto max-w-[980px] px-4 py-12 md:py-16">
          <Reveal variant="up" className="text-center">
            <h2 className="font-display text-[1.75rem] font-semibold tracking-[-0.03em] md:text-[2.25rem]">
              {t.services.title}
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
            {t.services.paths.map((path, i) => (
              <Reveal key={path.title} as="li" variant="up" delay={i * 40} className="text-center">
                <h3 className="font-display text-[1.15rem] font-semibold tracking-[-0.02em]">{path.title}</h3>
                <p className="mx-auto mt-2 max-w-[22ch] text-[14px] leading-relaxed text-mute md:max-w-none">
                  {path.text}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="overflow-hidden bg-black">
        <img
          src="/renders/pavilhao-dia.webp"
          alt=""
          width={1600}
          height={900}
          loading="lazy"
          className="aspect-[16/9] w-full object-cover md:aspect-[2.5/1]"
        />
      </section>

      <section id="contacto" className="bg-paper">
        <div className="mx-auto max-w-[980px] px-4 py-16 md:py-20">
          <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:items-start">
            <Reveal variant="up" className="md:sticky md:top-20">
              <p className="text-[12px] font-medium tracking-[0.14em] text-mute uppercase">{t.quote.kicker}</p>
              <h2 className="mt-3 font-display text-[2rem] font-semibold tracking-[-0.03em] md:text-[2.4rem]">
                {t.quote.title}
              </h2>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-mute">{t.quote.lead}</p>

              <dl className="mt-10 space-y-5 text-[14px]">
                <div>
                  <dt className="text-[11px] font-medium tracking-[0.08em] text-mute uppercase">{t.quote.phone}</dt>
                  <dd className="mt-1.5">
                    <a
                      href={`tel:${site.phoneDisplay.replace(/\s/g, "")}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {site.phoneDisplay}
                    </a>
                  </dd>
                  <dd className="mt-1 text-[13px] text-mute">WhatsApp · e-Mola</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium tracking-[0.08em] text-mute uppercase">{t.quote.email}</dt>
                  <dd className="mt-1.5">
                    <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium tracking-[0.08em] text-mute uppercase">{t.quote.address}</dt>
                  <dd className="mt-1.5 text-mute">
                    {site.city}, {site.country}
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal variant="up" delay={40}>
              <QuoteForm />
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
