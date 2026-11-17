import { render, screen, within } from "@testing-library/react";
import Home from "./page";

// A seção de avaliações tem os próprios testes; aqui ela nunca vai à rede.
vi.mock("@/lib/azics", async (original) => ({
  ...(await original<typeof import("@/lib/azics")>()),
  buscarAvaliacoes: vi.fn(() => new Promise(() => {})),
}));

describe("página inicial", () => {
  const buscar = vi.fn(() => Promise.reject(new TypeError("sem rede no teste")));

  beforeEach(() => {
    vi.stubGlobal("fetch", buscar);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    buscar.mockClear();
  });

  it("não chama a API da Azics nos testes (no CI a URL é a de produção)", () => {
    render(<Home />);
    expect(buscar).not.toHaveBeenCalled();
  });

  it("mostra o título principal", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("origem de verdade.");
  });

  it("mostra os títulos de cada seção", () => {
    render(<Home />);
    for (const titulo of [
      "Um Minastra para cada momento.",
      "Você sabe de onde vem o seu café.",
      "Especial sem ser complicado.",
      "Café feito por pessoas, não por atalhos.",
      "Descubra o sabor das montanhas de Minas.",
    ]) {
      expect(screen.getByRole("heading", { level: 2, name: titulo })).toBeInTheDocument();
    }
  });

  it("tem os links do menu para as seções", () => {
    render(<Home />);
    const menu = screen.getByRole("navigation", { name: "Navegação principal" });
    for (const destino of ["#cafes", "#origem", "#qualidade"]) {
      expect(within(menu).getAllByRole("link").some((link) => link.getAttribute("href") === destino)).toBe(true);
    }
  });

  it("leva cada café para a página do produto", () => {
    render(<Home />);
    // Fora do build o next/link não conhece o trailingSlash do next.config; a barra final é dele.
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href")?.replace(/\/$/, ""));
    expect(hrefs).toEqual(expect.arrayContaining(["/produto/bronze", "/produto/ouro", "/produto/ouro-graos"]));
  });
});
