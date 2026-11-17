import sitemap from "./sitemap";

describe("sitemap", () => {
  it("lista a página inicial e as páginas de produto novas", () => {
    const urls = sitemap().map((entrada) => entrada.url);
    expect(urls).toEqual([
      "https://minastra-cafes.github.io/website/",
      "https://minastra-cafes.github.io/website/produto/bronze/",
      "https://minastra-cafes.github.io/website/produto/ouro/",
      "https://minastra-cafes.github.io/website/produto/ouro-graos/",
    ]);
  });

  it("não traz mais o endereço antigo products2.html", () => {
    expect(sitemap().some((entrada) => entrada.url.includes("products2.html"))).toBe(false);
  });
});
