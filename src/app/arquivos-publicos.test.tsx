import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { render } from "@testing-library/react";
import { PRODUTOS } from "@/data/produtos";
import { metadata as metadadosLayout } from "./layout";
import NaoEncontrado from "./not-found";
import Home, { metadata as metadadosInicio } from "./page";
import PaginaProduto, { generateMetadata } from "./produto/[id]/page";

vi.mock("@/lib/azics", async (original) => ({
  ...(await original<typeof import("@/lib/azics")>()),
  buscarAvaliacoes: vi.fn(() => new Promise(() => {})),
}));

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "inter" }),
  Alegreya_SC: () => ({ variable: "alegreya" }),
}));

const PUBLIC = join(process.cwd(), "public");
const SITE = "https://minastra.azics.com.br";

// Todo caminho local que a página pede: src, srcset, poster e <source> de vídeo.
function caminhosDoHtml(container: HTMLElement): string[] {
  const caminhos: string[] = [];
  container.querySelectorAll("img").forEach((img) => {
    caminhos.push(img.getAttribute("src")!);
    img.getAttribute("srcset")?.split(",").forEach((parte) => caminhos.push(parte.trim().split(" ")[0]));
  });
  container.querySelectorAll("video").forEach((video) => {
    if (video.getAttribute("poster")) caminhos.push(video.getAttribute("poster")!);
    video.querySelectorAll("source").forEach((source) => {
      const src = source.getAttribute("src") ?? source.getAttribute("data-src");
      if (src) caminhos.push(src);
    });
  });
  container.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
    for (const url of script.textContent!.match(/https:\/\/minastra\.azics\.com\.br\/[^"]+\.(png|jpe?g|webp)/g) ?? []) {
      caminhos.push(url.replace(SITE, ""));
    }
  });
  return caminhos.filter((caminho) => caminho.startsWith("/"));
}

function caminhoDaUrl(url: unknown): string {
  return String(url).replace(SITE, "");
}

function arquivosEmPublic(pasta: string): string[] {
  return readdirSync(pasta).flatMap((nome) => {
    const completo = join(pasta, nome);
    return statSync(completo).isDirectory() ? arquivosEmPublic(completo) : ["/" + relative(PUBLIC, completo).split(sep).join("/")];
  });
}

async function todosOsCaminhosUsados(): Promise<Set<string>> {
  const usados = new Set<string>();
  const adicionar = (lista: string[]) => lista.forEach((caminho) => usados.add(caminho));

  adicionar(caminhosDoHtml(render(await Home()).container));
  adicionar(caminhosDoHtml(render(<NaoEncontrado />).container));
  for (const produto of PRODUTOS) {
    const params = Promise.resolve({ id: produto.id });
    adicionar(caminhosDoHtml(render(await PaginaProduto({ params })).container));
    const metadados = await generateMetadata({ params });
    adicionar([caminhoDaUrl((metadados.openGraph?.images as { url: string }[])[0].url)]);
  }

  const icones = metadadosLayout.icons as { icon: { url: string }[]; apple: { url: string }[] };
  adicionar([...icones.icon, ...icones.apple].map((icone) => caminhoDaUrl(icone.url)));
  adicionar([caminhoDaUrl((metadadosInicio.openGraph?.images as { url: string }[])[0].url)]);
  adicionar((metadadosInicio.twitter?.images as string[]).map(caminhoDaUrl));
  return usados;
}

describe("arquivos de public/", () => {
  it("todo arquivo que as páginas pedem existe", async () => {
    const faltando = [...(await todosOsCaminhosUsados())].filter((caminho) => !existsSync(join(PUBLIC, caminho)));
    expect(faltando).toEqual([]);
  });

  it("nenhuma imagem ou vídeo em public/images fica sem uso", async () => {
    const usados = await todosOsCaminhosUsados();
    const semUso = arquivosEmPublic(join(PUBLIC, "images")).filter((caminho) => !usados.has(caminho));
    expect(semUso).toEqual([]);
  });

  it("nenhuma imagem, vídeo ou ícone passa de 250 KB", () => {
    const pesados = arquivosEmPublic(PUBLIC)
      .filter((caminho) => /\.(png|jpe?g|webp|avif|mp4|webm)$/.test(caminho))
      .filter((caminho) => statSync(join(PUBLIC, caminho)).size > 250 * 1024);
    expect(pesados).toEqual([]);
  });
});
