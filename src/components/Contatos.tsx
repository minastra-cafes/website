"use client";

import { useConteudo } from "@/components/ConteudoProvider";
import { montarLinkWhatsApp } from "@/lib/pedido";

// A mesma mensagem do botão "saber mais" do site antigo.
const MENSAGEM_CONTATO = "Olá, gostaria de saber mais sobre os cafés Minastra!";

function IconeInstagram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconeWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3c.2-.5.2-1 .2-1.1-.1-.1-.2-.2-.5-.3Z" />
    </svg>
  );
}

const LINK = "inline-flex min-h-9 items-center gap-2 rounded-full border border-minastra-paper/20 px-3 text-xs font-semibold text-minastra-paper/80 transition hover:border-minastra-gold hover:text-minastra-gold";

// Instagram e WhatsApp lado a lado, no rodapé da inicial e da página de produto.
export function Contatos({ className = "" }: { className?: string }) {
  const { instagram, celular } = useConteudo();
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {instagram && (
        <a href={instagram} target="_blank" rel="noopener noreferrer" className={LINK}>
          <IconeInstagram />
          Instagram
        </a>
      )}
      <a href={montarLinkWhatsApp(MENSAGEM_CONTATO, celular)} target="_blank" rel="noopener noreferrer" className={LINK}>
        <IconeWhatsApp />
        WhatsApp
      </a>
    </div>
  );
}
