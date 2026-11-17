import { PRODUTOS } from "@/data/produtos";
import { CRIADOR_DO_SITE, montarDadosProduto, montarDadosSite, montarDescricaoProduto } from "./seo";

const ouro = PRODUTOS.find((produto) => produto.id === "ouro")!;

type No = Record<string, unknown>;

function noDoTipo(tipo: string): No {
  const grafo = montarDadosSite()["@graph"] as No[];
  return grafo.find((no) => no["@type"] === tipo)!;
}

describe("montarDadosSite", () => {
  it("liga a organização ao Instagram", () => {
    expect(noDoTipo("Organization").sameAs).toEqual(["https://www.instagram.com/minastra_cafes"]);
  });

  it("registra a Azics como criadora do site", () => {
    const site = noDoTipo("WebSite");
    expect(site.url).toBe("https://minastra-cafes.github.io/website/");
    expect(site.creator).toEqual({ "@type": "Organization", name: "Azics", url: "https://azics.com.br" });
    expect(CRIADOR_DO_SITE.url).toBe("https://azics.com.br");
  });

  it("aponta o publicador do site para a organização do Minastra", () => {
    expect(noDoTipo("WebSite").publisher).toEqual({ "@id": noDoTipo("Organization")["@id"] });
  });
});

describe("montarDadosProduto", () => {
  it("marca cada oferta como em estoque, com preço de 2 casas", () => {
    const dados = montarDadosProduto(ouro);
    expect(dados.offers).toEqual([
      expect.objectContaining({ price: "25.00", priceCurrency: "BRL", availability: "https://schema.org/InStock" }),
      expect.objectContaining({ price: "48.00", priceCurrency: "BRL", availability: "https://schema.org/InStock" }),
    ]);
  });
});

describe("montarDescricaoProduto", () => {
  it.each(PRODUTOS.map((produto) => [produto.id, produto]))("%s cabe no limite do Google (até 155 caracteres)", (_id, produto) => {
    expect(montarDescricaoProduto(produto).length).toBeLessThanOrEqual(155);
  });
});
