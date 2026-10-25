/**
 * Upstash Redis REST helpers (no extra npm package).
 * Requires UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.
 */
import { env } from "@/lib/env.server";

export type UpstashConfig = { url: string; token: string };

export function upstashConfig(): UpstashConfig | null {
  const url = env("UPSTASH_REDIS_REST_URL");
  const token = env("UPSTASH_REDIS_REST_TOKEN");
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

export function upstashEnabled(): boolean {
  return upstashConfig() != null;
}

async function upstashCommand(
  cfg: UpstashConfig,
  command: Array<string | number>,
): Promise<unknown> {
  const res = await fetch(`${cfg.url}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[upstash] HTTP ${res.status} ${text.slice(0, 120)}`);
  }
  const data = (await res.json()) as { result?: unknown };
  return data.result;
}

async function upstashPipeline(
  cfg: UpstashConfig,
  commands: Array<Array<string | number>>,
): Promise<unknown[]> {
  const res = await fetch(`${cfg.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[upstash] pipeline HTTP ${res.status} ${text.slice(0, 120)}`);
  }
  const data = (await res.json()) as Array<{ result?: unknown }>;
  return data.map((row) => row.result);
}

/** INCR key; set TTL only if key was newly created (EXPIRE NX). */
export async function redisIncrWithTtl(
  key: string,
  ttlSec: number,
): Promise<number | null> {
  const cfg = upstashConfig();
  if (!cfg) return null;
  try {
    const [countRaw] = await upstashPipeline(cfg, [
      ["INCR", key],
      ["EXPIRE", key, ttlSec, "NX"],
    ]);
    const count = Number(countRaw);
    return Number.isFinite(count) ? count : null;
  } catch (err) {
    console.error("[upstash] incr", err);
    return null;
  }
}

/** SET key value EX ttl — overwrites. */
export async function redisSet(
  key: string,
  value: string,
  ttlSec?: number,
): Promise<boolean> {
  const cfg = upstashConfig();
  if (!cfg) return false;
  try {
    const cmd: Array<string | number> =
      ttlSec != null && ttlSec > 0
        ? ["SET", key, value, "EX", ttlSec]
        : ["SET", key, value];
    await upstashCommand(cfg, cmd);
    return true;
  } catch (err) {
    console.error("[upstash] set", err);
    return false;
  }
}

/** SET key NX EX ttl — returns true if set (first time). */
export async function redisSetNx(
  key: string,
  value: string,
  ttlSec: number,
): Promise<boolean | null> {
  const cfg = upstashConfig();
  if (!cfg) return null;
  try {
    const result = await upstashCommand(cfg, ["SET", key, value, "EX", ttlSec, "NX"]);
    return result === "OK";
  } catch (err) {
    console.error("[upstash] setnx", err);
    return null;
  }
}

export async function redisGet(key: string): Promise<string | null> {
  const cfg = upstashConfig();
  if (!cfg) return null;
  try {
    const result = await upstashCommand(cfg, ["GET", key]);
    if (result == null) return null;
    return String(result);
  } catch (err) {
    console.error("[upstash] get", err);
    return null;
  }
}

export async function redisDel(key: string): Promise<void> {
  const cfg = upstashConfig();
  if (!cfg) return;
  try {
    await upstashCommand(cfg, ["DEL", key]);
  } catch (err) {
    console.error("[upstash] del", err);
  }
}

/** JSON cache helpers */
export async function cacheGetJson<T>(key: string): Promise<T | null> {
  const raw = await redisGet(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function cacheSetJson(
  key: string,
  value: unknown,
  ttlSec: number,
): Promise<boolean> {
  return redisSet(key, JSON.stringify(value), ttlSec);
}
