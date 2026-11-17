import { render, screen } from "@testing-library/react";
import { CONTEUDO_PADRAO } from "@/data/conteudo";
import { buscarSitePublico } from "@/lib/azics";
import { ConteudoProvider, useConteudo } from "./ConteudoProvider";

vi.mock("@/lib/azics", async (original) => ({
  ...(await original<typeof import("@/lib/azics")>()),
  buscarSitePublico: vi.fn(),
}));

const buscar = vi.mocked(buscarSitePublico);

function Titulo() {
  return <h1>{useConteudo().titulo}</h1>;
}

const DO_BUILD = { ...CONTEUDO_PADRAO, titulo: "Título do build" };

describe("ConteudoProvider", () => {
  afterEach(() => buscar.mockReset());

  it("mostra o texto do build e troca pelo atual do painel quando a API responde", async () => {
    buscar.mockResolvedValue({
      nome: "Minastra",
      titulo: "Título editado no painel",
      subtitulo: "x",
      instagram_url: null,
      celular: null,
      sobre: null,
    });
    render(
      <ConteudoProvider slug="minastra" inicial={DO_BUILD}>
        <Titulo />
      </ConteudoProvider>,
    );
    expect(screen.getByRole("heading")).toHaveTextContent("Título do build");
    expect(await screen.findByText("Título editado no painel")).toBeInTheDocument();
    expect(buscar).toHaveBeenCalledWith("minastra");
  });

  it("se a API falhar no navegador, fica o texto do build", async () => {
    buscar.mockResolvedValue(null);
    render(
      <ConteudoProvider slug="minastra" inicial={DO_BUILD}>
        <Titulo />
      </ConteudoProvider>,
    );
    await vi.waitFor(() => expect(buscar).toHaveBeenCalled());
    expect(screen.getByRole("heading")).toHaveTextContent("Título do build");
  });

  it("fora do provedor (nos testes de componente), usa o texto padrão do site", () => {
    render(<Titulo />);
    expect(screen.getByRole("heading")).toHaveTextContent(CONTEUDO_PADRAO.titulo);
  });
});
