"use client";

import { useEffect, useRef, useState } from "react";

type Props = { mp4: string; poster: string; rotulo: string; className?: string };

// Vídeo curto em loop, sem som, no lugar de uma animação pesada. Só baixa quando chega perto da tela;
// para quem pediu menos movimento no sistema, fica só o poster (o primeiro quadro).
export function VideoPreguicoso({ mp4, poster, rotulo, className }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const [carregar, setCarregar] = useState(false);

  useEffect(() => {
    const elemento = video.current;
    // Sem IntersectionObserver (só em ambientes de teste hoje), o poster basta.
    if (!elemento || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((entrada) => entrada.isIntersecting)) {
          setCarregar(true);
          observador.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    if (!carregar || !video.current) return;
    video.current.load();
    video.current.play().catch(() => {});
  }, [carregar]);

  return (
    <video ref={video} poster={poster} aria-label={rotulo} muted loop playsInline preload="none" className={className}>
      {/* data-src guarda o endereço antes do src existir (o teste de public/ confere que o arquivo existe). */}
      <source src={carregar ? mp4 : undefined} data-src={mp4} type="video/mp4" />
    </video>
  );
}
