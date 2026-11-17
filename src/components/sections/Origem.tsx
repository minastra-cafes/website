"use client";

import { useConteudo } from "@/components/ConteudoProvider";
import { foto } from "@/lib/foto";

export function Origem() {
  const { sobre } = useConteudo();
  return (
    <section id="origem" className="scroll-mt-16 bg-minastra-espresso px-5 py-16 text-minastra-paper sm:px-8 sm:py-24 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-20">
        <div className="relative">
          <img
            {...foto("localizacao")}
            sizes="(min-width: 1024px) 50vw, 100vw"
            alt="Paisagem do Sítio Lagoa em Alfenas"
            loading="lazy"
            className="h-[22rem] w-full rounded-3xl object-cover sm:h-[34rem]"
          />
          <div className="absolute -bottom-5 left-5 rounded-2xl bg-minastra-gold p-4 text-minastra-espresso shadow-xl sm:left-auto sm:right-5">
            <strong className="block font-display text-2xl">Alfenas · MG</strong>
            <span className="text-xs font-semibold">Sítio Lagoa, Sul de Minas</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.22em] text-minastra-gold">Da terra para a xícara</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl sm:leading-none">{sobre.titulo}</h2>
          {sobre.paragrafos.map((paragrafo, indice) => (
            <p key={indice} className={`${indice === 0 ? "mt-6" : "mt-4"} text-base leading-8 text-minastra-paper/70 sm:text-lg sm:leading-7`}>
              {paragrafo}
            </p>
          ))}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-minastra-paper/10 p-5">
              <strong className="font-display text-2xl text-minastra-gold">Catuaí 144</strong>
              <span className="mt-1 block text-xs text-minastra-paper/55">Variedade cultivada</span>
            </div>
            <div className="rounded-2xl border border-minastra-paper/10 p-5">
              <strong className="font-display text-2xl text-minastra-gold">Artesanal</strong>
              <span className="mt-1 block text-xs text-minastra-paper/55">Do campo à torra</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
