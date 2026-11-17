import { render, screen } from "@testing-library/react";
import { CONTEUDO_PADRAO } from "@/data/conteudo";
import { PRODUTOS } from "@/data/produtos";
import type { Conteudo } from "@/lib/conteudo";
import { montarLinkWhatsApp, montarMensagemPedido } from "@/lib/pedido";
import { montarDadosSite } from "@/lib/seo";
import { Contatos } from "./Contatos";
import { ConteudoProvider } from "./ConteudoProvider";
import { CompraProduto } from "./produto/CompraProduto";
import { Inicio } from "./sections/Inicio";
import { Origem } from "./sections/Origem";

// O navegador não acha nada novo na API: fica o conteúdo do build passado aqui.
vi.mock("@/lib/azics", async (original) => ({
  ...(await original<typeof import("@/lib/azics")>()),
  buscarSitePublico: vi.fn(() => new Promise(() => {})),
}));

const DO_PAINEL: Conteudo = {
  titulo: "Um café que conta a história da fazenda.",
  subtitulo: "Subtítulo escrito no painel.",
  instagram: "https://www.instagram.com/outra_conta/",
  celular: "5535911112222",
  sobre: { titulo: "Nossa história", paragrafos: ["Primeiro parágrafo.", "Segundo parágrafo."] },
};

function renderComConteudo(elemento: React.ReactNode, conteudo: Conteudo = DO_PAINEL) {
  return render(
    <ConteudoProvider slug="minastra" inicial={conteudo}>
      {elemento}
    </ConteudoProvider>,
  );
}

describe("conteúdo do painel na página", () => {
  it("o topo mostra o título e o subtítulo, com as três últimas palavras em dourado", () => {
    renderComConteudo(<Inicio />);
    const titulo = screen.getByRole("heading", { level: 1 });
    expect(titulo).toHaveTextContent("Um café que conta a história da fazenda.");
    // As palavras ficam em spans separados (animação palavra por palavra); o destaque reúne as três últimas.
    expect(titulo.querySelector(".text-minastra-gold")).toHaveTextContent("história da fazenda.");
    expect(screen.getByText("Subtítulo escrito no painel.")).toBeInTheDocument();
  });

  it("o Sobre mostra o título e os parágrafos do painel", () => {
    renderComConteudo(<Origem />);
    expect(screen.getByRole("heading", { level: 2, name: "Nossa história" })).toBeInTheDocument();
    expect(screen.getByText("Primeiro parágrafo.")).toBeInTheDocument();
    expect(screen.getByText("Segundo parágrafo.")).toBeInTheDocument();
  });

  it("o rodapé usa o Instagram e o celular do painel", () => {
    renderComConteudo(<Contatos />);
    expect(screen.getByRole("link", { name: /Instagram/ })).toHaveAttribute("href", "https://www.instagram.com/outra_conta/");
    expect(screen.getByRole("link", { name: /WhatsApp/ }).getAttribute("href")).toMatch(/^https:\/\/wa\.me\/5535911112222\?text=/);
  });

  it("sem Instagram no painel, o link some", () => {
    renderComConteudo(<Contatos />, { ...DO_PAINEL, instagram: null });
    expect(screen.queryByRole("link", { name: /Instagram/ })).toBeNull();
    expect(screen.getByRole("link", { name: /WhatsApp/ })).toBeInTheDocument();
  });

  it("o pedido do produto vai para o celular do painel", () => {
    const ouro = PRODUTOS.find((produto) => produto.id === "ouro")!;
    renderComConteudo(<CompraProduto produto={ouro} />);
    const esperado = montarLinkWhatsApp(montarMensagemPedido(ouro, "500", 1), "5535911112222");
    expect(screen.getByRole("link", { name: "Comprar no WhatsApp" })).toHaveAttribute("href", esperado);
  });
});

describe("JSON-LD com o conteúdo do painel", () => {
  type No = Record<string, unknown>;
  const organizacao = (conteudo: Conteudo) => (montarDadosSite(conteudo)["@graph"] as No[]).find((no) => no["@type"] === "Organization")!;

  it("usa o Instagram e o telefone do painel", () => {
    expect(organizacao(DO_PAINEL).sameAs).toEqual(["https://www.instagram.com/outra_conta/"]);
    expect(organizacao(DO_PAINEL).telephone).toBe("+55 35 91111-2222");
  });

  it("sem Instagram, não declara sameAs", () => {
    expect(organizacao({ ...DO_PAINEL, instagram: null }).sameAs).toBeUndefined();
  });

  it("o telefone padrão do site sai no formato de antes", () => {
    expect(organizacao(CONTEUDO_PADRAO).telephone).toBe("+55 35 99913-1028");
  });
});
