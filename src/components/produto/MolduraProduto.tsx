import Link from "next/link";
import { Contatos } from "@/components/Contatos";
import { CreditoAzics } from "@/components/CreditoAzics";
import { foto } from "@/lib/foto";

// A página de produto do site antigo tinha cores um pouco diferentes da inicial (ver .paleta-produto
// no globals.css) e o fundo creme com o degradê .grain-bg.
// comBarraDeCompra: a página do produto tem a barra fixa "Comprar" no celular; o rodapé ganha espaço
// embaixo para ela não cobrir os contatos.
export function MolduraProduto({
  comCabecalho = true,
  comBarraDeCompra = false,
  children,
}: {
  comCabecalho?: boolean;
  comBarraDeCompra?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="paleta-produto min-h-screen bg-minastra-cream text-minastra-espresso">
      {comCabecalho && (
        <header className="relative overflow-hidden border-b border-minastra-gold/30 bg-minastra-espresso text-minastra-paper">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(202,160,82,.14),transparent_40%)]" />

          <div className="relative mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:px-10">
            <nav className="flex items-center justify-between" aria-label="Navegação principal">
              <Link href="/#inicio" className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-minastra-paper">
                  <img src={foto("logo").src} alt="Logo Minastra" className="h-11 w-11 rounded-full object-cover" />
                </span>
                <span className="alegreya-sc text-2xl tracking-wider">MINASTRA</span>
              </Link>

              <Link
                href="/#cafes"
                className="rounded-full border border-minastra-gold/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition hover:bg-minastra-gold hover:text-minastra-espresso focus:outline-none focus:ring-4 focus:ring-minastra-gold/30"
              >
                Voltar
              </Link>
            </nav>
          </div>
        </header>
      )}

      {children}

      <footer className={`bg-minastra-espresso px-6 pt-6 text-center text-sm text-minastra-paper/60 ${comBarraDeCompra ? "pb-28 sm:pb-6" : "pb-6"}`}>
        <p>© 2026 Minastra Cafés Especiais</p>
        <p className="mt-1">Simples. Puro. Intenso.</p>
        <Contatos className="mt-4 justify-center" />
        <CreditoAzics className="mt-3" />
      </footer>
    </div>
  );
}
