import { buscarAvaliacoes, montarLinkAvaliar, temProximaPagina, type PaginaDeAvaliacoes } from "./azics";

const PAGINA: PaginaDeAvaliacoes = {
  itens: [
    {
      id: 1,
      nome: "Augusto O.",
      foto_url: null,
      nota: 5,
      texto: "Melhor café que já provei!",
      atualizada_em: "2026-11-17T13:57:36.039246Z",
    },
  ],
  total: 1,
  pagina: 2,
  tamanho: 10,
  media: 5,
};

function respostaJson(status: number, corpo: unknown) {
  return new Response(JSON.stringify(corpo), { status, headers: { "Content-Type": "application/json" } });
}

describe("buscarAvaliacoes", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.azics.com.br");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("chama a rota pública com o slug e a página", async () => {
    const buscar = vi.fn().mockResolvedValue(respostaJson(200, PAGINA));
    vi.stubGlobal("fetch", buscar);
    await buscarAvaliacoes("minastra", 2);
    expect(buscar).toHaveBeenCalledWith("https://api.azics.com.br/public/sites/minastra/avaliacoes?pagina=2");
  });

  it("devolve a página quando a API responde 200", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respostaJson(200, PAGINA)));
    expect(await buscarAvaliacoes("minastra", 2)).toEqual(PAGINA);
  });

  it.each([
    ["404 avaliacoes_desligadas", () => Promise.resolve(respostaJson(404, { detail: "avaliacoes_desligadas" }))],
    ["500", () => Promise.resolve(respostaJson(500, { detail: "erro" }))],
    ["falha de rede", () => Promise.reject(new TypeError("Failed to fetch"))],
    ["JSON inválido", () => Promise.resolve(new Response("<html>", { status: 200 }))],
  ])("devolve null com %s", async (_caso, resposta) => {
    vi.stubGlobal("fetch", vi.fn(resposta));
    expect(await buscarAvaliacoes("minastra", 1)).toBeNull();
  });
});

describe("temProximaPagina", () => {
  it("não tem próxima quando a página já cobre o total", () => {
    expect(temProximaPagina({ ...PAGINA, pagina: 1, tamanho: 10, total: 10 })).toBe(false);
  });

  it("tem próxima quando sobra avaliação", () => {
    expect(temProximaPagina({ ...PAGINA, pagina: 1, tamanho: 10, total: 11 })).toBe(true);
  });
});

describe("montarLinkAvaliar", () => {
  it("leva à página de avaliar do painel da Azics", () => {
    expect(montarLinkAvaliar("minastra")).toBe("https://painel.azics.com.br/avaliar?site=minastra");
  });
});
