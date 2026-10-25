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
      { title: `${loaderData?.title ?? "Projeto"} - TLE Group` },
      { name: "description", content: loaderData?.summary ?? "" },
    ],
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const project = Route.useLoaderData();
  const [hero, ...rest] = project.images;

  return (
    <main className="pt-14">
      <img
        src={project.cover}
        alt={hero?.alt ?? project.title}
        width={1600}
        height={900}
        className="aspect-[16/10] w-full object-cover md:aspect-[16/8]"
      />

      <article className="mx-auto grid max-w-6xl gap-8 px-5 py-8 md:grid-cols-12 md:py-10">
        <header className="md:col-span-7">
          <p className="text-sm text-mute">
            {project.place}
            <span className="px-1.5">·</span>
            {project.year}
            <span className="px-1.5">·</span>
            {project.area}
          </p>
          <h1 className="mt-2 font-display text-4xl leading-none font-normal md:text-6xl">{project.title}</h1>
          <p className="mt-4 max-w-lg text-charcoal">{project.summary}</p>
          <p className="mt-3 max-w-lg text-sm text-mute">{project.concept}</p>
        </header>
        <div className="md:col-span-4 md:col-start-9">
          <p className="text-sm text-mute">Materiais</p>
          <ul className="mt-2">
            {project.materials.map((item) => (
              <li key={item} className="border-t border-line py-2.5 text-sm">
                {item}
              </li>
            ))}
          </ul>
          <Link to="/" hash="contacto" className="mt-5 inline-flex text-sm underline underline-offset-4">
            Pedir cotação neste projecto
          </Link>
        </div>
      </article>

      <section className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
          {rest.map((image) => (
            <figure key={image.src} className="overflow-hidden bg-stone">
              <img
                src={image.src}
                alt={image.alt}
                width={1200}
                height={800}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}
