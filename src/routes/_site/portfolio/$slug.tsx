import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { getProject } from "@/data/projects";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/_site/portfolio/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Projeto"} — TLE Group` },
      { name: "description", content: loaderData?.summary ?? "" },
    ],
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const project = Route.useLoaderData();
  const [hero, ...rest] = project.images;

  return (
    <main className="pt-12">
      <div className="mx-auto max-w-6xl px-5 pt-6">
        <Link
          to="/portfolio"
          className="text-[13px] text-mute transition-opacity hover:text-ink hover:opacity-100"
        >
          ← Todos os trabalhos
        </Link>
      </div>

      <div className="mt-4 overflow-hidden bg-stone">
        <img
          src={project.cover}
          alt={hero?.alt ?? project.title}
          width={1600}
          height={900}
          className="aspect-[16/10] w-full object-cover md:aspect-[21/9]"
        />
      </div>

      <article className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-12 md:gap-12 md:py-16">
        <header className="md:col-span-7">
          <p className="text-[12px] tracking-[0.16em] text-mute uppercase">
            {project.kind}
            <span className="px-1.5 normal-case tracking-normal">·</span>
            {project.place}
            <span className="px-1.5">·</span>
            {project.year}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-none font-normal tracking-tight md:text-6xl">
            {project.title}
          </h1>
          <p className="mt-2 text-sm text-mute">{project.area}</p>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-charcoal">{project.summary}</p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-mute">{project.concept}</p>
        </header>

        <div className="md:col-span-4 md:col-start-9">
          <p className="text-[12px] font-medium tracking-[0.12em] text-mute uppercase">Materiais</p>
          <ul className="mt-3">
            {project.materials.map((item) => (
              <li key={item} className="border-t border-line py-3 text-sm">
                {item}
              </li>
            ))}
          </ul>
          <Link to="/" hash="contacto" className={cn(buttonVariants(), "mt-8")}>
            Pedir cotação neste projecto
          </Link>
        </div>
      </article>

      {rest.length ? (
        <section className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
          <p className="mb-6 text-[12px] tracking-[0.16em] text-mute uppercase">Galeria</p>
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
      ) : null}
    </main>
  );
}
