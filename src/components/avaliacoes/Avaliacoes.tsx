"use client";

import { useEffect, useRef, useState } from "react";
import { item, toque } from "@/components/item";
import { Revelar } from "@/components/Revelar";
import { buscarAvaliacoes, montarLinkAvaliar, temProximaPagina, type AvaliacaoPublica, type PaginaDeAvaliacoes } from "@/lib/azics";
import { CartaoAvaliacao } from "./CartaoAvaliacao";
import { Estrelas } from "./Estrelas";
import { useContagem } from "./useContagem";

// Seção de avaliações servida pela API da Azics. Não importa nada do conteúdo do Minastra:
// para outro cliente, basta passar outro slug e outro nome.
type Props = { slug: string; nomeNegocio: string };

type Estado = { itens: AvaliacaoPublica[]; ultima: PaginaDeAvaliacoes };

// Uma avaliação nova durante a paginação empurra as outras: a página 2 pode repetir a última da 1.
function juntarSemRepetir(atuais: AvaliacaoPublica[], novas: AvaliacaoPublica[]): AvaliacaoPublica[] {
  const ids = new Set(atuais.map((avaliacao) => avaliacao.id));
  return [...atuais, ...novas.filter((avaliacao) => !ids.has(avaliacao.id))];
}

export function Avaliacoes({ slug, nomeNegocio }: Props) {
  const [estado, setEstado] = useState<Estado | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [falhouMais, setFalhouMais] = useState(false);
  const secao = useRef<HTMLElement>(null);
  // Sem IntersectionObserver (só em ambientes de teste hoje), a contagem começa direto.
  const [visivel, setVisivel] = useState(() => typeof IntersectionObserver === "undefined");
  // A média conta de 0 até o valor final, e as estrelas se enchem junto, quando a seção aparece.
  const mediaAnimada = useContagem(estado?.ultima.media ?? 0, visivel);

  useEffect(() => {
    let ativo = true;
    buscarAvaliacoes(slug, 1).then((pagina) => {
      if (ativo && pagina) setEstado({ itens: pagina.itens, ultima: pagina });
    });
    return () => {
      ativo = false;
    };
  }, [slug]);

  const temSecao = estado !== null;
  useEffect(() => {
    const elemento = secao.current;
    if (!temSecao || !elemento || typeof IntersectionObserver === "undefined") return;
    const observador = new IntersectionObserver((entradas) => {
      if (entradas.some((entrada) => entrada.isIntersecting)) {
        setVisivel(true);
        observador.disconnect();
      }
    });
    observador.observe(elemento);
    return () => observador.disconnect();
  }, [temSecao]);

  // Sem resposta ainda, com erro ou sem nenhuma avaliação: a seção não existe (nada de espaço reservado).
  if (!estado || estado.itens.length === 0 || estado.ultima.media === null) return null;

  const { itens, ultima } = estado;

  async function verMais() {
    setCarregando(true);
    const proxima = await buscarAvaliacoes(slug, ultima.pagina + 1);
    setCarregando(false);
    if (!proxima) {
      setFalhouMais(true);
      return;
    }
    setFalhouMais(false);
    setEstado({ itens: juntarSemRepetir(itens, proxima.itens), ultima: proxima });
  }

  const media = ultima.media ?? 0;

  return (
    <section ref={secao} id="avaliacoes" aria-label="Avaliações de clientes" className="scroll-mt-16 bg-minastra-espresso px-5 py-16 text-minastra-paper sm:px-8 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Revelar className="max-w-3xl">
            <p data-item className={`text-xs font-bold uppercase tracking-[.22em] text-minastra-gold ${item}`}>Quem já provou</p>
            <h2 data-item className={`mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl sm:leading-none ${item}`}>
              O que dizem do nosso café.
            </h2>
          </Revelar>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center lg:flex-col lg:items-end">
            <div className="flex items-center gap-4">
              <strong aria-hidden="true" className="font-display text-5xl text-minastra-gold">
                {mediaAnimada.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </strong>
              <div>
                <Estrelas nota={mediaAnimada} rotulo={media} className="text-xl text-minastra-gold" />
                <span className="mt-1 block text-xs text-minastra-paper/60">
                  {ultima.total === 1 ? "1 avaliação" : `${ultima.total} avaliações`}
                </span>
              </div>
            </div>
            <a
              href={montarLinkAvaliar(slug)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${toque} inline-flex min-h-14 items-center justify-center rounded-full bg-minastra-gold px-7 text-sm font-bold text-minastra-espresso transition hover:-translate-y-0.5 hover:bg-minastra-paper`}
            >
              Avalie a {nomeNegocio}
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {itens.map((avaliacao) => (
            <CartaoAvaliacao key={avaliacao.id} avaliacao={avaliacao} />
          ))}
        </div>

        {(temProximaPagina(ultima) || falhouMais) && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={verMais}
              disabled={carregando}
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-minastra-paper/35 px-7 text-sm font-semibold transition hover:border-minastra-gold hover:text-minastra-gold disabled:opacity-60"
            >
              {carregando ? "Carregando…" : falhouMais ? "Tentar de novo" : "Ver mais"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
