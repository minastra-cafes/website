import type { Metadata } from "next";
import type { Produto } from "@/data/produtos";
import { SITE } from "@/data/site";

// Quem fez o site. Fica no HTML (meta creator e JSON-LD), sem aparecer na tela.
export const CRIADOR_DO_SITE = { nome: "Azics", url: "https://azics.com.br" } as const;

// As páginas que devem aparecer no Google. Fica fora do layout para o 404 levar só o noindex do Next.
export const ROBOTS_INDEXAR: Metadata["robots"] = { index: true, follow: true, "max-image-preview": "large" };

const ID_ORGANIZACAO = `${SITE.url}/#organizacao`;

export function montarDadosSite() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ID_ORGANIZACAO,
        name: SITE.nome,
        url: `${SITE.url}/`,
        logo: `${SITE.url}/logo.png`,
        description: "Cafés especiais 100% arábica produzidos no Sítio Lagoa, em Alfenas, Sul de Minas.",
        telephone: "+55 35 99913-1028",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Alfenas",
          addressRegion: "MG",
          addressCountry: "BR",
        },
        sameAs: [SITE.instagram],
      },
      {
        "@type": "WebSite",
        name: SITE.nome,
        url: `${SITE.url}/`,
        inLanguage: "pt-BR",
        publisher: { "@id": ID_ORGANIZACAO },
        creator: { "@type": "Organization", name: CRIADOR_DO_SITE.nome, url: CRIADOR_DO_SITE.url },
      },
    ],
  };
}

export function montarDadosProduto(produto: Produto) {
  const url = `${SITE.url}/produto/${produto.id}/`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produto.nome,
    description: produto.descricao,
    image: produto.fotos.map((foto) => `${SITE.url}${foto.src}`),
    brand: { "@type": "Brand", name: "Minastra" },
    offers: Object.entries(produto.pesoValores).map(([peso, valor]) => ({
      "@type": "Offer",
      url,
      priceCurrency: "BRL",
      price: valor.toFixed(2),
      availability: "https://schema.org/InStock",
      name: `${produto.nome} ${peso}g`,
    })),
  };
}

// O Google corta a descrição perto de 155 caracteres: vai só a do produto, sem o complemento.
export function montarDescricaoProduto(produto: Produto): string {
  return produto.descricao;
}

// JSON.stringify não escapa "<": sem isso, um texto com "</script>" fecharia a tag.
export function serializarJsonLd(dados: unknown): string {
  return JSON.stringify(dados).replace(/</g, "\\u003c");
}
