// --- Defina a data e hora do sorteio ---
// Formato: Ano, Mês (0-11), Dia, Hora, Minuto, Segundo
// Setembro é o mês 8, pois a contagem começa do 0 (Janeiro).

const APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzNfYXXPv0eVNy9uWnj0QRj2KaqmTKjgYghE-tAsArHhdefBvpHswpSMAC4JPEdcSbC/exec';


const dataSorteio = new Date(2025, 11, 4, 15, 0, 0);

// --- Seleciona os elementos no HTML ---
const diasEl = document.getElementById('days');
const horasEl = document.getElementById('hours');
const minutosEl = document.getElementById('minutes');
const segundosEl = document.getElementById('seconds');
const timerEl = document.getElementById('timer');
const h1El = document.querySelector('h1');

// --- Elementos do DOM (Barra de Progresso) ---
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');


async function atualizarBarraDeProgresso() {
    try {
        const urlProgress = `${APPSCRIPT_URL}?action=getProgress`;
        const response = await fetch(urlProgress);
        const data = await response.json();

        if (data.total > 0) {
            const porcentagem = (data.vendidos / data.total) * 100;
            progressBar.style.width = `${porcentagem.toFixed(2)}%`;
            progressText.textContent = `${Math.round(porcentagem)}% dos números vendidos!`;
        }

    } catch (error) {
        progressText.textContent = "Erro ao carregar progresso.";
        console.error("Erro ao buscar progresso:", error);
    }
}


function atualizarContagem() {
    const agora = new Date();
    const diferenca = dataSorteio - agora;

    // Se a data já passou
    if (diferenca <= 0) {
        clearInterval(intervalo);
        timerEl.innerHTML = "<h2>Sorteio Realizado!</h2>";
        h1El.textContent = "Boa sorte a todos!";
        return;
    }

    // Calcula o tempo restante
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

    // Adiciona o zero à esquerda se for menor que 10
    diasEl.innerHTML = String(dias).padStart(2, '0');
    horasEl.innerHTML = String(horas).padStart(2, '0');
    minutosEl.innerHTML = String(minutos).padStart(2, '0');
    segundosEl.innerHTML = String(segundos).padStart(2, '0');
}

// Inicia o intervalo que atualiza a contagem a cada segundo
const intervalo = setInterval(atualizarContagem, 1000);

// Chama a função uma vez no início para não esperar 1 segundo
atualizarContagem();

// --- CHAMADA INICIAL ---
// Chama as funções para carregar tudo assim que a página abre
document.addEventListener('DOMContentLoaded', () => {
    atualizarBarraDeProgresso();
});