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

export const deliveryCategories: DeliveryCategory[] = [
  {
    id: "renders",
    label: "Renderizações",
    labelEn: "Renders",
    description: "Imagens exteriores de alta definição. O volume, a luz e os materiais antes da primeira parede.",
    descriptionEn: "High-definition exterior images. Volume, light and materials before the first wall.",
    images: [
      {
        src: "/entrega/render-01.webp",
        alt: "Fachada principal com garagem e volume branco",
        caption: "Fachada principal",
      },
      {
        src: "/entrega/render-02.webp",
        alt: "Vista lateral com ripado e jardim",
        caption: "Vista lateral",
      },
      {
        src: "/entrega/render-03.webp",
        alt: "Vista traseira e lateral com vegetação",
        caption: "Vista de conjunto",
      },
    ],
  },
  {
    id: "plantas",
    label: "Plantas",
    labelEn: "Floor plans",
    description: "Plantas cotadas, zoneamento e implantação. A distribuição que a obra vai executar.",
    descriptionEn: "Dimensioned plans, zoning and site layout. The distribution the build will execute.",
    images: [
      {
        src: "/entrega/planta-01.webp",
        alt: "Planta baixa com zoneamento de áreas",
        caption: "Planta baixa · zoneamento",
      },
      {
        src: "/entrega/planta-02.webp",
        alt: "Planta de implantação",
        caption: "Implantação",
      },
      {
        src: "/entrega/situacao-01.webp",
        alt: "Planta de situação e mapa de localização",
        caption: "Situação",
      },
    ],
  },
  {
    id: "cortes",
    label: "Cortes e elevações",
    labelEn: "Sections & elevations",
    description: "Cortes técnicos, alturas e relações entre espaços. O que a secção mostra e a elevação confirma.",
    descriptionEn: "Technical sections, heights and spatial relationships. What the cut shows and the elevation confirms.",
    images: [
      {
        src: "/entrega/corte-01.webp",
        alt: "Cortes longitudinais com cotas e níveis",
        caption: "Cortes · níveis e cotas",
      },
      {
        src: "/entrega/localizacao-01.webp",
        alt: "Planta de localização do terreno",
        caption: "Localização",
      },
    ],
  },
];

export function getDeliveryCategory(id: string) {
  return deliveryCategories.find((c) => c.id === id);
}
