import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
      { title: "TLE Arquitetura — a casa, antes da primeira parede" },
      {
        name: "description",
        content:
          "Visualização residencial em Maputo. Estudo visual, projeto executivo e imagens finais em meticais, antes da obra.",
      },
    ],
  }),
  component: HomePage,
});

const PATHS = [
  {
    title: "Estudo visual",
    text: "Partido, três imagens e uma rodada de ajustes — para decidir o volume antes da execução.",
    href: "/simulador",
    cta: "Ver estimativa",
  },
  {
    title: "Projeto executivo",
    text: "Plantas, cortes e a especificação dos materiais que a obra precisa para não inventar.",
    href: "/#orcamento",
    cta: "Pedir cotação",
  },
  {
    title: "Entrega completa",
    text: "Executivo, sequência de imagens e revisões registadas no portal do cliente.",
    href: "/#orcamento",
    cta: "Começar",
  },
];

const STEPS = [
  { n: "01", title: "Programa", text: "Metragem, terreno e o que a casa precisa de conter." },
  { n: "02", title: "Partido", text: "Volume, chegada e o que a rua pode ver." },
  { n: "03", title: "Imagem", text: "Pedra, madeira e luz, no horário certo." },
  { n: "04", title: "Entrega", text: "Plantas, prazo e cada revisão no portal." },
];

const FAQS = [
  {
    q: "Quanto custa um estudo visual?",
    a: "Depende da metragem, do partido e do tipo de entrega. O simulador dá uma referência em meticais; a proposta fechada considera terreno e prazo.",
  },
  {
    q: "Fazem só a imagem ou também o projeto?",
    a: "Estudo visual, projeto executivo e entrega completa com imagens finais. Escolha o caminho e peça a cotação.",
  },
  {
    q: "Atendem fora de Maputo?",
    a: "Sim. O acompanhamento pode ser online — Maputo, Matola, Costa do Sol, Boane e outras localidades em Moçambique.",
  },
  {
    q: "Como acompanho o projeto?",
    a: "No portal do cliente: etapas, aprovação de imagens e documentos. Cada revisão fica registada.",
  },
];

const featured = projects.slice(0, 3);
const [featuredMain, ...featuredSide] = featured;

function HomePage() {
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

  return (
    <main>
      {/* —— Hero: tipografia grande, um CTA principal —— */}
      <section className="relative h-svh min-h-[34rem] overflow-hidden bg-ink text-paper">
        <div ref={parallaxRef} className="parallax-layer absolute inset-0">
          <img
            src="/hero-poster.webp"
            alt="Residência em volumes brancos, pedra e madeira, vista da rua"
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
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(to_top,rgb(12,12,12,0.85),transparent)]" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-20 md:pb-24">
          <p className="hero-enter hero-enter-delay-1 text-[11px] tracking-[0.2em] text-paper/70 uppercase">
            Maputo · Visualização residencial
          </p>
          <h1 className="hero-enter hero-enter-delay-2 mt-5 max-w-[14ch] font-display text-[2.75rem] leading-[0.92] font-normal tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-[5.25rem]">
            A casa, antes da primeira parede.
          </h1>
          <div className="hero-enter hero-enter-delay-3 mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href="#orcamento" className="btn btn-solid-invert min-h-12 px-8 text-sm font-medium">
              Pedir cotação
            </a>
            <Link
              to="/portfolio"
              className="text-sm tracking-wide text-paper/80 underline-offset-4 transition hover:text-paper hover:underline"
            >
              Ver projetos
            </Link>
          </div>
        </div>
      </section>

      {/* —— Projetos: 1 grande + 2 laterais —— */}
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-mute uppercase">Seleção</p>
              <h2 className="mt-3 max-w-md font-display text-4xl leading-[1.05] font-normal md:text-5xl">
                Casas vistas inteiras antes da obra
              </h2>
            </div>
            <Link
              to="/portfolio"
              className="text-sm text-mute underline-offset-4 transition hover:text-ink hover:underline"
            >
              Todo o portefólio
            </Link>
          </Reveal>

          {featuredMain ? (
            <div className="mt-14 grid gap-5 md:grid-cols-12 md:gap-6">
              <Reveal as="div" variant="up" className="md:col-span-7">
                <ProjectCard project={featuredMain} aspect="aspect-[4/5] md:aspect-[3/4]" />
              </Reveal>
              <div className="flex flex-col gap-5 md:col-span-5 md:gap-6">
                {featuredSide.map((project, i) => (
                  <Reveal key={project.slug} variant="up" delay={(i + 1) * 80}>
                    <ProjectCard project={project} aspect="aspect-[16/11]" />
                  </Reveal>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* —— Caminhos —— */}
      <section id="servicos" className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <Reveal variant="fade">
            <p className="text-[11px] tracking-[0.18em] text-paper/45 uppercase">Serviços</p>
            <h2 className="mt-3 max-w-lg font-display text-4xl leading-[1.05] font-normal text-balance md:text-5xl">
              Três formas de começar.
            </h2>
          </Reveal>
          <ul className="mt-16 grid gap-px bg-paper/10 md:grid-cols-3">
            {PATHS.map((path, i) => (
              <Reveal
                key={path.title}
                as="li"
                variant="up"
                delay={i * 70}
                className="flex flex-col bg-ink p-8 md:p-10"
              >
                <span className="font-display text-sm italic text-paper/40">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 font-display text-2xl font-normal md:text-3xl">{path.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-paper/60">{path.text}</p>
                {path.href.startsWith("/#") ? (
                  <a
                    href={path.href}
                    className="mt-10 text-sm text-paper/80 underline-offset-4 transition hover:text-paper hover:underline"
                  >
                    {path.cta}
                  </a>
                ) : (
                  <Link
                    to={path.href}
                    className="mt-10 text-sm text-paper/80 underline-offset-4 transition hover:text-paper hover:underline"
                  >
                    {path.cta}
                  </Link>
                )}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* —— Método —— */}
      <section id="metodo" className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <Reveal className="max-w-xl">
            <p className="text-[11px] tracking-[0.18em] text-mute uppercase">Método</p>
            <h2 className="mt-3 font-display text-4xl leading-[1.05] font-normal md:text-5xl">
              Da conversa à imagem aprovada.
            </h2>
          </Reveal>
          <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} as="li" delay={i * 60}>
                <p className="font-display text-sm italic text-mute">{step.n}</p>
                <h3 className="mt-4 font-display text-2xl font-normal">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* —— Momento fotográfico —— */}
      <section className="overflow-hidden bg-ink">
        <Reveal variant="fade">
          <img
            src="/renders/pavilhao-dia.webp"
            alt="Pavilhão aberto, laje em balanço e chegada sob cobertura"
            width={1600}
            height={900}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover md:aspect-[21/9]"
          />
        </Reveal>
      </section>

      {/* —— Estimativa —— */}
      <section className="bg-stone">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <Reveal className="max-w-xl">
            <p className="text-[11px] tracking-[0.18em] text-mute uppercase">Estimativa</p>
            <h2 className="mt-3 font-display text-4xl leading-[1.05] font-normal md:text-5xl">
              Uma referência em meticais.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-mute">
              Metragem, partido e entrega. Não é proposta fechada — terreno e prazo ainda ajustam o valor.
            </p>
          </Reveal>
          <Reveal className="mt-12" delay={80}>
            <Simulator draft={draft} onChange={setDraft} />
          </Reveal>
        </div>
      </section>

      {/* —— FAQ —— */}
      <section id="duvidas" className="bg-paper">
        <div className="mx-auto max-w-2xl px-5 py-20 md:py-28">
          <Reveal>
            <p className="text-[11px] tracking-[0.18em] text-mute uppercase">Dúvidas</p>
            <h2 className="mt-3 font-display text-4xl font-normal md:text-5xl">Perguntas frequentes</h2>
          </Reveal>
          <ul className="mt-12 border-t border-line">
            {FAQS.map((item, index) => {
              const open = openFaq === index;
              return (
                <li key={item.q} className="border-b border-line">
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-6 py-5 text-left"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : index)}
                  >
                    <span className="font-display text-lg font-normal md:text-xl">{item.q}</span>
                    <span className="mt-1 shrink-0 text-mute" aria-hidden>
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 text-sm leading-relaxed text-mute">{item.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* —— Cotação (fecho) —— */}
      <section id="orcamento" className="border-t border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-16 px-5 py-20 md:grid-cols-2 md:gap-20 md:py-28">
          <Reveal variant="fade">
            <p className="text-[11px] tracking-[0.18em] text-mute uppercase">Cotação</p>
            <h2 className="mt-3 font-display text-4xl leading-[1.05] font-normal md:text-5xl">
              Conte o terreno.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-mute">
              O pedido leva a estimativa desta página. Respondemos com a imagem e a referência em meticais.
            </p>
            <dl className="mt-12 max-w-sm space-y-0 text-sm">
              <div className="border-t border-line py-4">
                <dt className="text-[11px] tracking-[0.12em] text-mute uppercase">Telefone</dt>
                <dd className="mt-1">{site.phoneDisplay}</dd>
              </div>
              <div className="border-t border-line py-4">
                <dt className="text-[11px] tracking-[0.12em] text-mute uppercase">E-mail</dt>
                <dd className="mt-1">
                  <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div className="border-t border-b border-line py-4">
                <dt className="text-[11px] tracking-[0.12em] text-mute uppercase">Morada</dt>
                <dd className="mt-1">
                  {site.address}
                  <br />
                  {site.city}, {site.country}
                </dd>
              </div>
            </dl>
          </Reveal>
          <Reveal variant="fade" delay={60}>
            <QuoteForm draft={draft} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
