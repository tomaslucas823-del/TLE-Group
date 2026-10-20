import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { brlFromCents } from "@/lib/format";
import { setApproval, type StudioData } from "@/lib/studio.functions";
import { cn } from "@/lib/cn";

export function ClientPortal({ data, onChange }: { data: StudioData; onChange: () => void }) {
  const project = data.projects[0];
  if (!project) {
    return <p className="text-mute">Ainda não há um projeto nesta conta.</p>;
  }
  const client = data.clients.find((item) => item.id === project.client_id);
  const steps = data.milestones.filter((item) => item.project_id === project.id);
  const shots = data.approvals.filter((item) => item.project_id === project.id);
  const proposal = data.proposals[0];

  return (
    <div className="space-y-10">
      <p className="border border-line bg-stone px-4 py-3 text-sm">
        Visão do cliente {client ? `· ${client.name}` : ""}. A gestão completa fica na{" "}
        <Link to="/estudio" className="underline">
          área do estúdio
        </Link>
        .
      </p>
      <header className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end">
        <div>
          <p className="text-sm text-mute">{project.stage}</p>
          <h1 className="mt-2 font-display text-5xl font-normal">{project.title}</h1>
          <p className="mt-3 max-w-xl text-mute">{project.summary}</p>
        </div>
        <img src={project.cover} alt="" width={1600} height={900} className="aspect-video w-full object-cover" />
      </header>
      <ol className="space-y-3">
        {steps.map((step) => (
          <li key={step.id} className="flex items-center gap-4 border-t border-line py-3">
            <span
              className={cn(
                "grid h-8 w-8 place-items-center text-xs",
                step.status === "pendente" ? "bg-stone text-mute" : "bg-ink text-paper",
              )}
            >
              {String(step.position).padStart(2, "0")}
            </span>
            <span className="flex-1">{step.label}</span>
            <span className="text-sm text-mute">
              {step.status === "feito" ? "Concluído" : step.status === "atual" ? "Em curso" : "A seguir"}
            </span>
          </li>
        ))}
      </ol>
      <section>
        <h2 className="font-display text-2xl font-semibold">Imagens para aprovar</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {shots.map((shot) => (
            <article key={shot.id} className="border border-line">
              <img src={shot.image} alt={shot.label} width={1600} height={900} className="aspect-video w-full object-cover" />
              <div className="p-4">
                <p className="font-medium">{shot.label}</p>
                <p className="mt-1 text-sm text-mute">{shot.approved ? "Aprovada" : "Aguardando decisão"}</p>
                <button
                  type="button"
                  className={cn(buttonVariants({ variant: shot.approved ? "line" : "primary" }), "mt-3")}
                  onClick={() =>
                    setApproval({ data: { id: shot.id, approved: !shot.approved } }).then(onChange)
                  }
                >
                  {shot.approved ? "Pedir ajuste" : "Aprovar imagem"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      {proposal ? (
        <section className="border border-line p-5">
          <h2 className="font-display text-2xl font-semibold">Documentos</h2>
          <p className="mt-2 text-sm text-mute">
            {proposal.project_title} · {brlFromCents(proposal.total_cents)}
          </p>
          <Link to="/proposta/$id" params={{ id: String(proposal.id) }} className={cn(buttonVariants({ variant: "line" }), "mt-4")}>
            Baixar proposta
          </Link>
        </section>
      ) : null}
    </div>
  );
}
