// O site fica na raiz de minastra.azics.com.br, então o prefixo é vazio. Se um cliente for servido
// numa subpasta (como o antigo minastra-cafes.github.io/website/), basta preencher aqui: o next.config
// usa o mesmo valor, e o src de <img> passa por caminhoPublico().
export const BASE_PATH = "";

export function caminhoPublico(caminho: string): string {
  return `${BASE_PATH}${caminho}`;
}
