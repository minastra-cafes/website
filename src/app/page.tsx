import type { Metadata } from "next";
import { Avaliacoes } from "@/components/avaliacoes/Avaliacoes";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Bastidores } from "@/components/sections/Bastidores";
import { Cafes } from "@/components/sections/Cafes";
import { Chamada } from "@/components/sections/Chamada";
import { Diferenciais } from "@/components/sections/Diferenciais";
import { Inicio } from "@/components/sections/Inicio";
import { Origem } from "@/components/sections/Origem";
import { Qualidade } from "@/components/sections/Qualidade";
import { SITE } from "@/data/site";
import { obterConteudoNoBuild } from "@/lib/conteudo";
import { IMAGEM_COMPARTILHAR } from "@/lib/foto";
import { CRIADOR_DO_SITE, montarDadosSite, ROBOTS_INDEXAR, serializarJsonLd } from "@/lib/seo";

const TITULO = "Minastra | Cafés especiais do Sul de Minas";

export const metadata: Metadata = {
  title: TITULO,
  description: "Cafés especiais 100% arábica, produzidos em pequena escala no Sítio Lagoa, em Alfenas, Sul de Minas.",
  alternates: { canonical: `${SITE.url}/` },
  robots: ROBOTS_INDEXAR,
  creator: CRIADOR_DO_SITE.nome,
  openGraph: {
    locale: "pt_BR",
    type: "website",
    siteName: SITE.nome,
    title: TITULO,
    description: "Cafés especiais 100% arábica, com origem no Sítio Lagoa, em Alfenas, Sul de Minas.",
    url: `${SITE.url}/`,
    images: [{ url: `${SITE.url}${IMAGEM_COMPARTILHAR.trator}`, width: 1200, height: 630, alt: "Cafezal Minastra nas montanhas do Sul de Minas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: "Café especial com origem de verdade, produzido artesanalmente em Alfenas, Minas Gerais.",
    images: [`${SITE.url}${IMAGEM_COMPARTILHAR.serras}`],
  },
};

export default async function Home() {
  const conteudo = await obterConteudoNoBuild();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializarJsonLd(montarDadosSite(conteudo)) }} />
      <Header />
      <main>
        <Inicio />
        <Diferenciais />
        <Cafes />
        <Origem />
        <Qualidade />
        <Avaliacoes slug={process.env.NEXT_PUBLIC_SITE_SLUG ?? "minastra"} nomeNegocio="Minastra" />
        <Bastidores />
        <Chamada />
      </main>
      <Footer />
    </>
  );
}
