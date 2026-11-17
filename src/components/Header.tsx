import { foto } from "@/lib/foto";

const LINKS = [
  { href: "#cafes", texto: "Cafés" },
  { href: "#origem", texto: "Nossa origem" },
  { href: "#qualidade", texto: "Qualidade" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-minastra-espresso/95 text-minastra-paper backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10" aria-label="Navegação principal">
        <a href="#inicio" className="flex items-center gap-3" aria-label="Minastra, início">
          <img src={foto("logo").src} alt="" className="h-10 w-10 rounded-full bg-minastra-paper object-cover" />
          <span className="brand text-2xl tracking-wider">Minastra</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-minastra-paper/75 transition hover:text-minastra-gold">
              {link.texto}
            </a>
          ))}
        </div>

        <a href="#cafes" className="rounded-full bg-minastra-gold px-5 py-2.5 text-xs font-bold uppercase tracking-[.13em] text-minastra-espresso transition hover:bg-minastra-paper">
          Escolher café
        </a>
      </nav>
    </header>
  );
}
