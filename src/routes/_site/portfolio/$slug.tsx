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
    <main className="pt-11">
      <div className="mx-auto max-w-[980px] px-4 pt-5">
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

      <article className="mx-auto grid max-w-[980px] gap-8 px-4 py-10 md:grid-cols-12 md:gap-10 md:py-14">
        <header className="md:col-span-7">
          <p className="text-[12px] tracking-[0.14em] text-mute uppercase">
            {project.kind}
            <span className="px-1.5 normal-case tracking-normal">·</span>
            {project.place}
            <span className="px-1.5">·</span>
            {project.year}
          </p>
          <h1 className="mt-2 font-display text-[1.75rem] font-semibold tracking-[-0.03em] md:text-[2.25rem]">
            {project.title}
          </h1>
          <p className="mt-1.5 text-[13px] text-mute">{project.area}</p>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-charcoal">{project.summary}</p>
          <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-mute">{project.concept}</p>
        </header>

        <div className="md:col-span-4 md:col-start-9">
          <p className="text-[12px] font-medium tracking-[0.12em] text-mute uppercase">Materiais</p>
          <ul className="mt-3">
            {project.materials.map((item) => (
              <li key={item} className="border-t border-line py-2.5 text-[14px]">
                {item}
              </li>
            ))}
          </ul>
          <Link to="/" hash="contacto" className={cn(buttonVariants(), "mt-6")}>
            Pedir cotação neste projecto
          </Link>
        </div>
      </article>

      {rest.length ? (
        <section className="mx-auto max-w-[980px] px-4 pb-14 md:pb-20">
          <p className="mb-4 text-[12px] tracking-[0.14em] text-mute uppercase">Galeria</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
