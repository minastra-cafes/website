const imagensQuemSomos = [
    "images/sobre/colhedeira.webp",   // gif
    "images/sobre/cafezal_em_flor.png",
    "images/sobre/fazenda_lagoa.png",
    "images/sobre/helio.jpeg",
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