// Gera em public/ as versões leves das imagens listadas em imagens.config.json.
// Os originais ficam em originais/ (fora do deploy). Rode de novo ao trocar ou incluir uma foto:
//   npm run imagens
// Precisa do ffmpeg no PATH só para os vídeos.
import { spawn } from "node:child_process";
import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const RAIZ = process.cwd();
const IMAGENS = join(RAIZ, "public", "images");
const config = JSON.parse(await readFile(join(RAIZ, "imagens.config.json"), "utf8"));

await mkdir(IMAGENS, { recursive: true });

// Fotos: WebP em cada largura, sem aumentar além do original.
for (const [nome, { origem, larguras }] of Object.entries(config.fotos)) {
  for (const largura of larguras) {
    const destino = join(IMAGENS, `${nome}-${largura}.webp`);
    await sharp(join(RAIZ, origem)).resize({ width: largura, withoutEnlargement: true }).webp({ quality: 74, effort: 6 }).toFile(destino);
    console.log("foto", destino);
  }
}

// Compartilhamento (WhatsApp, Facebook): JPEG 1200x630, o formato que todos aceitam.
for (const [nome, origem] of Object.entries(config.compartilhamento)) {
  const destino = join(IMAGENS, `${nome}.jpg`);
  await sharp(join(RAIZ, origem)).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 78, mozjpeg: true }).toFile(destino);
  console.log("compartilhar", destino);
}

// Ícones: favicon de 48 px, o da tela inicial do iPhone (180 px) e a logo de 192 px do JSON-LD.
const icones = [
  [config.icones.favicon, 48, "favicon.png"],
  [config.icones.favicon, 180, "apple-touch-icon.png"],
  [config.icones.logoGoogle, 192, "logo.png"],
];
for (const [origem, lado, arquivo] of icones) {
  await sharp(join(RAIZ, origem)).resize(lado, lado).png({ compressionLevel: 9, palette: true }).toFile(join(RAIZ, "public", arquivo));
  console.log("ícone", arquivo);
}

// Vídeos: a animação WebP vira MP4 (H.264, toca em qualquer navegador) com 480 px de largura,
// mais o primeiro quadro como poster. O WebM (VP9) saiu maior que o MP4 nos testes e ficou de fora.
function rodarFfmpeg(argumentos, entrada) {
  return new Promise((resolver, rejeitar) => {
    const processo = spawn("ffmpeg", argumentos, { stdio: ["pipe", "ignore", "inherit"] });
    processo.on("error", rejeitar);
    processo.on("close", (codigo) => (codigo === 0 ? resolver() : rejeitar(new Error(`ffmpeg saiu com ${codigo}`))));
    processo.stdin.end(entrada);
  });
}

for (const [nome, { origem }] of Object.entries(config.videos)) {
  const arquivo = join(RAIZ, origem);
  const meta = await sharp(arquivo, { animated: true }).metadata();
  const quadros = meta.pages;
  const altura = meta.pageHeight;
  const duracaoMedia = meta.delay.reduce((soma, atraso) => soma + atraso, 0) / quadros;
  const fps = (1000 / duracaoMedia).toFixed(3);
  const brutos = await sharp(arquivo, { animated: true }).removeAlpha().raw().toBuffer();
  const entrada = ["-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", `${meta.width}x${altura}`, "-r", fps, "-i", "-", "-an"];

  await rodarFfmpeg(
    [...entrada, "-vf", "scale=480:-2", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "30", "-preset", "veryslow", "-movflags", "+faststart", join(IMAGENS, `${nome}.mp4`)],
    brutos,
  );
  await sharp(arquivo, { pages: 1 }).resize({ width: 480 }).webp({ quality: 70 }).toFile(join(IMAGENS, `${nome}-poster.webp`));
  console.log("vídeo", nome, `${quadros} quadros a ${fps} fps`);
}
