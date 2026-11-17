import { caminhoPublico } from "./caminho";

describe("caminhoPublico", () => {
  it("junta o basePath do GitHub Pages ao caminho do arquivo", () => {
    expect(caminhoPublico("/logo.png")).toBe("/website/logo.png");
  });
});
