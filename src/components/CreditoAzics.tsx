import { CRIADOR_DO_SITE } from "@/lib/seo";

// Linha discreta no fim do rodapé. O link é seguido (sem nofollow): conta como indicação da Azics.
export function CreditoAzics({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[11px] tracking-wide text-minastra-paper/35 ${className}`}>
      Site feito por{" "}
      <a href={CRIADOR_DO_SITE.url} target="_blank" rel="noopener" className="underline-offset-2 transition hover:text-minastra-paper/70 hover:underline">
        {CRIADOR_DO_SITE.nome}
      </a>
    </p>
  );
}
