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
 * Anonymized technical sheets and selected renders from studio packages.
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
        src: "/entrega/render-01.webp",
        alt: "Fachada principal com volume branco e elementos de pedra",
        caption: "Fachada principal",
      },
      {
        src: "/entrega/render-02.webp",
        alt: "Vista lateral com laje e integração com o terreno",
        caption: "Vista lateral",
      },
      {
        src: "/entrega/render-03.webp",
        alt: "Chegada coberta e pórtico",
        caption: "Chegada e pórtico",
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
        src: "/entrega/planta-01.webp",
        alt: "Planta de implantação e zoneamento",
        caption: "Implantação",
      },
      {
        src: "/entrega/planta-02.webp",
        alt: "Planta de distribuição interior cotada",
        caption: "Planta cotada",
      },
      {
        src: "/entrega/situacao-01.webp",
        alt: "Planta de situação e enquadramento no lote",
        caption: "Situação",
      },
      {
        src: "/entrega/localizacao-01.webp",
        alt: "Localização e orientação no terreno",
        caption: "Localização",
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
        src: "/entrega/corte-01.webp",
        alt: "Corte técnico longitudinal com alturas e relações de espaços",
        caption: "Corte longitudinal",
      },
    ],
  },
];

export function getDeliveryCategory(id: string) {
  return deliveryCategories.find((c) => c.id === id);
}
