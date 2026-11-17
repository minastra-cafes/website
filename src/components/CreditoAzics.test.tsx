import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";
import { MolduraProduto } from "./produto/MolduraProduto";

describe("crédito da Azics no rodapé", () => {
  it.each([
    ["página inicial", <Footer key="inicio" />],
    ["página de produto", <MolduraProduto key="produto">conteúdo</MolduraProduto>],
  ])("aparece na %s com link para a Azics", (_pagina, elemento) => {
    render(elemento);
    const link = screen.getByRole("link", { name: "Azics" });
    expect(link).toHaveAttribute("href", "https://azics.com.br");
    expect(link).toHaveAttribute("target", "_blank");
    // Sem nofollow: o link vale como indicação da Azics para o Google.
    expect(link.getAttribute("rel")).not.toContain("nofollow");
    expect(link.closest("p")).toHaveTextContent("Site feito por Azics");
  });
});
