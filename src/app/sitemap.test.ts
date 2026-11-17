import sitemap from "./sitemap";

describe("sitemap", () => {
  it("lista a página inicial e as páginas de produto novas", () => {
    const urls = sitemap().map((entrada) => entrada.url);
    expect(urls).toEqual([
      "https://minastra.azics.com.br/",
      "https://minastra.azics.com.br/produto/bronze/",
      "https://minastra.azics.com.br/produto/ouro/",
      "https://minastra.azics.com.br/produto/ouro-graos/",
    ]);
  });

  it("não traz mais o endereço antigo products2.html", () => {
    expect(sitemap().some((entrada) => entrada.url.includes("products2.html"))).toBe(false);
  });
});

describe("robots", () => {
  it("aponta para o sitemap no domínio novo", async () => {
    const { default: robots } = await import("./robots");
    expect(robots().sitemap).toBe("https://minastra.azics.com.br/sitemap.xml");
  });
});
