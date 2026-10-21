import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CountUp } from "@/components/count-up";
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
    text: "Partido, três imagens e uma rodada de ajustes para decidir o volume antes de gastar com a execução.",
    href: "/simulador",
    cta: "Ver estimativa",
  },
  {
    title: "Projeto executivo",
    text: "Plantas, cortes e a especificação dos materiais que aparecem na imagem — o que a obra precisa para não inventar.",
    href: "/#orcamento",
    cta: "Pedir cotação",
  },
  {
    title: "Entrega completa",
    text: "Executivo, sequência de imagens e revisões registadas no portal do cliente.",
    href: "/#orcamento",
    cta: "Começar agora",
  },
];

const REASONS = [
  {
    n: "01",
    title: "Decisão antes da obra",
    text: "Fachada, chegada e materiais são vistos em imagem. O retrabalho deixa de ser surpresa no estaleiro.",
  },
  {
    n: "02",
    title: "Adequado ao terreno",
    text: "Metragem, recuos e o que a família precisa entram no programa antes do primeiro traço.",
  },
  {
    n: "03",
    title: "Estimativa em meticais",
    text: "Simulador com referência clara de estudo. A proposta fechada considera terreno, programa e prazo.",
  },
  {
    n: "04",
    title: "Portal do cliente",
    text: "Cada revisão e aprovação fica registada. A família acompanha o estado do projeto sem perder o fio.",
  },
  {
    n: "05",
    title: "Maputo e arredores",
    text: "Residências pensadas para o clima, a luz e a forma de construir em Moçambique.",
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
    a: "O valor depende da metragem, do partido e do tipo de entrega. Use o simulador nesta página para uma referência em meticais; a proposta fechada considera terreno e prazo.",
  },
  {
    q: "Vocês fazem só a imagem ou também o projeto?",
    a: "Fazemos estudo visual, projeto executivo e entrega completa com imagens finais. Escolha o caminho que combina consigo e peça a cotação.",
  },
  {
    q: "Atendem fora de Maputo?",
    a: "Sim. O acompanhamento pode ser online. Trabalhamos residências em Maputo, Matola, Costa do Sol, Boane e outras localidades em Moçambique.",
  },
  {
    q: "Como acompanho o projeto?",
    a: "No portal do cliente: estado das etapas, aprovação de imagens e documentos. Cada revisão fica registada.",
  },
  {
    q: "O que preciso enviar para começar?",
    a: "Medidas do terreno (ou aproximação), cidade, número de quartos e o que a família precisa. O formulário de cotação guarda também a estimativa do simulador.",
  },
];

const areaNumbers = projects.map((p) => parseInt(p.area, 10)).filter((n) => !Number.isNaN(n));
const minArea = Math.min(...areaNumbers);
const maxArea = Math.max(...areaNumbers);

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
      <section className="relative h-svh min-h-[36rem] overflow-hidden bg-ink text-paper">
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
        <div className="pointer-events-none absolute inset-0 bg-ink/35" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(to_top,rgb(12,12,12,0.75),transparent)]" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-28 md:pb-24">
          <p className="hero-enter hero-enter-delay-1 inline-flex w-fit border border-paper/25 px-3 py-1 text-[11px] tracking-[0.16em] text-paper/85 uppercase">
            Visualização residencial · Maputo
          </p>
          <h1 className="hero-enter hero-enter-delay-2 mt-4 max-w-3xl font-display text-4xl leading-[0.95] font-normal tracking-tight text-balance md:text-6xl lg:text-7xl">
            A casa, antes da primeira parede.
          </h1>
          <p className="hero-enter hero-enter-delay-3 mt-4 max-w-xl text-sm leading-relaxed text-paper/85 md:text-base">
            Estudo visual, projeto executivo ou entrega completa. A família decide o volume e os materiais em imagem — não no estaleiro.
          </p>
          <div className="hero-enter hero-enter-delay-4 mt-8 flex flex-wrap items-center gap-3">
            <a href="#orcamento" className="btn btn-solid-invert btn-shine min-h-12 px-6 text-sm font-medium">
              Pedir cotação
            </a>
            <Link
              to="/portfolio"
              className="btn btn-outline min-h-12 border-paper/50 px-6 text-sm text-paper"
              data-cursor="Projetos"
            >
              Ver projetos
            </Link>
          </div>
          <p className="hero-enter hero-enter-delay-5 mt-8 max-w-md border-l border-paper/30 pl-4 text-sm text-paper/75">
            Já tem terreno? Envie medidas, cidade e número de quartos. Respondemos com a imagem e a referência em meticais.
          </p>
        </div>
      </section>

      {/* Contadores — só números reais do portefólio */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-4 px-5 py-10 md:py-12">
          <Reveal variant="up">
            <p className="font-display text-4xl font-normal md:text-5xl">
              <CountUp to={projects.length} />
            </p>
            <p className="mt-1 text-xs tracking-[0.12em] text-mute uppercase">Residências no portefólio</p>
          </Reveal>
          <Reveal variant="up" delay={80}>
            <p className="font-display text-4xl font-normal md:text-5xl">
              <CountUp to={PATHS.length} />
            </p>
            <p className="mt-1 text-xs tracking-[0.12em] text-mute uppercase">Caminhos de entrega</p>
          </Reveal>
          <Reveal variant="up" delay={160}>
            <p className="font-display text-3xl font-normal md:text-5xl">
              <CountUp to={minArea} />–<CountUp to={maxArea} />
              <span className="text-2xl text-mute"> m²</span>
            </p>
            <p className="mt-1 text-xs tracking-[0.12em] text-mute uppercase">Área nos projetos</p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.14em] text-mute uppercase">Projetos em destaque</p>
              <h2 className="mt-2 font-display text-3xl font-normal md:text-4xl">Casas vistas inteiras antes da obra</h2>
            </div>
            <Link to="/portfolio" className="text-sm underline-offset-4 hover:underline" data-cursor="Todas">
              Ver todos os projetos
            </Link>
          </Reveal>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {projects.slice(0, 4).map((project, i) => (
              <Reveal key={project.slug} as="li" variant="up" delay={i * 90}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="servicos" className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
          <Reveal variant="left">
            <p className="text-xs tracking-[0.14em] text-paper/55 uppercase">Como começar</p>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-normal text-balance md:text-5xl">
              Qual caminho combina consigo?
            </h2>
            <p className="mt-4 max-w-xl text-sm text-paper/70">
              Desde uma estimativa rápida até a entrega com portal e revisões registadas.
            </p>
          </Reveal>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {PATHS.map((path, i) => (
              <Reveal
                key={path.title}
                as="li"
                variant="up"
                delay={i * 100}
                className="lift flex flex-col border border-paper/15 p-6 hover:border-paper/40"
              >
                <h3 className="font-display text-2xl font-normal">{path.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-paper/70">{path.text}</p>
                {path.href.startsWith("/#") ? (
                  <a href={path.href} className="mt-6 text-sm underline underline-offset-4">
                    {path.cta}
                  </a>
                ) : (
                  <Link to={path.href} className="mt-6 text-sm underline underline-offset-4">
                    {path.cta}
                  </Link>
                )}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
          <Reveal variant="right">
            <p className="text-xs tracking-[0.14em] text-mute uppercase">Porquê a TLE</p>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-normal md:text-5xl">
              Menos surpresa na obra. Mais decisão na imagem.
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {REASONS.map((item, i) => (
              <Reveal key={item.n} as="li" variant="up" delay={i * 80}>
                <p className="font-display text-2xl italic text-mute">{item.n}</p>
                <h3 className="mt-2 font-display text-xl font-normal">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{item.text}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-10" delay={200}>
            <a href="#orcamento" className="btn btn-solid btn-shine min-h-12 px-6 text-sm">
              Pedir cotação para o meu terreno
            </a>
          </Reveal>
        </div>
      </section>

      <section id="metodo" className="border-t border-line bg-stone">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
          <Reveal>
            <h2 className="max-w-xl font-display text-3xl font-normal md:text-5xl">
              Da conversa à imagem aprovada.
            </h2>
          </Reveal>
          <ol className="mt-8 grid gap-0 border-t border-line md:grid-cols-4">
            {STEPS.map((step, i) => (
              <Reveal
                key={step.n}
                as="li"
                delay={i * 90}
                className="border-b border-line py-5 md:border-b-0 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <p className="font-display text-2xl italic text-mute">{step.n}</p>
                <h3 className="mt-3 font-display text-2xl font-normal">{step.title}</h3>
                <p className="mt-2 text-sm text-mute">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
          <Reveal className="max-w-xl">
            <p className="text-xs tracking-[0.14em] text-mute uppercase">Estimativa</p>
            <h2 className="mt-2 font-display text-3xl font-normal md:text-5xl">
              Uma referência em meticais para começar.
            </h2>
            <p className="mt-4 text-sm text-mute">
              Metragem, partido e entrega. Não é proposta fechada — terreno e prazo ainda ajustam o valor.
            </p>
          </Reveal>
          <Reveal className="mt-10" delay={120}>
            <Simulator draft={draft} onChange={setDraft} />
          </Reveal>
        </div>
      </section>

      <section className="overflow-hidden">
        <Reveal variant="zoom" className="media-zoom" data-cursor="">
          <img
            src="/renders/pavilhao-dia.webp"
            alt="Pavilhão aberto, laje em balanço e chegada sob cobertura"
            width={1600}
            height={900}
            loading="lazy"
            className="aspect-[16/9] w-full object-cover md:aspect-[21/9]"
          />
        </Reveal>
      </section>

      <section id="duvidas" className="border-t border-line bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-14 md:py-16">
          <Reveal>
            <p className="text-xs tracking-[0.14em] text-mute uppercase">Dúvidas frequentes</p>
            <h2 className="mt-2 font-display text-3xl font-normal md:text-4xl">Ainda tem dúvidas?</h2>
          </Reveal>
          <ul className="mt-8 border-t border-line">
            {FAQS.map((item, index) => {
              const open = openFaq === index;
              return (
                <Reveal key={item.q} as="li" delay={index * 40} className="border-b border-line">
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-4 py-4 text-left"
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
                      <p className="pb-4 text-sm leading-relaxed text-mute">{item.a}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between md:py-16">
          <Reveal variant="left" className="max-w-xl">
            <h2 className="font-display text-3xl font-normal md:text-4xl">Vamos começar a casa em imagem?</h2>
            <p className="mt-3 text-sm text-paper/70">
              Conte o terreno. A TLE responde com a imagem e a referência em meticais.
            </p>
          </Reveal>
          <Reveal variant="right" delay={100}>
            <a href="#orcamento" className="btn btn-solid-invert btn-shine min-h-12 shrink-0 px-6 text-sm font-medium">
              Pedir cotação
            </a>
          </Reveal>
        </div>
      </section>

      <section id="orcamento" className="border-t border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-2 md:py-16">
          <Reveal variant="left">
            <p className="text-xs tracking-[0.14em] text-mute uppercase">Cotação</p>
            <h2 className="mt-2 font-display text-3xl font-normal md:text-5xl">Conte o terreno.</h2>
            <p className="mt-4 max-w-sm text-sm text-mute">
              O pedido leva a estimativa desta página. Sem sessão, fica neste aparelho até entrar no estúdio.
            </p>
            <dl className="mt-10 max-w-sm text-sm">
              <div className="border-t border-line py-3">
                <dt className="text-mute">Telefone</dt>
                <dd className="mt-1">{site.phoneDisplay}</dd>
              </div>
              <div className="border-t border-line py-3">
                <dt className="text-mute">E-mail</dt>
                <dd className="mt-1">
                  <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div className="border-t border-line py-3">
                <dt className="text-mute">Morada</dt>
                <dd className="mt-1">
                  {site.address}
                  <br />
                  {site.city}, {site.country}
                </dd>
              </div>
              <div className="border-t border-b border-line py-3">
                <dt className="text-mute">Redes</dt>
                <dd className="mt-1 text-mute">Instagram, Facebook, LinkedIn — a indicar.</dd>
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
