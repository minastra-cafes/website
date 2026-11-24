"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Palco dos cafés: a seção fica presa (position: sticky, do próprio navegador) e a rolagem faz a fila de
// cards passar inteira antes de a página seguir.
// - Celular: a fila começa com o primeiro card na margem e anda até o último; deslizar para o lado também
//   move a fila e encaixa no card seguinte. Os pontos marcam o card da vez e levam até ele.
// - Computador (lg): a fila entra pela direita e para centrada, com os cards endireitando no caminho.
// - "Reduzir movimento": nada prende; no celular vira um carrossel nativo de rolar de lado.
// Sem encaixe automático durante a rolagem: é ele que dá trancos no toque.
const MENU = 64; // altura do menu fixo (h-16)

export function CarrosselCafes({ children, total }: { children: ReactNode; total: number }) {
  const fora = useRef<HTMLDivElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const estado = useRef({ topo: 0, curso: 0, inicio: 0, ligado: false });
  const [ativo, setAtivo] = useState(0);

  useEffect(() => {
    const externo = fora.current;
    const interno = palco.current;
    const trilho = interno?.querySelector<HTMLElement>("[data-trilho]");
    // sem matchMedia (navegador muito antigo, testes): fica o carrossel nativo, que é o seguro
    if (!externo || !interno || !trilho || typeof window.matchMedia !== "function") return;
    const reduzido = matchMedia("(prefers-reduced-motion: reduce)");
    const telaGrande = matchMedia("(min-width: 1024px)");
    const e = estado.current;
    let quadro = 0;

    const aplica = () => {
      quadro = 0;
      // medido a cada quadro: o que fica acima pode mudar de altura depois (fotos carregando)
      e.topo = externo.getBoundingClientRect().top + window.scrollY - MENU;
      const p = e.curso ? Math.min(1, Math.max(0, (window.scrollY - e.topo) / e.curso)) : 1;
      interno.style.setProperty("--p", p.toFixed(4));
      trilho.style.translate = `${e.inicio - p * e.curso}px 0`;
      setAtivo(Math.round(p * (total - 1)));
    };
    const aoRolar = () => { if (!quadro) quadro = requestAnimationFrame(aplica); };

    const desliga = () => {
      if (!e.ligado) return;
      window.removeEventListener("scroll", aoRolar);
      externo.style.height = "";
      trilho.style.translate = "";
      interno.style.removeProperty("--p");
      interno.removeAttribute("data-preso");
      e.ligado = false;
    };

    const mede = () => {
      if (reduzido.matches) { desliga(); return; }
      interno.setAttribute("data-preso", "");
      trilho.style.translate = "";
      const caixa = trilho.getBoundingClientRect();
      if (telaGrande.matches) {
        // entra com o primeiro card a 62% da tela e para na posição centrada
        e.inicio = Math.max(0, window.innerWidth * 0.62 - caixa.left);
        e.curso = e.inicio;
      } else {
        // cada card fica centrado na sua vez: começa no primeiro e anda um passo por card até o último
        // offsetLeft/offsetWidth: a posição de layout, sem o deslocamento da animação de entrada
        const cards = [...trilho.children] as HTMLElement[];
        const passo = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 0;
        e.inicio = (window.innerWidth - cards[0].offsetWidth) / 2 - (caixa.left + cards[0].offsetLeft);
        e.curso = passo * (cards.length - 1);
      }
      const alturaPalco = interno.offsetHeight;
      externo.style.height = `${alturaPalco + e.curso}px`;
      e.topo = externo.getBoundingClientRect().top + window.scrollY - MENU;
      if (!e.ligado) { window.addEventListener("scroll", aoRolar, { passive: true }); e.ligado = true; }
      aplica();
    };

    // deslizar para o lado no toque: vira rolagem da página dentro do palco preso e encaixa num card
    let x0 = 0, y0 = 0, s0 = 0, ultimoX = 0, lado: "x" | "y" | null = null;
    const posicao = (i: number) => e.topo + (e.curso * i) / Math.max(1, total - 1);
    const dentro = () => window.scrollY >= e.topo - 2 && window.scrollY <= e.topo + e.curso + 2;
    const inicioToque = (ev: TouchEvent) => {
      const t = ev.touches[0];
      x0 = ultimoX = t.clientX; y0 = t.clientY; s0 = window.scrollY; lado = null;
    };
    const moveToque = (ev: TouchEvent) => {
      if (!e.ligado) return;
      const t = ev.touches[0];
      const dx = t.clientX - x0, dy = t.clientY - y0;
      if (lado === null && Math.hypot(dx, dy) > 8) lado = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (lado !== "x" || !dentro()) return;
      ev.preventDefault();
      ultimoX = t.clientX;
      window.scrollTo(0, Math.min(e.topo + e.curso, Math.max(e.topo, s0 - dx)));
    };
    const fimToque = () => {
      if (lado !== "x" || !e.ligado) return;
      const dx = ultimoX - x0;
      const atual = e.curso ? ((window.scrollY - e.topo) / e.curso) * (total - 1) : 0;
      let i = Math.round(atual);
      if (dx < -40) i = Math.ceil(atual - 0.05);
      else if (dx > 40) i = Math.floor(atual + 0.05);
      window.scrollTo({ top: posicao(Math.min(total - 1, Math.max(0, i))), behavior: "smooth" });
      lado = null;
    };

    mede();
    window.addEventListener("resize", mede);
    reduzido.addEventListener("change", mede);
    telaGrande.addEventListener("change", mede);
    interno.addEventListener("touchstart", inicioToque, { passive: true });
    interno.addEventListener("touchmove", moveToque, { passive: false });
    interno.addEventListener("touchend", fimToque);
    return () => {
      desliga();
      window.removeEventListener("resize", mede);
      reduzido.removeEventListener("change", mede);
      telaGrande.removeEventListener("change", mede);
      interno.removeEventListener("touchstart", inicioToque);
      interno.removeEventListener("touchmove", moveToque);
      interno.removeEventListener("touchend", fimToque);
      cancelAnimationFrame(quadro);
    };
  }, [total]);

  // ponto: com o palco preso, rola a página até o card; sem ele, rola o carrossel nativo
  const vaiPara = (i: number) => {
    const e = estado.current;
    if (e.ligado) {
      window.scrollTo({ top: e.topo + (e.curso * i) / Math.max(1, total - 1), behavior: "smooth" });
      return;
    }
    const trilho = palco.current?.querySelector<HTMLElement>("[data-trilho]");
    const card = trilho?.children[i] as HTMLElement | undefined;
    if (!trilho || !card) return;
    trilho.scrollTo({ left: card.offsetLeft - (trilho.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
  };

  return (
    <div ref={fora} className="relative">
      <div ref={palco} className="cafes-palco sticky top-16">
        {children}
        <div className="cafes-pontos flex justify-center gap-1 lg:hidden" role="group" aria-label="Escolher café">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => vaiPara(i)}
              aria-label={`Ver café ${i + 1} de ${total}`}
              aria-current={ativo === i ? "true" : undefined}
              className="flex h-11 w-11 items-center justify-center"
            >
              <span className={`block h-2.5 rounded-full transition-all duration-300 ${ativo === i ? "w-7 bg-minastra-gold" : "w-2.5 bg-minastra-paper/35"}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
