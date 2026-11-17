import { foto, montarFoto } from "./foto";

describe("montarFoto", () => {
  it("monta o src com a maior largura e o srcset com todas", () => {
    expect(montarFoto("serras-cafe", [640, 1152])).toEqual({
      src: "/images/serras-cafe-1152.webp",
      srcSet: "/images/serras-cafe-640.webp 640w, /images/serras-cafe-1152.webp 1152w",
    });
  });
});

describe("foto", () => {
  it("lê as larguras do imagens.config.json", () => {
    expect(foto("trator").srcSet).toBe("/images/trator-640.webp 640w, /images/trator-1152.webp 1152w");
  });
});
