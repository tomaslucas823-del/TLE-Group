export const site = {
  name: "TLE Arquitetura",
  legalName: "TLE Visualização Arquitetónica, Lda",
  /** Substituir pelo NUIT real. */
  nuit: "000 000 000",
  city: "Maputo",
  country: "Moçambique",
  /** Morada definitiva - ainda por indicar. */
  address: "Morada a indicar, Maputo",
  /** E-mail definitivo - ainda por indicar. */
  email: "contacto@tle.co.mz",
  /** Telefone definitivo - ainda por indicar. */
  phoneDisplay: "+258 8X XXX XXXX",
  /** Só dígitos, com indicativo. Vazio = o botão de WhatsApp fica oculto. */
  phoneWa: "",
  /** URL completa ou vazio até existir a página. */
  instagram: "",
  facebook: "",
  linkedin: "",
  domain: "https://www.tlearquitetura.co.mz",
  /** Cole o ID de medição (G-XXXXXXXX) quando o Google Analytics estiver criado. Vazio = não carrega script. */
  gaId: "",
} as const;

export const waHref = site.phoneWa
  ? `https://wa.me/${site.phoneWa}?text=${encodeURIComponent(
      "Olá, TLE. Quero conversar sobre um projeto residencial.",
    )}`
  : "";
