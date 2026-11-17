import { render, screen } from "@testing-library/react";
import { metadata as metadadosLayout } from "./layout";
import { metadata as metadados404 } from "./not-found";
import { metadata as metadadosInicio } from "./page";
import PaginaProduto, { generateMetadata } from "./produto/[id]/page";

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "inter" }),
  Alegreya_SC: () => ({ variable: "alegreya" }),
}));

describe("metadados de SEO", () => {
  it("o layout não define robots, para o 404 ficar só com o noindex do Next", () => {
    expect(metadadosLayout.robots).toBeUndefined();
  });

  it("a página inicial e a de produto pedem indexação", async () => {
    const produto = await generateMetadata({ params: Promise.resolve({ id: "ouro" }) });
    for (const robots of [metadadosInicio.robots, produto.robots]) {
      expect(robots).toEqual({ index: true, follow: true, "max-image-preview": "large" });
    }
  });

  it("o 404 tem título", () => {
    expect(metadados404.title).toBe("Página não encontrada | Minastra Cafés Especiais");
  });

  it("a página inicial registra a Azics como criadora", () => {
    expect(metadadosInicio.creator).toBe("Azics");
  });
});

describe("página de produto", () => {
  it("o nome do café é o h1 da página", async () => {
    render(await PaginaProduto({ params: Promise.resolve({ id: "ouro" }) }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Linha Ouro");
  });
});
