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

## Conteúdo do painel

Título, subtítulo, o texto do Sobre, o Instagram e o celular (WhatsApp) vêm de
`GET /public/sites/<slug>` da API da Azics:

- no build, entram no HTML (bom para o Google e para as prévias de link no WhatsApp). Se a API
  falhar, o build falha e o site no ar continua o último bom;
- no navegador, o site confere a versão atual: uma edição no painel aparece em até 1 minuto;
- o workflow roda sozinho toda segunda, para o HTML não ficar velho.

Campo vazio no painel fica com o texto de `src/data/conteudo.ts`. Sem Instagram, o link some.

## Imagens

As fotos originais ficam em `originais/` (fora do deploy). As versões leves que o site usa ficam em
`public/images/` e são geradas a partir de `imagens.config.json`:

```bash
npm run imagens
```

O script (`scripts/otimizar-imagens.mjs`) gera WebP em cada largura da lista, as imagens de
compartilhamento (JPEG 1200x630), os ícones e o vídeo da colheita (MP4; precisa do `ffmpeg`). Para
incluir uma foto: coloque o original em `originais/`, inclua no JSON, rode o script e use
`foto("<nome>")` no componente. Os testes falham se um arquivo pedido não existir, se sobrar
imagem sem uso ou se algum arquivo passar de 250 KB.

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
