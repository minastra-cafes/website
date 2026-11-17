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
    const esperado = montarLinkWhatsApp(montarMensagemPedido(ouro, "500", 2));
    expect(screen.getByRole("link", { name: "Comprar no WhatsApp" })).toHaveAttribute("href", esperado);
    expect(screen.getByRole("link", { name: "Comprar" })).toHaveAttribute("href", esperado);
  });

  it("troca a foto principal ao clicar numa miniatura", async () => {
    const comDuasFotos = { ...ouro, fotos: [{ src: "/images/a.webp", srcSet: "/images/a.webp 600w" }, { src: "/images/b.webp", srcSet: "/images/b.webp 600w" }] };
    render(<CompraProduto produto={comDuasFotos} />);
    await userEvent.click(screen.getByRole("button", { name: "Ver foto 2 de Linha Ouro" }));
    expect(screen.getByRole("img", { name: "Linha Ouro" })).toHaveAttribute("src", "/images/b.webp");
  });
});
