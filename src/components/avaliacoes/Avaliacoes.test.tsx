import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("o Ver mais junta a próxima página sem repetir avaliação e some no fim", async () => {
    buscar
      .mockResolvedValueOnce(pagina({ itens: [avaliacao({ id: 1, nome: "Ana P." })], total: 11 }))
      .mockResolvedValueOnce(
        pagina({ pagina: 2, total: 11, itens: [avaliacao({ id: 1, nome: "Ana P." }), avaliacao({ id: 2, nome: "Bruno C." })] }),
      );
    renderizar();
    await esperarSecao();
    await userEvent.click(screen.getByRole("button", { name: "Ver mais" }));
    expect(buscar).toHaveBeenLastCalledWith("minastra", 2);
    expect(await screen.findByText("Bruno C.")).toBeInTheDocument();
    expect(screen.getAllByText("Ana P.")).toHaveLength(1);
    expect(screen.queryByRole("button", { name: "Ver mais" })).toBeNull();
  });

  it("se a página 2 falha, mantém as avaliações e oferece tentar de novo", async () => {
    buscar
      .mockResolvedValueOnce(pagina({ total: 11 }))
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(pagina({ pagina: 2, total: 11, itens: [avaliacao({ id: 2, nome: "Bruno C." })] }));
    renderizar();
    await esperarSecao();
    await userEvent.click(screen.getByRole("button", { name: "Ver mais" }));
    const tentar = await screen.findByRole("button", { name: "Tentar de novo" });
    expect(screen.getByText("Augusto O.")).toBeInTheDocument();
    await userEvent.click(tentar);
    expect(buscar).toHaveBeenLastCalledWith("minastra", 2);
    expect(await screen.findByText("Bruno C.")).toBeInTheDocument();
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
