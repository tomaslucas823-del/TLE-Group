import { getRequest } from "@tanstack/react-start/server";
import { getSql } from "@/lib/db";
import { PUBLIC_LEAD_INBOX, publicLeadOwnerId } from "@/lib/auth/roles.server";
import { clampArea, isStyle, isTier } from "@/lib/estimate";

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

/** Categorias alinhadas às folhas TLE (A01 renders, plantas, A03 estrutura). */
export const PIECE_CATEGORIES = [
  "aparencia",
  "plantas",
  "estrutura",
  "documentos",
] as const;

export type PieceCategory = (typeof PIECE_CATEGORIES)[number];

export const PIECE_KINDS = ["image", "pdf"] as const;
export type PieceKind = (typeof PIECE_KINDS)[number];

export const PIECE_CATEGORY_LABEL: Record<PieceCategory, string> = {
  aparencia: "Aparência",
  plantas: "Plantas e elevações",
  estrutura: "Estrutura",
  documentos: "Documentos",
};

export type ApprovalRow = {
  id: number;
  project_id: number;
  label: string;
  image: string;
  approved: boolean;
  category: PieceCategory;
  kind: PieceKind;
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

export const LEAD_STATUS = ["novo", "conversa", "proposta", "fechado"] as const;
export const PAY_STATUS = ["aberto", "aguardando", "recebido"] as const;
export const PAY_METHOD = ["", "mpesa", "emola", "cartao", "transferencia"] as const;

export function text(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export function clientIp(): string {
  const request = getRequest();
  if (!request) return "unknown";
  const h = request.headers;
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || h.get("x-real-ip") || "unknown";
}

export function normalizeCategory(value: unknown): PieceCategory {
  const c = text(value, 40);
  if (PIECE_CATEGORIES.includes(c as PieceCategory)) return c as PieceCategory;
  return "aparencia";
}

export function normalizeKind(value: unknown): PieceKind {
  const k = text(value, 20);
  if (PIECE_KINDS.includes(k as PieceKind)) return k as PieceKind;
  return "image";
}

function mapApproval(row: {
  id: number;
  project_id: number;
  label: string;
  image: string;
  approved: boolean | number;
  category?: string | null;
  kind?: string | null;
}): ApprovalRow {
  return {
    id: row.id,
    project_id: row.project_id,
    label: row.label,
    image: row.image,
    approved: Boolean(row.approved),
    category: normalizeCategory(row.category),
    kind: normalizeKind(row.kind),
  };
}

export function normalizeLead(input: unknown) {
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

/** Demo seed once per workspace (idempotent). */
export async function seed(uid: string) {
  const sql = await getSql();
  const inserted = await sql<{ user_id: string }>`
    insert into workspace_seed (user_id) values (${uid})
    on conflict (user_id) do nothing
    returning user_id
  `;
  if (!inserted.length) return;
}

export async function loadWorkspace(uid: string): Promise<StudioData> {
  const sql = await getSql();
  const inbox = publicLeadOwnerId();
  const leadOwnerFilter = uid === inbox || inbox === PUBLIC_LEAD_INBOX ? null : inbox;

  const [clients, ownLeads, inboxLeads, projects, milestones, approvalsRaw, meetings, proposals, installments] =
    await Promise.all([
      sql<ClientRow>`select id, name, email, phone, city, notes from clients where user_id = ${uid} order by id`,
      sql<LeadRow>`select id, name, email, phone, area_m2, style, complexity, estimate_cents, message, status from leads where user_id = ${uid} order by id desc`,
      leadOwnerFilter && leadOwnerFilter !== uid
        ? sql<LeadRow>`select id, name, email, phone, area_m2, style, complexity, estimate_cents, message, status from leads where user_id = ${leadOwnerFilter} order by id desc`
        : Promise.resolve([] as LeadRow[]),
      sql<ProjectRow>`select id, client_id, title, place, stage, cover, summary from projects where user_id = ${uid} order by id`,
      sql<MilestoneRow>`select id, project_id, label, status, position from milestones where user_id = ${uid} order by position`,
      sql<{
        id: number;
        project_id: number;
        label: string;
        image: string;
        approved: boolean;
        category: string;
        kind: string;
      }>`select id, project_id, label, image, approved, category, kind from approvals where user_id = ${uid} order by id`,
      sql<MeetingRow>`select id, client_name, title, starts_at, place, notes from meetings where user_id = ${uid} order by starts_at`,
      sql<ProposalRow>`select id, lead_id, client_name, project_title, total_cents, scope from proposals where user_id = ${uid} order by id desc`,
      sql<InstallmentRow>`select id, proposal_id, label, percent, amount_cents, due_label, status, method from installments where user_id = ${uid} order by id`,
    ]);

  const publicInbox = await sql<LeadRow>`
    select id, name, email, phone, area_m2, style, complexity, estimate_cents, message, status
    from leads where user_id = ${PUBLIC_LEAD_INBOX} order by id desc
  `;

  const leads = [...ownLeads, ...inboxLeads, ...publicInbox].filter(
    (lead, index, arr) => arr.findIndex((l) => l.id === lead.id) === index,
  );

  return {
    clients,
    leads,
    projects,
    milestones,
    approvals: approvalsRaw.map(mapApproval),
    meetings,
    proposals,
    installments,
  };
}

/** Checklist por projecto: quantas peças em cada categoria. */
export function projectPieceChecklist(
  projectId: number,
  approvals: ApprovalRow[],
): Record<PieceCategory, { count: number; approved: number }> {
  const out = {} as Record<PieceCategory, { count: number; approved: number }>;
  for (const cat of PIECE_CATEGORIES) {
    out[cat] = { count: 0, approved: 0 };
  }
  for (const a of approvals) {
    if (a.project_id !== projectId) continue;
    const bucket = out[a.category] ?? out.aparencia;
    bucket.count += 1;
    if (a.approved) bucket.approved += 1;
  }
  return out;
}
