const imagens = [
    "images/maquina_no_cafe.jpeg",
    "images/cafes_na_flor.jpeg",
];

const bg1 = document.getElementById("bg1");
const bg2 = document.getElementById("bg2");

let indice = 0;
let visivel = true;
const intervalo = 4500;

// Preload de imagens para evitar piscadas
imagens.forEach((src) => {
    const img = new Image();
    img.src = src;
});

// Função para animar transição
setInterval(() => {
    indice = (indice + 1) % imagens.length;
    const proxima = imagens[indice];

    if (visivel) {
        bg2.style.backgroundImage = `url('${proxima}')`;
        bg2.style.opacity = 1;
        bg1.style.opacity = 0;
        bg2.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }], { duration: intervalo, easing: 'ease-in-out', fill: 'forwards' });
    } else {
        bg1.style.backgroundImage = `url('${proxima}')`;
        bg1.style.opacity = 1;
        bg2.style.opacity = 0;
        bg1.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }], { duration: intervalo, easing: 'ease-in-out', fill: 'forwards' });
    }

    visivel = !visivel;
}, intervalo);