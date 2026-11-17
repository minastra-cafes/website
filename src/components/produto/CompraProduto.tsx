"use client";

import { useRef, useState } from "react";
import { useConteudo } from "@/components/ConteudoProvider";
import type { Produto } from "@/data/produtos";
import { calcularTotal, formatarMoeda, montarLinkWhatsApp, montarMensagemPedido, normalizarQuantidade } from "@/lib/pedido";

const FOCO = "focus:outline-none focus:ring-4 focus:ring-minastra-gold/30";

export function CompraProduto({ produto }: { produto: Produto }) {
  const pesos = Object.keys(produto.pesoValores);
  const [peso, setPeso] = useState(pesos[pesos.length - 1]);
  const faixa = useRef<HTMLDivElement>(null);
  const [atual, setAtual] = useState(0);

  function irParaFoto(indice: number) {
    setAtual(indice);
    const elemento = faixa.current;
    elemento?.scrollTo({ left: indice * elemento.clientWidth, behavior: "smooth" });
  }

  // Quem desliza com o dedo muda a foto: a miniatura acompanha a que ficou na tela.
  function acompanharFaixa() {
    const elemento = faixa.current;
    if (!elemento || elemento.clientWidth === 0) return;
    setAtual(Math.round(elemento.scrollLeft / elemento.clientWidth));
  }
  // Texto do campo: deixa a pessoa apagar e digitar; a conta usa o número normalizado.
  const [quantidade, setQuantidade] = useState("1");

  const pacotes = normalizarQuantidade(Number(quantidade));
  const total = formatarMoeda(calcularTotal(produto, peso, pacotes));
  // O total "pula" a cada troca de peso ou quantidade (até voltando ao valor de antes): a key nova
  // recria o elemento e refaz a animação. Na primeira pintura ele fica parado.
  const [trocas, setTrocas] = useState(0);
  const classePulo = trocas > 0 ? "pulo" : "";

  function trocarPeso(novo: string) {
    if (novo === peso) return;
    setPeso(novo);
    setTrocas((anterior) => anterior + 1);
  }

  // O campo pode mudar sem mudar o total (apagar o número conta como 1 pacote): aí não pula.
  function trocarQuantidade(nova: string) {
    setQuantidade(nova);
    if (normalizarQuantidade(Number(nova)) !== pacotes) setTrocas((anterior) => anterior + 1);
  }
  const { celular } = useConteudo();
  const linkWhatsApp = montarLinkWhatsApp(montarMensagemPedido(produto, peso, pacotes), celular);

  return (
    <>
      <div className="grid gap-7 lg:grid-cols-[1.05fr_.95fr] lg:items-start lg:gap-12">
        <section
          aria-label="Fotos do produto"
          className="overflow-hidden rounded-[2rem] border-4 border-minastra-paper bg-minastra-paper shadow-[0_24px_60px_rgba(43,29,22,.14)]"
        >
          <div className="bg-minastra-espresso p-4">
            {/* Faixa que desliza para o lado no celular (scroll-snap); as miniaturas levam até cada foto. */}
            <div
              ref={faixa}
              data-testid="faixa-fotos"
              onScroll={acompanharFaixa}
              className="sem-barra flex snap-x snap-mandatory overflow-x-auto rounded-[1.4rem]"
            >
              {produto.fotos.map((item, indice) => (
                <img
                  key={item.src}
                  src={item.src}
                  srcSet={item.srcSet}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  alt={produto.fotos.length > 1 ? `${produto.nome}, foto ${indice + 1} de ${produto.fotos.length}` : produto.nome}
                  decoding="async"
                  fetchPriority={indice === 0 ? "high" : "low"}
                  loading={indice === 0 ? "eager" : "lazy"}
                  className="h-[22rem] w-full shrink-0 snap-center rounded-[1.4rem] object-cover sm:h-[32rem]"
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 p-4">
            {produto.fotos.map((item, indice) => (
              <button
                key={item.src}
                type="button"
                aria-label={`Ver foto ${indice + 1} de ${produto.nome}`}
                aria-current={indice === atual ? "true" : undefined}
                onClick={() => irParaFoto(indice)}
                className={`overflow-hidden rounded-xl border-2 bg-minastra-cream p-1 transition ${FOCO} ${indice === atual ? "border-minastra-gold" : "border-transparent"}`}
              >
                <img src={item.src} srcSet={item.srcSet} sizes="120px" alt="" className="aspect-square w-full rounded-lg object-cover" />
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-minastra-brown/10 bg-minastra-paper p-6 shadow-[0_20px_50px_rgba(43,29,22,.08)] sm:p-8 lg:sticky lg:top-24">
          <span className="inline-flex bg-minastra-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-minastra-espresso">{produto.torra}</span>

          <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-minastra-brown sm:text-5xl sm:leading-none">{produto.nome}</h1>
          <p className="mt-4 text-[15px] leading-7 text-[#654638] sm:text-lg sm:leading-8">{produto.descricao}</p>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-minastra-brown/70">
            {["100% arábica", "Produção familiar", "Torra artesanal"].map((selo) => (
              <span key={selo} className="flex items-center gap-2">
                <span className="text-minastra-gold">✦</span> {selo}
              </span>
            ))}
          </div>

          <div className="mt-7 border-t border-minastra-brown/15 pt-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-minastra-brown">Escolha o peso</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {pesos.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={item === peso}
                  onClick={() => trocarPeso(item)}
                  className={`motion-safe:active:scale-[0.98] rounded-[1.2rem] border-2 p-4 text-left transition ${FOCO} ${
                    item === peso
                      ? "border-minastra-espresso bg-minastra-espresso text-minastra-paper"
                      : "border-minastra-brown/20 bg-minastra-cream text-minastra-espresso"
                  }`}
                >
                  <span className="block text-xs font-bold uppercase tracking-[0.2em]">{item}g</span>
                  <strong className="mt-2 block font-display text-2xl sm:text-3xl">{formatarMoeda(produto.pesoValores[item])}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 border-t border-minastra-brown/15 pt-6">
            <label htmlFor="quantidade" className="text-[11px] font-bold uppercase tracking-[0.24em] text-minastra-brown">
              Quantidade
            </label>
            <div className="mt-4 flex w-52 items-center justify-between overflow-hidden rounded-full border-2 border-minastra-brown/20 bg-minastra-cream">
              <button
                type="button"
                aria-label="Diminuir quantidade"
                onClick={() => trocarQuantidade(String(Math.max(1, pacotes - 1)))}
                className="h-12 w-14 text-2xl font-bold text-minastra-brown"
              >
                −
              </button>
              <input
                id="quantidade"
                type="number"
                min="1"
                value={quantidade}
                onChange={(evento) => trocarQuantidade(evento.target.value)}
                onBlur={() => setQuantidade(String(pacotes))}
                className="h-12 w-20 bg-transparent text-center text-lg font-bold outline-none"
              />
              <button
                type="button"
                aria-label="Aumentar quantidade"
                onClick={() => trocarQuantidade(String(pacotes + 1))}
                className="h-12 w-14 text-2xl font-bold text-minastra-brown"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-7 rounded-[1.4rem] bg-minastra-espresso p-5 text-minastra-paper">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-minastra-gold">Total</span>
              <strong key={trocas} data-testid="total" className={`font-display text-3xl text-minastra-gold sm:text-4xl ${classePulo}`}>
                {total}
              </strong>
            </div>
            <a
              href={linkWhatsApp}
              target="_blank"
              rel="noopener"
              className={`motion-safe:active:scale-[0.98] mt-5 flex min-h-14 w-full items-center justify-center rounded-full bg-minastra-gold px-5 py-4 text-center text-sm font-bold uppercase tracking-[0.15em] text-minastra-espresso transition hover:bg-minastra-paper ${FOCO}`}
            >
              Comprar no WhatsApp
            </a>
            <p className="mt-3 text-center text-[11px] text-minastra-paper/50">Você revisa o pedido e combina a entrega antes de concluir.</p>
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-minastra-brown/10 bg-minastra-paper/95 p-3 shadow-[0_-10px_35px_rgba(43,29,22,.12)] backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-minastra-brown/55">Total</span>
            <strong key={trocas} className={`font-display text-2xl text-minastra-brown ${classePulo}`}>
              {total}
            </strong>
          </div>
          <a
            href={linkWhatsApp}
            target="_blank"
            rel="noopener"
            className="flex min-h-12 items-center justify-center rounded-full bg-minastra-gold px-5 text-xs font-bold uppercase tracking-wider text-minastra-espresso transition motion-safe:active:scale-[0.98]"
          >
            Comprar
          </a>
        </div>
      </div>
    </>
  );
}
