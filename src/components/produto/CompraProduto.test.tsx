import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PRODUTOS } from "@/data/produtos";
import { montarLinkWhatsApp, montarMensagemPedido } from "@/lib/pedido";
import { CompraProduto } from "./CompraProduto";

const ouro = PRODUTOS.find((produto) => produto.id === "ouro")!;

function totalDesktop() {
  return screen.getByTestId("total").textContent;
}

describe("CompraProduto", () => {
  it("começa no último peso, como o site antigo", () => {
    render(<CompraProduto produto={ouro} />);
    expect(screen.getByRole("button", { name: /500g/ })).toHaveAttribute("aria-pressed", "true");
    expect(totalDesktop()).toBe("R$ 48,00");
  });

  it("muda o total ao escolher outro peso", async () => {
    render(<CompraProduto produto={ouro} />);
    await userEvent.click(screen.getByRole("button", { name: /250g/ }));
    expect(totalDesktop()).toBe("R$ 25,00");
  });

  it("o + sobe a quantidade e o − não passa de 1", async () => {
    render(<CompraProduto produto={ouro} />);
    const quantidade = screen.getByLabelText("Quantidade");
    await userEvent.click(screen.getByRole("button", { name: "Aumentar quantidade" }));
    expect(quantidade).toHaveValue(2);
    expect(totalDesktop()).toBe("R$ 96,00");
    await userEvent.click(screen.getByRole("button", { name: "Diminuir quantidade" }));
    await userEvent.click(screen.getByRole("button", { name: "Diminuir quantidade" }));
    expect(quantidade).toHaveValue(1);
  });

  it("volta a quantidade para 1 quando o campo fica vazio e perde o foco", async () => {
    render(<CompraProduto produto={ouro} />);
    const quantidade = screen.getByLabelText("Quantidade");
    await userEvent.clear(quantidade);
    expect(totalDesktop()).toBe("R$ 48,00");
    fireEvent.blur(quantidade);
    expect(quantidade).toHaveValue(1);
  });

  it("os dois botões de compra levam a mensagem do pedido ao WhatsApp", async () => {
    render(<CompraProduto produto={ouro} />);
    await userEvent.click(screen.getByRole("button", { name: "Aumentar quantidade" }));
    const esperado = montarLinkWhatsApp(montarMensagemPedido(ouro, "500", 2), "5535999131028");
    expect(screen.getByRole("link", { name: "Comprar no WhatsApp" })).toHaveAttribute("href", esperado);
    expect(screen.getByRole("link", { name: "Comprar" })).toHaveAttribute("href", esperado);
  });
});

describe("fotos do produto", () => {
  const comDuasFotos = {
    ...ouro,
    fotos: [
      { src: "/images/a.webp", srcSet: "/images/a.webp 600w" },
      { src: "/images/b.webp", srcSet: "/images/b.webp 600w" },
    ],
  };

  function faixaDeFotos() {
    const faixa = screen.getByTestId("faixa-fotos");
    Object.defineProperty(faixa, "clientWidth", { configurable: true, value: 300 });
    faixa.scrollTo = vi.fn() as unknown as typeof faixa.scrollTo;
    return faixa;
  }

  it("mostra todas as fotos numa faixa que desliza para o lado", () => {
    render(<CompraProduto produto={comDuasFotos} />);
    expect(screen.getByRole("img", { name: "Linha Ouro, foto 1 de 2" })).toHaveAttribute("src", "/images/a.webp");
    expect(screen.getByRole("img", { name: "Linha Ouro, foto 2 de 2" })).toHaveAttribute("src", "/images/b.webp");
    expect(screen.getByTestId("faixa-fotos")).toHaveClass("snap-x", "overflow-x-auto");
  });

  it("a miniatura leva a faixa até a foto escolhida", async () => {
    render(<CompraProduto produto={comDuasFotos} />);
    const faixa = faixaDeFotos();
    await userEvent.click(screen.getByRole("button", { name: "Ver foto 2 de Linha Ouro" }));
    expect(faixa.scrollTo).toHaveBeenCalledWith({ left: 300, behavior: "smooth" });
    expect(screen.getByRole("button", { name: "Ver foto 2 de Linha Ouro" })).toHaveAttribute("aria-current", "true");
  });

  it("deslizar a faixa marca a miniatura da foto que ficou na tela", () => {
    render(<CompraProduto produto={comDuasFotos} />);
    const faixa = faixaDeFotos();
    faixa.scrollLeft = 290;
    fireEvent.scroll(faixa);
    expect(screen.getByRole("button", { name: "Ver foto 2 de Linha Ouro" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("button", { name: "Ver foto 1 de Linha Ouro" })).not.toHaveAttribute("aria-current");
  });

  it("com uma foto só, o texto alternativo é o nome do café", () => {
    render(<CompraProduto produto={ouro} />);
    expect(screen.getByRole("img", { name: "Linha Ouro" })).toBeInTheDocument();
  });
});

describe("fotos dos cafés", () => {
  it("Bronze e Ouro em Grãos abrem com a foto nova do pacote e mantêm a antiga em segundo", () => {
    const fotos = (id: string) => PRODUTOS.find((produto) => produto.id === id)!.fotos.map((item) => item.src);
    expect(fotos("bronze")).toEqual(["/images/produto-bronze-pacote-1152.webp", "/images/produto-bronze-856.webp"]);
    expect(fotos("ouro-graos")).toEqual(["/images/produto-ouro-graos-pacote-1152.webp", "/images/produto-ouro-graos-1200.webp"]);
    expect(fotos("ouro")).toEqual(["/images/produto-ouro-1200.webp"]);
  });
});
