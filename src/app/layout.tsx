import type { Metadata, Viewport } from "next";
import { Alegreya_SC, Inter } from "next/font/google";
import { SITE } from "@/data/site";
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

export const viewport: Viewport = {
  themeColor: "#251711",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" translate="no" className={`${inter.variable} ${alegreya.variable}`}>
      <body className="bg-minastra-paper font-sans text-minastra-espresso antialiased">{children}</body>
    </html>
  );
}
