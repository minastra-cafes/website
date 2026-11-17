"use client";

import { useEffect, useRef, type ReactNode } from "react";

const ATRASO_MS = 90;

// Mostra o bloco quando ele entra na tela (o mesmo padrão da Azics). Os filhos com data-item e a
// classe `item` saem do estado `escondido` em sequência. Sem JS, ou com "reduzir movimento",
// nada fica escondido (ver a variante `escondido` no globals.css e o script `js` no layout).
export function Revelar({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;
    document.documentElement.dataset.revelarPronto = "";

    // Atraso por posição, só entre os itens deste bloco (ignora Revelar aninhados).
    Array.from(elemento.querySelectorAll<HTMLElement>("[data-item]"))
      .filter((filho) => filho.closest("[data-revelar]") === elemento)
      .forEach((filho, indice) => {
        filho.style.transitionDelay = `${indice * ATRASO_MS}ms`;
      });

    const mostrar = () => elemento.setAttribute("data-visivel", "");
    if (typeof IntersectionObserver === "undefined") {
      mostrar();
      return;
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((entrada) => entrada.isIntersecting)) {
          mostrar();
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={ref} data-revelar="" className={className}>
      {children}
    </div>
  );
}
