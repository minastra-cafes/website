// Cinco estrelas, com a nota arredondada para a meia estrela mais próxima.
// rotulo: a nota lida pelo leitor de tela (a final), quando `nota` está animando.
export function Estrelas({ nota, rotulo = nota, className = "" }: { nota: number; rotulo?: number; className?: string }) {
  const meias = Math.round(nota * 2) / 2;
  const textoRotulo = `Nota ${rotulo.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} de 5`;

  return (
    <span role="img" aria-label={textoRotulo} className={`inline-flex gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((posicao) => {
        const preenchida = Math.min(1, Math.max(0, meias - (posicao - 1)));
        return (
          <span key={posicao} aria-hidden="true" className="relative inline-block leading-none">
            <span className="opacity-25">★</span>
            {preenchida > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${preenchida * 100}%` }}>
                ★
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
