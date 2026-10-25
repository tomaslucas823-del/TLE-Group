/**
 * Rate limit:
 * - Com UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN → contador partilhado (multi-instância).
 * - Sem Redis → memória do processo (dev / fallback).
 *
 * API REST do Upstash (sem dependência npm extra).
 */

import { env } from "@/lib/env.server";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export class RateLimitError extends Error {
  readonly status = 429;
  constructor(message = "Demasiados pedidos. Tente de novo dentro de alguns minutos.") {
    super(message);
    this.name = "RateLimitError";
  }
}

function upstashConfig(): { url: string; token: string } | null {
  const url = env("UPSTASH_REDIS_REST_URL");
  const token = env("UPSTASH_REDIS_REST_TOKEN");
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

/** Incrementa chave no Upstash; devolve o novo valor ou null se falhar. */
async function redisIncr(key: string, windowSec: number): Promise<number | null> {
  const cfg = upstashConfig();
  if (!cfg) return null;

  const redisKey = `rl:${key}`;
  try {
    // Pipeline: INCR + EXPIRE só na primeira contagem (NX)
    const res = await fetch(`${cfg.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["EXPIRE", redisKey, windowSec, "NX"],
      ]),
    });
    if (!res.ok) {
      console.error("[rate-limit] Upstash HTTP", res.status);
      return null;
    }
    const data = (await res.json()) as Array<{ result?: number | string | null }>;
    const count = Number(data[0]?.result);
    return Number.isFinite(count) ? count : null;
  } catch (err) {
    console.error("[rate-limit] Upstash error", err);
    return null;
  }
}

function memoryAssert(key: string, limit: number, windowMs: number): void {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || now >= current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (current.count >= limit) {
    throw new RateLimitError();
  }

  current.count += 1;
}

/**
 * @param key identificador (ex.: IP + rota)
 * @param limit máximo de pedidos na janela
 * @param windowMs duração da janela em ms
 */
export async function assertRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<void> {
  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
  const redisCount = await redisIncr(key, windowSec);

  if (redisCount != null) {
    if (redisCount > limit) throw new RateLimitError();
    return;
  }

  // Fallback local se Redis não estiver configurado ou falhar
  memoryAssert(key, limit, windowMs);
}

/** Limpa entradas expiradas da memória local. */
export function pruneRateLimits(): void {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key);
  }
}
