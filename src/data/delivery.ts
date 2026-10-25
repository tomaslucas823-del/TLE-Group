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

/** Samples of real TLE delivery quality. */
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
        src: "/entrega/planta-mobilada-t3.webp",
        alt: "Planta baixa mobilada tipologia T3 com zoneamento",
        caption: "Planta mobilada · T3",
      },
      {
        src: "/entrega/planta-cotada.webp",
        alt: "Planta baixa cotada com dimensões",
        caption: "Planta cotada",
      },
      {
        src: "/entrega/planta-situacao.webp",
        alt: "Planta de situação e localização",
        caption: "Planta de situação",
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
        src: "/entrega/corte-aa-bb.webp",
        alt: "Secções de corte AA e BB",
        caption: "Cortes AA · BB",
      },
      {
        src: "/entrega/corte-cc-dd.webp",
        alt: "Secções de corte CC e DD",
        caption: "Cortes CC · DD",
      },
      {
        src: "/entrega/corte-ee-ff.webp",
        alt: "Secções de corte EE e FF",
        caption: "Cortes EE · FF",
      },
      {
        src: "/entrega/alcado-laterais.webp",
        alt: "Alçados laterais esquerdo e direito",
        caption: "Alçados laterais",
      },
      {
        src: "/entrega/alcado-frontal-posterior.webp",
        alt: "Alçados frontal e posterior",
        caption: "Alçados frontal · posterior",
      },
    ],
  },
  {
    id: "estrutura",
    label: "Estrutura",
    labelEn: "Structure",
    description: "Fundação e vigas de piso.",
    descriptionEn: "Foundations and floor beams.",
    images: [
      {
        src: "/entrega/estrutura-fundacao.webp",
        alt: "Planta de fundação com sapatas e eixos",
        caption: "Planta de fundação",
      },
      {
        src: "/entrega/estrutura-vigas-piso.webp",
        alt: "Planta e pormenores de vigas de piso",
        caption: "Vigas de piso",
      },
    ],
  },
];

export function getDeliveryCategory(id: string) {
  return deliveryCategories.find((c) => c.id === id);
}
