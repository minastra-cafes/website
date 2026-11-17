import config from "../../imagens.config.json";
import { caminhoPublico } from "./caminho";

// As fotos geradas por scripts/otimizar-imagens.mjs: public/images/<nome>-<largura>.webp.
export type Foto = { src: string; srcSet: string };

export type NomeFoto = keyof typeof config.fotos;

export function montarFoto(nome: string, larguras: number[]): Foto {
  const arquivo = (largura: number) => caminhoPublico(`/images/${nome}-${largura}.webp`);
  return {
    src: arquivo(Math.max(...larguras)),
    srcSet: larguras.map((largura) => `${arquivo(largura)} ${largura}w`).join(", "),
  };
}

export function foto(nome: NomeFoto): Foto {
  return montarFoto(nome, config.fotos[nome].larguras);
}

export const VIDEO_COLHEDEIRA = {
  mp4: caminhoPublico("/images/colhedeira.mp4"),
  poster: caminhoPublico("/images/colhedeira-poster.webp"),
};

export const IMAGEM_COMPARTILHAR = {
  trator: "/images/compartilhar-trator.jpg",
  serras: "/images/compartilhar-serras.jpg",
};
