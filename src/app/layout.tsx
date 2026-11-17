import type { Metadata, Viewport } from "next";
import { Alegreya_SC, Inter } from "next/font/google";
import Script from "next/script";
import { ConteudoProvider } from "@/components/ConteudoProvider";
import { SITE } from "@/data/site";
import { obterConteudoNoBuild } from "@/lib/conteudo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Só no nome "Minastra": 500 na inicial (.brand; ela pedia 500 e 600, mas a família não tem 600)
// e 400 na página de produto (.alegreya-sc).
const alegreya = Alegreya_SC({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-alegreya-sc",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE.url}/`),
  authors: [{ name: SITE.nome }],
  icons: {
    icon: [{ url: `${SITE.url}/favicon.png`, sizes: "48x48", type: "image/png" }],
    apple: [{ url: `${SITE.url}/apple-touch-icon.png`, sizes: "180x180" }],
  },
  other: { google: "notranslate" },
};

// Liga as animações de entrada só com JS. Se o bundle não carregar em 3 s, tira a classe para o
// conteúdo nunca ficar escondido (o mesmo script da Azics).
const scriptJs =
  "var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(d.dataset.revelarPronto===undefined)d.classList.remove('js')},3000)";

export const viewport: Viewport = {
  themeColor: "#251711",
};

// O conteúdo do painel (título, subtítulo, Sobre, Instagram, celular) entra no HTML no build; o
// ConteudoProvider confere a versão atual no navegador.
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const conteudo = await obterConteudoNoBuild();
  return (
    <html lang="pt-BR" translate="no" className={`${inter.variable} ${alegreya.variable}`} suppressHydrationWarning>
      <body className="bg-minastra-paper font-sans text-minastra-espresso antialiased">
        <ConteudoProvider slug={process.env.NEXT_PUBLIC_SITE_SLUG ?? "minastra"} inicial={conteudo}>
          {children}
        </ConteudoProvider>
        <Script id="js-ativo" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: scriptJs }} />
      </body>
    </html>
  );
}
