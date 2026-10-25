/**
 * CAPTCHA for public forms.
 *
 * 1) Always available: signed arithmetic challenge (HMAC with BETTER_AUTH_SECRET).
 * 2) Optional: Cloudflare Turnstile when TURNSTILE_SECRET_KEY is set.
 *
 * Tokens are single-use and short-lived. Used-token registry uses Upstash when
 * configured so multiple Vercel instances share state.
 */
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env.server";
import { redisSetNx } from "@/lib/upstash.server";

const CHALLENGE_TTL_MS = 10 * 60 * 1000;
const USED_TOKEN_TTL_SEC = Math.ceil((CHALLENGE_TTL_MS + 60_000) / 1000);
const DEV_FALLBACK = "tle-dev-captcha-secret-change-me";

/** In-memory single-use registry (fallback when Redis is offline). */
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
  token: string;
  question: string;
  turnstileSiteKey?: string;
};

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

async function markTokenUsed(token: string): Promise<void> {
  const key = `captcha:used:${token.slice(0, 80)}`;
  const nx = await redisSetNx(key, "1", USED_TOKEN_TTL_SEC);
  if (nx === false) {
    throw new CaptchaError("Desafio já utilizado. Actualize e tente de novo.");
  }
  // nx === null → Redis offline; use memory fallback
  if (nx === null) {
    pruneUsedTokens();
    if (usedTokens.has(token)) {
      throw new CaptchaError("Desafio já utilizado. Actualize e tente de novo.");
    }
    usedTokens.set(token, Date.now() + USED_TOKEN_TTL_SEC * 1000);
  }
}

/** Verify the math challenge answer (single-use). */
export async function verifyMathChallenge(
  token: string,
  answerRaw: string | number,
): Promise<void> {
  if (!token || typeof token !== "string") throw new CaptchaError("Desafio em falta.");
  if (token.length > 2000) throw new CaptchaError();

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

  await markTokenUsed(token);
}

export async function verifyTurnstile(responseToken: string, ip?: string): Promise<void> {
  const secretKey = env("TURNSTILE_SECRET_KEY");
  if (!secretKey) return;
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

export async function assertCaptcha(input: {
  captchaToken?: string;
  captchaAnswer?: string | number;
  turnstileToken?: string;
  ip?: string;
}): Promise<void> {
  await verifyMathChallenge(String(input.captchaToken ?? ""), input.captchaAnswer ?? "");
  if (env("TURNSTILE_SECRET_KEY")) {
    await verifyTurnstile(String(input.turnstileToken ?? ""), input.ip);
  }
}
