import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { buscarAvaliacoes, type AvaliacaoPublica, type PaginaDeAvaliacoes } from "@/lib/azics";
import { Avaliacoes } from "./Avaliacoes";

vi.mock("@/lib/azics", async (original) => ({
  ...(await original<typeof import("@/lib/azics")>()),
  buscarAvaliacoes: vi.fn(),
}));

const buscar = vi.mocked(buscarAvaliacoes);

function avaliacao(campos: Partial<AvaliacaoPublica> = {}): AvaliacaoPublica {
  return {
    id: 1,
    nome: "Augusto O.",
    foto_url: null,
    nota: 5,
    texto: "Melhor café que já provei!",
    atualizada_em: new Date().toISOString(),
    ...campos,
  };
}

function pagina(campos: Partial<PaginaDeAvaliacoes> = {}): PaginaDeAvaliacoes {
  return { itens: [avaliacao()], total: 1, pagina: 1, tamanho: 10, media: 5, ...campos };
}

function renderizar() {
  return render(<Avaliacoes slug="minastra" nomeNegocio="Minastra" />);
}

async function esperarSecao() {
  return screen.findByRole("region", { name: /avaliações/i });
}

describe("Avaliacoes", () => {
  afterEach(() => buscar.mockReset());

  it("não mostra nada enquanto a busca não termina", () => {
    buscar.mockReturnValue(new Promise(() => {}));
    const { container } = renderizar();
    expect(container.querySelector("section#avaliacoes")).toBeNull();
  });

  it.each([
    ["a API falha", null],
    ["não há avaliações", pagina({ itens: [], total: 0, media: null })],
  ])("some quando %s", async (_caso, resposta) => {
    buscar.mockResolvedValue(resposta);
    const { container } = renderizar();
    await waitFor(() => expect(buscar).toHaveBeenCalledWith("minastra", 1));
    await Promise.resolve();
    expect(container.querySelector("section#avaliacoes")).toBeNull();
  });

  it("mostra a média, o total, a avaliação e o botão de avaliar", async () => {
    buscar.mockResolvedValue(pagina());
    renderizar();
    await esperarSecao();
    expect(screen.getByText("5,0")).toBeInTheDocument();
    expect(screen.getByText("1 avaliação")).toBeInTheDocument();
    expect(screen.getByText("Augusto O.")).toBeInTheDocument();
    expect(screen.getByText("Melhor café que já provei!")).toBeInTheDocument();
    expect(screen.getByText("hoje")).toBeInTheDocument();
    const avaliar = screen.getByRole("link", { name: "Avalie a Minastra" });
    expect(avaliar).toHaveAttribute("href", "https://painel.azics.com.br/avaliar?site=minastra");
    expect(avaliar).toHaveAttribute("target", "_blank");
    expect(avaliar).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("fala em avaliações no plural", async () => {
    buscar.mockResolvedValue(pagina({ total: 12 }));
    renderizar();
    await esperarSecao();
    expect(screen.getByText("12 avaliações")).toBeInTheDocument();
  });

  it("mostra meia estrela na nota 4,5", async () => {
    buscar.mockResolvedValue(pagina({ itens: [avaliacao({ nota: 4.5 })], media: 4.5 }));
    renderizar();
    await esperarSecao();
    expect(screen.getAllByRole("img", { name: "Nota 4,5 de 5" }).length).toBeGreaterThan(0);
  });

  it("mostra as avaliações da primeira página num carrossel, sem Ver mais", async () => {
    buscar.mockResolvedValue(
      pagina({ total: 11, itens: [avaliacao({ id: 1, nome: "Ana P." }), avaliacao({ id: 2, nome: "Bruno C." })] }),
    );
    const { container } = renderizar();
    await esperarSecao();
    const carrossel = container.querySelector("[data-carrossel-avaliacoes]")!;
    expect(carrossel).not.toBeNull();
    expect(carrossel).toHaveTextContent("Ana P.");
    expect(carrossel).toHaveTextContent("Bruno C.");
    expect(screen.queryByRole("button", { name: "Ver mais" })).toBeNull();
    expect(buscar).toHaveBeenCalledTimes(1);
  });

  it("volta para a inicial do nome quando a foto não carrega", async () => {
    buscar.mockResolvedValue(pagina({ itens: [avaliacao({ foto_url: "https://lh3.googleusercontent.com/a/x" })] }));
    const { container } = renderizar();
    await esperarSecao();
    const foto = container.querySelector("img[src='https://lh3.googleusercontent.com/a/x']");
    expect(foto).not.toBeNull();
    fireEvent.error(foto!);
    expect(container.querySelector("img[src='https://lh3.googleusercontent.com/a/x']")).toBeNull();
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("quebra textos longos sem espaço para não estourar a tela", async () => {
    const texto = "a".repeat(300);
    buscar.mockResolvedValue(pagina({ itens: [avaliacao({ texto })] }));
    renderizar();
    await esperarSecao();
    expect(screen.getByText(texto)).toHaveClass("break-words");
  });
});

describe("média para leitor de tela", () => {
  it("o número que conta fica escondido do leitor de tela; as estrelas anunciam a nota final", async () => {
    buscar.mockResolvedValue(pagina());
    renderizar();
    await esperarSecao();
    expect(screen.getByText("5,0")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getAllByRole("img", { name: "Nota 5 de 5" }).length).toBeGreaterThan(0);
  });
});
