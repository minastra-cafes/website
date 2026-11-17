import type { Produto } from "@/data/produtos";
import { SITE } from "@/data/site";

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Campo vazio, 0, negativo ou NaN contam como 1 pacote: o total nunca fica sem sentido.
export function normalizarQuantidade(quantidade: number): number {
  return Number.isFinite(quantidade) && quantidade >= 1 ? Math.floor(quantidade) : 1;
}

export function calcularTotal(produto: Produto, peso: string, quantidade: number): number {
  return produto.pesoValores[peso] * normalizarQuantidade(quantidade);
}

export function montarMensagemPedido(produto: Produto, peso: string, quantidade: number): string {
  const pacotes = normalizarQuantidade(quantidade);
  const total = calcularTotal(produto, peso, pacotes);
  return [
    "Olá! Tudo bem?",
    "",
    `Gostaria de pedir ${pacotes} ${pacotes === 1 ? "pacote" : "pacotes"} do ${produto.nome}, de ${peso}g.`,
    `O valor mostrado no site foi ${formatarMoeda(total)}.`,
    "",
    "Vocês poderiam confirmar a disponibilidade e me informar o valor da entrega, por favor?",
  ].join("\n");
}

export function montarLinkWhatsApp(mensagem: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
