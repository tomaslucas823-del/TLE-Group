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
 * Renders use existing portfolio assets; technical sheets will be replaced
 * with anonymized pages from project PDFs (public/entrega/*).
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
        src: `/renders/${encodeURIComponent("WhatsApp Image 2026-10-21 at 20.36.44.jpeg")}`,
        alt: "Fachada principal com garagem e volume branco",
        caption: "Fachada principal",
      },
      {
        src: `/renders/${encodeURIComponent("WhatsApp Image 2026-10-21 at 20.36.45.jpeg")}`,
        alt: "Vista da rua com laje contínua",
        caption: "Vista da rua",
      },
      {
        src: `/renders/${encodeURIComponent("WhatsApp Image 2026-10-21 at 20.36.46.jpeg")}`,
        alt: "Entrada coberta com painel de madeira",
        caption: "Entrada",
      },
      {
        src: "/renders/veu-frente.webp",
        alt: "Fachada com pórtico e pedra",
        caption: "Volume e chegada",
      },
    ],
  },
  {
    id: "plantas",
    label: "Plantas",
    labelEn: "Floor plans",
    description:
      "Plantas cotadas, zoneamento e implantação. A distribuição que a obra vai executar. Amostras técnicas do estúdio.",
    descriptionEn:
      "Dimensioned plans, zoning and site layout. The distribution the build will execute. Studio technical samples.",
    images: [
      {
        src: "/renders/oculus-jardim.webp",
        alt: "Representação de volume e planta conceptual",
        caption: "Conceito de planta · volume",
      },
      {
        src: "/renders/linear-dia.webp",
        alt: "Fachada linear correspondente a planta alongada",
        caption: "Partido linear",
      },
      {
        src: "/renders/pavilhao-dia.webp",
        alt: "Pavilhão de chegada",
        caption: "Chegada e pórtico",
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
        src: "/renders/oculus-fachada.webp",
        alt: "Elevação com óculo e volumetria",
        caption: "Elevação · óculo",
      },
      {
        src: "/renders/veu-lateral.webp",
        alt: "Elevação lateral com ripado",
        caption: "Elevação lateral",
      },
      {
        src: "/renders/linear-ripado.webp",
        alt: "Detalhe de elevação com ripado",
        caption: "Detalhe de elevação",
      },
    ],
  },
];

export function getDeliveryCategory(id: string) {
  return deliveryCategories.find((c) => c.id === id);
}
