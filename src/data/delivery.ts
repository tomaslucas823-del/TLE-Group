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

/** Samples of real TLE delivery quality. Client PII removed. */
export const deliveryCategories: DeliveryCategory[] = [
  {
    id: "renders",
    label: "Renderizações",
    labelEn: "Renders",
    description: "Volume, luz e materiais.",
    descriptionEn: "Volume, light and materials.",
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
    description: "Plantas de piso e relação com o terreno.",
    descriptionEn: "Floor plans and site relationship.",
    images: [
      {
        src: "/renders/linear-garagem.webp",
        alt: "Organização de chegada e garagem",
        caption: "Chegada e garagem",
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
        caption: "Implantação",
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
    labelEn: "Sections",
    description: "Alturas, cortes e elevações.",
    descriptionEn: "Heights, sections and elevations.",
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
        caption: "Elevação",
      },
      {
        src: "/renders/pavilhao-coluna.webp",
        alt: "Corte e coluna do pavilhão",
        caption: "Corte",
      },
      {
        src: "/renders/veu-azul.webp",
        alt: "Elevação com luz e volume",
        caption: "Volume",
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
