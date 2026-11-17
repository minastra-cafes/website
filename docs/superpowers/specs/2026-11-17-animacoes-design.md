# Animações leves no site do Minastra

Data: 2026-11-17

## Intenção

O objetivo é chamar atenção para os cafés e para a origem, pensando primeiro no celular, **sem
atrapalhar o uso**. Hoje o site só tem efeitos de *hover*, que não existem no toque. O padrão é o
mesmo da Azics, para os projetos seguirem uma estrutura só.

## Metas

- Topo: o título entra palavra por palavra, "origem de verdade." ganha um brilho dourado que passa
  uma vez, depois entram o subtítulo, os botões e os números. A foto ao fundo faz um zoom bem lento.
- Cafés: os cartões entram em cascata ao rolar. Ao tocar, o cartão "afunda" levemente
  (`active:scale`), o que substitui o *hover* no celular.
- Seções (Origem, Qualidade, Avaliações, Bastidores, Chamada): o título e o texto sobem suavemente
  quando entram na tela.
- Origem: o selo "Alfenas · MG" desliza para o lugar.
- Avaliações: a média conta de 0 até o valor final e as estrelas se enchem quando a seção aparece.
- Produto: o total "pula" quando muda o peso ou a quantidade.

## Fora do escopo

- O pulso dos ícones ✦ ◇ ⌂ (pedido do usuário: "bem cara de IA").
- Bibliotecas de animação, como Motion, e animação ligada à rolagem (`animation-timeline`).

## Anti-metas

- Atrasar o carregamento: a foto do topo aparece desde o primeiro desenho da tela; o zoom só a move.
- Bloquear um toque ou esconder conteúdo de quem não tem JavaScript ou ativou "reduzir movimento".
- Animação em loop chamando atenção o tempo todo. A única contínua é o zoom lento da foto.

## Restrições

- Animar só `transform` e `opacity`, com no máximo 0,7 s por elemento (a contagem da média dura até
  0,9 s).
- Com "reduzir movimento" ativado, nada se move e a média aparece direto no valor final.
- Sem JavaScript, ou se ele não carregar em 3 s, nada fica escondido. É o mesmo truque da Azics: a
  classe `js` no `<html>`, retirada se o `Revelar` não sinalizar a tempo.
- Mobile primeiro: conferir a 375 px antes do desktop.

## Abordagens consideradas

1. **Padrão da Azics (escolhida):** CSS para a entrada do topo e o componente `Revelar`
   (`IntersectionObserver`) para o que aparece ao rolar. Pesa menos de 1 KB e é igual ao da Azics.
2. **Animação ligada à rolagem só com CSS:** não usa JavaScript, mas não funciona em parte dos
   iPhones nem no Firefox.
3. **Biblioteca Motion:** dá molas e gestos, mas acrescenta 30 a 40 KB e foge do padrão.

## Decisões minhas (podem ser corrigidas)

- **Estrutura:**
  - `src/components/Revelar.tsx` copia o da Azics: marca `data-visivel` e atrasa cada `[data-item]`
    em 90 ms.
  - Uma variante Tailwind `escondido` e as keyframes ficam no `globals.css`.
  - O script que põe a classe `js` entra no `layout.tsx`.
- **Título palavra por palavra,** e não linha por linha: as quebras de linha mudam com a largura da
  tela, e palavras com um atraso curto (cerca de 40 ms) dão o mesmo efeito de subir. O título
  continua sendo um único `h1`, com o texto inteiro para leitores de tela.
- **Brilho dourado:** um degradê que atravessa o texto uma vez, com `background-clip: text`.
- **Zoom da foto:** de 1 a 1,06 em cerca de 20 s, indo e voltando. Fica dentro do `overflow-hidden`
  que já existe.
- **Contador da média:** usa `requestAnimationFrame` e começa quando a seção entra na tela. O
  `aria-label` já traz o valor final.
- **Total do produto:** troca a `key` para refazer uma animação curta de "pulo".

## Testes

- `Revelar`: marca visível ao entrar na tela; sem `IntersectionObserver`, mostra direto.
- Contador: chega ao valor final; com "reduzir movimento", mostra o valor final sem animar.
- Título: o `h1` mantém o texto completo e o destaque dourado.
- Os testes atuais continuam passando, porque as animações não mudam o conteúdo.
- Conferência no navegador a 375 px e no desktop, incluindo o modo "reduzir movimento".
