import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProject } from "@/data/projects";

export const Route = createFileRoute("/_site/portfolio/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Projeto"} — TLE Arquitetura` },
      { name: "description", content: loaderData?.summary ?? "" },
    ],
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const project = Route.useLoaderData();

  return (
    <main className="pt-14">
      <img
        src={project.cover}
        alt={project.images[0]?.alt ?? project.title}
        width={1600}
        height={900}
        className="aspect-[16/10] w-full object-cover md:aspect-[16/8]"
      />
      <article className="mx-auto grid max-w-6xl gap-10 px-5 py-10 md:grid-cols-12 md:py-14">
        <header className="md:col-span-7">
          <p className="text-sm text-mute">
            {project.place}
            <span className="px-1.5">·</span>
            {project.year}
            <span className="px-1.5">·</span>
            {project.area}
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none font-normal md:text-7xl">{project.title}</h1>
          <p className="mt-6 max-w-lg text-charcoal">{project.summary}</p>
          <p className="mt-4 max-w-lg text-sm text-mute">{project.concept}</p>
        </header>
        <div className="md:col-span-4 md:col-start-9">
          <p className="text-sm text-mute">Materiais</p>
          <ul className="mt-2">
            {project.materials.map((item) => (
              <li key={item} className="border-t border-line py-3 text-sm">
                {item}
              </li>
            ))}
          </ul>
          <Link to="/" hash="orcamento" className="mt-6 inline-flex text-sm underline underline-offset-4">
            Pedir uma casa neste partido
          </Link>
        </div>
      </article>
      <section>
        {project.images.map((image) => (
          <figure key={image.src}>
            <img
              src={image.src}
              alt={image.alt}
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
              className="w-full object-cover"
            />
          </figure>
        ))}
      </section>
    </main>
  );
}
