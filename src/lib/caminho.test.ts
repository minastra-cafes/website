import { BASE_PATH, caminhoPublico } from "./caminho";

describe("caminhoPublico", () => {
  it("serve os arquivos na raiz do domínio minastra.azics.com.br", () => {
    expect(BASE_PATH).toBe("");
    expect(caminhoPublico("/logo.png")).toBe("/logo.png");
  });
});
