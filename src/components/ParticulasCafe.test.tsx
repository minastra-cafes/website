import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ConteudoProvider } from "@/components/ConteudoProvider";
import { CONTEUDO_PADRAO } from "@/data/conteudo";
import { ParticulasCafe } from "./ParticulasCafe";
import { Inicio } from "./sections/Inicio";

vi.mock("@/lib/azics", async (original) => ({
  ...(await original<typeof import("@/lib/azics")>()),
  buscarSitePublico: vi.fn(() => new Promise(() => {})),
}));

describe("partículas de café no topo", () => {
  it("o canvas é só enfeite: fora do leitor de tela e sem receber cliques", () => {
    const { container } = render(<ParticulasCafe />);
    const canvas = container.querySelector("canvas")!;
    expect(canvas).toHaveAttribute("aria-hidden", "true");
    expect(canvas).toHaveClass("pointer-events-none");
  });

  it("fica entre a foto e o filtro marrom do topo", () => {
    const { container } = render(
      <ConteudoProvider slug="minastra" inicial={CONTEUDO_PADRAO}>
        <Inicio />
      </ConteudoProvider>,
    );
    const camada = container.querySelector("#inicio canvas")!.parentElement!;
    expect(camada).toHaveClass("-z-[15]");
  });
});
