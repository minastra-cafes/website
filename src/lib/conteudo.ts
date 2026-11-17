import { cache } from "react";
import { CONTEUDO_PADRAO } from "@/data/conteudo";
import { buscarSitePublicoNoBuild, type SitePublico } from "./azics";

// O que o painel da Azics edita e o site mostra.
export type Conteudo = {
  titulo: string;
  subtitulo: string;
  // null: o Instagram foi tirado no painel, e o link some do site.
  instagram: string | null;
  // Só dígitos, com DDI e DDD (5535999131028): vai direto no wa.me.
  celular: string;
  sobre: { titulo: string; paragrafos: string[] };
};

function textoOuPadrao(texto: string | null | undefined, padrao: string): string {
  return texto && texto.trim() ? texto : padrao;
}

export function converterSitePublico(site: SitePublico): Conteudo {
  return {
    titulo: textoOuPadrao(site.titulo, CONTEUDO_PADRAO.titulo),
    subtitulo: textoOuPadrao(site.subtitulo, CONTEUDO_PADRAO.subtitulo),
    instagram: site.instagram_url,
    celular: textoOuPadrao(site.celular, CONTEUDO_PADRAO.celular),
    // Seção desligada (false) ou vazia (null) no painel: o site mantém o próprio texto do Sobre.
    sobre: site.sobre ? { titulo: site.sobre.titulo, paragrafos: site.sobre.paragrafos } : CONTEUDO_PADRAO.sobre,
  };
}

// O título do topo tem as três últimas palavras em dourado ("origem de verdade.").
export function dividirTitulo(titulo: string): [string, string] {
  const palavras = titulo.trim().split(/\s+/);
  if (palavras.length < 5) return [titulo, ""];
  return [`${palavras.slice(0, -3).join(" ")} `, palavras.slice(-3).join(" ")];
}

// Uma busca por build, dividida entre o layout e as páginas (o cache do React junta as chamadas).
export const obterConteudoNoBuild = cache(async (): Promise<Conteudo> => {
  const slug = process.env.NEXT_PUBLIC_SITE_SLUG ?? "minastra";
  return converterSitePublico(await buscarSitePublicoNoBuild(slug));
});
