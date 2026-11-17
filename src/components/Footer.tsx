import { caminhoPublico } from "@/lib/caminho";

export function Footer() {
  return (
    <footer className="bg-minastra-espresso px-5 py-10 text-minastra-paper/60 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <img src={caminhoPublico("/logo.png")} alt="" className="h-10 w-10 rounded-full bg-minastra-paper object-cover" />
          <span className="brand text-xl text-minastra-paper">Minastra</span>
        </div>
        <p>© 2026 Minastra Cafés Especiais · Alfenas, MG</p>
        <a href="#inicio" className="font-semibold text-minastra-gold">
          Voltar ao topo ↑
        </a>
      </div>
    </footer>
  );
}
