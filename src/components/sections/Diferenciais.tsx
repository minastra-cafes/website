// Os destaques da marca, logo abaixo do topo (antes ficavam repetidos dentro do topo). No celular cabem
// três; no computador entra o quarto, para preencher a largura.
const DIFERENCIAIS = [
  { icone: "✦", titulo: "Torra artesanal", texto: "100% arábica" },
  { icone: "▲", titulo: "Sul de Minas", texto: "Origem única" },
  { icone: "◇", titulo: "Pequenos lotes", texto: "Mais frescor" },
  { icone: "⌂", titulo: "Produção familiar", texto: "Direto para a sua casa", soComputador: true },
];

export function Diferenciais() {
  // sobe 1 px sobre o topo: a altura do topo (90svh) dá valor quebrado e a emenda podia mostrar uma
  // fileira da foto sem o filtro escuro
  return (
    <section className="relative -mt-px bg-gradient-to-b from-minastra-espresso to-minastra-leaf px-3 py-4 text-minastra-paper sm:px-8 sm:py-5">
      <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-minastra-paper/15 lg:grid-cols-4">
        {DIFERENCIAIS.map((item) => (
          <div key={item.titulo} className={`${item.soComputador ? "hidden lg:flex" : "flex"} flex-col items-center px-2 text-center sm:flex-row sm:justify-center sm:gap-3 sm:px-5 sm:text-left`}>
            <span className="mb-1 text-lg text-minastra-gold sm:mb-0 sm:text-xl">{item.icone}</span>
            <div>
              <strong className="block text-[11px] leading-tight sm:text-sm sm:leading-5">{item.titulo}</strong>
              <span className="mt-0.5 block text-[11px] text-minastra-paper/65 sm:mt-1 sm:text-xs">{item.texto}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
