/**
 * Server-backed session check for private routes.
 * Uses a server function so the verification always runs on the server
 * (cookie / bearer), never trusts the client alone.
 */
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const checkSession = createServerFn({ method: "GET" }).handler(async () => {
  const { getSessionUser, authConfigured } = await import("./verify.server");
  const { gateIdentityEnabled } = await import("./gate-identity.server");

  const databaseConfigured = Boolean(process.env.DATABASE_URL?.trim());

  // Auth off + no real DB → local dev shared user; allow.
  if (!authConfigured && !gateIdentityEnabled()) {
    if (databaseConfigured) return { ok: false as const };
    return { ok: true as const };
  }

  const user = await getSessionUser();
  return { ok: Boolean(user) };
});

/** Call from route `beforeLoad`. Redirects to /login when there is no session. */
export async function requireSessionOrRedirect(callbackURL: string): Promise<void> {
  const result = await checkSession();
  if (!result.ok) {
    throw redirect({
      to: "/login",
      search: { callback: callbackURL },
    });
  }
}
