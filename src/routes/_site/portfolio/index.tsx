import { createFileRoute, Link } from "@tanstack/react-router";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { projects } from "@/data/projects";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/_site/portfolio/")({
  head: () => ({
    meta: [
      { title: "Trabalhos - TLE Group" },
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
    <main className="pt-11">
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-[980px] px-4 py-10 md:py-14">
          <Reveal variant="up">
            <p className="text-[12px] font-medium tracking-[0.14em] text-mute uppercase">Portfólio</p>
          </Reveal>
          <Reveal variant="up" delay={30}>
            <h1 className="mt-2 max-w-2xl font-display text-[1.75rem] font-semibold tracking-[-0.03em] md:text-[2.25rem]">
              Qualidade que se vê antes da obra.
            </h1>
          </Reveal>
          <Reveal variant="up" delay={50}>
            <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-mute md:text-[15px]">
              Volume, luz, materiais e detalhe. Trabalhos reais da TLE Group em Moçambique.
            </p>
          </Reveal>
          <Reveal variant="up" delay={70}>
            <p className="mt-5 text-[13px] text-mute">
              {projects.length} projectos · Residencial · Inhambane
            </p>
          </Reveal>
        </div>
      </section>

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
              <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[980px] px-4 pb-8 md:pb-10">
                <p className="text-[12px] tracking-[0.14em] text-paper/80 uppercase">Em destaque</p>
                <h2 className="mt-1.5 font-display text-[1.5rem] font-semibold tracking-[-0.03em] text-paper md:text-[2rem]">
                  {featured.title}
                </h2>
                <p className="mt-1.5 max-w-lg text-[13px] text-paper/80">
                  {featured.place}
                  <span className="px-1.5">·</span>
                  {featured.area}
                  <span className="px-1.5">·</span>
                  {featured.year}
                </p>
              </div>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="mx-auto max-w-[980px] px-4 py-10 md:py-14">
        <div className="mb-6 flex flex-col gap-2 md:mb-8 md:flex-row md:items-end md:justify-between">
          <Reveal variant="left">
            <h2 className="font-display text-[1.25rem] font-semibold tracking-[-0.02em] md:text-[1.5rem]">
              Todos os trabalhos
            </h2>
          </Reveal>
          <Reveal variant="right" delay={40}>
            <p className="max-w-sm text-[13px] text-mute md:text-right">
              Clique num projecto para ver imagens, materiais e o conceito.
            </p>
          </Reveal>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4">
          {(rest.length ? rest : projects).map((project, i) => (
            <Reveal key={project.slug} as="li" variant="up" delay={(i % 2) * 50}>
              <ProjectCard project={project} aspect="aspect-[4/3]" showYear />
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="border-t border-line bg-stone">
        <div className="mx-auto flex max-w-[980px] flex-col items-start gap-5 px-4 py-10 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="max-w-md">
            <h2 className="font-display text-[1.25rem] font-semibold tracking-[-0.02em] md:text-[1.5rem]">
              O próximo projecto pode ser o seu.
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-mute md:text-[14px]">
              Metragem, local e ideia. Respondemos com estimativa e o caminho até ao executivo.
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
