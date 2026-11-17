"use client";

import { useConteudo } from "@/components/ConteudoProvider";
import { dividirTitulo } from "@/lib/conteudo";
import { foto } from "@/lib/foto";

const DESTAQUES = [
  { valor: "100%", rotulo: "Arábica" },
  { valor: "Sul de Minas", rotulo: "Origem única" },
  { valor: "Pequenos lotes", rotulo: "Mais frescor" },
];

export function Inicio() {
  const { titulo, subtitulo } = useConteudo();
  const [inicio, destaque] = dividirTitulo(titulo);
  return (
    <section id="inicio" className="relative isolate min-h-[86svh] max-h-[90svh] overflow-hidden bg-minastra-espresso pt-16 text-minastra-paper">
      <img {...foto("serras-cafe")} sizes="100vw" fetchPriority="high" alt="Cafezal Minastra nas montanhas do Sul de Minas" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(37,23,17,.96)_0%,rgba(37,23,17,.82)_48%,rgba(37,23,17,.38)_100%)]" />

      <div className="mx-auto flex min-h-[calc(92svh-4rem)] max-w-7xl items-center px-5 py-16 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <h1 className="mt-7 font-display text-5xl font-bold leading-[.98] tracking-[-.035em] text-minastra-paper sm:text-6xl sm:leading-none lg:text-8xl">
            {inicio}
            {destaque && <span className="text-minastra-gold">{destaque}</span>}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-minastra-paper/75 sm:text-xl sm:leading-7">
            {subtitulo}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#cafes" className="inline-flex min-h-14 items-center justify-center rounded-full bg-minastra-gold px-7 text-sm font-bold text-minastra-espresso transition hover:-translate-y-0.5 hover:bg-minastra-paper">
              Encontrar meu café
            </a>
            <a href="#origem" className="inline-flex min-h-14 items-center justify-center rounded-full border border-minastra-paper/35 px-7 text-sm font-semibold transition hover:border-minastra-gold hover:text-minastra-gold">
              Conhecer a fazenda
            </a>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 border-t border-minastra-paper/15 pt-6 text-center sm:text-left">
            {DESTAQUES.map((destaque) => (
              <div key={destaque.valor}>
                <strong className="block font-display text-xl text-minastra-gold sm:text-2xl">{destaque.valor}</strong>
                <span className="text-xs text-minastra-paper/60">{destaque.rotulo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
