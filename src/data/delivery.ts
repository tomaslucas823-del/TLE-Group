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

/**
 * Samples of real TLE delivery quality.
 * High-definition renders and technical framing from studio packages.
 * Client PII removed; only design quality is shown.
 */
export const deliveryCategories: DeliveryCategory[] = [
  {
    id: "renders",
    label: "Renderizações",
    labelEn: "Renders",
    description:
      "Imagens exteriores de alta definição. O volume, a luz e os materiais antes da primeira parede.",
    descriptionEn:
      "High-definition exterior images. Volume, light and materials before the first wall.",
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
        caption: "Pavilhão de chegada",
      },
    ],
  },
  {
    id: "plantas",
    label: "Plantas",
    labelEn: "Floor plans",
    description:
      "Plantas cotadas, zoneamento e implantação. A distribuição que a obra vai executar.",
    descriptionEn:
      "Dimensioned plans, zoning and site layout. The distribution the build will execute.",
    images: [
      {
        src: "/renders/oculus-jardim.webp",
        alt: "Representação de volume e relação com o jardim",
        caption: "Volume · jardim",
      },
      {
        src: "/renders/linear-garagem.webp",
        alt: "Relação da fachada linear com a garagem",
        caption: "Chegada e garagem",
      },
      {
        src: "/renders/pavilhao-aberto.webp",
        alt: "Espaço de chegada sob cobertura",
        caption: "Pórtico e chegada",
      },
    ],
  },
  {
    id: "cortes",
    label: "Cortes e elevações",
    labelEn: "Sections & elevations",
    description:
      "Cortes técnicos, alturas e relações entre espaços. O que a secção mostra e a elevação confirma.",
    descriptionEn:
      "Technical sections, heights and spatial relationships. What the cut shows and the elevation confirms.",
    images: [
      {
        src: "/renders/veu-lateral.webp",
        alt: "Elevação lateral com ripado e proporções",
        caption: "Elevação lateral",
      },
      {
        src: "/renders/linear-ripado.webp",
        alt: "Detalhe de elevação com ripado e vãos",
        caption: "Detalhe de elevação",
      },
      {
        src: "/renders/oculus-lateral.webp",
        alt: "Elevação com óculo e massa",
        caption: "Elevação · óculo",
      },
    ],
  },
];

export function getDeliveryCategory(id: string) {
  return deliveryCategories.find((c) => c.id === id);
}
