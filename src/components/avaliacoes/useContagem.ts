"use client";

import { useEffect, useState } from "react";

// Sem matchMedia (ambientes de teste) ou com "reduzir movimento": o número aparece direto no final.
function deveAnimar(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  if (typeof window.requestAnimationFrame !== "function") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Conta de 0 até `final` (com desaceleração no fim) depois que `iniciar` vira true.
export function useContagem(final: number, iniciar: boolean, duracaoMs = 900): number {
  const [animar] = useState(deveAnimar);
  const [valor, setValor] = useState(animar ? 0 : final);

  useEffect(() => {
    if (!animar || !iniciar) return;
    let quadro = 0;
    const inicio = performance.now();
    const passo = (agora: number) => {
      // O carimbo do quadro pode ser um pouco anterior ao performance.now() lido acima.
      const progresso = Math.min(1, Math.max(0, (agora - inicio) / duracaoMs));
      const suavizado = 1 - (1 - progresso) ** 3;
      setValor(progresso === 1 ? final : final * suavizado);
      if (progresso < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [animar, iniciar, final, duracaoMs]);

  return animar ? valor : final;
}
