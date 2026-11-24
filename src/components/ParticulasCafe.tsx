"use client";

import { useEffect, useRef } from "react";

// Flores brancas de café caindo devagar no topo, girando e virando no ar.
// O canvas fica entre a foto e o filtro marrom do topo, então o degradê apaga as partículas atrás do
// título (à esquerda) e elas aparecem mais onde a foto é clara (à direita): enfeite, sem disputar o texto.
// Poucas partículas (10 no celular, 18 no computador); param fora da tela e com a aba escondida; com
// "reduzir movimento" (ou sem matchMedia, como nos testes) não há animação nenhuma.

type Particula = {
  x: number;
  y: number;
  tamanho: number;
  vy: number;
  balanco: number;
  fase: number;
  giro: number;
  vGiro: number;
  vira: number;
  vVira: number;
  alfa: number;
};

// a flor do café: 5 pétalas brancas um pouco alongadas e, no miolo, os estames amarelos em raio
const PETALAS = 5;
const ESTAMES = 5;

function desenhaFlor(ctx: CanvasRenderingContext2D, t: number) {
  ctx.fillStyle = "#fffaf2";
  for (let i = 0; i < PETALAS; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / PETALAS);
    ctx.beginPath();
    ctx.ellipse(0, -t * 0.32, t * 0.16, t * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // estames: raiozinhos amarelos saindo do centro, entre as pétalas, cada um com a pontinha (antera)
  ctx.strokeStyle = "#e8a83a";
  ctx.fillStyle = "#e08a1e";
  ctx.lineWidth = Math.max(0.8, t * 0.045);
  ctx.lineCap = "round";
  for (let i = 0; i < ESTAMES; i++) {
    const angulo = ((i + 0.5) * Math.PI * 2) / ESTAMES - Math.PI / 2;
    const fx = Math.cos(angulo) * t * 0.24;
    const fy = Math.sin(angulo) * t * 0.24;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(fx, fy);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(fx, fy, Math.max(0.8, t * 0.045), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#f3d27a";
  ctx.beginPath();
  ctx.arc(0, 0, t * 0.06, 0, Math.PI * 2);
  ctx.fill();
}


export function ParticulasCafe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || typeof window.matchMedia !== "function") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const celular = window.innerWidth < 768;
    const total = celular ? 10 : 18;
    let largura = 0;
    let altura = 0;
    let particulas: Particula[] = [];

    const nova = (noTopo: boolean): Particula => {
      return {
        x: Math.random() * largura,
        y: noTopo ? -20 - Math.random() * 60 : Math.random() * altura,
        tamanho: 10 + Math.random() * 8,
        vy: 16 + Math.random() * 22,
        balanco: 10 + Math.random() * 22,
        fase: Math.random() * Math.PI * 2,
        giro: Math.random() * Math.PI * 2,
        vGiro: (Math.random() - 0.5) * 1.2,
        vira: Math.random() * Math.PI * 2,
        vVira: 0.8 + Math.random() * 1.4,
        alfa: 0.55 + Math.random() * 0.35,
      };
    };

    const mede = () => {
      const dpr = celular ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      // a barra de endereço do celular dispara resize ao rolar: recriar o canvas sem o tamanho ter mudado
      // só apagava e realocava o desenho à toa
      if (canvas.clientWidth === largura && canvas.clientHeight === altura) return;
      largura = canvas.clientWidth;
      altura = canvas.clientHeight;
      canvas.width = Math.round(largura * dpr);
      canvas.height = Math.round(altura * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!particulas.length) particulas = Array.from({ length: total }, () => nova(false));
    };

    let quadro = 0;
    let anterior = 0;
    let visivel = true;
    const passo = (agora: number) => {
      const dt = Math.min(0.05, anterior ? (agora - anterior) / 1000 : 0);
      anterior = agora;
      ctx.clearRect(0, 0, largura, altura);
      for (let i = 0; i < particulas.length; i++) {
        const p = particulas[i];
        p.y += p.vy * dt;
        p.fase += dt;
        p.giro += p.vGiro * dt;
        p.vira += p.vVira * dt;
        if (p.y > altura + 30) {
          particulas[i] = nova(true);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = p.alfa;
        ctx.translate(p.x + Math.sin(p.fase) * p.balanco, p.y);
        ctx.rotate(p.giro);
        // "vira" no ar: achata num eixo, como uma pétala girando
        ctx.scale(1, 0.35 + 0.65 * Math.abs(Math.cos(p.vira)));
        desenhaFlor(ctx, p.tamanho);
        ctx.restore();
      }
      quadro = requestAnimationFrame(passo);
    };

    const liga = () => {
      if (quadro || !visivel || document.hidden) return;
      anterior = 0;
      quadro = requestAnimationFrame(passo);
    };
    const desliga = () => {
      cancelAnimationFrame(quadro);
      quadro = 0;
    };

    mede();
    const observador = new IntersectionObserver(([entrada]) => {
      visivel = entrada.isIntersecting;
      if (visivel) liga();
      else desliga();
    });
    observador.observe(canvas);
    const aoMudarAba = () => (document.hidden ? desliga() : liga());
    document.addEventListener("visibilitychange", aoMudarAba);
    window.addEventListener("resize", mede);
    liga();

    return () => {
      desliga();
      observador.disconnect();
      document.removeEventListener("visibilitychange", aoMudarAba);
      window.removeEventListener("resize", mede);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
