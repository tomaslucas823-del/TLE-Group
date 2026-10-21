import { Link } from "@tanstack/react-router";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  /** aspect ratio class, e.g. aspect-[4/3] */
  aspect?: string;
  showYear?: boolean;
};

/** Image-led card with rising caption on hover + studio cursor target. */
export function ProjectCard({ project, aspect = "aspect-[4/3]", showYear = false }: ProjectCardProps) {
  return (
    <Link
      to="/portfolio/$slug"
      params={{ slug: project.slug }}
      className="group block"
      data-cursor="Ver projeto"
    >
      <div className="project-card relative overflow-hidden bg-stone">
        <div className="media-zoom">
          <img
            src={project.cover}
            alt={project.images[0]?.alt ?? project.title}
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
            className={`${aspect} w-full object-cover`}
          />
        </div>
        <div className="project-card__caption">
          <p className="font-display text-xl font-normal text-paper md:text-2xl">{project.title}</p>
          <p className="mt-1 text-sm text-paper/75">
            {project.area}
            <span className="px-1.5">·</span>
            {project.place}
            {showYear ? (
              <>
                <span className="px-1.5">·</span>
                {project.year}
              </>
            ) : null}
          </p>
        </div>
      </div>
      <div className="pt-3 md:hidden">
        <h3 className="font-display text-xl font-normal">{project.title}</h3>
        <p className="mt-1 text-sm text-mute">
          {project.area}
          <span className="px-1.5">·</span>
          {project.place}
        </p>
      </div>
    </Link>
  );
}
