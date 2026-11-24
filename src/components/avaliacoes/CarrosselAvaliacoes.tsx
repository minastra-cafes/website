"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Carrossel das avaliações: um card por vez no celular (com as bordas do anterior e do próximo), três no
// computador. Fica 3 s em cada parada e desliza para a próxima; depois da última, volta à primeira.
// O deslizar é a rolagem nativa com encaixe, então também dá para passar com o dedo.
// As bolinhas mostram a parada da vez; tocar numa leva até ela e recomeça a contar os 3 s.
// Não anda sozinho enquanto a pessoa lê (dedo na tela, foco do teclado, mouse em cima em quem tem mouse),
// com a seção fora da tela ou a aba escondida, nem com "reduzir movimento" (as bolinhas continuam).
export const INTERVALO_MS = 3000;

// posições de rolagem em que o carrossel para: o início de cada card, sem passar do fim da fila
function medirParadas(el: HTMLElement): number[] {
  const cards = [...el.children] as HTMLElement[];
  if (!cards.length) return [];
  const inicio = cards[0].offsetLeft;
  const maximo = Math.max(0, el.scrollWidth - el.clientWidth);
  const paradas: number[] = [];
  for (const card of cards) {
    const posicao = Math.min(card.offsetLeft - inicio, maximo);
    if (!paradas.length || posicao - paradas[paradas.length - 1] > 4) paradas.push(posicao);
  }
  return paradas;
}

export function CarrosselAvaliacoes({ children }: { children: ReactNode }) {
  const trilho = useRef<HTMLDivElement>(null);
  const paradas = useRef<number[]>([]);
  const recomeca = useRef<() => void>(() => {});
  const [total, setTotal] = useState(0);
  const [ativo, setAtivo] = useState(0);

  // paradas e bolinha da vez (vale com ou sem movimento automático)
  useEffect(() => {
    const el = trilho.current;
    if (!el) return;
    let largura = 0;
    const mede = () => {
      // só quando a largura muda: no celular a barra de endereço some e volta ao rolar, mudando só a altura
      if (window.innerWidth === largura) return;
      largura = window.innerWidth;
      paradas.current = medirParadas(el);
      setTotal(paradas.current.length);
    };
    let quadro = 0;
    const marca = () => {
      quadro = 0;
      const lista = paradas.current;
      if (!lista.length) return;
      let perto = 0;
      lista.forEach((posicao, i) => {
        if (Math.abs(posicao - el.scrollLeft) < Math.abs(lista[perto] - el.scrollLeft)) perto = i;
      });
      setAtivo(perto);
    };
    const aoRolar = () => { if (!quadro) quadro = requestAnimationFrame(marca); };
    mede();
    el.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", mede);
    return () => {
      el.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", mede);
      cancelAnimationFrame(quadro);
    };
  }, []);

  // anda sozinho
  useEffect(() => {
    const el = trilho.current;
    if (!el || typeof window.matchMedia !== "function") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = 0;
    let lendo = false;
    let naTela = typeof IntersectionObserver === "undefined";

    const proximo = () => {
      const lista = paradas.current;
      if (lista.length < 2) return;
      // a primeira parada depois da posição atual; no fim, volta para a primeira
      const seguinte = lista.findIndex((posicao) => posicao > el.scrollLeft + 4);
      el.scrollTo({ left: seguinte === -1 ? 0 : lista[seguinte], behavior: "smooth" });
    };
    const agenda = () => {
      window.clearTimeout(timer);
      if (lendo || !naTela || document.hidden || paradas.current.length < 2) return;
      timer = window.setTimeout(() => {
        proximo();
        agenda();
      }, INTERVALO_MS);
    };
    recomeca.current = agenda;
    const para = () => { lendo = true; window.clearTimeout(timer); };
    const solta = () => { lendo = false; agenda(); };
    const aoSairFoco = (e: FocusEvent) => { if (!el.contains(e.relatedTarget as Node)) solta(); };

    // pausa por mouse só onde existe mouse: no celular o toque simula um "mouse em cima" que só sai ao
    // tocar em outro lugar, e o carrossel ficaria parado depois de qualquer toque
    const temMouse = matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (temMouse) {
      el.addEventListener("mouseenter", para);
      el.addEventListener("mouseleave", solta);
    }
    el.addEventListener("touchstart", para, { passive: true });
    el.addEventListener("touchend", solta, { passive: true });
    el.addEventListener("focusin", para);
    el.addEventListener("focusout", aoSairFoco);
    const aoMudarAba = () => (document.hidden ? window.clearTimeout(timer) : agenda());
    document.addEventListener("visibilitychange", aoMudarAba);
    let observador: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      observador = new IntersectionObserver(([entrada]) => {
        naTela = entrada.isIntersecting;
        agenda();
      });
      observador.observe(el);
    }
    agenda();

    return () => {
      window.clearTimeout(timer);
      recomeca.current = () => {};
      el.removeEventListener("mouseenter", para);
      el.removeEventListener("mouseleave", solta);
      el.removeEventListener("touchstart", para);
      el.removeEventListener("touchend", solta);
      el.removeEventListener("focusin", para);
      el.removeEventListener("focusout", aoSairFoco);
      document.removeEventListener("visibilitychange", aoMudarAba);
      observador?.disconnect();
    };
  }, []);

  // tocar numa bolinha: vai até a parada dela e recomeça a contar os 3 s
  const vaiPara = (i: number) => {
    const el = trilho.current;
    if (!el) return;
    el.scrollTo({ left: paradas.current[i] ?? 0, behavior: "smooth" });
    setAtivo(i);
    recomeca.current();
  };

  return (
    <div>
      <div ref={trilho} data-carrossel-avaliacoes="" className="avaliacoes-trilho" role="group" aria-label="Avaliações de clientes">
        {children}
      </div>
      {total > 1 && (
        <div className="mt-5 flex justify-center gap-1" role="group" aria-label="Escolher avaliação">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => vaiPara(i)}
              aria-label={`Ver avaliação ${i + 1} de ${total}`}
              aria-current={ativo === i ? "true" : undefined}
              className="flex h-11 w-11 items-center justify-center"
            >
              <span className={`block h-2.5 rounded-full transition-all duration-300 ${ativo === i ? "w-7 bg-minastra-gold" : "w-2.5 bg-minastra-paper/35"}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
