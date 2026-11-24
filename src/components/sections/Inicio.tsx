"use client";

import { useConteudo } from "@/components/ConteudoProvider";
import { dividirTitulo } from "@/lib/conteudo";
import { foto } from "@/lib/foto";

const ATRASO_PALAVRA_MS = 40;
// O brilho passa pelas palavras douradas depois que a última palavra termina de subir.
const DURACAO_PALAVRA_MS = 600;

function separarPalavras(texto: string): string[] {
  return texto.trim().split(/\s+/).filter(Boolean);
}

export function Inicio() {
  const { titulo, subtitulo } = useConteudo();
  const [inicio, destaque] = dividirTitulo(titulo);
  const palavrasInicio = separarPalavras(inicio);
  const palavrasDestaque = separarPalavras(destaque);
  const total = palavrasInicio.length + palavrasDestaque.length;
  const inicioBrilho = (total - 1) * ATRASO_PALAVRA_MS + DURACAO_PALAVRA_MS;

  // Cada palavra sobe com 40 ms a mais que a anterior (só CSS: começa no primeiro desenho da tela).
  const palavra = (texto: string, indice: number, conteudo: React.ReactNode = texto) => (
    <span key={indice} className="palavra" style={{ animationDelay: `${indice * ATRASO_PALAVRA_MS}ms` }}>
      {conteudo}
    </span>
  );

  return (
    <section id="inicio" className="relative isolate min-h-[86svh] max-h-[90svh] overflow-hidden bg-minastra-espresso pt-16 text-minastra-paper">
      <img
        {...foto("serras-cafe")}
        sizes="100vw"
        fetchPriority="high"
        alt="Cafezal Minastra nas montanhas do Sul de Minas"
        className="zoom-lento absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(37,23,17,.96)_0%,rgba(37,23,17,.82)_48%,rgba(37,23,17,.38)_100%)]" />
      {/* o pé da foto escurece até o tom do café e emenda na faixa de baixo, sem corte seco */}
      <div className="absolute inset-x-0 -bottom-px -z-10 h-32 bg-gradient-to-b from-transparent to-minastra-espresso" />

      <div className="mx-auto flex min-h-[calc(92svh-4rem)] max-w-7xl items-center px-5 pb-[18svh] pt-10 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <h1
            aria-label={titulo}
            className="mt-7 font-display text-5xl font-bold leading-[.98] tracking-[-.035em] text-minastra-paper sm:text-6xl sm:leading-none lg:text-8xl"
          >
            <span aria-hidden="true">
              {palavrasInicio.flatMap((texto, indice) => [palavra(texto, indice), " "])}
              {palavrasDestaque.length > 0 && (
                <span className="text-minastra-gold">
                  {palavrasDestaque.flatMap((texto, indice) => {
                    const posicao = palavrasInicio.length + indice;
                    const brilho = (
                      <span className="brilho" style={{ animationDelay: `${inicioBrilho + indice * 80}ms` }}>
                        {texto}
                      </span>
                    );
                    return indice === 0 ? [palavra(texto, posicao, brilho)] : [" ", palavra(texto, posicao, brilho)];
                  })}
                </span>
              )}
            </span>
          </h1>
          <p className="entrar mt-6 max-w-2xl text-base leading-8 text-minastra-paper/75 sm:text-xl sm:leading-7" style={{ animationDelay: "300ms" }}>
            {subtitulo}
          </p>
          <div className="entrar mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "400ms" }}>
            <a href="#cafes" className="motion-safe:active:scale-[0.98] inline-flex min-h-14 items-center justify-center rounded-full bg-minastra-gold px-7 text-sm font-bold text-minastra-espresso transition hover:-translate-y-0.5 hover:bg-minastra-paper">
              Encontrar meu café
            </a>
            <a href="#origem" className="motion-safe:active:scale-[0.98] inline-flex min-h-14 items-center justify-center rounded-full border border-minastra-paper/35 px-7 text-sm font-semibold transition hover:border-minastra-gold hover:text-minastra-gold">
              Conhecer a fazenda
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
