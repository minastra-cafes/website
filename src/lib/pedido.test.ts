import { PRODUTOS } from "@/data/produtos";
import { calcularTotal, montarLinkWhatsApp, montarMensagemPedido } from "./pedido";

const ouro = PRODUTOS.find((produto) => produto.id === "ouro")!;

describe("calcularTotal", () => {
  it("multiplica o preço do peso pela quantidade", () => {
    expect(calcularTotal(ouro, "500", 2)).toBe(96);
  });

  it.each([0, -3, Number.NaN])("conta 1 pacote quando a quantidade é %s", (quantidade) => {
    expect(calcularTotal(ouro, "500", quantidade)).toBe(48);
  });
});

describe("montarMensagemPedido", () => {
  it("monta a mesma mensagem do site antigo", () => {
    expect(montarMensagemPedido(ouro, "500", 1)).toBe(
      "Olá! Tudo bem?\n\nGostaria de pedir 1 pacote do Linha Ouro, de 500g.\nO valor mostrado no site foi R$ 48,00.\n\nVocês poderiam confirmar a disponibilidade e me informar o valor da entrega, por favor?",
    );
  });

  it("fala em pacotes no plural a partir de 2", () => {
    expect(montarMensagemPedido(ouro, "500", 2)).toContain("Gostaria de pedir 2 pacotes do Linha Ouro, de 500g.");
  });

  it("nunca mostra NaN com quantidade inválida", () => {
    expect(montarMensagemPedido(ouro, "250", Number.NaN)).toContain("1 pacote do Linha Ouro, de 250g.\nO valor mostrado no site foi R$ 25,00.");
  });
});

describe("montarLinkWhatsApp", () => {
  it("leva a mensagem codificada para o número do Minastra", () => {
    expect(montarLinkWhatsApp("a b")).toBe("https://wa.me/5535999131028?text=a%20b");
  });
});
