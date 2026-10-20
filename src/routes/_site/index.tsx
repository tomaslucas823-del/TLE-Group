import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QuoteForm } from "@/components/quote-form";
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
          "Visualização residencial em Moçambique. A casa em imagem, estimativa em meticais e acompanhamento no portal.",
      },
    ],
  }),
  component: HomePage,
});

const STEPS = [
  {
    n: "01",
    title: "Programa",
    text: "Metragem, terreno e o que a casa precisa de conter.",
  },
  {
    n: "02",
    title: "Partido",
    text: "Volume, chegada e o que a rua pode ver.",
  },
  {
    n: "03",
    title: "Imagem",
    text: "Pedra, madeira e luz, no horário certo.",
  },
  {
    n: "04",
    title: "Entrega",
    text: "Plantas, prazo e cada revisão no portal.",
  },
];

function HomePage() {
  const search = Route.useSearch();
  const [draft, setDraft] = useState<Draft>(() => ({
    area: clampArea(search.area),
    style: isStyle(search.estilo) ? search.estilo : "pedra",
    tier: isTier(search.entrega) ? search.entrega : "estudo",
  }));
  const [playHero, setPlayHero] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlayHero(false);
  }, []);

  return (
    <main>
      <section className="relative h-svh min-h-[36rem] bg-ink text-paper">
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
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(to_top,rgba(12,12,12,0.55),transparent)]" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-32 md:pb-24">
          <p className="font-display text-xl italic">Maputo</p>
          <h1 className="mt-2 max-w-4xl font-display text-5xl leading-[0.92] font-normal tracking-tight text-balance md:text-7xl">
            A casa, antes da primeira parede.
          </h1>
          <div className="mt-8 flex gap-8 text-sm">
            <a href="#orcamento" className="border-b border-paper/60 pb-0.5">
              Cotação
            </a>
            <Link to="/portfolio" className="border-b border-paper/60 pb-0.5">
              Trabalho
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-end gap-8 px-5 py-14 md:grid-cols-12 md:py-16">
        <h2 className="font-display text-4xl leading-[1.02] font-normal text-balance md:col-span-7 md:text-5xl">
          Menos surpresa na obra. Mais decisão na imagem.
        </h2>
        <p className="text-sm leading-relaxed text-mute md:col-span-4 md:col-start-9">
          Fachada, chegada e o que a rua vê são material e luz. Quando isso só aparece no estaleiro,
          o retrabalho já tem preço. Residências em Moçambique — volumes brancos, pedra, madeira, betão.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-14 md:pb-16">
        <div className="flex items-baseline justify-between pb-6">
          <h2 className="font-display text-3xl font-normal">Casas</h2>
          <Link to="/portfolio" className="text-sm text-mute underline-offset-4 hover:text-ink hover:underline">
            Todas
          </Link>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <li key={project.slug}>
              <Link to="/portfolio/$slug" params={{ slug: project.slug }} className="group block">
                <div className="overflow-hidden border border-line bg-paper">
                  <img
                    src={project.cover}
                    alt={project.images[0]?.alt ?? project.title}
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="pt-3">
                  <h3 className="font-display text-xl font-normal md:text-2xl">{project.title}</h3>
                  <p className="mt-1 text-sm text-mute">
                    {project.place}
                    <span className="px-1.5">·</span>
                    {project.area}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="metodo" className="mx-auto max-w-6xl px-5 py-14 md:py-16">
        <h2 className="max-w-xl font-display text-4xl leading-none font-normal md:text-5xl">
          Da conversa à imagem aprovada.
        </h2>
        <ol className="mt-8 grid gap-0 border-t border-line md:grid-cols-4">
          {STEPS.map((step) => (
            <li key={step.n} className="border-b border-line py-5 md:border-b-0 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
              <p className="font-display text-2xl italic text-mute">{step.n}</p>
              <h3 className="mt-3 font-display text-2xl font-normal">{step.title}</h3>
              <p className="mt-2 text-sm text-mute">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
          <div className="max-w-xl">
            <h2 className="font-display text-4xl leading-none font-normal md:text-5xl">
              Uma estimativa para começar.
            </h2>
            <p className="mt-4 text-sm text-mute">
              Metragem, partido e entrega. O valor é referência de estudo, em meticais.
            </p>
          </div>
          <div className="mt-10">
            <Simulator draft={draft} onChange={setDraft} />
          </div>
        </div>
      </section>

      <section>
        <img
          src="/renders/pavilhao-dia.webp"
          alt="Pavilhão aberto, laje em balanço e chegada sob cobertura"
          width={1600}
          height={900}
          loading="lazy"
          className="aspect-[16/9] w-full object-cover md:aspect-[21/9]"
        />
      </section>

      <section id="orcamento" className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-2 md:py-16">
          <div>
            <h2 className="font-display text-4xl leading-none font-normal md:text-5xl">
              Conte o terreno.
            </h2>
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
          </div>
          <QuoteForm draft={draft} />
        </div>
      </section>
    </main>
  );
}
