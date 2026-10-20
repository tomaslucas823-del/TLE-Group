import { createFileRoute, Link } from "@tanstack/react-router";
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
        <h1 className="font-display text-5xl leading-none font-normal md:text-7xl">Casas</h1>
        <p className="max-w-xs text-right text-sm text-mute">Cinco residências vistas inteiras antes da primeira parede.</p>
      </header>
      <ul>
        {projects.map((project) => (
          <li key={project.slug} className="border-t border-line">
            <Link to="/portfolio/$slug" params={{ slug: project.slug }} className="group block">
              <img
                src={project.cover}
                alt={project.images[0]?.alt ?? project.title}
                width={1600}
                height={900}
                loading="lazy"
                decoding="async"
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="mx-auto flex max-w-6xl items-baseline justify-between gap-4 px-5 py-4">
                <h2 className="font-display text-3xl font-normal md:text-4xl">{project.title}</h2>
                <p className="text-sm text-mute">
                  {project.place}
                  <span className="px-1.5">·</span>
                  {project.year}
                  <span className="px-1.5">·</span>
                  {project.area}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
