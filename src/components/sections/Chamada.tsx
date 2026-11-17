export function Chamada() {
  return (
    <section className="px-5 pb-16 sm:px-8 sm:pb-24 lg:px-10">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-minastra-leaf px-6 py-12 text-minastra-paper sm:px-12 sm:py-16 lg:px-16">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[45px] border-minastra-gold/10" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-minastra-gold">Sua próxima xícara começa aqui</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl sm:leading-none">Descubra o sabor das montanhas de Minas.</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-minastra-paper/70">Escolha seu perfil, selecione o peso e faça seu pedido em poucos passos.</p>
          <a
            href="#cafes"
            className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-minastra-gold px-7 text-sm font-bold text-minastra-espresso transition hover:bg-minastra-paper"
          >
            Escolher meu Minastra
          </a>
        </div>
      </div>
    </section>
  );
}
