export type Locale = "pt" | "en";

export const LOCALE_STORAGE_KEY = "tle-locale";

export const messages = {
  pt: {
    nav: {
      projects: "Projetos",
      services: "Serviços",
      method: "Entrega",
      estimate: "Estimativa",
      portal: "Portal",
      studio: "Estúdio",
      login: "Entrar",
      quote: "Pedir cotação",
      menu: "Menu",
      close: "Fechar",
    },
    hero: {
      kicker: "Inhambane · Construção civil",
      title: "A casa, antes da primeira parede.",
      cta: "Pedir cotação",
      projects: "Ver projetos",
    },
    featured: {
      kicker: "Seleção",
      title: "Casas vistas inteiras antes da obra",
      all: "Todo o portefólio",
    },
    services: {
      kicker: "Serviços",
      title: "Três formas de começar.",
      paths: [
        {
          title: "Estudo visual",
          text: "Partido, três imagens e uma rodada de ajustes, para decidir o volume antes da execução.",
          cta: "Ver estimativa",
        },
        {
          title: "Projeto executivo",
          text: "Plantas, cortes e a especificação dos materiais que a obra precisa para não inventar.",
          cta: "Pedir cotação",
        },
        {
          title: "Entrega completa",
          text: "Executivo, sequência de imagens e revisões registadas no portal do cliente.",
          cta: "Começar",
        },
      ],
    },
    method: {
      kicker: "Método",
      title: "Da conversa à imagem aprovada.",
      steps: [
        { n: "01", title: "Programa", text: "Metragem, terreno e o que a casa precisa de conter." },
        { n: "02", title: "Partido", text: "Volume, chegada e o que a rua pode ver." },
        { n: "03", title: "Imagem", text: "Pedra, madeira e luz, no horário certo." },
        { n: "04", title: "Entrega", text: "Plantas, prazo e cada revisão no portal." },
      ],
    },
    estimate: {
      kicker: "Estimativa",
      title: "Uma referência em meticais.",
      lead: "Metragem, partido e entrega. Não é proposta fechada: terreno e prazo ainda ajustam o valor.",
      area: "Metragem",
      style: "Partido",
      tier: "Entrega",
      ref: "Referência",
      disclaimer: "Não é proposta fechada. Terreno, programa e prazo ainda ajustam o valor.",
      cta: "Pedir com esta estimativa",
      handoff: "Levar ao pedido",
    },
    styles: {
      pedra: { label: "Branco, pedra e madeira", note: "Volumes fechados, um plano de pedra e madeira quente." },
      oculo: { label: "Concreto e óculo", note: "Massa contínua, abertura circular e jardim solto." },
      ripado: { label: "Ripado e grandes vãos", note: "Fachada linear, brises e vidro do chão ao teto." },
      pavilhao: { label: "Pavilhão aberto", note: "Laje em balanço, pórtico e chegada sob cobertura." },
    },
    tiers: {
      estudo: { label: "Estudo visual", detail: "Partido, três imagens e uma rodada de ajustes." },
      executivo: { label: "Projeto executivo", detail: "Plantas, cortes, materiais e seis imagens." },
      completo: { label: "Entrega completa", detail: "Executivo, dez imagens e duas rodadas de revisão." },
    },
    payments: {
      signal: "Sinal",
      executive: "Projeto executivo",
      images: "Imagens finais",
    },
    faq: {
      kicker: "Dúvidas",
      title: "Perguntas frequentes",
      items: [
        {
          q: "Quanto custa um estudo visual?",
          a: "Depende da metragem, do partido e do tipo de entrega. O simulador dá uma referência em meticais; a proposta fechada considera terreno e prazo.",
        },
        {
          q: "Fazem só a imagem ou também o projeto?",
          a: "Estudo visual, projeto executivo e entrega completa com imagens finais. Escolha o caminho e peça a cotação.",
        },
        {
          q: "Atendem fora de Maputo?",
          a: "Sim. O acompanhamento pode ser online: Maputo, Matola, Costa do Sol, Boane e outras localidades em Moçambique.",
        },
        {
          q: "Como acompanho o projeto?",
          a: "No portal do cliente: etapas, aprovação de imagens e documentos. Cada revisão fica registada.",
        },
      ],
    },
    quote: {
      kicker: "Cotação",
      title: "Conte o terreno.",
      lead: "Metragem, partido e contacto. O pedido chega ao estúdio com verificação de segurança.",
      phone: "Telefone",
      email: "E-mail",
      optional: "opcional",
      address: "Morada",
      name: "Nome",
      message: "Ideias do projeto",
      messagePlaceholder:
        "Quartos, salas, terreno (largura × profundidade), materiais, orientação, orçamento…",
      projectIdeas: "Ideias provisórias",
      delivery: "Prazo estimado",
      weeks: "semanas",
      send: "Enviar pedido",
      sendWhatsApp: "Continuar no WhatsApp",
      whatsAppHint: "Abre o WhatsApp com o pedido já escrito. Só precisa de enviar.",
      sending: "A enviar…",
      received: "Pedido recebido.",
      receivedWhatsApp: "O WhatsApp abriu com a sua mensagem. Confirme o envio na conversa.",
      receivedCloud: "O pedido chegou ao estúdio. Resposta em um dia útil por WhatsApp ou e-mail. Guarde o resumo abaixo.",
      receivedLocal: "Ficou guardado neste aparelho e passa para o estúdio no próximo acesso.",
      sendAnother: "Fazer outro pedido",
      errName: "Indique o seu nome.",
      errEmail: "Indique um e-mail válido.",
      errPhone: "Indique um telefone válido.",
      errCaptcha: "Responda à verificação de segurança.",
      errSubmit: "Não foi possível enviar. Verifique os dados e tente de novo.",
      captchaLoading: "A carregar verificação…",
    },
    footer: {
      contact: "Contacto",
      projectsServices: "Projetos e serviços",
      studio: "Estúdio",
      social: "Redes",
      privacy: "Privacidade",
      terms: "Termos",
      clientPortal: "Portal do cliente",
      studioArea: "Área do estúdio",
      faq: "Dúvidas",
      igPending: "Instagram (a indicar)",
      fbPending: "Facebook (a indicar)",
      liPending: "LinkedIn (a indicar)",
    },
    cookies: {
      text: "Cookies só para medir o acesso, e apenas com o seu aceite.",
      privacy: "Privacidade",
      accept: "Aceitar",
      reject: "Recusar",
    },
    portfolio: {
      title: "Casas",
      count: (n: number) => `${n} residências vistas inteiras antes da primeira parede.`,
      materials: "Materiais",
      askParty: "Pedir uma casa neste partido",
    },
    a11y: {
      langToEn: "Switch to English",
      langToPt: "Mudar para português",
      backTop: "Voltar ao topo",
    },
  },
  en: {
    nav: {
      projects: "Projects",
      services: "Services",
      method: "Delivery",
      estimate: "Estimate",
      portal: "Portal",
      studio: "Studio",
      login: "Sign in",
      quote: "Request a quote",
      menu: "Menu",
      close: "Close",
    },
    hero: {
      kicker: "Inhambane · Civil construction",
      title: "The house, before the first wall.",
      cta: "Request a quote",
      projects: "View projects",
    },
    featured: {
      kicker: "Selected",
      title: "Houses seen whole before construction",
      all: "Full portfolio",
    },
    services: {
      kicker: "Services",
      title: "Three ways to begin.",
      paths: [
        {
          title: "Visual study",
          text: "Massing, three images and one round of revisions, to decide the volume before execution.",
          cta: "See estimate",
        },
        {
          title: "Executive design",
          text: "Plans, sections and the material specification the build needs so nothing is improvised.",
          cta: "Request a quote",
        },
        {
          title: "Full delivery",
          text: "Executive set, image sequence and revisions logged in the client portal.",
          cta: "Get started",
        },
      ],
    },
    method: {
      kicker: "Method",
      title: "From conversation to approved image.",
      steps: [
        { n: "01", title: "Brief", text: "Floor area, site and what the house must hold." },
        { n: "02", title: "Massing", text: "Volume, arrival and what the street can see." },
        { n: "03", title: "Image", text: "Stone, timber and light at the right hour." },
        { n: "04", title: "Delivery", text: "Drawings, schedule and every revision in the portal." },
      ],
    },
    estimate: {
      kicker: "Estimate",
      title: "A reference in meticais.",
      lead: "Floor area, massing and delivery. Not a final proposal: site and timeline still adjust the figure.",
      area: "Floor area",
      style: "Massing",
      tier: "Delivery",
      ref: "Reference",
      disclaimer: "Not a final proposal. Site, programme and schedule still adjust the value.",
      cta: "Request with this estimate",
      handoff: "Take to the form",
    },
    styles: {
      pedra: { label: "White, stone and timber", note: "Closed volumes, a stone plane and warm wood." },
      oculo: { label: "Concrete and oculus", note: "Continuous mass, circular opening and loose garden." },
      ripado: { label: "Batten and wide spans", note: "Linear façade, brise-soleil and floor-to-ceiling glass." },
      pavilhao: { label: "Open pavilion", note: "Cantilevered slab, portico and arrival under cover." },
    },
    tiers: {
      estudo: { label: "Visual study", detail: "Massing, three images and one revision round." },
      executivo: { label: "Executive design", detail: "Plans, sections, materials and six images." },
      completo: { label: "Full delivery", detail: "Executive set, ten images and two revision rounds." },
    },
    payments: {
      signal: "Deposit",
      executive: "Executive design",
      images: "Final images",
    },
    faq: {
      kicker: "FAQ",
      title: "Common questions",
      items: [
        {
          q: "How much does a visual study cost?",
          a: "It depends on floor area, massing and delivery type. The simulator gives a metical reference; the final proposal accounts for site and schedule.",
        },
        {
          q: "Do you only produce images, or also the design?",
          a: "Visual study, executive design and full delivery with final images. Choose the path and request a quote.",
        },
        {
          q: "Do you work outside Maputo?",
          a: "Yes. Coordination can be online: Maputo, Matola, Costa do Sol, Boane and other places in Mozambique.",
        },
        {
          q: "How do I follow the project?",
          a: "In the client portal: stages, image approvals and documents. Every revision is logged.",
        },
      ],
    },
    quote: {
      kicker: "Quote",
      title: "Tell us about the site.",
      lead: "Floor area, massing and your contact. The request reaches the studio with security checks.",
      phone: "Phone",
      email: "Email",
      optional: "optional",
      address: "Address",
      name: "Name",
      message: "Project ideas",
      messagePlaceholder:
        "Bedrooms, living areas, plot (width × depth), materials, orientation, budget…",
      projectIdeas: "Provisional ideas",
      delivery: "Estimated timeline",
      weeks: "weeks",
      send: "Send request",
      sendWhatsApp: "Continue on WhatsApp",
      whatsAppHint: "Opens WhatsApp with your request written. Just tap send.",
      sending: "Sending…",
      received: "Request received.",
      receivedWhatsApp: "WhatsApp opened with your message. Confirm send in the chat.",
      receivedCloud: "Your request reached the studio. Reply within one business day by WhatsApp or email. Keep the summary below.",
      receivedLocal: "Saved on this device and will sync to the studio on the next sign-in.",
      sendAnother: "Make another request",
      errName: "Please enter your name.",
      errEmail: "Please enter a valid email.",
      errPhone: "Please enter a valid phone number.",
      errCaptcha: "Please answer the security check.",
      errSubmit: "Could not send. Check the details and try again.",
      captchaLoading: "Loading verification…",
    },
    footer: {
      contact: "Contact",
      projectsServices: "Projects and services",
      studio: "Studio",
      social: "Social",
      privacy: "Privacy",
      terms: "Terms",
      clientPortal: "Client portal",
      studioArea: "Studio area",
      faq: "FAQ",
      igPending: "Instagram (soon)",
      fbPending: "Facebook (soon)",
      liPending: "LinkedIn (soon)",
    },
    cookies: {
      text: "Cookies only to measure visits, and only with your consent.",
      privacy: "Privacy",
      accept: "Accept",
      reject: "Decline",
    },
    portfolio: {
      title: "Houses",
      count: (n: number) => `${n} residences seen whole before the first wall.`,
      materials: "Materials",
      askParty: "Request a house in this massing",
    },
    a11y: {
      langToEn: "Switch to English",
      langToPt: "Mudar para português",
      backTop: "Back to top",
    },
  },
} as const;

export type Messages = (typeof messages)["pt"];

export function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (v === "pt" || v === "en") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function resolveLocale(): Locale {
  return readStoredLocale() ?? "pt";
}

export function applyLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale === "en" ? "en" : "pt";
}

export function setLocale(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
  applyLocale(locale);
}

export const LOCALE_BOOT_SCRIPT = `(function(){try{var k=${JSON.stringify(LOCALE_STORAGE_KEY)};var v=localStorage.getItem(k);document.documentElement.lang=(v==='en')?'en':'pt';}catch(e){}})();`;
