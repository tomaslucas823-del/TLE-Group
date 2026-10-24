import { getSql } from "@/lib/db";
import { getSessionUser } from "./verify.server";

export type AppRole = "studio" | "client";

export type Profile = {
  userId: string;
  role: AppRole;
  clientId: number | null;
};

export class ForbiddenError extends Error {
  readonly status = 403;
  constructor(message = "Sem permissão.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/** Caixa de entrada dos leads públicos quando TLE_STUDIO_USER_ID não está definido. */
export const PUBLIC_LEAD_INBOX = "studio-inbox";

export function publicLeadOwnerId(): string {
  const configured = process.env.TLE_STUDIO_USER_ID?.trim();
  return configured || PUBLIC_LEAD_INBOX;
}

function studioEmails(): Set<string> {
  const raw = process.env.TLE_STUDIO_EMAILS?.trim() ?? "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

/**
 * Papel por omissão para novos utilizadores.
 * - studio só se estiver em TLE_STUDIO_EMAILS, for TLE_STUDIO_USER_ID, ou TLE_DEFAULT_ROLE=studio
 * - em produção, sem lista de estúdio, novos logins são "client" (mais seguro)
 * - em desenvolvimento, sem config, mantém studio para facilitar testes locais
 */
function defaultRoleFor(userId: string, email: string | null): AppRole {
  if (userId === "dev-user") return "studio";
  const configuredOwner = process.env.TLE_STUDIO_USER_ID?.trim();
  if (configuredOwner && userId === configuredOwner) return "studio";
  if (email && studioEmails().has(email.toLowerCase())) return "studio";

  const fallback = process.env.TLE_DEFAULT_ROLE?.trim().toLowerCase();
  if (fallback === "studio") return "studio";
  if (fallback === "client") return "client";

  const hasStudioConfig = Boolean(configuredOwner) || studioEmails().size > 0;
  if (!hasStudioConfig && process.env.NODE_ENV !== "production") {
    return "studio";
  }
  return "client";
}

/** Garante linha em profiles e devolve o perfil. */
export async function ensureProfile(userId: string, email?: string | null): Promise<Profile> {
  const sql = await getSql();
  const existing = await sql<{ role: string; client_id: number | null }>`
    select role, client_id from profiles where user_id = ${userId} limit 1
  `;
  if (existing[0]) {
    return {
      userId,
      role: existing[0].role === "client" ? "client" : "studio",
      clientId: existing[0].client_id,
    };
  }

  const role = defaultRoleFor(userId, email ?? null);
  await sql`
    insert into profiles (user_id, role, client_id)
    values (${userId}, ${role}, ${null})
    on conflict (user_id) do nothing
  `;
  return { userId, role, clientId: null };
}

export async function getProfileForUser(userId: string): Promise<Profile> {
  const session = await getSessionUser();
  const email = session?.id === userId ? session.email : null;
  return ensureProfile(userId, email);
}

export async function requireStudio(userId: string): Promise<Profile> {
  const profile = await getProfileForUser(userId);
  if (profile.role !== "studio") {
    throw new ForbiddenError("Apenas a equipa do estúdio pode aceder a esta área.");
  }
  return profile;
}

/** Workspace CRM: dados da conta do estúdio (userId do utilizador studio). */
export function studioWorkspaceId(userId: string): string {
  return userId;
}

export type PortalScope =
  | { kind: "studio"; workspaceId: string }
  | { kind: "client"; workspaceId: string; clientId: number };

/**
 * Âmbito do portal do cliente.
 * - studio: vê o workspace completo (atalho interno)
 * - client: só o client_id ligado no perfil
 */
export async function resolvePortalScope(userId: string): Promise<PortalScope> {
  const profile = await getProfileForUser(userId);
  if (profile.role === "studio") {
    return { kind: "studio", workspaceId: userId };
  }
  if (!profile.clientId) {
    throw new ForbiddenError(
      "Conta de cliente sem projeto associado. Peça ao estúdio para vincular o acesso.",
    );
  }
  const sql = await getSql();
  const rows = await sql<{ user_id: string }>`
    select user_id from clients where id = ${profile.clientId} limit 1
  `;
  const workspaceId = rows[0]?.user_id;
  if (!workspaceId) {
    throw new ForbiddenError("Cliente não encontrado.");
  }
  return { kind: "client", workspaceId, clientId: profile.clientId };
}
