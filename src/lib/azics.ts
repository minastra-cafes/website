// Cliente das rotas públicas da API da Azics. Não sabe nada do Minastra: serve para qualquer
// site de cliente, que só troca o slug e a URL da API (NEXT_PUBLIC_*).

export type AvaliacaoPublica = {
  id: number;
  // Já encurtado pela API ("Mariana S.").
  nome: string;
  foto_url: string | null;
  nota: number;
  texto: string;
  atualizada_em: string;
};

export type PaginaDeAvaliacoes = {
  itens: AvaliacaoPublica[];
  total: number;
  pagina: number;
  tamanho: number;
  // Com uma casa; null quando não há nenhuma avaliação visível.
  media: number | null;
};

const URL_AVALIAR = "https://painel.azics.com.br/avaliar";

// Qualquer falha (404 de site ou de avaliações desligadas, 5xx, rede, JSON quebrado) vira null:
// a seção some e o resto da página nunca quebra por causa da API.
export async function buscarAvaliacoes(slug: string, pagina: number): Promise<PaginaDeAvaliacoes | null> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/public/sites/${encodeURIComponent(slug)}/avaliacoes?pagina=${pagina}`;
  try {
    const resposta = await fetch(url);
    if (!resposta.ok) return null;
    return (await resposta.json()) as PaginaDeAvaliacoes;
  } catch {
    return null;
  }
}

export function temProximaPagina(pagina: PaginaDeAvaliacoes): boolean {
  return pagina.pagina * pagina.tamanho < pagina.total;
}

export function montarLinkAvaliar(slug: string): string {
  return `${URL_AVALIAR}?site=${encodeURIComponent(slug)}`;
}
