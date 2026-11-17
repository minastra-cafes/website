import { CreditoAzics } from "@/components/CreditoAzics";
import { foto } from "@/lib/foto";

export function Footer() {
  return (
    <footer className="bg-minastra-espresso px-5 py-6 text-minastra-paper/60 sm:px-8 lg:px-10">
      {/* No celular: logo e "Voltar ao topo" na mesma linha, o resto embaixo. No desktop: uma linha só. */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 text-sm">
        <div className="flex items-center gap-3">
          <img src={foto("logo").src} alt="" className="h-9 w-9 rounded-full bg-minastra-paper object-cover" />
          <span className="brand text-xl text-minastra-paper">Minastra</span>
        </div>
        <a href="#inicio" className="font-semibold text-minastra-gold sm:order-last">
          Voltar ao topo ↑
        </a>
        <div className="w-full sm:w-auto sm:text-center">
          <p>© 2026 Minastra Cafés Especiais · Alfenas, MG</p>
          <CreditoAzics className="mt-1" />
        </div>
      </div>
    </footer>
  );
}
