/**
 * CAPTCHA for public forms.
 *
 * 1) Always available: signed arithmetic challenge (HMAC with BETTER_AUTH_SECRET).
 * 2) Optional: Cloudflare Turnstile when TURNSTILE_SECRET_KEY is set.
 *
 * Tokens are single-use and short-lived. In production the HMAC secret MUST be
 * configured — the dev default is rejected.
 */
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env.server";

const CHALLENGE_TTL_MS = 10 * 60 * 1000;
const USED_TOKEN_TTL_MS = CHALLENGE_TTL_MS + 60_000;
const DEV_FALLBACK = "tle-dev-captcha-secret-change-me";

/** In-memory single-use registry (per process). */
const usedTokens = new Map<string, number>();

function pruneUsedTokens(now = Date.now()) {
  for (const [token, exp] of usedTokens) {
    if (now >= exp) usedTokens.delete(token);
  }
}

function secret(): string {
  const configured = env("BETTER_AUTH_SECRET") || env("CAPTCHA_SECRET");
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "[captcha] BETTER_AUTH_SECRET ou CAPTCHA_SECRET é obrigatório em produção.",
    );
  }
  return DEV_FALLBACK;
}

function b64url(buf: Buffer | string): string {
  const b = typeof buf === "string" ? Buffer.from(buf, "utf8") : buf;
  return b.toString("base64url");
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export type CaptchaChallenge = {
  /** Opaque token the client must return with the answer. */
  token: string;
  /** Human-readable question, e.g. "Quanto é 4 + 7?". */
  question: string;
  /** Site key for Turnstile widget when configured (public). */
  turnstileSiteKey?: string;
};

/** Create a short-lived math challenge. */
export function createMathChallenge(): CaptchaChallenge {
  const a = randomInt(2, 12);
  const b = randomInt(2, 12);
  const exp = Date.now() + CHALLENGE_TTL_MS;
  const nonce = randomInt(1e9, 2e9);
  const body = JSON.stringify({ a, b, exp, n: nonce });
  const token = `${b64url(body)}.${sign(body)}`;
  const siteKey = env("TURNSTILE_SITE_KEY") || env("VITE_TURNSTILE_SITE_KEY");
  return {
    token,
    question: `Quanto é ${a} + ${b}?`,
    ...(siteKey ? { turnstileSiteKey: siteKey } : {}),
  };
}

export class CaptchaError extends Error {
  readonly status = 400;
  constructor(message = "Verificação de segurança falhou. Tente de novo.") {
    super(message);
    this.name = "CaptchaError";
  }
}

/** Verify the math challenge answer (single-use). */
export function verifyMathChallenge(token: string, answerRaw: string | number): void {
  if (!token || typeof token !== "string") throw new CaptchaError("Desafio em falta.");
  if (token.length > 2000) throw new CaptchaError();

  pruneUsedTokens();
  if (usedTokens.has(token)) {
    throw new CaptchaError("Desafio já utilizado. Actualize e tente de novo.");
  }

  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) throw new CaptchaError();
  const body = Buffer.from(payloadB64, "base64url").toString("utf8");
  const expectedSig = sign(body);
  if (!safeEqual(sig, expectedSig)) throw new CaptchaError();

  let parsed: { a?: number; b?: number; exp?: number; n?: number };
  try {
    parsed = JSON.parse(body) as { a?: number; b?: number; exp?: number; n?: number };
  } catch {
    throw new CaptchaError();
  }
  const { a, b, exp } = parsed;
  if (typeof a !== "number" || typeof b !== "number" || typeof exp !== "number") {
    throw new CaptchaError();
  }
  if (Date.now() > exp) throw new CaptchaError("Desafio expirado. Actualize e tente de novo.");

  const answer = Number(String(answerRaw).trim());
  if (!Number.isInteger(answer) || answer !== a + b) {
    throw new CaptchaError("Resposta incorrecta.");
  }

  // Mark consumed only after a correct answer (failed guesses can retry until expiry).
  usedTokens.set(token, Date.now() + USED_TOKEN_TTL_MS);
}

/** Verify Cloudflare Turnstile token when secret is configured. */
export async function verifyTurnstile(responseToken: string, ip?: string): Promise<void> {
  const secretKey = env("TURNSTILE_SECRET_KEY");
  if (!secretKey) return; // optional — skip if not configured
  if (!responseToken?.trim()) throw new CaptchaError("Complete a verificação Turnstile.");

  const form = new URLSearchParams();
  form.set("secret", secretKey);
  form.set("response", responseToken.trim());
  if (ip && ip !== "unknown") form.set("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
    headers: { "content-type": "application/x-www-form-urlencoded" },
  });
  if (!res.ok) throw new CaptchaError("Falha ao validar CAPTCHA.");
  const data = (await res.json()) as { success?: boolean };
  if (!data.success) throw new CaptchaError("Verificação Turnstile rejeitada.");
}

/**
 * Full public-form check: math always required; Turnstile if configured.
 */
export async function assertCaptcha(input: {
  captchaToken?: string;
  captchaAnswer?: string | number;
  turnstileToken?: string;
  ip?: string;
}): Promise<void> {
  verifyMathChallenge(String(input.captchaToken ?? ""), input.captchaAnswer ?? "");
  if (env("TURNSTILE_SECRET_KEY")) {
    await verifyTurnstile(String(input.turnstileToken ?? ""), input.ip);
  }
}
