import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompraProduto } from "@/components/produto/CompraProduto";
import { MolduraProduto } from "@/components/produto/MolduraProduto";
import { buscarProduto, PRODUTOS } from "@/data/produtos";
import { SITE } from "@/data/site";
import { CRIADOR_DO_SITE, montarDadosProduto, montarDescricaoProduto, ROBOTS_INDEXAR, serializarJsonLd } from "@/lib/seo";

// Export estático: só existem as páginas geradas aqui; qualquer outro id cai no 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUTOS.map((produto) => ({ id: produto.id }));
}

export const viewport: Viewport = {
  themeColor: "#2b1d16",
};

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const produto = buscarProduto((await params).id);
  if (!produto) return {};

  const url = `${SITE.url}/produto/${produto.id}/`;
  const imagem = `${SITE.url}${produto.fotos[0]}`;
  const tituloSeo = `${produto.nome} | Café especial Minastra`;
  const descricao = montarDescricaoProduto(produto);

  return {
    title: `${produto.nome} | Minastra Cafés Especiais`,
    description: descricao,
    alternates: { canonical: url },
    robots: ROBOTS_INDEXAR,
    creator: CRIADOR_DO_SITE.nome,
    openGraph: {
      locale: "pt_BR",
      // O og:type "product" do site antigo não existe no Next; "website" é o que ele aceita.
      type: "website",
      siteName: SITE.nome,
      title: tituloSeo,
      description: descricao,
      url,
      images: [{ url: imagem, alt: "Café especial Minastra" }],
    },
    twitter: { card: "summary_large_image", title: tituloSeo, description: descricao, images: [imagem] },
  };
}

const VANTAGENS = [
  { titulo: "Origem identificada", texto: "Produzido no Sítio Lagoa, em Alfenas, Sul de Minas." },
  { titulo: "Compra acompanhada", texto: "Finalize pelo WhatsApp e tire suas dúvidas diretamente conosco." },
  { titulo: "Feito em pequena escala", texto: "Mais cuidado em cada etapa, do cultivo à torra." },
];

export default async function PaginaProduto({ params }: Props) {
  const produto = buscarProduto((await params).id);
  if (!produto) notFound();

  return (
    <MolduraProduto>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializarJsonLd(montarDadosProduto(produto)) }} />
      <main className="grain-bg px-4 pb-28 pt-5 sm:px-8 sm:pb-10 sm:pt-8 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-md sm:max-w-2xl lg:max-w-7xl">
          <nav className="mb-5 flex items-center gap-2 text-xs text-minastra-brown/60" aria-label="Navegação estrutural">
            <Link href="/" className="transition hover:text-minastra-brown">
              Início
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/#cafes" className="transition hover:text-minastra-brown">
              Cafés
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-minastra-brown">{produto.nome}</span>
          </nav>

          <CompraProduto produto={produto} />

          <section className="mt-8 grid gap-3 sm:grid-cols-3 lg:mt-12">
            {VANTAGENS.map((vantagem) => (
              <article key={vantagem.titulo} className="rounded-2xl border border-minastra-brown/10 bg-minastra-paper p-5">
                <strong className="text-sm text-minastra-brown">{vantagem.titulo}</strong>
                <p className="mt-2 text-xs leading-5 text-minastra-brown/65">{vantagem.texto}</p>
              </article>
            ))}
          </section>
        </div>
      </main>
    </MolduraProduto>
  );
}
