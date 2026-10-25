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

/** Estimativa de semanas restantes conforme etapa textual do projecto. */
function estimateRemainingWeeks(stage: string, steps: { status: string }[]) {
  const done = steps.filter((s) => s.status === "feito").length;
  const total = steps.length || 4;
  const remainingSteps = Math.max(0, total - done);
  const s = stage.toLowerCase();
  if (s.includes("entregue") || s.includes("conclu")) return 0;
  if (remainingSteps === 0) return 0;
  if (s.includes("imagem") || s.includes("render")) return Math.max(1, remainingSteps);
  if (s.includes("execut") || s.includes("planta")) return Math.max(2, remainingSteps + 1);
  return Math.max(2, remainingSteps * 2);
}

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
      <div className="mx-auto max-w-[980px] space-y-4">
        <h1 className="font-display text-[1.75rem] font-semibold tracking-[-0.03em] md:text-[2.25rem]">
          Área de entrega e acompanhamento
        </h1>
        <p className="text-[15px] text-mute">Ainda não há um projecto vinculado a esta conta.</p>
        <p className="text-[14px] text-mute">
          Após a contratação e o sinal de 50%, o estúdio activa o acesso. Aqui passará a ver o estado
          do projecto, prazos e ficheiros entregues.
        </p>
        <Link to="/" hash="contacto" className={cn(buttonVariants(), "mt-2 inline-flex")}>
          Pedir cotação
        </Link>
      </div>
    );
  }

  const client = data.clients.find((item) => item.id === project.client_id);
  const steps = data.milestones
    .filter((item) => item.project_id === project.id)
    .slice()
    .sort((a, b) => a.position - b.position);
  const shots = data.approvals.filter((item) => item.project_id === project.id);
  const proposal = data.proposals[0];
  const installments = data.installments.filter((i) =>
    proposal ? i.proposal_id === proposal.id : false,
  );
  const tabPieces = shots.filter((s) => s.category === tab);

  const doneSteps = steps.filter((s) => s.status === "feito").length;
  const progressPct =
    steps.length > 0 ? Math.round((doneSteps / steps.length) * 100) : project.stage ? 25 : 0;
  const weeksLeft = estimateRemainingWeeks(project.stage, steps);
  const sinal = installments.find((i) => i.label.toLowerCase().includes("sinal"));
  const sinalPaid = sinal?.status === "recebido";

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
    <div className="mx-auto max-w-[980px] space-y-10">
      <header className="space-y-3">
        <p className="text-[12px] font-medium tracking-[0.14em] text-mute uppercase">
          Área de entrega e acompanhamento
        </p>
        <h1 className="font-display text-[1.75rem] font-semibold tracking-[-0.03em] md:text-[2.25rem]">
          {project.title}
        </h1>
        <p className="max-w-xl text-[14px] text-mute">
          {client ? `${client.name} · ` : ""}
          {project.place}
          {project.summary ? ` · ${project.summary}` : ""}
        </p>
      </header>

      {error ? (
        <p role="alert" className="text-sm text-timber-deep">
          {error}
        </p>
      ) : null}

      {/* Status cards */}
      <section className="grid gap-3 sm:grid-cols-3">
        <article className="border border-line bg-paper p-4">
          <p className="text-[11px] font-medium tracking-[0.08em] text-mute uppercase">Andamento</p>
          <p className="mt-2 font-display text-[1.75rem] font-semibold tracking-[-0.03em]">
            {progressPct}%
          </p>
          <div className="mt-3 h-1 w-full bg-stone">
            <div className="h-1 bg-ink transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="mt-2 text-[13px] text-mute">{project.stage || "Em preparação"}</p>
        </article>
        <article className="border border-line bg-paper p-4">
          <p className="text-[11px] font-medium tracking-[0.08em] text-mute uppercase">
            Tempo restante
          </p>
          <p className="mt-2 font-display text-[1.75rem] font-semibold tracking-[-0.03em]">
            {weeksLeft === 0 ? "—" : weeksLeft}
          </p>
          <p className="mt-2 text-[13px] text-mute">
            {weeksLeft === 0 ? "Entrega concluída ou a validar" : "semanas estimadas"}
          </p>
        </article>
        <article className="border border-line bg-paper p-4">
          <p className="text-[11px] font-medium tracking-[0.08em] text-mute uppercase">Sinal (50%)</p>
          <p className="mt-2 font-display text-[1.25rem] font-semibold tracking-[-0.02em]">
            {sinalPaid ? "Recebido" : sinal ? "Em aberto" : "A confirmar"}
          </p>
          <p className="mt-2 text-[13px] text-mute">
            {sinal
              ? brlFromCents(sinal.amount_cents)
              : "Após contratação o estúdio regista o pagamento"}
          </p>
        </article>
      </section>

      {/* Phases */}
      <section>
        <h2 className="font-display text-[1.25rem] font-semibold tracking-[-0.02em]">Fases do projecto</h2>
        <ol className="mt-4 space-y-0">
          {steps.length === 0 ? (
            <li className="text-sm text-mute">Etapas ainda não foram definidas pelo estúdio.</li>
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
                <span className="flex-1 text-[14px]">{step.label}</span>
                <span className="text-[13px] text-mute">
                  {step.status === "feito"
                    ? "Concluído"
                    : step.status === "atual"
                      ? "Em curso"
                      : "A seguir"}
                </span>
              </li>
            ))
          )}
        </ol>
      </section>

      {/* Piece checklist */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PIECE_CATEGORIES.map((cat) => {
          const info = checklist[cat];
          const ready = info.count > 0;
          return (
            <article
              key={cat}
              className={cn("border border-line p-4", ready ? "bg-stone" : "bg-paper")}
            >
              <p className="text-[11px] tracking-[0.08em] text-mute uppercase">
                {PIECE_CATEGORY_LABEL[cat]}
              </p>
              <p className="mt-2 text-[14px] font-medium">
                {ready ? `${info.count} peça${info.count === 1 ? "" : "s"}` : "Ainda sem peças"}
              </p>
              <p className="mt-1 text-[13px] text-mute">
                {ready
                  ? `${info.approved} aprovada${info.approved === 1 ? "" : "s"}`
                  : "O estúdio publicará aqui"}
              </p>
            </article>
          );
        })}
      </section>

      {/* Files / approvals */}
      <section>
        <h2 className="font-display text-[1.25rem] font-semibold tracking-[-0.02em]">
          Ficheiros e entregas
        </h2>
        <p className="mt-1 text-[13px] text-mute">
          Aparência, plantas, estrutura e documentos do seu projecto.
        </p>
        <div className="mt-4 flex gap-0 overflow-x-auto border-b border-line">
          {PIECE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={tab === cat}
              onClick={() => setTab(cat)}
              className={cn(
                "relative shrink-0 px-3.5 py-2.5 text-[13px] transition-colors",
                tab === cat ? "text-ink" : "text-mute hover:text-ink",
              )}
            >
              {PIECE_CATEGORY_LABEL[cat]}
              {checklist[cat].count ? (
                <span className="ml-1.5 text-[11px] opacity-60">{checklist[cat].count}</span>
              ) : null}
              {tab === cat ? (
                <span className="absolute inset-x-3 bottom-0 h-px bg-ink" aria-hidden />
              ) : null}
            </button>
          ))}
        </div>

        {tabPieces.length === 0 ? (
          <p className="mt-6 text-[14px] text-mute">
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
          <h2 className="font-display text-[1.25rem] font-semibold tracking-[-0.02em]">
            Proposta comercial
          </h2>
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
