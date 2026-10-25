import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { brlFromCents } from "@/lib/format";
import { setApproval, type StudioData } from "@/lib/studio.functions";
import {
  type PieceCategory,
  PIECE_CATEGORIES,
  PIECE_CATEGORY_LABEL,
  projectPieceChecklist,
} from "@/lib/studio-pure";
import { cn } from "@/lib/cn";

export function ClientPortal({ data, onChange }: { data: StudioData; onChange: () => void }) {
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [tab, setTab] = useState<PieceCategory>("aparencia");

  const project = data.projects[0];
  const projectId = project?.id ?? 0;

  const checklist = useMemo(
    () => (projectId ? projectPieceChecklist(projectId, data.approvals) : null),
    [projectId, data.approvals],
  );

  if (!project || !checklist) {
    return (
      <div className="space-y-4">
        <p className="text-mute">Ainda não há um projeto nesta conta.</p>
        <p className="text-sm text-mute">
          Quando o estúdio vincular o seu acesso a um cliente, o projecto e as imagens para aprovação
          aparecem aqui.
        </p>
      </div>
    );
  }

  const client = data.clients.find((item) => item.id === project.client_id);
  const steps = data.milestones.filter((item) => item.project_id === project.id);
  const shots = data.approvals.filter((item) => item.project_id === project.id);
  const proposal = data.proposals[0];
  const tabPieces = shots.filter((s) => s.category === tab);

  async function toggleApproval(id: number, approved: boolean) {
    setError("");
    setBusyId(id);
    try {
      await setApproval({ data: { id, approved } });
      onChange();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível actualizar a aprovação.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-10">
      <p className="border border-line bg-stone px-4 py-3 text-sm">
        Visão do cliente {client ? `· ${client.name}` : ""}. A gestão completa fica na{" "}
        <Link to="/estudio" className="underline">
          área do estúdio
        </Link>
        .
      </p>
      {error ? (
        <p role="alert" className="text-sm text-timber-deep">
          {error}
        </p>
      ) : null}
      <header className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end">
        <div>
          <p className="text-sm text-mute">{project.stage}</p>
          <h1 className="mt-2 font-display text-5xl font-normal">{project.title}</h1>
          <p className="mt-3 max-w-xl text-mute">{project.summary}</p>
        </div>
        <img src={project.cover} alt="" width={1600} height={900} className="aspect-video w-full object-cover" />
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PIECE_CATEGORIES.map((cat) => {
          const info = checklist[cat];
          const ready = info.count > 0;
          return (
            <article
              key={cat}
              className={cn("border border-line p-4", ready ? "bg-stone" : "bg-paper")}
            >
              <p className="text-xs tracking-wide text-mute uppercase">{PIECE_CATEGORY_LABEL[cat]}</p>
              <p className="mt-2 font-medium">
                {ready ? `${info.count} peça${info.count === 1 ? "" : "s"}` : "Ainda sem peças"}
              </p>
              <p className="mt-1 text-sm text-mute">
                {ready
                  ? `${info.approved} aprovada${info.approved === 1 ? "" : "s"}`
                  : "O estúdio publicará aqui"}
              </p>
            </article>
          );
        })}
      </section>

      <ol className="space-y-3">
        {steps.length === 0 ? (
          <li className="text-sm text-mute">Etapas do projecto ainda não foram definidas.</li>
        ) : (
          steps.map((step) => (
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
          ))
        )}
      </ol>

      <section>
        <h2 className="font-display text-2xl font-semibold">Peças do projecto</h2>
        <p className="mt-2 text-sm text-mute">
          Aparência, plantas, estrutura e documentos — como nas propostas TLE.
        </p>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {PIECE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={tab === cat}
              onClick={() => setTab(cat)}
              className={cn(
                "min-h-11 shrink-0 px-4 text-sm",
                tab === cat ? "bg-ink text-paper" : "bg-stone text-ink",
              )}
            >
              {PIECE_CATEGORY_LABEL[cat]}
              {checklist[cat].count ? (
                <span className="ml-2 opacity-70">{checklist[cat].count}</span>
              ) : null}
            </button>
          ))}
        </div>

        {tabPieces.length === 0 ? (
          <p className="mt-6 text-sm text-mute">
            Ainda não há peças nesta secção. Quando o estúdio publicar, aparecem aqui para consulta e
            aprovação.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tabPieces.map((shot) => (
              <article key={shot.id} className="border border-line">
                {shot.kind === "pdf" ? (
                  <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-stone p-6">
                    <p className="text-sm text-mute">Documento PDF</p>
                    <a
                      href={shot.image}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonVariants({ variant: "line" })}
                    >
                      Abrir / descarregar
                    </a>
                  </div>
                ) : (
                  <img
                    src={shot.image}
                    alt={shot.label}
                    width={1600}
                    height={900}
                    className="aspect-video w-full object-cover"
                  />
                )}
                <div className="p-4">
                  <p className="font-medium">{shot.label}</p>
                  <p className="mt-1 text-sm text-mute">
                    {shot.approved ? "Aprovada" : "Aguardando decisão"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {shot.kind === "pdf" ? (
                      <a
                        href={shot.image}
                        target="_blank"
                        rel="noreferrer"
                        className={buttonVariants({ variant: "line" })}
                      >
                        Ver PDF
                      </a>
                    ) : null}
                    <button
                      type="button"
                      disabled={busyId === shot.id}
                      className={cn(
                        buttonVariants({ variant: shot.approved ? "line" : "primary" }),
                        "disabled:opacity-60",
                      )}
                      onClick={() => void toggleApproval(shot.id, !shot.approved)}
                    >
                      {busyId === shot.id
                        ? "A guardar…"
                        : shot.approved
                          ? "Pedir ajuste"
                          : "Aprovar"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {proposal ? (
        <section className="border border-line p-5">
          <h2 className="font-display text-2xl font-semibold">Proposta comercial</h2>
          <p className="mt-2 text-sm text-mute">
            {proposal.project_title} · {brlFromCents(proposal.total_cents)}
          </p>
          <Link
            to="/proposta/$id"
            params={{ id: String(proposal.id) }}
            className={cn(buttonVariants({ variant: "line" }), "mt-4")}
          >
            Abrir proposta
          </Link>
        </section>
      ) : null}
    </div>
  );
}
