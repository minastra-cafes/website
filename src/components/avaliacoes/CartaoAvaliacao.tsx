"use client";

import { useState } from "react";
import type { AvaliacaoPublica } from "@/lib/azics";
import { formatarDataRelativa } from "@/lib/dataRelativa";
import { Estrelas } from "./Estrelas";

function Avatar({ nome, fotoUrl }: { nome: string; fotoUrl: string | null }) {
  // A foto vem do Google (lh3.googleusercontent.com) e pode expirar: aí fica a inicial.
  const [falhou, setFalhou] = useState(false);
  const classe = "h-11 w-11 shrink-0 rounded-full";

  if (fotoUrl && !falhou) {
    return (
      <img
        src={fotoUrl}
        alt=""
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setFalhou(true)}
        className={`${classe} object-cover`}
      />
    );
  }
  return (
    <span aria-hidden="true" className={`${classe} flex items-center justify-center bg-minastra-gold font-display text-lg font-bold text-minastra-espresso`}>
      {nome.trim().charAt(0).toUpperCase()}
    </span>
  );
}

export function CartaoAvaliacao({ avaliacao }: { avaliacao: AvaliacaoPublica }) {
  return (
    <article className="flex flex-col rounded-3xl border border-minastra-paper/10 bg-minastra-paper/[.04] p-6">
      <div className="flex items-center gap-3">
        <Avatar nome={avaliacao.nome} fotoUrl={avaliacao.foto_url} />
        <div className="min-w-0">
          <strong className="block truncate text-sm text-minastra-paper">{avaliacao.nome}</strong>
          <span className="text-xs text-minastra-paper/55">{formatarDataRelativa(avaliacao.atualizada_em)}</span>
        </div>
      </div>
      <Estrelas nota={avaliacao.nota} className="mt-5 text-lg text-minastra-gold" />
      <p className="mt-3 break-words text-sm leading-7 text-minastra-paper/75">{avaliacao.texto}</p>
    </article>
  );
}
