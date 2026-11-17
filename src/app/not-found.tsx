import Link from "next/link";
import { MolduraProduto } from "@/components/produto/MolduraProduto";

// O bloco "Produto não encontrado" da página de produto antiga, que agora serve de 404 do site.
export default function NaoEncontrado() {
  return (
    <MolduraProduto comCabecalho={false}>
      <main className="grain-bg min-h-[70vh] px-6 py-20 text-center">
        <div className="mx-auto max-w-md rounded-[2rem] bg-minastra-paper p-8 shadow-xl">
          <h1 className="font-display text-4xl font-bold text-minastra-brown">Produto não encontrado</h1>
          <p className="mt-4 leading-7 text-[#654638]">Volte ao catálogo e escolha um dos nossos cafés.</p>
          <Link
            href="/#cafes"
            className="mt-7 inline-flex rounded-full bg-minastra-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-minastra-espresso"
          >
            Ver produtos
          </Link>
        </div>
      </main>
    </MolduraProduto>
  );
}
