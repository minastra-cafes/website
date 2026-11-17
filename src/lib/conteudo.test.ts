import { CONTEUDO_PADRAO } from "@/data/conteudo";
import type { SitePublico } from "./azics";
import { converterSitePublico, dividirTitulo } from "./conteudo";

const API: SitePublico = {
  nome: "Minastra",
  titulo: "Título do painel",
  subtitulo: "Subtítulo do painel",
  instagram_url: "https://www.instagram.com/outra_conta/",
  celular: "5535911112222",
  sobre: { titulo: "Sobre do painel", paragrafos: ["Primeiro.", "Segundo."] },
};

describe("converterSitePublico", () => {
  it("usa título, subtítulo, Instagram, celular e Sobre do painel", () => {
    expect(converterSitePublico(API)).toEqual({
      titulo: "Título do painel",
      subtitulo: "Subtítulo do painel",
      instagram: "https://www.instagram.com/outra_conta/",
      celular: "5535911112222",
      sobre: { titulo: "Sobre do painel", paragrafos: ["Primeiro.", "Segundo."] },
    });
  });

  it("título ou subtítulo em branco ficam com o texto do site", () => {
    const conteudo = converterSitePublico({ ...API, titulo: "  ", subtitulo: "" });
    expect(conteudo.titulo).toBe(CONTEUDO_PADRAO.titulo);
    expect(conteudo.subtitulo).toBe(CONTEUDO_PADRAO.subtitulo);
  });

  it("sem Instagram no painel, o site não mostra o link", () => {
    expect(converterSitePublico({ ...API, instagram_url: null }).instagram).toBeNull();
  });

  it("sem celular no painel, o WhatsApp continua com o número do site (a compra depende dele)", () => {
    expect(converterSitePublico({ ...API, celular: null }).celular).toBe(CONTEUDO_PADRAO.celular);
  });

  it.each([false, null] as const)("Sobre %s no painel fica com o texto do site", (sobre) => {
    expect(converterSitePublico({ ...API, sobre }).sobre).toEqual(CONTEUDO_PADRAO.sobre);
  });
});

describe("dividirTitulo", () => {
  it("separa as três últimas palavras para o destaque em dourado", () => {
    expect(dividirTitulo("Café especial com origem de verdade.")).toEqual(["Café especial com ", "origem de verdade."]);
  });

  it("título curto fica sem destaque", () => {
    expect(dividirTitulo("Cafés especiais")).toEqual(["Cafés especiais", ""]);
  });
});
