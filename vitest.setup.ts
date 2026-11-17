import "@testing-library/jest-dom/vitest";

// Nos testes, o "build" não vai à API da Azics: usa o conteúdo padrão do site. Os testes do cliente
// da API e da conversão testam a busca de verdade com fetch simulado.
vi.mock("@/lib/conteudo", async (original) => {
  const { CONTEUDO_PADRAO } = await import("@/data/conteudo");
  return { ...(await original<typeof import("@/lib/conteudo")>()), obterConteudoNoBuild: async () => CONTEUDO_PADRAO };
});
