const imagensQuemSomos = [
    "images/sobre/torrefacao.jpeg",
    "images/sobre/helio.jpeg",
    "images/sobre/colhedeira.webp",   // gif
];

const quemSomosImg = document.getElementById("quemSomosImg");
let indiceQS = 0;
const intervaloQS = 4100;

// Preload das imagens
imagensQuemSomos.forEach(src => {
    const img = new Image();
    img.src = src;
});

// Troca suave de imagem
setInterval(() => {
    // fade-out
    quemSomosImg.style.opacity = 0;

    setTimeout(() => {
        indiceQS = (indiceQS + 1) % imagensQuemSomos.length;
        quemSomosImg.src = imagensQuemSomos[indiceQS];

        // fade-in
        quemSomosImg.style.opacity = 1;
    }, 400);
}, intervaloQS);