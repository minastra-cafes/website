import { Contatos } from "@/components/Contatos";
import { CreditoAzics } from "@/components/CreditoAzics";
import { foto } from "@/lib/foto";

export function Footer() {
  return (
    <footer className="bg-minastra-espresso px-5 py-6 text-minastra-paper/60 sm:px-8 lg:px-10">
      {/* Celular: logo e "Voltar ao topo" na primeira linha, os contatos embaixo e o texto por último.
          Desktop: uma linha só, na ordem logo, texto, contatos, "Voltar ao topo". */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 text-sm">
        <div className="flex items-center gap-3">
          <img src={foto("logo").src} alt="" className="h-9 w-9 rounded-full bg-minastra-paper object-cover" />
          <span className="brand text-xl text-minastra-paper">Minastra</span>
        </div>
        <a href="#inicio" className="font-semibold text-minastra-gold sm:order-last">
          Voltar ao topo ↑
        </a>
        <Contatos className="w-full sm:order-3 sm:w-auto" />
        <div className="w-full sm:order-2 sm:w-auto sm:text-center">
          <p>© 2026 Minastra Cafés Especiais · Alfenas, MG</p>
          <CreditoAzics className="mt-1" />
        </div>
      </div>
    </footer>
  );
}
