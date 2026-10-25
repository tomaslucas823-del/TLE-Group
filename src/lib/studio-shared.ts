import { getRequest } from "@tanstack/react-start/server";
import { getSql } from "@/lib/db";
import { PUBLIC_LEAD_INBOX, publicLeadOwnerId } from "@/lib/auth/roles.server";
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
  type PieceCategory,
  type PieceKind,
  PIECE_CATEGORIES,
  PIECE_KINDS,
  text,
  normalizeCategory,
  normalizeKind,
} from "@/lib/studio-pure";

// Re-export pure surface for server code that still imports from here
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
  PieceCategory,
  PieceKind,
};
export {
  PIECE_CATEGORIES,
  PIECE_KINDS,
  PIECE_CATEGORY_LABEL,
  LEAD_STATUS,
  PAY_STATUS,
  PAY_METHOD,
  text,
  normalizeCategory,
  normalizeKind,
  normalizeLead,
  projectPieceChecklist,
} from "@/lib/studio-pure";

export function clientIp(): string {
  const request = getRequest();
  if (!request) return "unknown";
  const h = request.headers;
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || h.get("x-real-ip") || "unknown";
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
