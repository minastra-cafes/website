# Site do Minastra em React, com as avaliações da API da Azics

Data: 2026-11-17

## Intenção

Hoje o site do Minastra (https://minastra-cafes.github.io/website/) é HTML puro, com o Tailwind e o
JavaScript carregados por CDN. Ele vai passar a usar a mesma estrutura dos projetos da Azics, para que
todos os projetos sigam um padrão só. O Minastra também é o **primeiro cliente servido pela API da
Azics**, então este repositório serve de molde para os próximos sites de clientes.

A mudança é só técnica. O visual tem que continuar igual ao que está no ar. O único conteúdo novo é
uma **seção de avaliações** que vem de `GET /public/sites/{slug}/avaliacoes`.

## Metas

- O site é reescrito em Next 16 com `output: "export"`, React 19, TypeScript, Tailwind v4 e Vitest,
  com a mesma configuração do `Azics/` (o site institucional, não o painel).
- As páginas ficam iguais às que estão no ar no `origin/main` (commit `cf3d35c`): `index.html` e
  `products2.html` com `products.json`. Fica igual em cores, fontes, espaçamentos, textos, imagens e
  links do WhatsApp e do Instagram.
- Entra uma seção de avaliações com a média, as avaliações visíveis e um botão para avaliar.
- O deploy continua no GitHub Pages, em `/website/`.
- O que é do Minastra (textos, produtos, cores) fica separado do que serve para qualquer cliente
  (o cliente da API e a seção de avaliações). Assim, o próximo cliente só copia e troca o conteúdo.

## Fora do escopo

- Ler da API o título, os produtos, o Sobre, as perguntas ou as unidades. Isso continua fixo no código.
- Trazer a versão local sem commit (`index.html` local, `index2.html` e `produto.html`). A base é o
  que está no GitHub.
- Domínio próprio, mudanças de texto ou redesenho.

## Anti-metas (o que conta como fracasso)

- Mudar o visual: a página nova tem que ficar idêntica à atual, a 375 px e no desktop.
- Uma falha ou lentidão da API quebrar ou atrasar o resto da página.
- Quebrar os links já divulgados: `.../website/` e `.../website/products2.html?produto=ouro`.
- Perder no deploy o SEO que já existe: as meta tags, Open Graph, JSON-LD, `robots.txt`, `sitemap.xml`
  e o arquivo de verificação do Google (`google7948c07e85a67e36.html`).

## Restrições

- **Git:** o `main` local está atrás do `origin/main` e tem alterações sem commit (`index2.html`,
  `produto.html`, imagens apagadas e imagens novas). O trabalho começa de um branch novo a partir do
  `origin/main` (de preferência num worktree), sem mexer nessas alterações locais. Só faço commits com
  autorização explícita.
- **Next 16 mudou bastante:** antes de escrever código, ler `node_modules/next/dist/docs/` (ver
  `Azics/AGENTS.md`).
- **Mobile primeiro:** cada tela é feita e conferida a 375 px antes do desktop.
- **Sem pastas vazias:** não criar pastas ou arquivos de estrutura que ainda não têm uso.
- **API:** a rota pública já libera CORS para qualquer origem, aceita só `GET`, tem cache de 60 s e
  retorna 10 itens por página no formato `{ itens, total, pagina, ..., media }`. Ela responde
  `404 site_nao_encontrado` ou `404 avaliacoes_desligadas`. Cada item tem
  `{ id, nome ("Mariana S."), foto_url, nota, texto, atualizada_em }`. Os campos de paginação exatos
  estão em `Azics-back/src/azics_api/shared/schemas/pagina.py`.

## Abordagens consideradas

1. **Next estático, avaliações buscadas no navegador** (escolhida). Uma avaliação nova aparece em até
   1 minuto sem publicar o site de novo, e é a forma mais simples de copiar para o próximo cliente.
   A troca é que o Google não lê as avaliações.
2. **Next estático, avaliações buscadas no build.** O Google leria as avaliações, mas uma avaliação
   nova só apareceria depois de publicar de novo, o que exigiria um workflow agendado ou um gatilho
   vindo do painel em cada cliente.
3. **Vite + React.** Descartada porque foge da estrutura da Azics, que é o motivo da mudança.

O usuário escolheu a 1.

## O que foi decidido

- **Base:** o conteúdo do `origin/main`.
- **Avaliações:** buscadas no navegador, só a seção de avaliações vem da API.
- **Endereço:** o repositório `minastra-cafes/website` é convertido e continua servido em `/website/`.
- **Slug:** `minastra`. O site já está cadastrado na produção e com as avaliações ligadas. Em
  2026-11-17, `GET https://api.azics.com.br/public/sites/minastra/avaliacoes` respondeu 200 com 1
  avaliação, no formato `{ itens, total, pagina, tamanho, media }`. Dá para verificar o site contra a
  produção, mas os casos de lista vazia, `404` e várias páginas são testados com respostas falsas.

## Propostas minhas (podem ser corrigidas)

- **Rotas:** `/` é a página inicial e `/produto/[id]` é a página de produto (`bronze`, `ouro`,
  `ouro-graos`), gerada com `generateStaticParams` a partir de `src/data/produtos.ts`, que substitui o
  `products.json`. O `public/products2.html` vira uma página mínima que lê `?produto=` e redireciona
  para `/website/produto/<id>/`, para não quebrar links antigos.
  - **Por que mudar a URL:** hoje o `products2.html` monta o produto em JavaScript, com um `fetch` do
    `products.json`, então o Google mal vê o conteúdo. Com uma página estática por produto, o Google
    passa a ler o conteúdo.
  - **Ajustes de SEO:** o `sitemap.xml`, o `canonical`, o `og:url` e o JSON-LD passam a apontar para
    `/produto/<id>/`. O `products2.html` leva `noindex`. Ele não leva `canonical`, porque é um HTML fixo e não sabe
    qual é o produto. Quem indica o endereço novo é o `canonical` da página de destino.
  - **A troca:** o GitHub Pages não faz redirecionamento 301, então o Google pode levar um tempo para
    trocar o endereço antigo pelo novo.
- **Lugar da seção:** depois de "Especial sem ser complicado." (`#qualidade`) e antes de
  "Café feito por pessoas". Ganha o id `#avaliacoes`, mas não entra no menu, porque a seção pode
  sumir.
- **Estados da seção:**
  - Carregando: nada aparece e nenhum espaço fica reservado. Um esqueleto contradiz a regra de a seção
    sumir com erro, `404` ou lista vazia: nesses casos a página pularia, e isso aconteceria com todo
    cliente que tem as avaliações desligadas. A seção fica bem abaixo da primeira tela, então quando
    ela entra ninguém vê o pulo.
  - Com avaliações: título, média com estrelas, "N avaliações", os cartões e "Ver mais" enquanto houver
    próxima página.
  - Erro, `404` ou nenhuma avaliação: a seção inteira não aparece.
- **Cartão:** foto (ou a inicial, quando não houver foto), nome, estrelas, texto e data relativa
  ("há 3 dias"). No celular os cartões ficam empilhados; no desktop, em grade de 3 colunas. O visual
  segue a paleta e as fontes do site (`minastra-*`, Georgia nos títulos).
- **Botão "Avalie a Minastra":** abre `https://painel.azics.com.br/avaliar?site=<slug>` em outra aba.
- **Configuração:** `NEXT_PUBLIC_API_URL` (`https://api.azics.com.br`) e `NEXT_PUBLIC_SITE_SLUG` (`minastra`),
  definidas no workflow e num `.env.example`.
- **Estilo:** a configuração do Tailwind por CDN vira `@theme` no `globals.css`, com as mesmas cores,
  sombras e fonte de título. Inter e Alegreya SC entram por `next/font/google`. Os caracteres `✦ ◇ ⌂`
  ficam como estão.
- **Arquivos:** `src/app` (layout, página inicial, `produto/[id]`, robots, sitemap),
  `src/components/sections` (uma seção por arquivo), `src/components/avaliacoes` (a parte que serve
  para qualquer cliente), `src/lib/azics.ts` (o cliente da API), `src/data` (o conteúdo do Minastra) e
  `public/` (imagens, favicon, logo, o arquivo do Google e o `products2.html`).
- **Testes (Vitest + Testing Library):**
  - O cliente da API: monta a URL, faz a paginação e trata o `404` e as falhas de rede.
  - A seção: carregando, com avaliações, vazia, com erro e o "Ver mais".
  - A página de produto: gera um caminho para cada produto.
- **Deploy:** o workflow passa a rodar `npm ci`, os testes e `npm run build`, e publica a pasta `out/`.

## Com quem vai construir

- Como reproduzir cada classe e detalhe do HTML atual em componentes.
- O formato exato do esqueleto e dos cartões, dentro da paleta do site.
- Como comparar com o site atual para provar que o visual não mudou (por exemplo, capturas de tela
  lado a lado a 375 px e a 1280 px).
