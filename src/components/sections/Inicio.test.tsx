import { render, screen } from "@testing-library/react";
import { ConteudoProvider } from "@/components/ConteudoProvider";
import { CONTEUDO_PADRAO } from "@/data/conteudo";
import { Inicio } from "./Inicio";

vi.mock("@/lib/azics", async (original) => ({
  ...(await original<typeof import("@/lib/azics")>()),
  buscarSitePublico: vi.fn(() => new Promise(() => {})),
}));

function renderizar(titulo = CONTEUDO_PADRAO.titulo) {
  return render(
    <ConteudoProvider slug="minastra" inicial={{ ...CONTEUDO_PADRAO, titulo }}>
      <Inicio />
    </ConteudoProvider>,
  );
}

describe("topo animado", () => {
  it("o h1 é lido como a frase inteira", () => {
    renderizar();
    expect(screen.getByRole("heading", { level: 1, name: "Café especial com origem de verdade." })).toBeInTheDocument();
  });

  it("cada palavra entra com 40 ms a mais que a anterior", () => {
    const { container } = renderizar();
    const atrasos = [...container.querySelectorAll<HTMLElement>("h1 .palavra")].map((palavra) => palavra.style.animationDelay);
    expect(atrasos).toEqual(["0ms", "40ms", "80ms", "120ms", "160ms", "200ms"]);
  });

  it("as três últimas palavras ficam no destaque dourado", () => {
    const { container } = renderizar();
    expect(container.querySelector("h1 .text-minastra-gold")).toHaveTextContent("origem de verdade.");
  });

  it("título curto não cria destaque vazio", () => {
    const { container } = renderizar("Cafés especiais");
    expect(container.querySelector("h1 .text-minastra-gold")).toBeNull();
    expect(container.querySelectorAll("h1 .palavra")).toHaveLength(2);
  });
});
