export type Shot = { src: string; alt: string };

export type Project = {
  slug: string;
  title: string;
  place: string;
  area: string;
  year: string;
  kind: string;
  summary: string;
  concept: string;
  materials: string[];
  cover: string;
  images: Shot[];
};

const shot = (name: string, alt: string): Shot => ({
  src: `/renders/${name}.webp`,
  alt,
});

export const projects: Project[] = [
  {
    slug: "casa-brise",
    title: "Casa Brise",
    place: "Maputo",
    area: "220 m²",
    year: "2026",
    kind: "Residencial",
    summary:
      "Volumes brancos, garagem para dois carros sob laje contínua e um plano de ripado de madeira. Pedra na parede e jardim tropical na chegada.",
    concept:
      "Dados provisórios até confirmação do cliente. A casa organiza a chegada pela garagem coberta, o ripado filtra a luz e a pedra marca o volume de estar. Nome, local e metragem serão actualizados quando o estúdio fechar a ficha.",
    materials: ["Reboco branco", "Pedra irregular", "Ripado de madeira", "Pavimento de betão"],
    cover: "/renders/brise-frente.webp",
    images: [
      shot("brise-frente", "Fachada frontal da Casa Brise com garagem para dois carros e palmeira"),
      shot("brise-obliqua", "Vista oblíqua com piso molhado, ripado e volume branco"),
      shot("brise-rua", "Vista da rua com laje contínua e jardim lateral"),
      shot("brise-patio", "Pátio lateral com pedra irregular e volume escuro"),
      shot("brise-entrada", "Entrada coberta com painel de madeira e jardim"),
    ],
  },
  {
    slug: "casa-veu",
    title: "Casa Véu",
    place: "Matola",
    area: "186 m²",
    year: "2026",
    kind: "Residencial",
    summary:
      "Volumes brancos, um plano de pedra e a garagem como pórtico. A casa se fecha para a rua e se abre para o pátio.",
    concept:
      "O véu de pedra protege a chegada sem transformar a fachada num muro. Madeira, reboco e concreto se encontram em juntas secas.",
    materials: ["Reboco branco", "Pedra irregular", "Madeira natural", "Concreto aparente"],
    cover: "/renders/veu-frente.webp",
    images: [
      shot("veu-frente", "Fachada frontal da Casa Véu, com porta de madeira e pórtico de concreto"),
      shot("veu-entrada", "Acesso com muro de pedra clara, palmeira e piso molhado"),
      shot("veu-noite", "Fachada ao anoitecer, com a pedra iluminada por baixo"),
      shot("veu-portal", "Portal de entrada com porta branca e painel de madeira"),
      shot("veu-lateral", "Lateral com volume escuro e ripado vertical de madeira"),
      shot("veu-muro", "Muro cego, painel de madeira e jardim de placas de concreto"),
    ],
  },
  {
    slug: "casa-oculus",
    title: "Casa Óculus",
    place: "Maputo",
    area: "210 m²",
    year: "2026",
    kind: "Residencial",
    summary:
      "Uma barra de concreto, um óculo e o jardim como extensão da sala. A vaga fica ao lado, sem competir com a casa.",
    concept:
      "O círculo é a única janela que a rua merece ver. O restante da vida acontece atrás do volume, entre o jardim e a cobertura em balanço.",
    materials: ["Concreto desempenado", "Esquadria de madeira", "Ripado", "Vegetação de porte"],
    cover: "/renders/oculus-jardim.webp",
    images: [
      shot("oculus-jardim", "Vista do jardim da Casa Óculus, com janela circular e cobertura"),
      shot("oculus-rua", "Fachada para a rua, com vaga coberta e jardineira baixa"),
      shot("oculus-fachada", "Fachada posterior com janelas altas e canteiro de samambaias"),
      shot("oculus-fundo", "Chegada posterior com porta de madeira e brises"),
      shot("oculus-lateral", "Lateral quase cega, com duas frestas verticais"),
    ],
  },
  {
    slug: "casa-linear",
    title: "Casa Linear",
    place: "Costa do Sol",
    area: "320 m²",
    year: "2025",
    kind: "Residencial",
    summary:
      "Uma laje longa, ripado de madeira e pedra no fundo da garagem. Duas vagas e a sala no mesmo gesto.",
    concept:
      "A casa é uma linha. O ripado filtra o sol da tarde, a pedra esquenta a garagem à noite e a piscina fica no eixo do estar.",
    materials: ["Ripado de freijó", "Pedra moledo", "Laje branca", "Vidro piso-teto"],
    cover: "/renders/linear-dia.webp",
    images: [
      shot("linear-dia", "Fachada diurna da Casa Linear, com ripado, pedra e garagem"),
      shot("linear-dusk", "A mesma fachada no fim da tarde, com luz quente sob a laje"),
      shot("linear-garagem", "Garagem coberta com dois carros e parede de pedra"),
      shot("linear-ripado", "Detalhe do ripado de madeira e da porta de vidro"),
      shot("linear-detalhe", "Encontro do ripado com a laje branca e o jardim"),
      shot("linear-piscina", "Piscina, deck de pedra e brises móveis de madeira"),
    ],
  },
  {
    slug: "pavilhao-norte",
    title: "Pavilhão Norte",
    place: "Maputo",
    area: "148 m²",
    year: "2026",
    kind: "Residencial",
    summary:
      "Um pavilhão de chegada: laje perfurada de luz, coluna solta e um plano de pedra que recebe a porta.",
    concept:
      "A casa não começa na porta. Começa no pátio coberto, onde a luz é desenhada no forro e as plantas já fazem parte da planta baixa.",
    materials: ["Pedra ferro", "Madeira vertical", "Coluna de concreto", "Forro com rasgo de luz"],
    cover: "/renders/pavilhao-dia.webp",
    images: [
      shot("pavilhao-dia", "Pavilhão de entrada com muro de pedra e plantas em vasos"),
      shot("pavilhao-noite", "O mesmo pavilhão à noite, com luz no piso da escada"),
      shot("pavilhao-aberto", "Vista aberta do pórtico, coluna e painel de madeira"),
      shot("pavilhao-coluna", "Coluna solta, painel de madeira e porta escura"),
    ],
  },
  {
    slug: "casa-jardim",
    title: "Casa Jardim",
    place: "Boane",
    area: "164 m²",
    year: "2025",
    kind: "Residencial",
    summary:
      "Uma caixa branca pousada no gramado, com uma janela baixa e o jardim tropical entrando na foto.",
    concept:
      "Menos fachada, mais sombra. O volume de serviço fica à esquerda, a janela da sala no centro e uma fresta alta no quarto.",
    materials: ["Reboco branco", "Madeira na esquadria", "Concreto da cobertura", "Estrelítzia"],
    cover: "/renders/jardim-estrelitzia.webp",
    images: [
      shot("jardim-estrelitzia", "Fachada branca com janela baixa e estrelítzias no primeiro plano"),
      shot("jardim-ripado", "Volume com ripado de madeira e jardim de arbustos"),
      shot("veu-azul", "Chegada em luz fria, com pedra, porta e painel de madeira"),
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
