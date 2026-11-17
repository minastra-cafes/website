# Animações leves — Plano de implementação

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para executar este plano tarefa por tarefa. Os passos usam checkbox (`- [ ]`).

**Objetivo:** animações leves que chamam atenção para os cafés e para a origem, pensando primeiro no celular, sem atrapalhar o uso.

**Arquitetura:** segue o padrão da Azics:
- CSS puro na entrada do topo, que começa no primeiro desenho da tela;
- o componente `Revelar` (`IntersectionObserver`) para o que aparece ao rolar: ele marca `data-visivel` no bloco, e cada filho com `data-item` sai do estado `escondido` com um atraso escalonado;
- o estado escondido só existe com a classe `js` no `<html>` e sem "reduzir movimento".

**Tecnologias:** Next 16 com export estático, React 19, Tailwind v4 (`@custom-variant`, `motion-safe:`) e Vitest. Sem nenhuma biblioteca nova.

**Spec:** `docs/superpowers/specs/2026-11-17-animacoes-design.md`

## Restrições globais

- Animar só `transform`/`translate`/`scale` e `opacity`, com no máximo 0,7 s por elemento. A contagem da média dura até 0,9 s.
- Toda animação fica dentro de `motion-safe:` ou de `@media (prefers-reduced-motion: no-preference)`. Com "reduzir movimento", nada se move.
- Sem JavaScript nada fica escondido. O script inline põe `js` no `<html>` e o retira em 3 s se `document.documentElement.dataset.revelarPronto` não tiver sido marcado pelo `Revelar`. É o mesmo código do `Azics/src/app/layout.tsx`.
- A foto do topo nunca começa com `opacity: 0`.
- Sem o pulso dos ícones ✦ ◇ ⌂.
- Mobile primeiro: conferir a 375 px antes de 1280 px.
- Commits só com um "sim" explícito do usuário para cada um. Os passos "Commit" são pedidos de autorização.

## Pontos de atenção na revisão

1. **Página aberta já rolada no meio** (link com `#avaliacoes`, ou voltar no navegador): os blocos já visíveis aparecem na hora, sem ficarem escondidos esperando rolagem. O `IntersectionObserver` dispara na montagem. Teste na Tarefa 1.
2. **Contador desmontado no meio da animação:** o `requestAnimationFrame` é cancelado e não há atualização de estado depois de desmontar. Teste na Tarefa 4.
3. **Título curto, sem destaque** (`dividirTitulo` devolve destaque vazio): nenhum `span` dourado vazio é renderizado e as palavras continuam animadas. Teste na Tarefa 2.
4. **Toque rápido seguido em vários pesos:** o total mostra sempre o valor certo, e a animação recomeça a cada troca sem acumular. Teste na Tarefa 5.
5. **Leitor de tela no título palavra por palavra:** o `h1` é lido como uma frase só, sem pausas entre `span`s, porque o `aria-label` do `h1` é o título inteiro. Teste na Tarefa 2.

---

### Tarefa 1: Base (`Revelar`, variante `escondido`, script `js`)

**Arquivos:**
- Criar: `src/components/Revelar.tsx` (copiar de `Azics/src/components/ui/Revelar.tsx`, com `ATRASO_MS = 90`)
- Criar: `src/components/item.ts` (a constante `item`, igual à da Azics, com `duration-[700ms]`)
- Alterar: `src/app/globals.css`, para incluir:
  - `@custom-variant escondido (html.js [data-revelar]:not([data-visivel]) &);`
  - `--ease-saida: cubic-bezier(0.16, 1, 0.3, 1);` no `@theme`
  - o `scroll-behavior: smooth` passa para dentro de `@media (prefers-reduced-motion: no-preference)`
- Alterar: `src/app/layout.tsx`, para pôr o `<Script id="js-ativo" strategy="beforeInteractive">` com o mesmo `scriptJs` da Azics e `suppressHydrationWarning` no `<html>`
- Testar: `src/components/Revelar.test.tsx`

**Interfaces:**
- Produz: `Revelar({ children, className }: { children: ReactNode; className?: string })`, que renderiza `<div data-revelar>` e marca `data-visivel` ao entrar na tela.
- Produz: `item: string`, a classe dos filhos marcados com `data-item`.

- [ ] **Passo 1: escrever os testes que falham** (`IntersectionObserver` simulado como no `VideoPreguicoso.test.tsx`):
  - `marca data-visivel quando entra na tela`: antes do callback, sem `data-visivel`; depois de `act(() => avisarVisivel())`, com `data-visivel`.
  - `atrasa cada data-item em 90 ms`: três filhos com `data-item` recebem `transitionDelay` de `0ms`, `90ms` e `180ms`.
  - `sem IntersectionObserver, mostra direto` (ponto 1): com `IntersectionObserver` indefinido, `data-visivel` aparece na montagem.
  - `sinaliza que está pronto`: `document.documentElement.dataset.revelarPronto` fica definido.
- [ ] **Passo 2: rodar e ver falhar.** Rode `npx vitest run src/components/Revelar.test.tsx`. Esperado: FAIL, porque o módulo ainda não existe.
- [ ] **Passo 3: implementar** o `Revelar`, o `item`, o CSS e o script no layout.
- [ ] **Passo 4: rodar e ver passar.** Rode `npx vitest run`. Esperado: todos passam.
- [ ] **Passo 5: pedir autorização para o commit** `feat: base das animações (Revelar e classe js)`.

### Tarefa 2: Topo

**Arquivos:**
- Alterar: `src/components/sections/Inicio.tsx`
- Alterar: `src/app/globals.css`, com as keyframes dentro de `@media (prefers-reduced-motion: no-preference)`:
  - `subir-palavra`: de `translate: 0 0.6em; opacity: 0` até o normal, em 0,6 s;
  - `entrar`: de `translate: 0 1rem; opacity: 0`, em 0,7 s;
  - `brilho`: o `background-position` de um degradê dourado→creme→dourado com `background-clip: text`, uma vez, em 0,7 s, começando depois da última palavra;
  - `zoom-lento`: `scale` de 1 a 1,06 em 20 s, `alternate infinite`.
- Testar: `src/components/sections/Inicio.test.tsx`

**Interfaces:**
- Consome: `useConteudo().titulo` e `dividirTitulo(titulo)` (já existem).
- Produz: no `h1`, cada palavra é um `<span aria-hidden="true" class="palavra">` com `style={{ animationDelay: \`${indice * 40}ms\` }}`, e o `h1` leva `aria-label={titulo}`.

- [ ] **Passo 1: escrever os testes que falham:**
  - `o h1 é lido como a frase inteira` (ponto 5): `getByRole("heading", { level: 1, name: "Café especial com origem de verdade." })`.
  - `cada palavra entra com 40 ms a mais que a anterior`: as palavras do título padrão, que são 6, têm `animationDelay` de 0, 40, 80, 120, 160 e 200 ms.
  - `as três últimas palavras ficam no destaque dourado`: o elemento `.text-minastra-gold` contém "origem de verdade.".
  - `título curto não cria destaque vazio` (ponto 3): com o título "Cafés especiais" no provedor, não existe `.text-minastra-gold`, e as 2 palavras continuam com `.palavra`.
- [ ] **Passo 2: rodar e ver falhar.**
- [ ] **Passo 3: implementar.**
  - O subtítulo, os botões e os números usam a animação `entrar`, com atrasos de 300, 400 e 500 ms.
  - A `<img>` da foto do topo recebe `motion-safe:animate-[zoom-lento_20s_ease-in-out_infinite_alternate]`. A opacidade não muda.
  - O destaque recebe a animação `brilho`, com `animation-delay` igual ao atraso da última palavra mais 0,6 s.
- [ ] **Passo 4: rodar e ver passar.** Rode `npx vitest run`.
- [ ] **Passo 5: conferir no navegador** a 375 px: o título entra em menos de 1 s e a foto aparece desde o início.
- [ ] **Passo 6: pedir autorização para o commit** `feat: entrada animada do topo`.

### Tarefa 3: Seções ao rolar, cartões em cascata, toque e selo da Origem

**Arquivos:**
- Alterar: `src/components/sections/Cafes.tsx`, `Origem.tsx`, `Qualidade.tsx`, `Bastidores.tsx` e `Chamada.tsx`.
- Alterar: `src/components/avaliacoes/Avaliacoes.tsx`. Só envolve o cabeçalho; a contagem fica para a Tarefa 4.
- Testar: `src/components/sections/revelar-secoes.test.tsx`

**Interfaces:**
- Consome: `Revelar` e `item` da Tarefa 1.

- [ ] **Passo 1: escrever o teste que falha:** `cada seção tem um bloco Revelar com itens`. Para Cafés, Origem, Qualidade, Bastidores e Chamada, `container.querySelector("[data-revelar] [data-item]")` não pode ser nulo. Em Cafés há 3 cartões com `data-item` dentro do mesmo `[data-revelar]`.
- [ ] **Passo 2: rodar e ver falhar.**
- [ ] **Passo 3: implementar.**
  - Em cada seção, o rótulo, o `h2` e o parágrafo são `data-item` com a classe `item` dentro de um `Revelar`.
  - Os cartões de café ficam num `Revelar` próprio, também com `data-item` e `item`, o que dá a cascata de 90 ms.
  - Os cartões de café, os botões dourados e os botões de peso do produto ganham `motion-safe:active:scale-[0.98] motion-safe:transition-transform`.
  - O selo "Alfenas · MG" é um `data-item` com `motion-safe:escondido:translate-x-6` no lugar do `translate-y`.
- [ ] **Passo 4: rodar e ver passar.** Rode `npx vitest run`.
- [ ] **Passo 5: conferir no navegador** a 375 px: ao rolar, cada bloco entra uma vez. Abrir direto em `/#avaliacoes` mostra a seção sem esperar.
- [ ] **Passo 6: pedir autorização para o commit** `feat: seções e cartões entram ao rolar`.

### Tarefa 4: Avaliações (média contando, estrelas enchendo)

**Arquivos:**
- Criar: `src/components/avaliacoes/useContagem.ts`
- Alterar: `src/components/avaliacoes/Avaliacoes.tsx` e `Estrelas.tsx`
- Testar: `src/components/avaliacoes/useContagem.test.tsx`

**Interfaces:**
- Produz: `useContagem(final: number, iniciar: boolean, duracaoMs = 900): number`.
  - Vai de 0 até `final` com `requestAnimationFrame` e *ease-out* depois que `iniciar` vira `true`.
  - Com "reduzir movimento" (`matchMedia`), ou sem `requestAnimationFrame`, devolve `final` direto.
  - Cancela o quadro pendente ao desmontar.
- Produz: o prop `animar?: boolean` em `Estrelas`. Quando `true`, a largura das estrelas cheias usa `motion-safe:transition-[width] duration-700` a partir de `0%`.

- [ ] **Passo 1: escrever os testes que falham** (`renderHook`, com `requestAnimationFrame` e `performance.now` simulados por `vi.useFakeTimers()`):
  - `fica em 0 até começar`;
  - `chega ao valor final em 900 ms`: depois de `iniciar=true` e de avançar 900 ms, devolve 5;
  - `com reduzir movimento, devolve o final na hora`;
  - `cancela o quadro ao desmontar` (ponto 2): `cancelAnimationFrame` é chamado no `unmount`.
- [ ] **Passo 2: rodar e ver falhar.**
- [ ] **Passo 3: implementar.**
  - Em `Avaliacoes`, a média exibida é `useContagem(media, visivel)`, formatada com uma casa. `visivel` vem de um `IntersectionObserver` no `section`, ou de `true` se ele não existir.
  - O `strong` da média leva `aria-label` com o valor final.
  - `Estrelas` recebe `animar={visivel}`.
- [ ] **Passo 4: rodar e ver passar.** Rode `npx vitest run`. Os testes atuais de `Avaliacoes` continuam passando: no jsdom não há `IntersectionObserver`, então `visivel` vale `true`, e o `matchMedia` ausente leva a mostrar o valor final.
- [ ] **Passo 5: pedir autorização para o commit** `feat: média e estrelas animadas nas avaliações`.

### Tarefa 5: Total do produto pula

**Arquivos:**
- Alterar: `src/components/produto/CompraProduto.tsx`
- Alterar: `src/app/globals.css`, com a keyframe `pulo`: `scale` 1 → 1,08 → 1 em 0,3 s, dentro de `no-preference`.
- Testar: `src/components/produto/CompraProduto.test.tsx`

- [ ] **Passo 1: escrever o teste que falha** (ponto 4): `o total recomeça a animação a cada troca`.
  - Guardar o nó `getByTestId("total")`.
  - Clicar em "250g" e depois em "500g" rapidamente.
  - O nó atual é diferente do guardado (uma `key` nova), tem a classe `motion-safe:animate-[pulo_300ms_ease-out]` e o texto `R$ 48,00`.
- [ ] **Passo 2: rodar e ver falhar.**
- [ ] **Passo 3: implementar.** O `strong` do total (desktop e barra do celular) usa `key={\`${peso}-${pacotes}\`}` e a classe da animação.
- [ ] **Passo 4: rodar e ver passar.** Rode `npx vitest run`, `npm run lint` e `npx tsc --noEmit`.
- [ ] **Passo 5: conferência final no navegador.** Gere o build e sirva o `out/`.
  - A 375 px: topo, rolagem até o fim, um produto e trocas de peso.
  - A 1280 px: o mesmo.
  - O console sem erros novos.
  - As alturas das seções iguais às de antes: `[731,79,2139,1029,1046,618,1161,552,184]` a 375 px.
- [ ] **Passo 6: pedir autorização para o commit** `feat: total do produto pula ao mudar`.
