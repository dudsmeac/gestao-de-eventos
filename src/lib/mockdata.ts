export type EventItem = {
  id: string;
  title: string;
  local: string;
  date: string;
  time: string;
  description: string;
  image: string;
  soldOut?: boolean;
};

export const events: EventItem[] = [
  {
    id: "snct-abertura",
    title: "Abertura da SNCTZO 2026",
    local: "Auditório 11 - UERJ Maracanã",
    date: "20 de outubro de 2026",
    time: "19h00",
    image: "linear-gradient(135deg, oklch(0.31 0.09 255), oklch(0.45 0.12 260))",
    description:
      "Cerimônia oficial de abertura da Semana Nacional de Ciência e Tecnologia na Zona Oeste. Conferência magna com pesquisadores convidados e apresentação cultural.",
  },
  {
    id: "palestra-ia",
    title: "Inteligência Artificial e Educação",
    local: "Sala 4001 - Bloco F",
    date: "21 de outubro de 2026",
    time: "14h00",
    image: "linear-gradient(135deg, oklch(0.45 0.15 30), oklch(0.85 0.17 85))",
    description:
      "Palestra sobre os impactos da inteligência artificial nas práticas pedagógicas contemporâneas e o uso ético em sala de aula.",
  },
  {
    id: "minicurso-react",
    title: "Minicurso: Desenvolvimento Web Moderno",
    local: "Laboratório de Informática - LAB 3",
    date: "22 de outubro de 2026",
    time: "09h00",
    image: "linear-gradient(135deg, oklch(0.5 0.15 200), oklch(0.7 0.12 180))",
    description:
      "Aprenda os fundamentos do desenvolvimento web moderno com React, TypeScript e ferramentas atuais do mercado. Vagas limitadas.",
    soldOut: true,
  },
  {
    id: "mesa-redonda",
    title: "Mesa Redonda: Mulheres na Ciência",
    local: "Auditório 11 - UERJ Maracanã",
    date: "23 de outubro de 2026",
    time: "16h00",
    image: "linear-gradient(135deg, oklch(0.45 0.18 340), oklch(0.65 0.14 20))",
    description:
      "Conversa com pesquisadoras de diferentes áreas sobre os desafios, avanços e perspectivas das mulheres na ciência brasileira.",
  },
  {
    id: "workshop-dados",
    title: "Workshop de Análise de Dados",
    local: "Sala 5012 - Bloco A",
    date: "24 de outubro de 2026",
    time: "13h30",
    image: "linear-gradient(135deg, oklch(0.4 0.12 145), oklch(0.65 0.15 150))",
    description:
      "Workshop prático sobre análise de dados com Python, abordando manipulação, visualização e estatística aplicada.",
  },
  {
    id: "encerramento",
    title: "Encerramento e Premiação",
    local: "Auditório 11 - UERJ Maracanã",
    date: "25 de outubro de 2026",
    time: "18h00",
    image: "linear-gradient(135deg, oklch(0.31 0.09 255), oklch(0.85 0.17 85))",
    description:
      "Cerimônia de encerramento com premiação dos melhores trabalhos científicos apresentados durante a semana.",
  },
];

export const mockCertificates = [
  {
    id: "cert-1",
    eventTitle: "Semana de Iniciação Científica 2025",
    participant: "Maria Costa",
    date: "15 de outubro de 2025",
    time: "20 horas",
  },
  {
    id: "cert-2",
    eventTitle: "Workshop de Pesquisa Acadêmica",
    participant: "Maria Costa",
    date: "08 de agosto de 2025",
    time: "8 horas",
  },
  {
    id: "cert-3",
    eventTitle: "Congresso de Tecnologia UERJ",
    participant: "Maria Costa",
    date: "12 de maio de 2025",
    time: "12 horas",
  },
];