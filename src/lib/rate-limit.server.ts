/**
 * Rate limit:
 * - Com UPSTASH_REDIS_REST_* → contador partilhado (multi-instância Vercel).
 * - Sem Redis → memória do processo (dev / fallback).
 */

import { redisIncrWithTtl, upstashEnabled } from "@/lib/upstash.server";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export class RateLimitError extends Error {
  readonly status = 429;
  constructor(message = "Demasiados pedidos. Tente de novo dentro de alguns minutos.") {
    super(message);
    this.name = "RateLimitError";
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
  const redisCount = await redisIncrWithTtl(`rl:${key}`, windowSec);

  if (redisCount != null) {
    if (redisCount > limit) throw new RateLimitError();
    return;
  }

  // Fallback local se Redis não estiver configurado ou falhar
  memoryAssert(key, limit, windowMs);
}

export function isDistributedRateLimit(): boolean {
  return upstashEnabled();
}

/** Limpa entradas expiradas da memória local. */
export function pruneRateLimits(): void {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key);
  }
}
