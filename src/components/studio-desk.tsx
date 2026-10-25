import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { styleLabel, tierLabel } from "@/lib/estimate";
import { mznFromCents, formatWhen, googleCalendarUrl, meetingIcs } from "@/lib/format";
import {
  addClient,
  addMeeting,
  createProposal,
  deleteLead,
  setInstallment,
  setLeadStatus,
  type StudioData,
} from "@/lib/studio.functions";

const TABS = [
  ["resumo", "Resumo"],
  ["leads", "Leads"],
  ["clientes", "Clientes"],
  ["agenda", "Agenda"],
  ["propostas", "Propostas"],
] as const;

const STATUS = [
  ["novo", "Novo"],
  ["conversa", "Em conversa"],
  ["proposta", "Proposta"],
  ["fechado", "Fechado"],
] as const;

const STATUS_LABEL: Record<string, string> = Object.fromEntries(STATUS);

function csvEscape(value: string | number | null | undefined): string {
  const raw = value == null ? "" : String(value);
  if (/[",\n\r]/.test(raw)) return `"${raw.replace(/"/g, '""')}"`;
  return raw;
}

function exportLeadsExcel(leads: StudioData["leads"]) {
  const headers = [
    "ID",
    "Nome",
    "E-mail",
    "Telefone",
    "Metragem (m²)",
    "Partido",
    "Entrega",
    "Estimativa (MZN)",
    "Situação",
    "Mensagem",
  ];
  const rows = leads.map((lead) => [
    lead.id,
    lead.name,
    lead.email,
    lead.phone,
    lead.area_m2,
    styleLabel(lead.style),
    tierLabel(lead.complexity),
    (lead.estimate_cents / 100).toFixed(2).replace(".", ","),
    STATUS_LABEL[lead.status] ?? lead.status,
    lead.message ?? "",
  ]);
  const lines = [headers, ...rows].map((row) => row.map(csvEscape).join(";"));
  // BOM UTF-8 para o Excel abrir acentos corretamente; ; como separador (padrão PT)
  const csv = `\uFEFF${lines.join("\r\n")}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `tle-leads-${date}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function StudioDesk({ data, onChange }: { data: StudioData; onChange: () => void }) {
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("resumo");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(task: () => Promise<unknown>) {
    setError("");
    setBusy(true);
    try {
      await task();
      onChange();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível salvar.");
    } finally {
      setBusy(false);
    }
  }

  function confirmDeleteLead(lead: StudioData["leads"][number]) {
    const ok = window.confirm(
      `Apagar o lead de ${lead.name}? Esta ação não pode ser desfeita.`,
    );
    if (!ok) return;
    void run(() => deleteLead({ data: { id: lead.id } }));
  }

  const openLeads = data.leads.filter((lead) => lead.status === "novo").length;
  const waiting = data.installments.filter((item) => item.status !== "recebido").length;

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "min-h-11 shrink-0 px-4 text-sm",
              tab === id ? "bg-ink text-paper" : "bg-stone text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {error ? (
        <p role="alert" className="mt-4 text-sm text-timber-deep">
          {error}
        </p>
      ) : null}

      {tab === "resumo" ? (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Stat label="Leads novos" value={String(openLeads)} />
          <Stat label="Parcelas em aberto" value={String(waiting)} />
          <Stat label="Projetos" value={String(data.projects.length)} />
          <article className="border border-line p-5 md:col-span-3">
            <p className="text-sm text-mute">Próxima conversa</p>
            {data.meetings[0] ? (
              <>
                <h3 className="mt-2 font-display text-2xl font-semibold">{data.meetings[0].title}</h3>
                <p className="mt-2 text-sm text-mute">
                  {data.meetings[0].client_name} · {formatWhen(data.meetings[0].starts_at)} ·{" "}
                  {data.meetings[0].place}
                </p>
              </>
            ) : (
              <p className="mt-2 text-mute">Nenhuma reunião na agenda.</p>
            )}
          </article>
        </div>
      ) : null}

      {tab === "leads" ? (
        data.leads.length === 0 ? (
          <div className="mt-6 border border-line p-6">
            <p className="font-medium">Ainda não há leads.</p>
            <p className="mt-2 text-sm text-mute">
              Pedidos do formulário público aparecem aqui. Pode também importar leads guardados no
              aparelho ao abrir esta área.
            </p>
          </div>
        ) : (
          <div className="mt-6">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                className={buttonVariants({ variant: "line" })}
                onClick={() => exportLeadsExcel(data.leads)}
              >
                Exportar Excel
              </button>
            </div>
            <ul className="divide-y divide-line border border-line">
              {data.leads.map((lead) => (
                <li
                  key={lead.id}
                  className="grid gap-4 p-4 md:grid-cols-[1.4fr_0.8fr_auto] md:items-center"
                >
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-mute">
                      {lead.email} · {lead.phone}
                    </p>
                    <p className="mt-1 text-sm">
                      {lead.area_m2} m² · {styleLabel(lead.style)} · {tierLabel(lead.complexity)} ·{" "}
                      {mznFromCents(lead.estimate_cents)}
                    </p>
                    {lead.message ? <p className="mt-2 text-sm text-mute">{lead.message}</p> : null}
                  </div>
                  <label className="text-sm">
                    Situação
                    <select
                      className="mt-1 h-11 w-full border border-line bg-paper px-3"
                      value={lead.status}
                      disabled={busy}
                      onChange={(event) =>
                        run(() =>
                          setLeadStatus({ data: { id: lead.id, status: event.target.value } }),
                        )
                      }
                    >
                      {STATUS.map(([id, label]) => (
                        <option key={id} value={id}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      className={cn(buttonVariants({ variant: "line" }), "disabled:opacity-60")}
                      onClick={() => run(() => createProposal({ data: { leadId: lead.id } }))}
                    >
                      Gerar proposta
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      className={cn(
                        buttonVariants({ variant: "line" }),
                        "text-timber-deep disabled:opacity-60",
                      )}
                      onClick={() => confirmDeleteLead(lead)}
                    >
                      Apagar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      ) : null}

      {tab === "clientes" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <ClientForm onCreate={(input) => run(() => addClient({ data: input }))} />
          {data.clients.length === 0 ? (
            <div className="border border-line p-6">
              <p className="font-medium">Sem clientes ainda.</p>
              <p className="mt-2 text-sm text-mute">
                Adicione um cliente à esquerda para depois vincular acesso ao portal.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-line border border-line">
              {data.clients.map((client) => (
                <li key={client.id} className="p-4">
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-mute">
                    {client.city} · {client.email} · {client.phone}
                  </p>
                  {client.notes ? <p className="mt-2 text-sm">{client.notes}</p> : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {tab === "agenda" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <MeetingForm onCreate={(input) => run(() => addMeeting({ data: input }))} />
          {data.meetings.length === 0 ? (
            <div className="border border-line p-6">
              <p className="font-medium">Agenda vazia.</p>
              <p className="mt-2 text-sm text-mute">Agende a próxima conversa no formulário ao lado.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {data.meetings.map((meeting) => (
                <li key={meeting.id} className="border border-line p-4">
                  <p className="font-medium">{meeting.title}</p>
                  <p className="mt-1 text-sm text-mute">
                    {meeting.client_name} · {formatWhen(meeting.starts_at)} · {meeting.place}
                  </p>
                  {meeting.notes ? <p className="mt-2 text-sm">{meeting.notes}</p> : null}
                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    <a
                      className="underline"
                      href={googleCalendarUrl(meeting.title, meeting.starts_at, meeting.place)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Google Calendar
                    </a>
                    <button
                      type="button"
                      className="underline"
                      onClick={() =>
                        downloadIcs(meeting.title, meeting.starts_at, meeting.place, meeting.notes)
                      }
                    >
                      Descarregar .ics
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {tab === "propostas" ? (
        data.proposals.length === 0 ? (
          <div className="mt-6 border border-line p-6">
            <p className="font-medium">Nenhuma proposta gerada.</p>
            <p className="mt-2 text-sm text-mute">
              Na aba Leads, use “Gerar proposta” para criar o documento e as parcelas em meticais.
            </p>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {data.proposals.map((proposal) => {
              const parts = data.installments.filter((item) => item.proposal_id === proposal.id);
              return (
                <li key={proposal.id} className="border border-line p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-xl font-semibold">{proposal.project_title}</p>
                      <p className="text-sm text-mute">{proposal.client_name}</p>
                    </div>
                    <Link
                      to="/proposta/$id"
                      params={{ id: String(proposal.id) }}
                      className={buttonVariants({ variant: "line" })}
                    >
                      Abrir documento
                    </Link>
                  </div>
                  <p className="mt-3 text-sm">{proposal.scope}</p>
                  <p className="mt-3 font-medium">{mznFromCents(proposal.total_cents)}</p>
                  <ul className="mt-4 space-y-3">
                    {parts.map((part) => (
                      <InstallmentLine
                        key={part.id}
                        part={part}
                        onSave={(status, method) =>
                          run(() => setInstallment({ data: { id: part.id, status, method } }))
                        }
                      />
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        )
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <article className="bg-stone p-5">
      <p className="text-sm text-mute">{label}</p>
      <p className="mt-2 font-display text-4xl font-semibold">{value}</p>
    </article>
  );
}

function ClientForm({
  onCreate,
}: {
  onCreate: (input: { name: string; email: string; phone: string; city: string; notes: string }) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  return (
    <form
      className="space-y-3 border border-line p-4"
      onSubmit={(event) => {
        event.preventDefault();
        onCreate({ name, email, phone, city, notes });
        setName("");
        setEmail("");
        setPhone("");
        setCity("");
        setNotes("");
      }}
    >
      <p className="font-medium">Novo cliente</p>
      <input
        className="h-11 w-full border border-line px-3"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className="h-11 w-full border border-line px-3"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="h-11 w-full border border-line px-3"
        placeholder="Telefone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        className="h-11 w-full border border-line px-3"
        placeholder="Cidade"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <textarea
        className="w-full border border-line px-3 py-2"
        rows={3}
        placeholder="Notas"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button type="submit" className={buttonVariants()}>
        Salvar cliente
      </button>
    </form>
  );
}

function MeetingForm({
  onCreate,
}: {
  onCreate: (input: {
    clientName: string;
    title: string;
    startsAt: string;
    place: string;
    notes: string;
  }) => void;
}) {
  const [clientName, setClientName] = useState("");
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState("2026-10-28T09:00");
  const [place, setPlace] = useState("Videoconferência");
  const [notes, setNotes] = useState("");
  return (
    <form
      className="space-y-3 border border-line p-4"
      onSubmit={(event) => {
        event.preventDefault();
        onCreate({ clientName, title, startsAt, place, notes });
        setTitle("");
        setNotes("");
      }}
    >
      <p className="font-medium">Nova reunião</p>
      <input
        className="h-11 w-full border border-line px-3"
        placeholder="Cliente"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
      />
      <input
        className="h-11 w-full border border-line px-3"
        placeholder="Assunto"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        className="h-11 w-full border border-line px-3"
        type="datetime-local"
        value={startsAt}
        onChange={(e) => setStartsAt(e.target.value)}
        required
      />
      <input
        className="h-11 w-full border border-line px-3"
        placeholder="Local"
        value={place}
        onChange={(e) => setPlace(e.target.value)}
      />
      <textarea
        className="w-full border border-line px-3 py-2"
        rows={3}
        placeholder="Pauta"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button type="submit" className={buttonVariants()}>
        Agendar
      </button>
    </form>
  );
}

function InstallmentLine({
  part,
  onSave,
}: {
  part: StudioData["installments"][number];
  onSave: (status: string, method: string) => void;
}) {
  const [method, setMethod] = useState(part.method || "mpesa");
  const label =
    part.status === "recebido" ? "Recebido" : part.status === "aguardando" ? "Aguardando" : "Em aberto";
  return (
    <li className="border-t border-line pt-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span>
          {part.label} · {part.percent}% · {part.due_label}
        </span>
        <span className="font-medium">
          {mznFromCents(part.amount_cents)} · {label}
        </span>
      </div>
      {part.status !== "recebido" ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            className="h-11 border border-line bg-paper px-3"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="mpesa">M-Pesa</option>
            <option value="emola">e-Mola</option>
            <option value="cartao">Cartão (em MZN)</option>
            <option value="transferencia">Transferência</option>
          </select>
          <button
            type="button"
            className={buttonVariants({ variant: "line" })}
            onClick={() => onSave("aguardando", method)}
          >
            Registar cobrança
          </button>
          <button
            type="button"
            className={buttonVariants()}
            onClick={() => onSave("recebido", method || part.method || "mpesa")}
          >
            Confirmar recebimento
          </button>
        </div>
      ) : null}
      {part.status === "aguardando" && (part.method || method) === "mpesa" ? (
        <p className="mt-3 text-mute">
          Referência demonstrativa M-Pesa, sem débito: TLE-MPESA-{part.id}-{part.amount_cents}. A
          cobrança real entra quando a conta M-Pesa do estúdio estiver ligada.
        </p>
      ) : null}
      {part.status === "aguardando" && (part.method || method) === "emola" ? (
        <p className="mt-3 text-mute">
          Referência demonstrativa e-Mola, sem débito: TLE-EMOLA-{part.id}-{part.amount_cents}.
        </p>
      ) : null}
      {part.status === "aguardando" && (part.method || method) === "cartao" ? (
        <p className="mt-3 text-mute">
          Cartão internacional fica registado em meticais. Nenhum valor é debitado nesta página.
        </p>
      ) : null}
    </li>
  );
}

function downloadIcs(title: string, startsAt: string, place: string, notes: string) {
  const blob = new Blob([meetingIcs(title, startsAt, place, notes)], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "tle-reuniao.ics";
  link.click();
  URL.revokeObjectURL(url);
}
