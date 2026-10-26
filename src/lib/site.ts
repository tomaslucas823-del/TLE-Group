export const site = {
  name: "TLE Group",
  /** Total Link Engenharia & Construções */
  legalName: "TLE Group - Total Link Engenharia & Construções",
  /** Substituir pelo NUIT real quando disponível. */
  nuit: "000 000 000",
  city: "Inhambane",
  country: "Moçambique",
  address: "Inhambane, Moçambique",
  /** E-mail definitivo - ainda por indicar. */
  email: "contacto@tle.co.mz",
  phoneDisplay: "+258 86 591 3385",
  /** Só dígitos, com indicativo. Activa o botão de WhatsApp. */
  phoneWa: "258865913385",
  /** Mesmo número para contacto e pagamentos móveis (e-Mola / M-Pesa). */
  emolaDisplay: "+258 86 591 3385",
  /** URL completa ou vazio até existir a página. */
  instagram: "",
  facebook: "",
  linkedin: "",
  domain: "https://www.tlegroup.co.mz",
  /** Cole o ID de medição (G-XXXXXXXX) quando o Google Analytics estiver criado. Vazio = não carrega script. */
  gaId: "",
  tagline: "Soluções técnicas em construção civil",
} as const;

export const waHref = site.phoneWa
  ? `https://wa.me/${site.phoneWa}?text=${encodeURIComponent(
      "Olá, TLE Group. Quero conversar sobre um projecto de construção.",
    )}`
  : "";

/** NUIT ainda provisório — esconde ou marca em propostas públicas se for o placeholder. */
export const nuitIsProvisional = site.nuit.replace(/\s/g, "") === "000000000";

export function nuitLabel(): string {
  return nuitIsProvisional ? "NUIT a indicar" : `NUIT ${site.nuit}`;
}
