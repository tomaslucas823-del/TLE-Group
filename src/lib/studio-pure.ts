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
