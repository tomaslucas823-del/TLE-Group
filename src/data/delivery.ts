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

/** Samples of TLE delivery quality. Technical sheets (schematic where full raster pending). */
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
    description: "Plantas cotadas, mobiladas e tipologias (ex.: T2 / T3).",
    descriptionEn: "Dimensioned and furnished plans (e.g. T2 / T3).",
    images: [
      {
        src: "/entrega/planta-t3.svg",
        alt: "Planta baixa tipologia T3 com zoneamento de compartimentos",
        caption: "Planta mobilada · T3",
      },
      {
        src: "/entrega/planta-t2.svg",
        alt: "Planta baixa tipologia T2",
        caption: "Planta · T2",
      },
      {
        src: "/entrega/planta-t3.svg",
        alt: "Distribuição de quartos e áreas comuns",
        caption: "Zoneamento",
      },
    ],
  },
  {
    id: "cortes",
    label: "Cortes e elevações",
    labelEn: "Sections",
    description: "Cortes transversais e relações de altura / volumetria interna.",
    descriptionEn: "Sections and height relationships / interior volume.",
    images: [
      {
        src: "/entrega/corte-transversal.svg",
        alt: "Corte transversal esquemático",
        caption: "Corte transversal",
      },
      {
        src: "/entrega/corte-intermedio.svg",
        alt: "Corte intermédio com níveis",
        caption: "Corte intermédio",
      },
      {
        src: "/entrega/corte-transversal.svg",
        alt: "Relação de alturas e paredes",
        caption: "Alturas e paredes",
      },
    ],
  },
  {
    id: "estrutura",
    label: "Estrutura",
    labelEn: "Structure",
    description: "Fundação, pilares e elementos estruturais (amostras esquemáticas).",
    descriptionEn: "Foundations, columns and structural elements (schematic samples).",
    images: [
      {
        src: "/entrega/corte-intermedio.svg",
        alt: "Esquema estrutural de referência",
        caption: "Esquema estrutural",
      },
      {
        src: "/entrega/corte-transversal.svg",
        alt: "Corte com indicação de elementos estruturais",
        caption: "Corte estrutural",
      },
    ],
  },
];

export function getDeliveryCategory(id: string) {
  return deliveryCategories.find((c) => c.id === id);
}
