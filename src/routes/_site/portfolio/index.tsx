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
      <ul className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
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
                <h2 className="font-display text-xl font-normal md:text-2xl">{project.title}</h2>
                <p className="mt-1 text-sm text-mute">
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
