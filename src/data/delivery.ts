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
    description: "Disposição dos quartos e tipologias (T2, T3).",
    descriptionEn: "Room layout and typologies (T2, T3).",
    images: [
      {
        src: "/entrega/planta-t2.svg",
        alt: "Planta esquemática tipologia T2 com dois quartos",
        caption: "T2 · dois quartos",
      },
      {
        src: "/entrega/planta-t3.svg",
        alt: "Planta esquemática tipologia T3 com três quartos e suíte",
        caption: "T3 · três quartos",
      },
      {
        src: "/renders/linear-garagem.webp",
        alt: "Organização de chegada e garagem",
        caption: "Chegada e garagem",
      },
      {
        src: "/renders/jardim-estrelitzia.webp",
        alt: "Relação com o jardim e limites do terreno",
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
    description: "Cortes transversais e intermédios: paredes, materiais e volume interno.",
    descriptionEn: "Transverse and intermediate sections: walls, materials, interior volume.",
    images: [
      {
        src: "/entrega/corte-transversal.svg",
        alt: "Corte transversal com pisos e volumetria interna",
        caption: "Corte transversal",
      },
      {
        src: "/entrega/corte-intermedio.svg",
        alt: "Corte intermédio com paredes, lajes e acabamentos",
        caption: "Corte intermédio",
      },
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
        src: "/renders/pavilhao-coluna.webp",
        alt: "Corte e coluna do pavilhão",
        caption: "Corte · coluna",
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
