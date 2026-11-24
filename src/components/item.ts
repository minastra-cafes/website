// Classe dos filhos de <Revelar> que entram em sequência (rótulo → título → texto). Marque o elemento
// também com `data-item`. O estado escondido só existe com `html.js` e sem "reduzir movimento".
// Fica fora de Revelar.tsx porque constantes de um módulo "use client" viram referências de cliente
// nos Server Components.
export const item =
  "motion-safe:transition-[opacity,translate] motion-safe:duration-[700ms] motion-safe:ease-saida motion-safe:escondido:translate-y-6 motion-safe:escondido:opacity-0";

// O mesmo, mas entrando de lado (o selo "Alfenas · MG" da Origem).
export const itemLateral =
  "motion-safe:transition-[opacity,translate] motion-safe:duration-[700ms] motion-safe:ease-saida motion-safe:escondido:translate-x-6 motion-safe:escondido:opacity-0";

// Os cafés chegam pela direita, um após o outro, inclinados, e assentam (carrossel da seção Cafés).
export const itemCarrossel =
  "motion-safe:transition-[opacity,translate,rotate] motion-safe:duration-[900ms] motion-safe:ease-saida motion-safe:escondido:translate-x-[60vw] motion-safe:escondido:rotate-6 motion-safe:escondido:opacity-0";

// Afunda levemente ao toque: no celular não há hover, e isso mostra que o elemento respondeu.
export const toque = "motion-safe:active:scale-[0.98]";
