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

/**
 * Fases de obra com valores reais do mapa de quantidades (MZN).
 * Fases a 0 = ainda sem quantificação no mapa (acabamentos).
 */
export const WORK_PHASES = [
  { id: "implantacao", label: "Implantação", totalMzn: 18_422, included: true },
  { id: "sapatas", label: "Sapatas isoladas", totalMzn: 172_236, completed: true },
  { id: "baldrame", label: "Viga de pavimento / baldrame", totalMzn: 365_453, completed: true },
  { id: "pilares", label: "Pilares", totalMzn: 154_779, completed: true },
  { id: "alvenaria", label: "Alvenaria (blocos)", totalMzn: 474_098, completed: true },
  { id: "vigas", label: "Vigas", totalMzn: 275_152, completed: true },
  { id: "lajes-piso", label: "Lajes de piso", totalMzn: 65_737, completed: true },
  { id: "contra-piso", label: "Contra-piso", totalMzn: 31_464, completed: true },
  { id: "laje-cobertura", label: "Laje de cobertura", totalMzn: 258_314, completed: true },
  { id: "reboco", label: "Reboco", totalMzn: 388_470, completed: true },
  { id: "gesso", label: "Gesso", totalMzn: 0, completed: false },
  { id: "portas", label: "Portas", totalMzn: 0, completed: false },
  { id: "janelas", label: "Janelas", totalMzn: 0, completed: false },
  { id: "cobertura", label: "Chapas / telhas", totalMzn: 0, completed: false },
  { id: "pintura", label: "Pintura", totalMzn: 0, completed: false },
  { id: "revest-piso", label: "Revestimentos de piso", totalMzn: 0, completed: false },
  { id: "revest-parede", label: "Revestimentos de parede", totalMzn: 0, completed: false },
] as const;

/** Total quantificado no mapa (estrutura até reboco). */
export const WORK_MAP_TOTAL_MZN = WORK_PHASES.reduce((sum, p) => sum + p.totalMzn, 0);

/** Área de referência do mapa (~casa T3). */
export const WORK_REF_AREA_M2 = 130;

/** Custo médio quantificado por m² (estrutura → reboco). */
export const WORK_COST_PER_M2 = WORK_MAP_TOTAL_MZN / WORK_REF_AREA_M2;

/**
 * Multiplicador para fases de acabamento ainda não quantificadas no mapa.
 * Essencial ≈ só o quantificado; intermédio/premium acrescentam ordem de grandeza.
 */
const WORK_FINISH_FACTOR: Record<(typeof FINISHES)[number]["id"], number> = {
  essencial: 1.15,
  intermedio: 1.35,
  premium: 1.55,
};

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

function resolveArea(input: EstimateInput): number {
  const bed = BEDROOMS.find((b) => b.id === input.bedrooms) ?? BEDROOMS[1];
  const fl = FLOORS.find((f) => f.id === input.floors) ?? FLOORS[0];
  return (
    parseOptionalArea(input.areaM2 ?? null) ??
    bed.baseArea * (fl.id === "1" ? 1 : fl.id === "2" ? 0.85 : 0.75)
  );
}

/**
 * Estimativa de honorários de projecto em cêntimos de metical (referência preliminar).
 */
export function estimateFromBrief(input: EstimateInput) {
  const bed = BEDROOMS.find((b) => b.id === input.bedrooms) ?? BEDROOMS[1];
  const fl = FLOORS.find((f) => f.id === input.floors) ?? FLOORS[0];
  const fin = FINISHES.find((f) => f.id === input.finish) ?? FINISHES[0];
  const style = STYLES.find((s) => s.id === input.style)?.factor ?? 1;
  const tier = TIERS.find((t) => t.id === input.tier)?.factor ?? 1;

  const area = resolveArea(input);

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

/**
 * Estimativa de custo de obra (materiais/construção) em cêntimos de metical.
 * Baseada no mapa de quantidades real (estrutura → reboco) + factor de acabamentos.
 * É ordem de grandeza, não orçamento fechado.
 */
export function estimateConstructionCents(input: EstimateInput) {
  const fl = FLOORS.find((f) => f.id === input.floors) ?? FLOORS[0];
  const finishId = (FINISHES.find((f) => f.id === input.finish) ?? FINISHES[0]).id;
  const area = resolveArea(input);

  const baseMzn = WORK_COST_PER_M2 * area * fl.factor * WORK_FINISH_FACTOR[finishId];
  const cents = Math.round(baseMzn * 100);
  // Arredondar para 1000 MZN
  return Math.round(cents / 100_000) * 100_000;
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
