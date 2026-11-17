import { item } from "@/components/item";
import { Revelar } from "@/components/Revelar";

const MOTIVOS = [
  { numero: "01", titulo: "Origem transparente", texto: "Você conhece a fazenda, a variedade e as pessoas por trás de cada pacote." },
  { numero: "02", titulo: "Frescor em primeiro lugar", texto: "Pequenos lotes ajudam a preservar aroma, doçura e personalidade na xícara." },
  { numero: "03", titulo: "Compra sem atrito", texto: "Escolha peso e quantidade no site e finalize rapidamente pelo WhatsApp." },
];

export function Qualidade() {
  return (
    <section id="qualidade" className="scroll-mt-16 bg-minastra-paper px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Revelar className="text-center">
          <p data-item className={`text-xs font-bold uppercase tracking-[.22em] text-minastra-brown ${item}`}>Por que Minastra</p>
          <h2 data-item className={`mx-auto mt-4 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-6xl sm:leading-none ${item}`}>
            Especial sem ser complicado.
          </h2>
        </Revelar>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {MOTIVOS.map((motivo) => (
            <article key={motivo.numero} className="rounded-3xl bg-minastra-cream p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-minastra-gold text-xl">{motivo.numero}</span>
              <h3 className="mt-6 font-display text-2xl font-bold">{motivo.titulo}</h3>
              <p className="mt-3 text-sm leading-7 text-minastra-brown/70">{motivo.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
