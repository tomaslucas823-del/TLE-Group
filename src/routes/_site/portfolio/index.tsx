import { createFileRoute } from "@tanstack/react-router";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { projects } from "@/data/projects";

export const Route = createFileRoute("/_site/portfolio/")({
  head: () => ({
    meta: [
      { title: "Trabalho - TLE Arquitetura" },
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
      <header className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-5 py-8">
        <Reveal variant="left">
          <h1 className="font-display text-4xl leading-none font-normal md:text-6xl">Casas</h1>
        </Reveal>
        <Reveal variant="right" delay={80}>
          <p className="max-w-xs text-right text-sm text-mute">
            {projects.length} residências vistas inteiras antes da primeira parede.
          </p>
        </Reveal>
      </header>
      <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-3 px-5 pb-12 sm:grid-cols-2 md:gap-4 md:pb-16">
        {projects.map((project, i) => (
          <Reveal key={project.slug} as="li" variant="up" delay={(i % 2) * 60}>
            <ProjectCard project={project} aspect="aspect-[4/3]" showYear />
          </Reveal>
        ))}
      </ul>
    </main>
  );
}
