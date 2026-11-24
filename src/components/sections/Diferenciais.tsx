const DIFERENCIAIS = [
  { icone: "✦", titulo: "Torra artesanal", texto: "Feita em pequenos lotes" },
  { icone: "◇", titulo: "Compra simples", texto: "Pedido direto pelo WhatsApp" },
  { icone: "⌂", titulo: "Produção familiar", texto: "Direto para a sua casa" },
];

export function Diferenciais() {
  return (
    <section className="bg-gradient-to-b from-minastra-espresso to-minastra-leaf px-3 py-4 text-minastra-paper sm:px-8 sm:py-5">
      <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-minastra-paper/15">
        {DIFERENCIAIS.map((item) => (
          <div key={item.titulo} className="flex flex-col items-center px-2 text-center sm:flex-row sm:justify-center sm:gap-3 sm:px-5 sm:text-left">
            <span className="mb-1 text-lg text-minastra-gold sm:mb-0 sm:text-xl">{item.icone}</span>
            <div>
              <strong className="block text-[11px] leading-tight sm:text-sm sm:leading-5">{item.titulo}</strong>
              <span className="mt-1 hidden text-xs text-minastra-paper/65 sm:block">{item.texto}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
