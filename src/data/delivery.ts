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
 * Dense grid of renders + technical framing (plans / elevations).
 * Client PII removed.
 */
export const deliveryCategories: DeliveryCategory[] = [
  {
    id: "renders",
    label: "Renderizações",
    labelEn: "Renders",
    description:
      "Volume, luz e materiais — a imagem que fecha o partido antes da obra.",
    descriptionEn:
      "Volume, light and materials — the image that locks the massing before construction.",
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
    description:
      "Plantas de piso, zoneamento e relação com o terreno. A distribuição que a obra executa.",
    descriptionEn:
      "Floor plans, zoning and site relationship. The distribution the build will execute.",
    images: [
      {
        src: "/renders/linear-garagem.webp",
        alt: "Organização de chegada e garagem",
        caption: "Chegada · garagem",
      },
      {
        src: "/renders/pavilhao-aberto.webp",
        alt: "Espaço de chegada sob cobertura",
        caption: "Pórtico",
      },
      {
        src: "/renders/oculus-fundo.webp",
        alt: "Volume posterior e abertura",
        caption: "Fundo",
      },
      {
        src: "/renders/jardim-estrelitzia.webp",
        alt: "Relação com o jardim e limites",
        caption: "Implantação · jardim",
      },
      {
        src: "/renders/veu-entrada.webp",
        alt: "Entrada e sequência de espaços",
        caption: "Entrada",
      },
      {
        src: "/renders/linear-detalhe.webp",
        alt: "Detalhe de partido linear",
        caption: "Detalhe",
      },
    ],
  },
  {
    id: "cortes",
    label: "Cortes e elevações",
    labelEn: "Sections & elevations",
    description:
      "Alturas, cortes e elevações. O que a secção mostra e a fachada confirma.",
    descriptionEn:
      "Heights, sections and elevations. What the cut shows and the façade confirms.",
    images: [
      {
        src: "/renders/veu-lateral.webp",
        alt: "Elevação lateral com ripado",
        caption: "Elevação lateral",
      },
      {
        src: "/renders/linear-ripado.webp",
        alt: "Detalhe de elevação com ripado e vãos",
        caption: "Ripado",
      },
      {
        src: "/renders/oculus-lateral.webp",
        alt: "Elevação com óculo e massa",
        caption: "Elevação · óculo",
      },
      {
        src: "/renders/pavilhao-coluna.webp",
        alt: "Corte e coluna do pavilhão",
        caption: "Corte · coluna",
      },
      {
        src: "/renders/veu-azul.webp",
        alt: "Elevação com luz e volume",
        caption: "Elevação",
      },
      {
        src: "/renders/oculus-rua.webp",
        alt: "Vista da rua e proporções",
        caption: "Vista da rua",
      },
    ],
  },
];

export function getDeliveryCategory(id: string) {
  return deliveryCategories.find((c) => c.id === id);
}
