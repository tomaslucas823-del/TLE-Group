export type DeliveryShot = {
  src: string;
  alt: string;
  caption?: string;
};

export type DeliveryCategory = {
  id: string;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
  images: DeliveryShot[];
};

/** Samples of real TLE delivery quality. Client side-blocks cropped. */
export const deliveryCategories: DeliveryCategory[] = [
  {
    id: "renders",
    label: "Renderizações",
    labelEn: "Renders",
    description: "Fachadas e volumetrias finais.",
    descriptionEn: "Final façades and massing.",
    images: [
      {
        src: "/renders/veu-frente.webp",
        alt: "Fachada principal com pórtico e plano de pedra",
        caption: "Fachada principal",
      },
      {
        src: "/renders/oculus-fachada.webp",
        alt: "Volume com óculo e massa contínua",
        caption: "Volume e óculo",
      },
      {
        src: "/renders/linear-dia.webp",
        alt: "Fachada linear com grandes vãos",
        caption: "Partido linear",
      },
      {
        src: "/renders/pavilhao-dia.webp",
        alt: "Pavilhão aberto e laje em balanço",
        caption: "Pavilhão",
      },
      {
        src: "/renders/oculus-jardim.webp",
        alt: "Relação do volume com o jardim",
        caption: "Jardim",
      },
      {
        src: "/renders/linear-piscina.webp",
        alt: "Fachada linear e área exterior",
        caption: "Exterior",
      },
    ],
  },
  {
    id: "plantas",
    label: "Plantas",
    labelEn: "Floor plans",
    description: "Plantas cotadas, mobiladas e tipologias (ex.: T3).",
    descriptionEn: "Dimensioned and furnished plans (e.g. T3).",
    images: [
      {
        src: "/entrega/planta-mobilada-t3.svg",
        alt: "Planta baixa mobilada tipologia T3 com zoneamento",
        caption: "Planta mobilada · T3",
      },
      {
        src: "/entrega/planta-cotada.svg",
        alt: "Planta baixa cotada com dimensões",
        caption: "Planta cotada",
      },
      {
        src: "/entrega/planta-situacao.svg",
        alt: "Planta de situação e localização",
        caption: "Planta de situação",
      },
      {
        src: "/entrega/planta-vaos.svg",
        alt: "Planta de vãos, portas e janelas",
        caption: "Mapa de vãos",
      },
    ],
  },
  {
    id: "cortes",
    label: "Cortes e elevações",
    labelEn: "Sections",
    description: "Cortes transversais e alçados com paredes e volumetria interna.",
    descriptionEn: "Sections and elevations with walls and interior volume.",
    images: [
      {
        src: "/entrega/corte-aa-bb.svg",
        alt: "Secções de corte AA e BB",
        caption: "Cortes AA · BB",
      },
      {
        src: "/entrega/corte-cc-dd.svg",
        alt: "Secções de corte CC e DD",
        caption: "Cortes CC · DD",
      },
      {
        src: "/entrega/corte-ee-ff.svg",
        alt: "Secções de corte EE e FF",
        caption: "Cortes EE · FF",
      },
      {
        src: "/entrega/alcado-laterais.svg",
        alt: "Alçados laterais esquerdo e direito",
        caption: "Alçados laterais",
      },
      {
        src: "/entrega/alcado-frontal-posterior.svg",
        alt: "Alçados frontal e posterior",
        caption: "Alçados frontal · posterior",
      },
    ],
  },
  {
    id: "estrutura",
    label: "Estrutura",
    labelEn: "Structure",
    description: "Fundação, pilares, sapatas e vigas de piso.",
    descriptionEn: "Foundations, columns, footings and floor beams.",
    images: [
      {
        src: "/entrega/estrutura-fundacao.svg",
        alt: "Planta de fundação com sapatas e eixos",
        caption: "Planta de fundação",
      },
      {
        src: "/entrega/estrutura-pilares.svg",
        alt: "Quadro de pilares e pormenores de armadura",
        caption: "Quadro de pilares",
      },
      {
        src: "/entrega/estrutura-sapatas-vigas.svg",
        alt: "Pormenores de sapatas e vigas de piso",
        caption: "Sapatas e vigas",
      },
      {
        src: "/entrega/estrutura-vigas-piso.svg",
        alt: "Planta e pormenores de vigas de piso",
        caption: "Vigas de piso",
      },
    ],
  },
];

export function getDeliveryCategory(id: string) {
  return deliveryCategories.find((c) => c.id === id);
}
