import type { Conteudo } from "@/lib/conteudo";

// O texto do site quando o painel não tem o campo (ou fora do provedor, nos testes de componente).
// O build e o navegador trocam pelo que está no painel da Azics.
export const CONTEUDO_PADRAO: Conteudo = {
  titulo: "Café especial com origem de verdade.",
  subtitulo: "Do cultivo à torra, cuidamos de cada etapa para entregar cafés 100% arábica, frescos e cheios de identidade.",
  instagram: "https://www.instagram.com/minastra_cafes",
  celular: "5535999131028",
  sobre: {
    titulo: "Você sabe de onde vem o seu café.",
    paragrafos: [
      "A Minastra nasce de uma produção familiar em pequena escala. Cada lote carrega o cuidado de quem conhece a lavoura, respeita o tempo do grão e torra para revelar o melhor da origem.",
    ],
  },
};
