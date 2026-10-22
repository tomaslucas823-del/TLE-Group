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
import { assertCaptcha, createMathChallenge } from "@/lib/captcha.server";
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

export const getCaptchaChallenge = createServerFn({ method: "GET" }).handler(async () => {
  assertRateLimit(`captcha:${clientIp()}`, 30, 10 * 60 * 1000);
  return createMathChallenge();
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
