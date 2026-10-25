export const STYLES = [
  {
    id: "pedra",
    label: "Branco, pedra e madeira",
    note: "Volumes fechados, um plano de pedra e madeira quente.",
    factor: 1,
  },
  {
    id: "oculo",
    label: "Concreto e óculo",
    note: "Massa contínua, abertura circular e jardim solto.",
    factor: 1.06,
  },
  {
    id: "ripado",
    label: "Ripado e grandes vãos",
    note: "Fachada linear, brises e vidro do chão ao teto.",
    factor: 1.12,
  },
  {
    id: "pavilhao",
    label: "Pavilhão aberto",
    note: "Laje em balanço, pórtico e chegada sob cobertura.",
    factor: 1.16,
  },
] as const;

export const TIERS = [
  {
    id: "estudo",
    label: "Estudo visual",
    detail: "Partido, três imagens e uma rodada de ajustes.",
    factor: 1,
  },
  {
    id: "executivo",
    label: "Projeto executivo",
    detail: "Plantas, cortes, materiais e seis imagens.",
    factor: 1.48,
  },
  {
    id: "completo",
    label: "Entrega completa",
    detail: "Executivo, dez imagens e duas rodadas de revisão.",
    factor: 1.92,
  },
] as const;

/** Tipologia por número de quartos (mais intuitivo que m²). */
export const BEDROOMS = [
  { id: "t2", label: "T2 · 2 quartos", rooms: 2, baseArea: 95, factor: 1 },
  { id: "t3", label: "T3 · 3 quartos", rooms: 3, baseArea: 140, factor: 1.22 },
  { id: "t4", label: "T4+ · 4 ou mais", rooms: 4, baseArea: 200, factor: 1.48 },
] as const;

export const FLOORS = [
  { id: "1", label: "1 piso", factor: 1 },
  { id: "2", label: "2 pisos", factor: 1.16 },
  { id: "3", label: "3 ou mais", factor: 1.28 },
] as const;

export const FINISHES = [
  { id: "essencial", label: "Essencial", note: "Acabamentos sobrios e funcionais.", factor: 1 },
  { id: "intermedio", label: "Intermédio", note: "Materiais equilibrados e detalhe cuidado.", factor: 1.12 },
  { id: "premium", label: "Premium", note: "Acabamentos e orientações de projecto elevados.", factor: 1.28 },
] as const;

export type StyleId = (typeof STYLES)[number]["id"];
export type TierId = (typeof TIERS)[number]["id"];
export type BedroomId = (typeof BEDROOMS)[number]["id"];
export type FloorId = (typeof FLOORS)[number]["id"];
export type FinishId = (typeof FINISHES)[number]["id"];

export function isStyle(value: string | undefined): value is StyleId {
  return STYLES.some((item) => item.id === value);
}

export function isTier(value: string | undefined): value is TierId {
  return TIERS.some((item) => item.id === value);
}

export function isBedroom(value: string | undefined): value is BedroomId {
  return BEDROOMS.some((item) => item.id === value);
}

export function isFloor(value: string | undefined): value is FloorId {
  return FLOORS.some((item) => item.id === value);
}

export function isFinish(value: string | undefined): value is FinishId {
  return FINISHES.some((item) => item.id === value);
}

/** Área opcional: se vazia/inválida devolve null (não bloqueia). */
export function parseOptionalArea(value: number | string | undefined | null): number | null {
  if (value === "" || value === undefined || value === null) return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.min(800, Math.max(40, Math.round(n)));
}

export function clampArea(value: number | undefined) {
  if (!value || !Number.isFinite(value)) return 140;
  return Math.min(800, Math.max(40, Math.round(value)));
}

export function styleLabel(id: string) {
  return STYLES.find((item) => item.id === id)?.label ?? id;
}

export function tierLabel(id: string) {
  return TIERS.find((item) => item.id === id)?.label ?? id;
}

export function bedroomLabel(id: string) {
  return BEDROOMS.find((item) => item.id === id)?.label ?? id;
}

export function floorLabel(id: string) {
  return FLOORS.find((item) => item.id === id)?.label ?? id;
}

export function finishLabel(id: string) {
  return FINISHES.find((item) => item.id === id)?.label ?? id;
}

export type EstimateInput = {
  bedrooms: BedroomId;
  floors: FloorId;
  finish: FinishId;
  style: StyleId;
  tier: TierId;
  /** Opcional — se o cliente souber a metragem. */
  areaM2?: number | null;
};

/**
 * Estimativa em cêntimos de metical (referência preliminar).
 * Base em tipologia + pisos + acabamentos + partido + nível de entrega.
 */
export function estimateFromBrief(input: EstimateInput) {
  const bed = BEDROOMS.find((b) => b.id === input.bedrooms) ?? BEDROOMS[1];
  const fl = FLOORS.find((f) => f.id === input.floors) ?? FLOORS[0];
  const fin = FINISHES.find((f) => f.id === input.finish) ?? FINISHES[0];
  const style = STYLES.find((s) => s.id === input.style)?.factor ?? 1;
  const tier = TIERS.find((t) => t.id === input.tier)?.factor ?? 1;

  const area = parseOptionalArea(input.areaM2 ?? null) ?? bed.baseArea * (fl.id === "1" ? 1 : fl.id === "2" ? 0.85 : 0.75);

  const base =
    area <= 80
      ? 9_500_000
      : area <= 120
        ? 12_500_000
        : area <= 180
          ? 16_500_000
          : area <= 250
            ? 22_000_000
            : area <= 400
              ? 32_000_000
              : 32_000_000 + (area - 400) * 65_000;

  const total = base * bed.factor * fl.factor * fin.factor * style * tier;
  return Math.round(total / 100_000) * 100_000;
}

/** Compat: area + style + tier (simulador antigo / leads). */
export function estimateCents(area: number, styleId: string, tierId: string) {
  return estimateFromBrief({
    bedrooms: "t3",
    floors: "1",
    finish: "essencial",
    style: isStyle(styleId) ? styleId : "pedra",
    tier: isTier(tierId) ? tierId : "estudo",
    areaM2: area,
  });
}

/** Sinal 50% após contratação / restante em etapas. */
export function splitPayments(totalCents: number) {
  const parts = [
    { label: "Sinal", percent: 50, due: "Na aprovação da proposta" },
    { label: "Projeto executivo", percent: 30, due: "Na entrega das plantas" },
    { label: "Imagens finais", percent: 20, due: "Na entrega dos renders" },
  ];
  let used = 0;
  return parts.map((part, index) => {
    const amount =
      index === parts.length - 1
        ? totalCents - used
        : Math.round((totalCents * part.percent) / 100);
    used += amount;
    return { ...part, amountCents: amount };
  });
}

export const DELIVERY_WEEKS: Record<TierId, { min: number; max: number }> = {
  estudo: { min: 2, max: 3 },
  executivo: { min: 5, max: 7 },
  completo: { min: 8, max: 12 },
};
