/**
 * Rate limit in-memory (por processo). Suficiente para um único nó;
 * em multi-instância use Redis / edge rate limit.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export class RateLimitError extends Error {
  readonly status = 429;
  constructor(message = "Demasiados pedidos. Tente de novo dentro de alguns minutos.") {
    super(message);
    this.name = "RateLimitError";
  }
}

/**
 * @param key identificador (ex.: IP + rota)
 * @param limit máximo de pedidos na janela
 * @param windowMs duração da janela em ms
 */
export function assertRateLimit(key: string, limit: number, windowMs: number): void {
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

/** Limpa entradas expiradas (chamar ocasionalmente). */
export function pruneRateLimits(): void {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key);
  }
}
