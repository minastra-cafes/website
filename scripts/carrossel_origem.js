const imagensOrigem = [
    "images/sobre/trator.jpeg",
    // "images/sobre/serras_cafe.png",
    "images/sobre/localizacao_minastra.jpg",
];

const origImg = document.getElementById("origemImg");
let _indiceQS = 0;
const _intervaloQS = 4400;

// Preload das imagens
imagensOrigem.forEach(src => {
    const img = new Image();
    img.src = src;
});

// Troca suave de imagem
setInterval(() => {
    // fade-out
    origImg.style.opacity = 0;

    setTimeout(() => {
        _indiceQS = (_indiceQS + 1) % imagensOrigem.length;
        origImg.src = imagensOrigem[_indiceQS];

        // fade-in
        origImg.style.opacity = 1;
    }, 400);
}, _intervaloQS);