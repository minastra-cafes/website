import { render, screen, within } from "@testing-library/react";
import { PRODUTOS } from "@/data/produtos";
import { formatarMoeda, montarLinkWhatsApp } from "@/lib/pedido";
import { Footer } from "./Footer";
import { MolduraProduto } from "./produto/MolduraProduto";
import { Cafes } from "./sections/Cafes";

describe("contatos no rodapé", () => {
  it.each([
    ["página inicial", <Footer key="inicio" />],
    ["página de produto", <MolduraProduto key="produto">conteúdo</MolduraProduto>],
  ])("a %s tem Instagram e WhatsApp", (_pagina, elemento) => {
    render(elemento);
    const rodape = within(screen.getByRole("contentinfo"));

    const instagram = rodape.getByRole("link", { name: /Instagram/ });
    expect(instagram).toHaveAttribute("href", "https://www.instagram.com/minastra_cafes");
    expect(instagram).toHaveAttribute("target", "_blank");

    const whatsapp = rodape.getByRole("link", { name: /WhatsApp/ });
    expect(whatsapp).toHaveAttribute("href", montarLinkWhatsApp("Olá, gostaria de saber mais sobre os cafés Minastra!"));
    expect(whatsapp).toHaveAttribute("target", "_blank");
  });
});

describe("rodapé da página de produto", () => {
  it("deixa espaço para a barra fixa de compra no celular", () => {
    render(<MolduraProduto comBarraDeCompra>conteúdo</MolduraProduto>);
    expect(screen.getByRole("contentinfo")).toHaveClass("pb-28", "sm:pb-6");
  });

  it("sem a barra (no 404), fica com o espaço normal", () => {
    render(<MolduraProduto comCabecalho={false}>conteúdo</MolduraProduto>);
    expect(screen.getByRole("contentinfo")).not.toHaveClass("pb-28");
  });
});

describe("preço dos cartões de café", () => {
  it("acompanha uma mudança de preço em produtos.ts", () => {
    const bronze = PRODUTOS.find((produto) => produto.id === "bronze")!;
    const original = bronze.pesoValores["250"];
    bronze.pesoValores["250"] = 22;
    try {
      render(<Cafes />);
      expect(screen.getByText("R$ 22,00")).toBeInTheDocument();
    } finally {
      bronze.pesoValores["250"] = original;
    }
  });

  it("mostra o menor preço de cada café, lido de produtos.ts", () => {
    render(<Cafes />);
    for (const produto of PRODUTOS) {
      const cartao = screen.getAllByRole("link").find((link) => link.getAttribute("href")?.replace(/\/$/, "") === `/produto/${produto.id}`)!;
      const menor = Math.min(...Object.values(produto.pesoValores));
      // O Testing Library troca o espaço sem quebra do "R$ 20,00" por espaço comum ao ler o texto.
      expect(within(cartao).getByText(formatarMoeda(menor).replace(/\s/g, " "))).toBeInTheDocument();
    }
  });
});
