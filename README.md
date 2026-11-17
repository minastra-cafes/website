# Minastra Cafés Especiais

Site da Minastra em Next 16 (export estático), publicado no GitHub Pages em
https://minastra.azics.com.br/ (o antigo minastra-cafes.github.io/website/ redireciona para lá).
Segue a mesma estrutura dos projetos da Azics.

O conteúdo (textos, produtos, fotos) fica fixo em `src/data` e `src/components/sections`. Só a seção
de avaliações vem da API da Azics (`GET /public/sites/<slug>/avaliacoes`), buscada no navegador.

## Rodar

```bash
cp .env.example .env.local
npm install
npm run dev
```

Abra http://localhost:3000/.

## Testar

```bash
npm test
npm run lint
```

## Publicar

Um push no `main` roda o workflow `.github/workflows/deploy.yml`: testes, lint, `npm run build` e
publica a pasta `out/` no GitHub Pages.

O domínio fica em Settings → Pages → Custom domain (com deploy por Actions, um arquivo `CNAME`
seria ignorado). No DNS da Cloudflare: `CNAME minastra → minastra-cafes.github.io`, sem proxy.

## Configuração

| Variável | Valor | Para quê |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://api.azics.com.br` | API da Azics |
| `NEXT_PUBLIC_SITE_SLUG` | `minastra` | O site do Minastra cadastrado na Azics |

As duas entram no build (estão no workflow); mudar exige publicar de novo.

## Para o próximo cliente

`src/lib/azics.ts` e `src/components/avaliacoes/` não sabem nada do Minastra: copie as duas partes e
passe outro `slug` e outro `nomeNegocio` para `<Avaliacoes />`.
