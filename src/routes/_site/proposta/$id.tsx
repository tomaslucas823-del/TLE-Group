import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SessionGate } from "@/components/session-gate";
import { buttonVariants } from "@/components/ui/button";
import { brlFromCents } from "@/lib/format";
import { site } from "@/lib/site";
import { loadStudio, type InstallmentRow, type ProposalRow } from "@/lib/studio.functions";

export const Route = createFileRoute("/_site/proposta/$id")({
  head: () => ({
    meta: [
      { title: "Proposta — TLE Arquitetura" },
      { name: "description", content: "Proposta com escopo e cronograma de pagamento." },
    ],
  }),
  component: ProposalRoute,
});

function ProposalRoute() {
  const { id } = Route.useParams();
  return (
    <SessionGate title="Proposta" callbackURL={`/proposta/${id}`}>
      <ProposalSheet id={id} />
    </SessionGate>
  );
}

function ProposalSheet({ id }: { id: string }) {
  const [proposal, setProposal] = useState<ProposalRow | null>(null);
  const [parts, setParts] = useState<InstallmentRow[]>([]);
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    loadStudio()
      .then((data) => {
        if (!live) return;
        const found = data.proposals.find((item) => String(item.id) === id);
        if (!found) {
          setMissing(true);
          return;
        }
        setProposal(found);
        setParts(data.installments.filter((item) => item.proposal_id === found.id));
      })
      .catch((caught: unknown) => {
        if (live) setError(caught instanceof Error ? caught.message : "Não foi possível abrir a proposta.");
      });
    return () => {
      live = false;
    };
  }, [id]);

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-5 pt-28 pb-20">
        <p className="text-sm text-timber-deep">{error}</p>
      </main>
    );
  }

  if (missing) {
    return (
      <main className="mx-auto max-w-3xl px-5 pt-28 pb-20">
        <h1 className="font-display text-3xl font-semibold">Proposta não encontrada.</h1>
        <Link to="/estudio" className={`${buttonVariants({ variant: "line" })} mt-6`}>
          Voltar ao estúdio
        </Link>
      </main>
    );
  }

  if (!proposal) {
    return (
      <main className="mx-auto max-w-3xl px-5 pt-28 pb-20">
        <div className="h-64 animate-pulse bg-stone" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-5 pt-28 pb-20">
      <div className="no-print flex justify-end">
        <button type="button" className={buttonVariants()} onClick={() => window.print()}>
          Salvar em PDF
        </button>
      </div>
      <article className="mt-6 border border-line p-6 md:p-10">
        <p className="font-display text-2xl font-normal">TLE</p>
        <h1 className="mt-6 font-display text-3xl font-semibold">Proposta de visualização</h1>
        <p className="mt-2 text-sm text-mute">
          {site.legalName} · NUIT {site.nuit} · {site.city}
        </p>
        <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-mute">Cliente</dt>
            <dd className="font-medium">{proposal.client_name}</dd>
          </div>
          <div>
            <dt className="text-mute">Projeto</dt>
            <dd className="font-medium">{proposal.project_title}</dd>
          </div>
        </dl>
        <p className="mt-6">{proposal.scope}</p>
        <p className="mt-6 font-display text-3xl font-semibold">{brlFromCents(proposal.total_cents)}</p>
        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-mute">
              <th className="py-2 font-medium">Etapa</th>
              <th className="py-2 font-medium">Quando</th>
              <th className="py-2 text-right font-medium">Valor</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => (
              <tr key={part.id} className="border-b border-line">
                <td className="py-3">
                  {part.label} · {part.percent}%
                  <span className="mt-1 block text-xs text-mute">
                    {part.status === "recebido" ? "Recebido" : part.status === "aguardando" ? "Aguardando" : "Em aberto"}
                    {part.method ? ` · ${part.method}` : ""}
                  </span>
                </td>
                <td className="py-3 text-mute">{part.due_label}</td>
                <td className="py-3 text-right">{brlFromCents(part.amount_cents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-8 text-sm text-mute">
          M-Pesa, e-Mola, cartão e transferência ficam registados aqui como controlo interno, sempre em
          meticais. A cobrança no operador ou no banco só acontece depois de ligar o gateway. Nenhum
          valor desta página é debitado automaticamente. Cartão internacional, quando existir, é
          convertido para MZN.
        </p>
      </article>
    </main>
  );
}
