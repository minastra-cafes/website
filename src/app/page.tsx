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

const TITULO = "Minastra | Cafés especiais do Sul de Minas";

export const metadata: Metadata = {
  title: TITULO,
  description: "Cafés especiais 100% arábica, produzidos em pequena escala no Sítio Lagoa, em Alfenas, Sul de Minas.",
  alternates: { canonical: `${SITE.url}/` },
  openGraph: {
    locale: "pt_BR",
    type: "website",
    siteName: SITE.nome,
    title: TITULO,
    description: "Cafés especiais 100% arábica, com origem no Sítio Lagoa, em Alfenas, Sul de Minas.",
    url: `${SITE.url}/`,
    images: [{ url: `${SITE.url}/images/sobre/trator.jpeg`, alt: "Cafezal Minastra nas montanhas do Sul de Minas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: "Café especial com origem de verdade, produzido artesanalmente em Alfenas, Minas Gerais.",
    images: [`${SITE.url}/images/sobre/serras_cafe.png`],
  },
};

const ORGANIZACAO = {
  "@context": "https://schema.org",
  "@type": "Organization",
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
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZACAO).replace(/</g, "\\u003c") }} />
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
