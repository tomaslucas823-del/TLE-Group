import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  PUBLIC_LEAD_INBOX,
  publicLeadOwnerId,
  requireStudio,
  resolvePortalScope,
  studioWorkspaceId,
} from "@/lib/auth/roles.server";
import { assertRateLimit } from "@/lib/rate-limit.server";
import {
  clampArea,
  estimateCents,
  isStyle,
  isTier,
  splitPayments,
  styleLabel,
  tierLabel,
} from "@/lib/estimate";

export type ClientRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  notes: string;
};

export type LeadRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  area_m2: number;
  style: string;
  complexity: string;
  estimate_cents: number;
  message: string;
  status: string;
};

export type ProjectRow = {
  id: number;
  client_id: number;
  title: string;
  place: string;
  stage: string;
  cover: string;
  summary: string;
};

export type MilestoneRow = {
  id: number;
  project_id: number;
  label: string;
  status: string;
  position: number;
};

export type ApprovalRow = {
  id: number;
  project_id: number;
  label: string;
  image: string;
  approved: boolean;
};

export type MeetingRow = {
  id: number;
  client_name: string;
  title: string;
  starts_at: string;
  place: string;
  notes: string;
};

export type ProposalRow = {
  id: number;
  lead_id: number | null;
  client_name: string;
  project_title: string;
  total_cents: number;
  scope: string;
};

export type InstallmentRow = {
  id: number;
  proposal_id: number;
  label: string;
  percent: number;
  amount_cents: number;
  due_label: string;
  status: string;
  method: string;
};

export type StudioData = {
  clients: ClientRow[];
  leads: LeadRow[];
  projects: ProjectRow[];
  milestones: MilestoneRow[];
  approvals: ApprovalRow[];
  meetings: MeetingRow[];
  proposals: ProposalRow[];
  installments: InstallmentRow[];
};

const LEAD_STATUS = ["novo", "conversa", "proposta", "fechado"] as const;
const PAY_STATUS = ["aberto", "aguardando", "recebido"] as const;
const PAY_METHOD = ["", "mpesa", "emola", "cartao", "transferencia"] as const;

function text(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

function clientIp(): string {
  const request = getRequest();
  if (!request) return "unknown";
  const h = request.headers;
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || h.get("x-real-ip") || "unknown";
}

function normalizeLead(input: unknown) {
  const row = (input ?? {}) as Record<string, unknown>;
  const name = text(row.name, 80);
  const email = text(row.email, 120).toLowerCase();
  const phone = text(row.phone, 24);
  const message = text(row.message, 800);
  const style = text(row.style, 40);
  const complexity = text(row.complexity, 40);
  const areaM2 = clampArea(Number(row.areaM2));
  if (name.length < 2) throw new Error("Informe o nome.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("E-mail inválido.");
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 13) throw new Error("Telefone inválido.");
  if (!isStyle(style) || !isTier(complexity)) throw new Error("Estimativa incompleta.");
  return { name, email, phone, areaM2, style, complexity, message };
}

async function seed(uid: string) {
  const sql = await getSql();
  const inserted = await sql<{ user_id: string }>`
    insert into workspace_seed (user_id) values (${uid})
    on conflict (user_id) do nothing
    returning user_id
  `;
  if (!inserted.length) return;

  const marina = await sql<{ id: number }>`
    insert into clients (user_id, name, email, phone, city, notes)
    values (
      ${uid},
      ${"Marina Alves"},
      ${"marina.alves@email.com"},
      ${"+258 84 000 1100"},
      ${"Maputo"},
      ${"Quer decidir a pedra e a madeira antes de contratar a obra."}
    )
    returning id
  `;
  const ricardo = await sql<{ id: number }>`
    insert into clients (user_id, name, email, phone, city, notes)
    values (
      ${uid},
      ${"Ricardo Pacheco"},
      ${"ricardo.pacheco@email.com"},
      ${"+258 84 000 1188"},
      ${"Matola"},
      ${"Terreno estreito. Prioridade: garagem para dois carros e suíte."}
    )
    returning id
  `;

  const casa = await sql<{ id: number }>`
    insert into projects (user_id, client_id, title, place, stage, cover, summary)
    values (
      ${uid},
      ${marina[0].id},
      ${"Casa Véu"},
      ${"Matola"},
      ${"Projeto executivo"},
      ${"/renders/veu-frente.webp"},
      ${"Volumes brancos, plano de pedra e garagem em pórtico."}
    )
    returning id
  `;
  const projectId = casa[0].id;
  const steps = [
    ["Briefing e visita ao terreno", "feito"],
    ["Estudo de volumes", "feito"],
    ["Projeto executivo", "atual"],
    ["Imagens finais", "pendente"],
    ["Entrega do memorial", "pendente"],
  ];
  for (let index = 0; index < steps.length; index += 1) {
    const [label, status] = steps[index];
    await sql`
      insert into milestones (user_id, project_id, label, status, position)
      values (${uid}, ${projectId}, ${label}, ${status}, ${index + 1})
    `;
  }
  const shots = [
    ["Fachada frontal", "/renders/veu-frente.webp", true],
    ["Acesso de pedra", "/renders/veu-entrada.webp", true],
    ["Chegada noturna", "/renders/veu-noite.webp", false],
  ] as const;
  for (const [label, image, approved] of shots) {
    await sql`
      insert into approvals (user_id, project_id, label, image, approved)
      values (${uid}, ${projectId}, ${label}, ${image}, ${approved})
    `;
  }

  await sql`
    insert into projects (user_id, client_id, title, place, stage, cover, summary)
    values (
      ${uid},
      ${ricardo[0].id},
      ${"Casa Linear"},
      ${"Costa do Sol"},
      ${"Estudo"},
      ${"/renders/linear-dia.webp"},
      ${"Laje longa, ripado e duas vagas sob a cobertura."}
    )
  `;

  const lead = await sql<{ id: number }>`
    insert into leads (
      user_id, name, email, phone, area_m2, style, complexity, estimate_cents, message, status
    ) values (
      ${uid},
      ${"Helena Duarte"},
      ${"helena.duarte@email.com"},
      ${"+258 84 000 2201"},
      ${240},
      ${"ripado"},
      ${"executivo"},
      ${estimateCents(240, "ripado", "executivo")},
      ${"Casa térrea para um casal e dois filhos. Quer ver a piscina antes de fechar o terreno."},
      ${"conversa"}
    )
    returning id
  `;
  await sql`
    insert into leads (
      user_id, name, email, phone, area_m2, style, complexity, estimate_cents, message, status
    ) values (
      ${uid},
      ${"Paulo Nogueira"},
      ${"paulo.nogueira@email.com"},
      ${"+258 86 000 7788"},
      ${160},
      ${"pavilhao"},
      ${"estudo"},
      ${estimateCents(160, "pavilhao", "estudo")},
      ${"Quer só o estudo visual para alinhar com a família."},
      ${"novo"}
    )
  `;

  const total = estimateCents(240, "ripado", "executivo");
  const proposal = await sql<{ id: number }>`
    insert into proposals (user_id, lead_id, client_name, project_title, total_cents, scope)
    values (
      ${uid},
      ${lead[0].id},
      ${"Helena Duarte"},
      ${"Residência em ripado — 240 m²"},
      ${total},
      ${"Projeto executivo com plantas, cortes e seis imagens. Pagamento ligado às etapas de entrega."}
    )
    returning id
  `;
  for (const part of splitPayments(total)) {
    await sql`
      insert into installments (
        user_id, proposal_id, label, percent, amount_cents, due_label, status, method
      ) values (
        ${uid},
        ${proposal[0].id},
        ${part.label},
        ${part.percent},
        ${part.amountCents},
        ${part.due},
        ${"aberto"},
        ${""}
      )
    `;
  }

  await sql`
    insert into meetings (user_id, client_name, title, starts_at, place, notes)
    values (
      ${uid},
      ${"Marina Alves"},
      ${"Revisão do executivo — Casa Véu"},
      ${"2026-10-21T10:00:00"},
      ${"Videoconferência"},
      ${"Validar o painel de pedra e a altura do pórtico."}
    )
  `;
  await sql`
    insert into meetings (user_id, client_name, title, starts_at, place, notes)
    values (
      ${uid},
      ${"Helena Duarte"},
      ${"Apresentação da proposta"},
      ${"2026-10-23T15:30:00"},
      ${"Estúdio TLE — Maputo"},
      ${"Levar a sequência de pagamento e duas alternativas de ripado."}
    )
  `;
}

async function loadWorkspace(uid: string): Promise<StudioData> {
  const sql = await getSql();
  const inbox = publicLeadOwnerId();
  const leadOwnerFilter = uid === inbox || inbox === PUBLIC_LEAD_INBOX ? null : inbox;

  const [clients, ownLeads, inboxLeads, projects, milestones, approvals, meetings, proposals, installments] =
    await Promise.all([
      sql<ClientRow>`select id, name, email, phone, city, notes from clients where user_id = ${uid} order by id`,
      sql<LeadRow>`select id, name, email, phone, area_m2, style, complexity, estimate_cents, message, status from leads where user_id = ${uid} order by id desc`,
      leadOwnerFilter && leadOwnerFilter !== uid
        ? sql<LeadRow>`select id, name, email, phone, area_m2, style, complexity, estimate_cents, message, status from leads where user_id = ${leadOwnerFilter} order by id desc`
        : Promise.resolve([] as LeadRow[]),
      sql<ProjectRow>`select id, client_id, title, place, stage, cover, summary from projects where user_id = ${uid} order by id`,
      sql<MilestoneRow>`select id, project_id, label, status, position from milestones where user_id = ${uid} order by position`,
      sql<ApprovalRow>`select id, project_id, label, image, approved from approvals where user_id = ${uid} order by id`,
      sql<MeetingRow>`select id, client_name, title, starts_at, place, notes from meetings where user_id = ${uid} order by starts_at`,
      sql<ProposalRow>`select id, lead_id, client_name, project_title, total_cents, scope from proposals where user_id = ${uid} order by id desc`,
      sql<InstallmentRow>`select id, proposal_id, label, percent, amount_cents, due_label, status, method from installments where user_id = ${uid} order by id`,
    ]);

  let publicInbox: LeadRow[] = [];
  if (inbox === PUBLIC_LEAD_INBOX || uid === inbox) {
    publicInbox = await sql<LeadRow>`
      select id, name, email, phone, area_m2, style, complexity, estimate_cents, message, status
      from leads where user_id = ${PUBLIC_LEAD_INBOX} order by id desc
    `;
  }

  const leads = [...ownLeads, ...inboxLeads, ...publicInbox].filter(
    (lead, index, arr) => arr.findIndex((l) => l.id === lead.id) === index,
  );

  return {
    clients,
    leads,
    projects,
    milestones,
    approvals: approvals.map((row) => ({ ...row, approved: Boolean(row.approved) })),
    meetings,
    proposals,
    installments,
  };
}

export const loadStudio = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<StudioData> => {
    await requireStudio(context.userId);
    const uid = studioWorkspaceId(context.userId);
    await seed(uid);
    return loadWorkspace(uid);
  });

export const loadPortal = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<StudioData> => {
    const scope = await resolvePortalScope(context.userId);
    if (scope.kind === "studio") {
      await seed(scope.workspaceId);
      return loadWorkspace(scope.workspaceId);
    }

    const sql = await getSql();
    const { workspaceId, clientId } = scope;
    const clients = await sql<ClientRow>`
      select id, name, email, phone, city, notes from clients
      where user_id = ${workspaceId} and id = ${clientId}
    `;
    const projects = await sql<ProjectRow>`
      select id, client_id, title, place, stage, cover, summary from projects
      where user_id = ${workspaceId} and client_id = ${clientId} order by id
    `;
    const projectIdSet = new Set(projects.map((p) => p.id));
    if (!projectIdSet.size) {
      return {
        clients,
        leads: [],
        projects: [],
        milestones: [],
        approvals: [],
        meetings: [],
        proposals: [],
        installments: [],
      };
    }

    const allMilestones = await sql<MilestoneRow>`
      select id, project_id, label, status, position from milestones
      where user_id = ${workspaceId} order by position
    `;
    const allApprovals = await sql<ApprovalRow>`
      select id, project_id, label, image, approved from approvals
      where user_id = ${workspaceId} order by id
    `;
    const milestones = allMilestones.filter((m) => projectIdSet.has(m.project_id));
    const approvals = allApprovals.filter((a) => projectIdSet.has(a.project_id));

    const clientName = clients[0]?.name ?? "";
    const proposals = clientName
      ? await sql<ProposalRow>`
          select id, lead_id, client_name, project_title, total_cents, scope from proposals
          where user_id = ${workspaceId} and client_name = ${clientName}
          order by id desc
        `
      : [];
    const proposalIdSet = new Set(proposals.map((p) => p.id));
    const allInstallments = proposalIdSet.size
      ? await sql<InstallmentRow>`
          select id, proposal_id, label, percent, amount_cents, due_label, status, method
          from installments where user_id = ${workspaceId} order by id
        `
      : [];
    const installments = allInstallments.filter((i) => proposalIdSet.has(i.proposal_id));

    return {
      clients,
      leads: [],
      projects,
      milestones,
      approvals: approvals.map((row) => ({ ...row, approved: Boolean(row.approved) })),
      meetings: [],
      proposals,
      installments,
    };
  });

export const submitPublicLead = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const row = (input ?? {}) as Record<string, unknown>;
    const company = text(row.company, 120);
    if (company) return { honeypot: true as const };
    return { honeypot: false as const, lead: normalizeLead(input) };
  })
  .handler(async ({ data }) => {
    if (data.honeypot) return { id: 0, ok: true };

    assertRateLimit(`public-lead:${clientIp()}`, 8, 10 * 60 * 1000);

    const lead = data.lead;
    const owner = publicLeadOwnerId();
    const sql = await getSql();
    const cents = estimateCents(lead.areaM2, lead.style, lead.complexity);
    const rows = await sql<{ id: number }>`
      insert into leads (
        user_id, name, email, phone, area_m2, style, complexity, estimate_cents, message, status
      ) values (
        ${owner},
        ${lead.name},
        ${lead.email},
        ${lead.phone},
        ${lead.areaM2},
        ${lead.style},
        ${lead.complexity},
        ${cents},
        ${lead.message},
        ${"novo"}
      )
      returning id
    `;
    return { id: rows[0].id, ok: true };
  });

export const submitLead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => normalizeLead(input))
  .handler(async ({ context, data }) => {
    await requireStudio(context.userId);
    const sql = await getSql();
    const cents = estimateCents(data.areaM2, data.style, data.complexity);
    const rows = await sql<{ id: number }>`
      insert into leads (
        user_id, name, email, phone, area_m2, style, complexity, estimate_cents, message, status
      ) values (
        ${context.userId},
        ${data.name},
        ${data.email},
        ${data.phone},
        ${data.areaM2},
        ${data.style},
        ${data.complexity},
        ${cents},
        ${data.message},
        ${"novo"}
      )
      returning id
    `;
    return { id: rows[0].id };
  });

export const importLocalLeads = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    if (!Array.isArray(input)) return [];
    return input.slice(0, 10).flatMap((item) => {
      try {
        return [normalizeLead(item)];
      } catch {
        return [];
      }
    });
  })
  .handler(async ({ context, data }) => {
    await requireStudio(context.userId);
    const sql = await getSql();
    for (const lead of data) {
      const cents = estimateCents(lead.areaM2, lead.style, lead.complexity);
      await sql`
        insert into leads (
          user_id, name, email, phone, area_m2, style, complexity, estimate_cents, message, status
        ) values (
          ${context.userId},
          ${lead.name},
          ${lead.email},
          ${lead.phone},
          ${lead.areaM2},
          ${lead.style},
          ${lead.complexity},
          ${cents},
          ${lead.message},
          ${"novo"}
        )
      `;
    }
    return { imported: data.length };
  });

export const setLeadStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const row = (input ?? {}) as Record<string, unknown>;
    const id = Number(row.id);
    const status = text(row.status, 20);
    if (!Number.isInteger(id) || id < 1) throw new Error("Lead inválido.");
    if (!LEAD_STATUS.includes(status as (typeof LEAD_STATUS)[number])) {
      throw new Error("Status inválido.");
    }
    return { id, status };
  })
  .handler(async ({ context, data }) => {
    await requireStudio(context.userId);
    const sql = await getSql();
    const owner = publicLeadOwnerId();
    await sql`
      update leads set status = ${data.status}
      where id = ${data.id}
        and (user_id = ${context.userId} or user_id = ${owner} or user_id = ${PUBLIC_LEAD_INBOX})
    `;
    return { ok: true };
  });

export const addClient = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const row = (input ?? {}) as Record<string, unknown>;
    const name = text(row.name, 80);
    const email = text(row.email, 120);
    const phone = text(row.phone, 24);
    const city = text(row.city, 80);
    const notes = text(row.notes, 400);
    if (name.length < 2) throw new Error("Informe o nome do cliente.");
    return { name, email, phone, city, notes };
  })
  .handler(async ({ context, data }) => {
    await requireStudio(context.userId);
    const sql = await getSql();
    await sql`
      insert into clients (user_id, name, email, phone, city, notes)
      values (${context.userId}, ${data.name}, ${data.email}, ${data.phone}, ${data.city}, ${data.notes})
    `;
    return { ok: true };
  });

export const addMeeting = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const row = (input ?? {}) as Record<string, unknown>;
    const clientName = text(row.clientName, 80);
    const title = text(row.title, 120);
    const startsAt = text(row.startsAt, 40);
    const place = text(row.place, 120);
    const notes = text(row.notes, 400);
    if (title.length < 3 || Number.isNaN(new Date(startsAt).getTime())) {
      throw new Error("Informe título e data válidos.");
    }
    return { clientName, title, startsAt, place, notes };
  })
  .handler(async ({ context, data }) => {
    await requireStudio(context.userId);
    const sql = await getSql();
    await sql`
      insert into meetings (user_id, client_name, title, starts_at, place, notes)
      values (
        ${context.userId}, ${data.clientName}, ${data.title}, ${data.startsAt}, ${data.place}, ${data.notes}
      )
    `;
    return { ok: true };
  });

export const createProposal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const id = Number((input as { leadId?: unknown })?.leadId);
    if (!Number.isInteger(id) || id < 1) throw new Error("Lead inválido.");
    return { leadId: id };
  })
  .handler(async ({ context, data }) => {
    await requireStudio(context.userId);
    const sql = await getSql();
    const uid = context.userId;
    const owner = publicLeadOwnerId();
    const existing = await sql<{ id: number }>`
      select id from proposals where user_id = ${uid} and lead_id = ${data.leadId} limit 1
    `;
    if (existing.length) return { id: existing[0].id };
    const leads = await sql<LeadRow>`
      select id, name, email, phone, area_m2, style, complexity, estimate_cents, message, status
      from leads
      where id = ${data.leadId}
        and (user_id = ${uid} or user_id = ${owner} or user_id = ${PUBLIC_LEAD_INBOX})
    `;
    const lead = leads[0];
    if (!lead) throw new Error("Lead não encontrado.");
    const scopeText = `${tierLabel(lead.complexity)} · ${styleLabel(lead.style)} · ${lead.area_m2} m². Pagamento em sinal, projeto executivo e imagens finais.`;
    const created = await sql<{ id: number }>`
      insert into proposals (user_id, lead_id, client_name, project_title, total_cents, scope)
      values (
        ${uid},
        ${lead.id},
        ${lead.name},
        ${`Residência ${lead.area_m2} m²`},
        ${lead.estimate_cents},
        ${scopeText}
      )
      returning id
    `;
    for (const part of splitPayments(lead.estimate_cents)) {
      await sql`
        insert into installments (
          user_id, proposal_id, label, percent, amount_cents, due_label, status, method
        ) values (
          ${uid}, ${created[0].id}, ${part.label}, ${part.percent}, ${part.amountCents}, ${part.due}, ${"aberto"}, ${""}
        )
      `;
    }
    await sql`update leads set status = ${"proposta"} where id = ${lead.id}`;
    return { id: created[0].id };
  });

export const setInstallment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const row = (input ?? {}) as Record<string, unknown>;
    const id = Number(row.id);
    const status = text(row.status, 20);
    const method = text(row.method, 20);
    if (!Number.isInteger(id) || id < 1) throw new Error("Parcela inválida.");
    if (!PAY_STATUS.includes(status as (typeof PAY_STATUS)[number])) {
      throw new Error("Situação inválida.");
    }
    if (!PAY_METHOD.includes(method as (typeof PAY_METHOD)[number])) {
      throw new Error("Forma inválida.");
    }
    return { id, status, method };
  })
  .handler(async ({ context, data }) => {
    await requireStudio(context.userId);
    const sql = await getSql();
    await sql`
      update installments
      set status = ${data.status}, method = ${data.method}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const setApproval = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const row = (input ?? {}) as Record<string, unknown>;
    const id = Number(row.id);
    if (!Number.isInteger(id) || id < 1) throw new Error("Imagem inválida.");
    return { id, approved: Boolean(row.approved) };
  })
  .handler(async ({ context, data }) => {
    const scope = await resolvePortalScope(context.userId);
    const sql = await getSql();

    if (scope.kind === "studio") {
      await sql`
        update approvals set approved = ${data.approved}
        where id = ${data.id} and user_id = ${context.userId}
      `;
      return { ok: true };
    }

    await sql`
      update approvals a
      set approved = ${data.approved}
      from projects p
      where a.id = ${data.id}
        and a.project_id = p.id
        and a.user_id = ${scope.workspaceId}
        and p.user_id = ${scope.workspaceId}
        and p.client_id = ${scope.clientId}
    `;
    return { ok: true };
  });

export const linkClientAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const row = (input ?? {}) as Record<string, unknown>;
    const targetUserId = text(row.targetUserId, 120);
    const clientId = Number(row.clientId);
    if (!targetUserId || !Number.isInteger(clientId) || clientId < 1) {
      throw new Error("Dados inválidos.");
    }
    return { targetUserId, clientId };
  })
  .handler(async ({ context, data }) => {
    await requireStudio(context.userId);
    const sql = await getSql();
    const owned = await sql<{ id: number }>`
      select id from clients where id = ${data.clientId} and user_id = ${context.userId}
    `;
    if (!owned.length) throw new Error("Cliente não encontrado neste estúdio.");
    await sql`
      insert into profiles (user_id, role, client_id)
      values (${data.targetUserId}, ${"client"}, ${data.clientId})
      on conflict (user_id) do update set role = ${"client"}, client_id = ${data.clientId}
    `;
    return { ok: true };
  });
