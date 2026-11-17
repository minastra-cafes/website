# Site do Minastra em React — Plano de implementação

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para executar este plano tarefa por tarefa. Os passos usam checkbox (`- [ ]`).

**Objetivo:** reescrever o site do Minastra (o que está no `origin/main`) em Next 16 estático, com o mesmo visual, e incluir uma seção de avaliações que vem de `GET /public/sites/minastra/avaliacoes`.

**Arquitetura:** Next 16 com `output: "export"` e `basePath: "/website"`, publicado no GitHub Pages. O conteúdo do Minastra fica fixo em `src/data`. A seção de avaliações e o cliente da API não sabem nada do Minastra: recebem o slug e a URL da API por configuração. As avaliações são buscadas no navegador, depois que a página carrega.

**Tecnologias:** Next 16.4.3, React 19.3.0, TypeScript 5, Tailwind v4 (`@tailwindcss/turbopack`), Vitest 5 + Testing Library + jsdom. As mesmas versões do `Azics/package.json`.

**Spec:** `docs/superpowers/specs/2026-11-17-minastra-react-design.md`. Leia junto com este plano.

## Restrições globais

- **Base:** o branch novo `feat/react` sai do `origin/main` (commit `cf3d35c`), de preferência num worktree. As alterações locais sem commit (`index2.html`, `produto.html`, as imagens apagadas e as novas) não podem ser tocadas.
- **Commits:** cada commit só acontece com um "sim" explícito do usuário para aquele commit. Os passos "Commit" deste plano são pedidos de autorização.
- **Next 16:** antes de escrever código, leia o guia correspondente em `node_modules/next/dist/docs/` e siga os avisos de descontinuação. Nas rotas dinâmicas, `params` é uma `Promise`.
- **Mesma configuração do `Azics/`:** copie `vitest.config.ts` (sem o `exclude` do painel), `vitest.setup.ts`, `tsconfig.json` (sem o `exclude` do painel), `eslint.config.mjs` (sem o ignore do painel) e o bloco `turbopack.rules` do `next.config.ts`. Os scripts de `package.json` são `dev`, `build`, `start`, `lint` e `test`.
- **`next.config.ts`:** `output: "export"`, `basePath: "/website"`, `trailingSlash: true` e `images: { unoptimized: true }`.
- **basePath nas imagens:** um `<img src="/images/...">` puro não recebe o `/website`. Toda imagem usa `next/image` ou passa pelo helper `caminhoPublico()` da Tarefa 1.
- **Visual idêntico ao `origin/main`:** cada classe Tailwind do HTML é mantida como está. As cores, sombras e a fonte de título do `tailwind.config` inline viram `@theme` no `globals.css`: `--color-minastra-espresso: #251711`, `brown #6f2f1f`, `clay #a35f3c`, `gold #d3aa5c`, `cream #f3eadc`, `paper #fffaf2`, `leaf #183f2a`, `moss #2e5a38`, `--shadow-soft: 0 20px 60px rgba(37,23,17,.10)`, `--shadow-card: 0 14px 40px rgba(37,23,17,.12)` e `--font-display: Georgia, "Times New Roman", serif`. Também entram no CSS as classes `.brand` e `.surface`, e o `scroll-behavior: smooth`. Copie do `<style>` do `products2.html` as classes que ele define a mais (por exemplo, `font-serifbrand`).
- **Fontes:** Inter (400, 500, 600 e 700) e Alegreya SC (500 e 600) vêm do `next/font/google`.
- **Mobile primeiro:** cada tela é conferida a 375 px antes de 1280 px.
- **Sem pastas vazias:** só crie pastas que já tenham arquivo.
- **Configuração:** `NEXT_PUBLIC_API_URL=https://api.azics.com.br` e `NEXT_PUBLIC_SITE_SLUG=minastra` ficam em `.env.example` e no workflow.
- **Textos de interface em português do Brasil.**

## Pontos de atenção na revisão

1. **Nota fracionada ou média nula:** uma nota 4,5 mostra quatro estrelas e meia, e `media: null` não quebra nada (a seção some, porque não há avaliações). Teste na Tarefa 4.
2. **O "Ver mais" falha na página 2:** as avaliações já mostradas continuam na tela e o botão vira "Tentar de novo". A seção não some. Teste na Tarefa 4.
3. **Uma avaliação nova entra durante a paginação:** os itens se deslocam e a página 2 repete um item da página 1. Itens com o mesmo `id` não aparecem duas vezes. Teste na Tarefa 4.
4. **A `foto_url` não carrega (link do Google expirado):** o cartão volta para a inicial do nome. Teste na Tarefa 4.
5. **Quantidade vazia, 0 ou negativa na página de produto:** a quantidade vira 1 e o total e a mensagem do WhatsApp nunca ficam com `NaN`. Teste na Tarefa 2.

---

### Tarefa 1: Base do projeto e página inicial

**Arquivos:**
- Criar: `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `.gitignore` (`node_modules`, `.next`, `out`, `.env*.local`), `.env.example`
- Criar: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Criar: `src/lib/caminho.ts`, `src/data/site.ts`
- Criar: `src/components/Header.tsx`, `src/components/Footer.tsx`
- Criar: `src/components/sections/Inicio.tsx`, `Diferenciais.tsx`, `Cafes.tsx`, `Origem.tsx`, `Qualidade.tsx`, `Bastidores.tsx`, `Chamada.tsx`
- Mover com `git mv` para `public/`: `images/`, `favicon.png`, `logo.png` e `google7948c07e85a67e36.html`
- Apagar com `git rm`: `index.html` e `scripts/` (o `index.html` atual não usa nenhum carrossel)
- Testar: `src/app/page.test.tsx`, `src/lib/caminho.test.ts`

**Interfaces:**
- Produz: `caminhoPublico(caminho: string): string`, que junta `"/website"` a um caminho começado por `/`.
- Produz: `SITE` em `src/data/site.ts`, com `{ url: "https://minastra-cafes.github.io/website", nome: "Minastra Cafés Especiais", whatsapp: "5535999131028", instagram: "https://www.instagram.com/minastra_cafes" }`.
- Produz: o `<section id="qualidade">` em `Qualidade.tsx`. A Tarefa 4 coloca a seção de avaliações logo depois dele, no `page.tsx`.
- Produz: os cartões em `Cafes.tsx` apontam para `/produto/<id>/` com `next/link`, onde `id` é `bronze`, `ouro` ou `ouro-graos`.

- [ ] **Passo 1: escrever os testes que falham.**
  - `caminho.test.ts`: `caminhoPublico("/logo.png")` deve ser `"/website/logo.png"`.
  - `page.test.tsx`: renderizar `<Home />` e conferir:
    - o `h1` contém "origem de verdade.";
    - existem os `h2` "Um Minastra para cada momento.", "Você sabe de onde vem o seu café.", "Especial sem ser complicado.", "Café feito por pessoas, não por atalhos." e "Descubra o sabor das montanhas de Minas.";
    - o menu tem os links `#cafes`, `#origem` e `#qualidade`;
    - os três cartões de café têm `href` `/produto/bronze/`, `/produto/ouro/` e `/produto/ouro-graos/`.
- [ ] **Passo 2: rodar e ver falhar.** Rode `npx vitest run`. Esperado: FAIL, porque os módulos ainda não existem.
- [ ] **Passo 3: montar a base.** Crie os arquivos de configuração (ver Restrições globais) e instale as dependências com `npm install`.
- [ ] **Passo 4: implementar o layout.** O `layout.tsx` tem `lang="pt-BR"` e as fontes. O `metadata` traz o `title`, a `description`, o `robots`, o `authors`, o Open Graph, o Twitter e o `canonical`, todos copiados do `<head>` do `origin/main:index.html`. Também entram o `viewport` com `themeColor: "#251711"` e o JSON-LD `Organization`, renderizado como `<script type="application/ld+json">`.
- [ ] **Passo 5: implementar as seções.** Cada `<section>` do `origin/main:index.html` vira um componente, com as classes copiadas uma a uma, os mesmos textos e os mesmos `alt`, `width`, `height` e `loading`.
- [ ] **Passo 6: rodar e ver passar.** Rode `npx vitest run` e `npm run lint`. Esperado: PASS, sem erros.
- [ ] **Passo 7: comparar o visual.** Rode `npm run build` e sirva a pasta `out/`, com cada URL começando por `/website/`. Por exemplo, copie `out/` para `<pasta temporária>/website` e sirva a pasta temporária. Compare capturas a 375 px e a 1280 px com https://minastra-cafes.github.io/website/. Esperado: nenhuma diferença visível, o console sem erros e nenhuma imagem com 404.
- [ ] **Passo 8: pedir autorização para o commit** `feat: site do Minastra em Next com a página inicial`.

### Tarefa 2: Página de produto, links antigos e SEO

**Arquivos:**
- Criar: `src/data/produtos.ts`, que substitui o `products.json` (apague-o com `git rm`)
- Criar: `src/lib/pedido.ts`
- Criar: `src/app/produto/[id]/page.tsx`, `src/components/produto/CompraProduto.tsx` (`"use client"`)
- Criar: `src/app/not-found.tsx`, baseado no bloco `#erro` do `products2.html`
- Criar: `src/app/sitemap.ts`, `src/app/robots.ts`, ambos com `export const dynamic = "force-static"` (apague o `sitemap.xml` e o `robots.txt`)
- Trocar: `products2.html` por `public/products2.html` (redirecionamento)
- Testar: `src/lib/pedido.test.ts`, `src/components/produto/CompraProduto.test.tsx`, `src/app/produto/[id]/page.test.ts`, `src/app/sitemap.test.ts`

**Interfaces:**
- Consome: `SITE` e `caminhoPublico()` da Tarefa 1.
- Produz: `type Produto = { id: string; nome: string; torra: string; descricao: string; fotos: string[]; pesoValores: Record<string, number> }`.
- Produz: `PRODUTOS: Produto[]`, com os mesmos dados do `products.json`. Cada foto é um caminho começado por `/images/`.
- Produz: `calcularTotal(produto: Produto, peso: string, quantidade: number): number`.
- Produz: `montarMensagemPedido(produto: Produto, peso: string, quantidade: number): string`.
- Produz: `montarLinkWhatsApp(mensagem: string): string`.

- [ ] **Passo 1: escrever os testes que falham.**
  - `pedido.test.ts`:
    - `calcularTotal(ouro, "500", 2)` é `96`.
    - Com quantidade `0`, `-3` ou `NaN`, a conta usa 1, e `calcularTotal(ouro, "500", 0)` é `48`.
    - `montarMensagemPedido(ouro, "500", 1)` é exatamente:
      ```
      "Olá! Tudo bem?\n\nGostaria de pedir 1 pacote do Linha Ouro, de 500g.\nO valor mostrado no site foi R$ 48,00.\n\nVocês poderiam confirmar a disponibilidade e me informar o valor da entrega, por favor?"
      ```
      O `R$ 48,00` usa espaço sem quebra, que é o que o `toLocaleString` gera.
    - Com 2 pacotes, a mensagem diz "2 pacotes".
    - `montarLinkWhatsApp("a b")` é `"https://wa.me/5535999131028?text=a%20b"`.
  - `page.test.ts`: `generateStaticParams()` é `[{ id: "bronze" }, { id: "ouro" }, { id: "ouro-graos" }]`, e o arquivo exporta `dynamicParams = false`.
  - `CompraProduto.test.tsx`:
    - Começa no último peso (`500`).
    - Clicar em "250g" muda o total para `R$ 25,00`.
    - O "+" sobe a quantidade e o total. O "−" não desce de 1.
    - Apagar o campo de quantidade e sair dele deixa `1`.
    - Os dois links do WhatsApp (desktop e celular) têm o `href` de `montarLinkWhatsApp(montarMensagemPedido(...))`.
    - Clicar numa miniatura troca a foto principal.
  - `sitemap.test.ts`: a lista tem `https://minastra-cafes.github.io/website/` e `.../produto/bronze/`, `.../produto/ouro/` e `.../produto/ouro-graos/`, e nenhum `products2.html`.
- [ ] **Passo 2: rodar e ver falhar.** Rode `npx vitest run`. Esperado: FAIL.
- [ ] **Passo 3: implementar os dados e o pedido.** Escreva `produtos.ts` e `pedido.ts`. A moeda sai de `toLocaleString("pt-BR", { style: "currency", currency: "BRL" })`.
- [ ] **Passo 4: implementar a página de produto.**
  - `produto/[id]/page.tsx` faz o HTML do `products2.html` (cabeçalho, trilha, galeria, compra e barra fixa no celular) sem `fetch`. O produto sai de `PRODUTOS`, e a parte interativa fica em `CompraProduto`.
  - `generateMetadata` refaz o que o `renderizarProduto()` fazia, com a URL `${SITE.url}/produto/<id>/`:
    - title: `<nome> | Minastra Cafés Especiais`;
    - og/twitter title: `<nome> | Café especial Minastra`;
    - description: `<descricao> Café 100% arábica produzido em Alfenas, Sul de Minas.`;
    - canonical, og:url e imagem.
  - O JSON-LD `Product` vai renderizado na página, com uma `Offer` por peso e `price` com 2 casas.
- [ ] **Passo 5: implementar o `not-found.tsx`.** Ele é o bloco `#erro` do `products2.html`, com o mesmo texto e o link "Ver produtos" para `/#cafes`.
- [ ] **Passo 6: implementar o redirecionamento.** O `public/products2.html` é um HTML mínimo com `<meta name="robots" content="noindex">`, e um script. Ele não leva `canonical`: como é um HTML fixo, não sabe qual é o produto. Quem diz ao Google o endereço novo é o `canonical` da página de destino, junto com o sitemap.
  - O script lê `?produto=`. Se o id for `bronze`, `ouro` ou `ouro-graos`, faz `location.replace("/website/produto/<id>/")`; senão, `location.replace("/website/#cafes")`.
  - Dentro de `<noscript>` vai um link para a página inicial.
- [ ] **Passo 7: rodar e ver passar.** Rode `npx vitest run`, `npm run lint` e `npm run build`. Esperado: PASS. O `out/` tem `produto/bronze/index.html`, `produto/ouro/index.html`, `produto/ouro-graos/index.html`, `products2.html`, `sitemap.xml`, `robots.txt` e `404.html`.
- [ ] **Passo 8: comparar o visual.** Sirva o `out/` como na Tarefa 1 e compare `/website/produto/ouro/` com `https://minastra-cafes.github.io/website/products2.html?produto=ouro`, a 375 px e a 1280 px. Abra também `/website/products2.html?produto=bronze` e veja que cai em `/website/produto/bronze/`.
- [ ] **Passo 9: pedir autorização para o commit** `feat: páginas de produto estáticas e redirecionamento dos links antigos`.

### Tarefa 3: Cliente da API da Azics

**Arquivos:**
- Criar: `src/lib/azics.ts`
- Testar: `src/lib/azics.test.ts`

**Interfaces:**
- Produz:
  ```ts
  type AvaliacaoPublica = { id: number; nome: string; foto_url: string | null; nota: number; texto: string; atualizada_em: string };
  type PaginaDeAvaliacoes = { itens: AvaliacaoPublica[]; total: number; pagina: number; tamanho: number; media: number | null };
  ```
- Produz: `buscarAvaliacoes(slug: string, pagina: number): Promise<PaginaDeAvaliacoes | null>`. Faz `GET ${NEXT_PUBLIC_API_URL}/public/sites/${encodeURIComponent(slug)}/avaliacoes?pagina=${pagina}`. Devolve `null` em qualquer resposta que não seja 2xx, em falha de rede e em JSON inválido. Nunca lança erro.
- Produz: `temProximaPagina(pagina: PaginaDeAvaliacoes): boolean`, que é `pagina.pagina * pagina.tamanho < pagina.total`.
- Produz: `montarLinkAvaliar(slug: string): string`, que é `https://painel.azics.com.br/avaliar?site=${encodeURIComponent(slug)}`.

- [ ] **Passo 1: escrever os testes que falham** (`fetch` simulado com `vi.stubGlobal`, `NEXT_PUBLIC_API_URL` com `vi.stubEnv`):
  - Chama a URL exata `https://api.azics.com.br/public/sites/minastra/avaliacoes?pagina=2`.
  - Com 200, devolve o corpo.
  - Com 404 `avaliacoes_desligadas`, com 500, com `fetch` rejeitado e com `json()` rejeitado, devolve `null`.
  - `temProximaPagina` com `{ pagina: 1, tamanho: 10, total: 10 }` é `false`, e com `total: 11` é `true`.
  - `montarLinkAvaliar("minastra")` é `"https://painel.azics.com.br/avaliar?site=minastra"`.
- [ ] **Passo 2: rodar e ver falhar.** Rode `npx vitest run src/lib/azics.test.ts`. Esperado: FAIL.
- [ ] **Passo 3: implementar `azics.ts`.**
- [ ] **Passo 4: rodar e ver passar.** Rode `npx vitest run src/lib/azics.test.ts`. Esperado: PASS.
- [ ] **Passo 5: pedir autorização para o commit** `feat: cliente das avaliações públicas da Azics`.

### Tarefa 4: Seção de avaliações

**Arquivos:**
- Criar: `src/components/avaliacoes/Avaliacoes.tsx` (`"use client"`), `CartaoAvaliacao.tsx`, `Estrelas.tsx`, `src/lib/dataRelativa.ts`
- Alterar: `src/app/page.tsx`, para pôr `<Avaliacoes slug={process.env.NEXT_PUBLIC_SITE_SLUG!} nomeNegocio="Minastra" />` entre `<Qualidade />` e `<Bastidores />`
- Testar: `src/components/avaliacoes/Avaliacoes.test.tsx`, `src/lib/dataRelativa.test.ts`

**Interfaces:**
- Consome: `buscarAvaliacoes`, `temProximaPagina`, `montarLinkAvaliar` e os tipos da Tarefa 3.
- Produz: `Avaliacoes({ slug, nomeNegocio }: { slug: string; nomeNegocio: string })`. Não importa nada de `src/data`, para poder ser copiada para o próximo cliente.
- Produz: `formatarDataRelativa(iso: string, agora?: Date): string`. Usa `Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" })`: dias abaixo de 30, meses abaixo de 365 dias e anos acima disso.

- [ ] **Passo 1: escrever os testes que falham.**
  - `dataRelativa.test.ts`, com `agora = 2026-11-17T12:00:00Z`:
    - `"2026-11-17T09:00:00Z"` dá `"hoje"`;
    - `"2026-11-14T12:00:00Z"` dá `"há 3 dias"`;
    - `"2026-09-17T12:00:00Z"` dá `"há 2 meses"`;
    - `"2024-11-17T12:00:00Z"` dá `"há 2 anos"`.
  - `Avaliacoes.test.tsx` (`buscarAvaliacoes` simulado com `vi.mock`):
    - Enquanto a busca não termina, não existe `section#avaliacoes`.
    - Com `null`, `itens: []` ou `media: null`, não existe `section#avaliacoes`.
    - Com 1 item (`nome: "Augusto O."`, `nota: 5`, `media: 5`, `total: 1`), mostra `5,0`, "1 avaliação", o nome, o texto, "hoje" e um link "Avalie a Minastra" com `href` `https://painel.azics.com.br/avaliar?site=minastra`, `target="_blank"` e `rel="noopener noreferrer"`.
    - Com `total: 12`, mostra "12 avaliações".
    - Com a nota 4,5, as estrelas têm `aria-label` "Nota 4,5 de 5".
    - Com `total: 11`, aparece "Ver mais". O clique chama `buscarAvaliacoes("minastra", 2)` e junta os itens. Um `id` que já estava na tela não aparece de novo, e o botão some quando não há próxima página.
    - Se a página 2 devolve `null`, os itens da página 1 continuam e o botão vira "Tentar de novo". O clique nele chama a página 2 de novo.
    - Com `foto_url` preenchida, aparece a `<img>`. Depois de um `fireEvent.error` nela, aparece a inicial "A" no lugar.
    - Um texto de 300 caracteres sem espaço usa a classe `break-words`.
- [ ] **Passo 2: rodar e ver falhar.** Rode `npx vitest run src/components/avaliacoes src/lib/dataRelativa.test.ts`. Esperado: FAIL.
- [ ] **Passo 3: implementar `formatarDataRelativa`, `Estrelas`, `CartaoAvaliacao` e `Avaliacoes`.**
  - A nota é arredondada para a meia estrela mais próxima.
  - A média aparece com `toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })`.
  - A busca acontece num `useEffect`.
  - No celular os cartões ficam empilhados; no desktop (`lg`), em 3 colunas.
  - Fundo, títulos, rótulo e botão seguem o padrão das outras seções: `bg-minastra-cream` ou `paper`, `font-display`, o rótulo em maiúsculas e o botão no estilo do "Encontrar meu café".
  - A foto do Google é uma `<img>` com `referrerPolicy="no-referrer"`, que é o que mantém a `lh3.googleusercontent.com` carregando.
- [ ] **Passo 4: rodar e ver passar.** Rode `npx vitest run` e `npm run lint`. Esperado: PASS.
- [ ] **Passo 5: conferir com a produção.** Use `npm run dev` com `.env.local` copiado do `.env.example` e abra `http://localhost:3000/website/`, primeiro a 375 px e depois a 1280 px. Esperado: a seção mostra "Augusto O.", 5,0 e "1 avaliação", e o console fica sem erro de CORS. Teste também com `NEXT_PUBLIC_SITE_SLUG=nao-existe`: a seção some e nada mais muda na página.
- [ ] **Passo 6: pedir autorização para o commit** `feat: seção de avaliações servida pela API da Azics`.

### Tarefa 5: Deploy no GitHub Pages

**Arquivos:**
- Alterar: `.github/workflows/deploy.yml`
- Alterar: `README.md` (criar se não existir), com como rodar, testar, publicar e as duas variáveis de configuração

- [ ] **Passo 1: montar o workflow.** O job `build` faz `actions/checkout@v4`, `actions/setup-node@v4` (Node 22, `cache: npm`), `npm ci`, `npm test`, `npm run lint`, `npm run build` (com `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_SITE_SLUG` em `env`), `actions/configure-pages@v5` e `actions/upload-pages-artifact@v3` com `path: out`. O job `deploy` continua como está.
- [ ] **Passo 2: conferir localmente.** Rode `npm ci && npm test && npm run lint && npm run build`. Esperado: tudo passa e existem `out/index.html`, `out/google7948c07e85a67e36.html`, `out/favicon.png` e `out/images/sobre/serras_cafe.png`. A busca `grep -r '"/images/' out/*.html out/produto` não pode encontrar nenhum caminho sem `/website`.
- [ ] **Passo 3: pedir autorização para o commit** `ci: publicar o build do Next no GitHub Pages`.
- [ ] **Passo 4: pedir autorização para o push e a PR.** Depois do merge, abra https://minastra-cafes.github.io/website/ e confira a página inicial, um produto, `products2.html?produto=ouro` e a seção de avaliações, a 375 px e a 1280 px.
