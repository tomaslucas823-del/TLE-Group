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

export type StyleId = (typeof STYLES)[number]["id"];
export type TierId = (typeof TIERS)[number]["id"];

export function isStyle(value: string | undefined): value is StyleId {
  return STYLES.some((item) => item.id === value);
}

export function isTier(value: string | undefined): value is TierId {
  return TIERS.some((item) => item.id === value);
}

export function clampArea(value: number | undefined) {
  if (!value || !Number.isFinite(value)) return 180;
  return Math.min(800, Math.max(40, Math.round(value)));
}

export function styleLabel(id: string) {
  return STYLES.find((item) => item.id === id)?.label ?? id;
}

export function tierLabel(id: string) {
  return TIERS.find((item) => item.id === id)?.label ?? id;
}

/** Estimativa em cêntimos de metical, arredondada ao milhar de MZN mais próximo. */
export function estimateCents(area: number, styleId: string, tierId: string) {
  const meters = clampArea(area);
  const base =
    meters <= 80
      ? 9_500_000
      : meters <= 150
        ? 14_000_000
        : meters <= 250
          ? 21_000_000
          : meters <= 400
            ? 32_000_000
            : 32_000_000 + (meters - 400) * 65_000;
  const style = STYLES.find((item) => item.id === styleId)?.factor ?? 1;
  const tier = TIERS.find((item) => item.id === tierId)?.factor ?? 1;
  return Math.round((base * style * tier) / 100_000) * 100_000;
}

export function splitPayments(totalCents: number) {
  const parts = [
    { label: "Sinal", percent: 40, due: "Na aprovação da proposta" },
    { label: "Projeto executivo", percent: 40, due: "Na entrega das plantas" },
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
