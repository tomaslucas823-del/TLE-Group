import { createFileRoute } from "@tanstack/react-router";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { projects } from "@/data/projects";

export const Route = createFileRoute("/_site/portfolio/")({
  head: () => ({
    meta: [
      { title: "Trabalho — TLE Arquitetura" },
      {
        name: "description",
        content: "Casas desenhadas em imagem, antes da obra. Maputo e arredores.",
      },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <main className="pt-20">
      <header className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-5 py-10">
        <Reveal variant="left" slow>
          <span className="accent-line mb-4 bg-ink" aria-hidden />
          <h1 className="font-display text-5xl leading-none font-normal md:text-7xl">Casas</h1>
        </Reveal>
        <Reveal variant="right" delay={120}>
          <p className="max-w-xs text-right text-sm text-mute">
            {projects.length} residências vistas inteiras antes da primeira parede.
          </p>
        </Reveal>
      </header>
      <ul className="mx-auto grid max-w-6xl gap-8 px-5 pb-16 md:grid-cols-2 md:gap-10">
        {projects.map((project, i) => (
          <Reveal key={project.slug} as="li" variant="up" delay={(i % 2) * 100} slow>
            <ProjectCard project={project} aspect="aspect-[3/2]" showYear />
          </Reveal>
        ))}
      </ul>
    </main>
  );
}
