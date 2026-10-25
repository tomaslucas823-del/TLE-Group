import { createFileRoute, Link } from "@tanstack/react-router";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { projects } from "@/data/projects";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/_site/portfolio/")({
  head: () => ({
    meta: [
      { title: "Trabalhos — TLE Group" },
      {
        name: "description",
        content:
          "Portfólio de projectos residenciais da TLE Group. Visualizações e construção em Inhambane e Moçambique.",
      },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const [featured, ...rest] = projects;

  return (
    <main className="pt-12">
      {/* Hero editorial */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <Reveal variant="up">
            <p className="text-[12px] font-medium tracking-[0.2em] text-mute uppercase">
              Portfólio
            </p>
          </Reveal>
          <Reveal variant="up" delay={40}>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] font-normal tracking-tight md:text-6xl lg:text-7xl">
              Qualidade que se vê antes da obra.
            </h1>
          </Reveal>
          <Reveal variant="up" delay={80}>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-mute md:text-base">
              Cada projecto é apresentado com o rigor das nossas propostas: volume, luz, materiais
              e detalhe. Trabalhos reais da TLE Group em Moçambique.
            </p>
          </Reveal>
          <Reveal variant="up" delay={120}>
            <p className="mt-8 text-[13px] text-mute">
              {projects.length} projectos · Residencial · Inhambane e arredores
            </p>
          </Reveal>
        </div>
      </section>

      {/* Featured — full-bleed premium */}
      {featured ? (
        <section className="border-b border-line">
          <Link
            to="/portfolio/$slug"
            params={{ slug: featured.slug }}
            className="group block"
            data-cursor="Ver projecto"
          >
            <div className="relative overflow-hidden bg-stone">
              <img
                src={featured.cover}
                alt={featured.images[0]?.alt ?? featured.title}
                width={1600}
                height={900}
                className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.02] md:aspect-[21/9]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-5 pb-8 md:pb-12">
                <p className="text-[12px] tracking-[0.16em] text-paper/80 uppercase">Em destaque</p>
                <h2 className="mt-2 font-display text-3xl font-normal text-paper md:text-5xl">
                  {featured.title}
                </h2>
                <p className="mt-2 max-w-lg text-sm text-paper/80 md:text-[15px]">
                  {featured.place}
                  <span className="px-1.5">·</span>
                  {featured.area}
                  <span className="px-1.5">·</span>
                  {featured.year}
                </p>
                <p className="mt-3 hidden max-w-xl text-sm text-paper/70 md:block">{featured.summary}</p>
              </div>
            </div>
          </Link>
        </section>
      ) : null}

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <div className="mb-10 flex flex-col gap-3 md:mb-14 md:flex-row md:items-end md:justify-between">
          <Reveal variant="left">
            <h2 className="font-display text-2xl font-normal md:text-3xl">Todos os trabalhos</h2>
          </Reveal>
          <Reveal variant="right" delay={60}>
            <p className="max-w-sm text-sm text-mute md:text-right">
              Clique num projecto para ver imagens, materiais e o conceito da casa.
            </p>
          </Reveal>
        </div>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5 lg:gap-6">
          {(rest.length ? rest : projects).map((project, i) => (
            <Reveal key={project.slug} as="li" variant="up" delay={(i % 2) * 70}>
              <ProjectCard project={project} aspect="aspect-[4/3]" showYear />
            </Reveal>
          ))}
        </ul>
      </section>

      {/* CTA premium */}
      <section className="border-t border-line bg-stone">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div className="max-w-lg">
            <h2 className="font-display text-2xl font-normal md:text-3xl">
              O próximo projecto pode ser o seu.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-mute md:text-[15px]">
              Conte-nos a metragem, o local e a ideia. Respondemos com uma estimativa e o caminho
              até ao executivo.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/" hash="contacto" className={cn(buttonVariants())}>
              Pedir cotação
            </Link>
            <Link to="/simulador" className={cn(buttonVariants({ variant: "line" }))}>
              Simular custo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
