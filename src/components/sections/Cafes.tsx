import Link from "next/link";
import { item, itemCarrossel, toque } from "@/components/item";
import { Revelar } from "@/components/Revelar";
import { CarrosselCafes } from "@/components/sections/CarrosselCafes";
import { buscarProduto } from "@/data/produtos";
import { foto as fotoDe, type NomeFoto } from "@/lib/foto";
import { formatarMoeda } from "@/lib/pedido";

type Cartao = {
  id: string;
  nome: string;
  torra: string;
  texto: string;
  selo: string;
  foto: NomeFoto;
  alt: string;
  largura: number;
  altura: number;
  // A Linha Ouro é o cartão escuro, de destaque.
  escuro?: boolean;
};

const CARTOES: Cartao[] = [
  {
    id: "bronze",
    nome: "Linha Bronze",
    torra: "Torra média escura",
    texto: "Encorpado, naturalmente doce e perfeito para o café de todos os dias.",
    selo: "Intenso",
    foto: "produto-bronze-pacote",
    alt: "Pacote Linha Bronze",
    largura: 1152,
    altura: 1468,
  },
  {
    id: "ouro",
    nome: "Linha Ouro",
    torra: "Torra média clara",
    texto: "Chocolate, mel e doçura natural em uma xícara leve e aromática.",
    selo: "Mais suave",
    foto: "produto-ouro",
    alt: "Pacote Linha Ouro",
    largura: 1200,
    altura: 1080,
    escuro: true,
  },
  {
    id: "ouro-graos",
    nome: "Ouro em Grãos",
    torra: "Torra média clara",
    texto: "Para moer na hora e preservar toda a complexidade, frescor e aroma.",
    selo: "Em grãos",
    foto: "produto-ouro-graos-pacote",
    alt: "Linha Ouro em grãos",
    largura: 1152,
    altura: 1510,
  },
];

// O preço vem de produtos.ts, o mesmo da página do produto: muda num lugar só.
function precoInicial(id: string): string {
  const produto = buscarProduto(id);
  if (!produto) throw new Error(`Café sem produto em produtos.ts: ${id}`);
  return formatarMoeda(Math.min(...Object.values(produto.pesoValores)));
}

function CartaoCafe({ cartao }: { cartao: Cartao }) {
  const escuro = cartao.escuro === true;
  return (
    <Link
      href={`/produto/${cartao.id}/`}
      className={
        escuro
          ? `${toque} group block h-full overflow-hidden rounded-3xl border border-minastra-gold/40 bg-minastra-espresso text-minastra-paper shadow-card transition duration-300 hover:-translate-y-2 hover:shadow-soft`
          : `${toque} group block h-full overflow-hidden rounded-3xl border border-minastra-brown/10 bg-minastra-paper shadow-card transition duration-300 hover:-translate-y-2 hover:shadow-soft`
      }
    >
      <div className={escuro ? "relative overflow-hidden p-3" : "relative overflow-hidden bg-minastra-espresso p-3"}>
        <img
          {...fotoDe(cartao.foto)}
          sizes="(min-width: 768px) 33vw, 100vw"
          alt={cartao.alt}
          width={cartao.largura}
          height={cartao.altura}
          loading="lazy"
          decoding="async"
          className="h-72 w-full rounded-2xl object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <span
          className={
            escuro
              ? "absolute left-6 top-6 rounded-full bg-minastra-gold px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-minastra-espresso"
              : "absolute left-6 top-6 rounded-full bg-minastra-paper/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider"
          }
        >
          {cartao.selo}
        </span>
      </div>
      <div className="p-6">
        <p className={`text-xs font-semibold uppercase tracking-[.18em] ${escuro ? "text-minastra-gold" : "text-minastra-clay"}`}>{cartao.torra}</p>
        <h3 className={`mt-2 font-display text-3xl font-bold${escuro ? " text-minastra-gold" : ""}`}>{cartao.nome}</h3>
        <p className={`mt-3 text-sm leading-6 ${escuro ? "text-minastra-paper/65" : "text-minastra-brown/70"}`}>{cartao.texto}</p>
        <div className={`mt-6 flex items-end justify-between border-t pt-5 ${escuro ? "border-minastra-paper/10" : "border-minastra-brown/10"}`}>
          <div>
            <span className={`block text-xs ${escuro ? "text-minastra-paper/50" : "text-minastra-brown/60"}`}>A partir de</span>
            <strong className="font-display text-2xl">{precoInicial(cartao.id)}</strong>
          </div>
          <span
            className={
              escuro
                ? "flex h-11 w-11 items-center justify-center rounded-full bg-minastra-gold text-xl text-minastra-espresso"
                : "flex h-11 w-11 items-center justify-center rounded-full bg-minastra-espresso text-xl text-minastra-paper transition group-hover:bg-minastra-gold group-hover:text-minastra-espresso"
            }
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

export function Cafes() {
  return (
    <section id="cafes" className="cafes-secao scroll-mt-16 pt-16 sm:pt-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <Revelar className="max-w-3xl">
          <p data-item className={`text-xs font-bold uppercase tracking-[.22em] text-minastra-gold ${item}`}>Escolha pelo seu paladar</p>
          <h2 data-item className={`mt-4 font-display text-4xl font-bold leading-tight tracking-[-.025em] text-minastra-paper sm:text-6xl sm:leading-none ${item}`}>Um Minastra para cada momento.</h2>
          <p data-item className={`mt-5 max-w-2xl text-base leading-7 text-minastra-paper/75 sm:text-lg ${item}`}>
            Perfis claros, compra rápida e café fresco. Selecione o que combina com você.
          </p>
        </Revelar>
      </div>

      {/* Celular: carrossel com encaixe (deslizar de lado). Computador: os cards atravessam a tela. */}
      <CarrosselCafes total={CARTOES.length}>
        <Revelar className="cafes-revelar">
          <div data-trilho="" className="cafes-trilho">
            {CARTOES.map((cartao) => (
              <div key={cartao.id} data-item className={`cafes-card ${itemCarrossel}`}>
                <CartaoCafe cartao={cartao} />
              </div>
            ))}
          </div>
        </Revelar>
      </CarrosselCafes>
    </section>
  );
}
