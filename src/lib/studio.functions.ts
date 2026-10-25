import { createServerFn } from "@tanstack/react-start";
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
import { assertCaptcha, createMathChallenge } from "@/lib/captcha.server";
import {
  clampArea,
  estimateCents,
  isStyle,
  isTier,
  splitPayments,
} from "@/lib/estimate";
import {
  type ClientRow,
  type LeadRow,
  type ProjectRow,
  type MilestoneRow,
  type ApprovalRow,
  type MeetingRow,
  type ProposalRow,
  type InstallmentRow,
  type StudioData,
  LEAD_STATUS,
  PAY_STATUS,
  PAY_METHOD,
  text,
  clientIp,
  normalizeLead,
  seed,
  loadWorkspace,
} from "@/lib/studio-shared";

export type {
  ClientRow,
  LeadRow,
  ProjectRow,
  MilestoneRow,
  ApprovalRow,
  MeetingRow,
  ProposalRow,
  InstallmentRow,
  StudioData,
};

export const getCaptchaChallenge = createServerFn({ method: "GET" }).handler(async () => {
  assertRateLimit(`captcha:${clientIp()}`, 30, 10 * 60 * 1000);
  return createMathChallenge();
});

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
    return {
      honeypot: false as const,
      lead: normalizeLead(input),
      captchaToken: text(row.captchaToken, 500),
      captchaAnswer: text(row.captchaAnswer, 16),
      turnstileToken: text(row.turnstileToken, 2048),
    };
  })
  .handler(async ({ data }) => {
    if (data.honeypot) return { id: 0, ok: true };
    const ip = clientIp();
    assertRateLimit(`public-lead:${ip}`, 8, 10 * 60 * 1000);
    await assertCaptcha({
      captchaToken: data.captchaToken,
      captchaAnswer: data.captchaAnswer,
      turnstileToken: data.turnstileToken,
      ip,
    });
    const lead = data.lead;
    const owner = publicLeadOwnerId();
    const sql = await getSql();
    const cents = estimateCents(lead.areaM2, lead.style, lead.complexity);
    const rows = await sql<{ id: number }>`
      insert into leads (
        user_id, name, email, phone, area_m2, style, complexity, estimate_cents, message, status
      ) values (
        ${owner}, ${lead.name}, ${lead.email}, ${lead.phone}, ${lead.areaM2},
        ${lead.style}, ${lead.complexity}, ${cents}, ${lead.message}, ${"novo"}
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
        ${context.userId}, ${data.name}, ${data.email}, ${data.phone}, ${data.areaM2},
        ${data.style}, ${data.complexity}, ${cents}, ${data.message}, ${"novo"}
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
          ${context.userId}, ${lead.name}, ${lead.email}, ${lead.phone}, ${lead.areaM2},
          ${lead.style}, ${lead.complexity}, ${cents}, ${lead.message}, ${"novo"}
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
    if (!LEAD_STATUS.includes(status as (typeof LEAD_STATUS)[number])) throw new Error("Status inválido.");
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

export const deleteLead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const row = (input ?? {}) as Record<string, unknown>;
    const id = Number(row.id);
    if (!Number.isInteger(id) || id < 1) throw new Error("Lead inválido.");
    return { id };
  })
  .handler(async ({ context, data }) => {
    await requireStudio(context.userId);
    const sql = await getSql();
    const owner = publicLeadOwnerId();
    await sql`
      delete from leads
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
    const client_name = text(row.client_name ?? row.clientName, 80);
    const title = text(row.title, 120);
    const starts_at = text(row.starts_at ?? row.startsAt, 40);
    const place = text(row.place, 120);
    const notes = text(row.notes, 400);
    if (!client_name || !title || !starts_at) throw new Error("Reunião incompleta.");
    return { client_name, title, starts_at, place, notes };
  })
  .handler(async ({ context, data }) => {
    await requireStudio(context.userId);
    const sql = await getSql();
    await sql`
      insert into meetings (user_id, client_name, title, starts_at, place, notes)
      values (${context.userId}, ${data.client_name}, ${data.title}, ${data.starts_at}, ${data.place}, ${data.notes})
    `;
    return { ok: true };
  });

export const createProposal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const row = (input ?? {}) as Record<string, unknown>;
    const leadRaw = row.lead_id ?? row.leadId;
    const lead_id = leadRaw != null ? Number(leadRaw) : null;
    const client_name = text(row.client_name ?? row.clientName, 80);
    const project_title = text(row.project_title ?? row.projectTitle, 120);
    const scope = text(row.scope, 800);
    const areaM2 = clampArea(Number(row.areaM2 ?? row.area_m2 ?? 180));
    const style = text(row.style, 40) || "pedra";
    const complexity = text(row.complexity ?? row.tier, 40) || "estudo";
    if (Number.isInteger(lead_id) && lead_id! >= 1) {
      return {
        fromLead: true as const,
        lead_id: lead_id as number,
        client_name,
        project_title,
        scope,
        areaM2,
        style,
        complexity,
      };
    }
    if (!client_name || !project_title) throw new Error("Proposta incompleta.");
    if (!isStyle(style) || !isTier(complexity)) throw new Error("Estimativa inválida.");
    return {
      fromLead: false as const,
      lead_id: null as number | null,
      client_name,
      project_title,
      scope,
      areaM2,
      style,
      complexity,
    };
  })
  .handler(async ({ context, data }) => {
    await requireStudio(context.userId);
    const sql = await getSql();
    const owner = publicLeadOwnerId();

    let client_name = data.client_name;
    let project_title = data.project_title;
    let scope = data.scope;
    let areaM2 = data.areaM2;
    let style = data.style;
    let complexity = data.complexity;
    let lead_id = data.lead_id;

    if (data.fromLead && data.lead_id) {
      const leads = await sql<LeadRow>`
        select id, name, email, phone, area_m2, style, complexity, estimate_cents, message, status
        from leads
        where id = ${data.lead_id}
          and (user_id = ${context.userId} or user_id = ${owner} or user_id = ${PUBLIC_LEAD_INBOX})
        limit 1
      `;
      const lead = leads[0];
      if (!lead) throw new Error("Lead não encontrado.");
      client_name = client_name || lead.name;
      project_title =
        project_title ||
        `Proposta — ${lead.name}${lead.area_m2 ? ` · ${lead.area_m2} m²` : ""}`;
      scope =
        scope ||
        [
          lead.message ? `Pedido: ${lead.message}` : "",
          `${lead.area_m2} m² · ${lead.style} · ${lead.complexity}`,
          lead.email ? `Contacto: ${lead.email}${lead.phone ? ` · ${lead.phone}` : ""}` : "",
        ]
          .filter(Boolean)
          .join("\n");
      areaM2 = lead.area_m2 || areaM2;
      style = isStyle(lead.style) ? lead.style : style;
      complexity = isTier(lead.complexity) ? lead.complexity : complexity;
      lead_id = lead.id;
      await sql`
        update leads set status = ${"proposta"}
        where id = ${lead.id}
          and (user_id = ${context.userId} or user_id = ${owner} or user_id = ${PUBLIC_LEAD_INBOX})
      `;
    }

    if (!client_name || !project_title) throw new Error("Proposta incompleta.");
    if (!isStyle(style) || !isTier(complexity)) throw new Error("Estimativa inválida.");

    const total = estimateCents(areaM2, style, complexity);
    const proposal = await sql<{ id: number }>`
      insert into proposals (user_id, lead_id, client_name, project_title, total_cents, scope)
      values (${context.userId}, ${lead_id}, ${client_name}, ${project_title}, ${total}, ${scope})
      returning id
    `;
    for (const part of splitPayments(total)) {
      await sql`
        insert into installments (
          user_id, proposal_id, label, percent, amount_cents, due_label, status, method
        ) values (
          ${context.userId}, ${proposal[0].id}, ${part.label}, ${part.percent},
          ${part.amountCents}, ${part.due}, ${"aberto"}, ${""}
        )
      `;
    }
    return { id: proposal[0].id };
  });

export const setInstallment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const row = (input ?? {}) as Record<string, unknown>;
    const id = Number(row.id);
    const status = text(row.status, 20);
    const method = text(row.method, 40);
    if (!Number.isInteger(id) || id < 1) throw new Error("Parcela inválida.");
    if (!PAY_STATUS.includes(status as (typeof PAY_STATUS)[number])) throw new Error("Status inválido.");
    if (!PAY_METHOD.includes(method as (typeof PAY_METHOD)[number])) throw new Error("Método inválido.");
    return { id, status, method };
  })
  .handler(async ({ context, data }) => {
    await requireStudio(context.userId);
    const sql = await getSql();
    await sql`
      update installments set status = ${data.status}, method = ${data.method}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const setApproval = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const row = (input ?? {}) as Record<string, unknown>;
    const id = Number(row.id);
    const approved = Boolean(row.approved);
    if (!Number.isInteger(id) || id < 1) throw new Error("Aprovação inválida.");
    return { id, approved };
  })
  .handler(async ({ context, data }) => {
    const scope = await resolvePortalScope(context.userId);
    const sql = await getSql();
    const workspaceId = scope.workspaceId;

    if (scope.kind === "client") {
      const owned = await sql<{ id: number }>`
        select a.id from approvals a
        inner join projects p on p.id = a.project_id and p.user_id = a.user_id
        where a.id = ${data.id}
          and a.user_id = ${workspaceId}
          and p.client_id = ${scope.clientId}
        limit 1
      `;
      if (!owned.length) throw new Error("Sem permissão para esta aprovação.");
    }

    await sql`
      update approvals set approved = ${data.approved}
      where id = ${data.id} and user_id = ${workspaceId}
    `;
    return { ok: true };
  });

export const linkClientAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const row = (input ?? {}) as Record<string, unknown>;
    const targetUserId = text(row.targetUserId ?? row.userId, 120);
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
