"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CONTEUDO_PADRAO } from "@/data/conteudo";
import { buscarSitePublico } from "@/lib/azics";
import { converterSitePublico, type Conteudo } from "@/lib/conteudo";

const ContextoConteudo = createContext<Conteudo>(CONTEUDO_PADRAO);

// O HTML sai com o conteúdo do build (bom para o Google e para as prévias de link). No navegador,
// busca o atual do painel: uma edição aparece em até 1 minuto, sem esperar o build semanal.
export function ConteudoProvider({ slug, inicial, children }: { slug: string; inicial: Conteudo; children: React.ReactNode }) {
  const [conteudo, setConteudo] = useState(inicial);

  useEffect(() => {
    let ativo = true;
    buscarSitePublico(slug).then((site) => {
      if (ativo && site) setConteudo(converterSitePublico(site));
    });
    return () => {
      ativo = false;
    };
  }, [slug]);

  return <ContextoConteudo.Provider value={conteudo}>{children}</ContextoConteudo.Provider>;
}

export function useConteudo(): Conteudo {
  return useContext(ContextoConteudo);
}
