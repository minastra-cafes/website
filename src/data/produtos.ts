export type Produto = {
  id: string;
  nome: string;
  torra: string;
  descricao: string;
  // Caminhos a partir de public/, começando por /images/.
  fotos: string[];
  // Peso em gramas → preço em reais. A ordem é a dos botões; a página abre no último.
  pesoValores: Record<string, number>;
};

export const PRODUTOS: Produto[] = [
  {
    id: "bronze",
    nome: "Linha Bronze",
    torra: "Torra Média Escura",
    descricao:
      "Sabor intenso e encorpado do café tradicional, mas com um toque mais doce e um perfil que combina com o dia a dia — o café perfeito para as manhãs.",
    fotos: ["/images/produtos/new_bronze.webp"],
    pesoValores: { "250": 20, "500": 39 },
  },
  {
    id: "ouro",
    nome: "Linha Ouro",
    torra: "Torra Média Clara",
    descricao:
      "Aroma marcante de chocolate e sabor naturalmente doce, com notas suaves de mel. Um café leve e envolvente para quem aprecia suavidade e frescor.",
    fotos: ["/images/produtos/new_ouro.webp"],
    pesoValores: { "250": 25, "500": 48 },
  },
  {
    id: "ouro-graos",
    nome: "Ouro em Grãos",
    torra: "Média Clara · Grão",
    descricao:
      "As mesmas notas doces de chocolate, mel e frescor da versão moída. Em grãos para quem prefere moer na hora e preservar toda a frescura e aroma do café.",
    fotos: ["/images/produtos/ouro_grao.webp"],
    pesoValores: { "250": 25, "500": 48 },
  },
];

export function buscarProduto(id: string): Produto | undefined {
  return PRODUTOS.find((produto) => produto.id === id);
}
