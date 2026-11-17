import { item } from "@/components/item";
import { Revelar } from "@/components/Revelar";
import { VideoPreguicoso } from "@/components/VideoPreguicoso";
import { foto, VIDEO_COLHEDEIRA } from "@/lib/foto";

const GRADIENTE_FORTE = "absolute inset-0 bg-gradient-to-t from-minastra-espresso/75 via-transparent to-transparent";
const GRADIENTE = "absolute inset-0 bg-gradient-to-t from-minastra-espresso/65 via-transparent to-transparent";

export function Bastidores() {
  return (
    <section className="overflow-hidden bg-minastra-cream px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Revelar className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p data-item className={`text-xs font-bold uppercase tracking-[.22em] text-minastra-brown ${item}`}>Por trás da Minastra</p>
            <h2 data-item className={`mt-4 font-display text-4xl font-bold leading-tight tracking-[-.025em] sm:text-6xl sm:leading-none ${item}`}>Café feito por pessoas, não por atalhos.</h2>
          </div>
          <p data-item className={`max-w-md text-sm leading-7 text-minastra-brown/70 sm:text-base sm:leading-6 ${item}`}>
            Da lavoura à torrefação, estas são as mãos, os lugares e os processos que dão identidade a cada pacote.
          </p>
        </Revelar>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          <figure className="group relative col-span-2 overflow-hidden rounded-3xl lg:row-span-2">
            <img
              {...foto("helio")}
              alt="Hélio Gomes no cafezal Minastra"
              loading="lazy"
              className="h-72 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-96 lg:h-full"
            />
            <div className={GRADIENTE_FORTE} />
            <figcaption className="absolute bottom-0 p-5 text-minastra-paper sm:p-7">
              <strong className="font-display text-2xl sm:text-3xl">Conhecimento que atravessa gerações</strong>
              <span className="mt-2 block text-xs text-minastra-paper/70 sm:text-sm">Hélio Gomes, no Sítio Lagoa</span>
            </figcaption>
          </figure>

          <figure className="group relative overflow-hidden rounded-3xl">
            <img
              {...foto("torrefacao")}
              sizes="(min-width: 1024px) 25vw, 50vw"
              alt="Processo de torrefação do café Minastra"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105 lg:aspect-auto lg:h-72"
            />
            <div className={GRADIENTE} />
            <figcaption className="absolute bottom-0 p-4 text-sm font-semibold text-minastra-paper sm:p-5">Torra cuidadosa</figcaption>
          </figure>

          <figure className="group relative overflow-hidden rounded-3xl">
            <VideoPreguicoso
              mp4={VIDEO_COLHEDEIRA.mp4}
              poster={VIDEO_COLHEDEIRA.poster}
              rotulo="Colheita no cafezal Minastra"
              className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105 lg:aspect-auto lg:h-72"
            />
            <div className={GRADIENTE} />
            <figcaption className="absolute bottom-0 p-4 text-sm font-semibold text-minastra-paper sm:p-5">Colheita no tempo certo</figcaption>
          </figure>

          <figure className="group relative col-span-2 overflow-hidden rounded-3xl">
            <img
              {...foto("trator")}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="Trabalho diário na propriedade Minastra"
              loading="lazy"
              className="h-52 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-64"
            />
            <div className={GRADIENTE} />
            <figcaption className="absolute bottom-0 p-5 text-sm font-semibold text-minastra-paper">O trabalho diário por trás de cada xícara</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
