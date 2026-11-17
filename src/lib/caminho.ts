// O GitHub Pages serve o site em minastra-cafes.github.io/website/. O next/link já põe o prefixo,
// mas o src de <img> e os links fora do React precisam dele à mão.
export const BASE_PATH = "/website";

export function caminhoPublico(caminho: string): string {
  return `${BASE_PATH}${caminho}`;
}
