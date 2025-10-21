// 🪳 ARQUIVO DAS BARATINHAS 🪳
// Sistema de baratinhas andando juntas pela tela

// Função para criar movimentos aleatórios para baratinhas JUNTAS
function createRandomCockroachMovement() {
    const cockroach1 = document.querySelector('.cockroach-1');
    const cockroach2 = document.querySelector('.cockroach-2');

    if (!cockroach1 || !cockroach2) return;

    // Gerar posição aleatória para a primeira baratinha
    const randomX = Math.random() * (window.innerWidth - 100);
    const randomY = Math.random() * (window.innerHeight - 100);

    // Gerar duração mais rápida (entre 2 e 4 segundos)
    const randomDuration = Math.random() * 2 + 2; // Entre 2 e 4 segundos

    // Distância entre as baratinhas (sempre próximas)
    const offsetX = 30; // Distância horizontal entre elas
    const offsetY = 15; // Distância vertical entre elas

    // Aplicar movimento suave para ambas JUNTAS
    cockroach1.style.transition = `all ${randomDuration}s ease-in-out`;
    cockroach1.style.left = randomX + 'px';
    cockroach1.style.top = randomY + 'px';

    cockroach2.style.transition = `all ${randomDuration}s ease-in-out`;
    cockroach2.style.left = (randomX + offsetX) + 'px';
    cockroach2.style.top = (randomY + offsetY) + 'px';
}

// Função para criar baratinhas adicionais ocasionalmente
function createRandomCockroach() {
    const cockroachContainer = document.querySelector('.cockroach-container');
    if (!cockroachContainer) return;

    const cockroach = document.createElement('div');
    cockroach.className = 'cockroach random-cockroach';
    cockroach.innerHTML = '🪳';

    // Posição aleatória inicial
    cockroach.style.left = Math.random() * window.innerWidth + 'px';
    cockroach.style.top = Math.random() * window.innerHeight + 'px';
    cockroach.style.fontSize = (Math.random() * 10 + 16) + 'px';
    cockroach.style.opacity = '0.4';
    cockroach.style.position = 'absolute';

    cockroachContainer.appendChild(cockroach);

    // Remover após um tempo
    setTimeout(() => {
        if (cockroach.parentNode) {
            cockroach.parentNode.removeChild(cockroach);
        }
    }, 15000);
}

// Função para inicializar o sistema de baratinhas
function initCockroachSystem() {
    console.log("🪳 Sistema de baratinhas inicializado! Elas estão andando juntinhas! 🪳");

    // Movimentos aleatórios das baratinhas principais (mais rápidos)
    setInterval(() => {
        createRandomCockroachMovement();
    }, 1500); // A cada 1.5 segundos

    // Adicionar baratinhas extras ocasionalmente
    setInterval(() => {
        if (Math.random() < 0.1) {
            createRandomCockroach();
        }
    }, 8000);
}

// Função para pausar/retomar baratinhas (opcional)
function toggleCockroaches() {
    const cockroaches = document.querySelectorAll('.cockroach');
    cockroaches.forEach(cockroach => {
        if (cockroach.style.animationPlayState === 'paused') {
            cockroach.style.animationPlayState = 'running';
        } else {
            cockroach.style.animationPlayState = 'paused';
        }
    });
}

// Função para criar baratinhas extras em posições específicas
function createCockroachAt(x, y) {
    const cockroachContainer = document.querySelector('.cockroach-container');
    if (!cockroachContainer) return;

    const cockroach = document.createElement('div');
    cockroach.className = 'cockroach special-cockroach';
    cockroach.innerHTML = '🪳';

    cockroach.style.left = x + 'px';
    cockroach.style.top = y + 'px';
    cockroach.style.fontSize = '20px';
    cockroach.style.opacity = '0.6';
    cockroach.style.position = 'absolute';
    cockroach.style.transition = 'all 3s ease-in-out';

    cockroachContainer.appendChild(cockroach);

    // Fazer ela se mover para uma posição aleatória
    setTimeout(() => {
        const randomX = Math.random() * window.innerWidth;
        const randomY = Math.random() * window.innerHeight;
        cockroach.style.left = randomX + 'px';
        cockroach.style.top = randomY + 'px';
    }, 1000);

    // Remover após um tempo
    setTimeout(() => {
        if (cockroach.parentNode) {
            cockroach.parentNode.removeChild(cockroach);
        }
    }, 10000);
}

// Exportar funções para uso global
window.createRandomCockroachMovement = createRandomCockroachMovement;
window.createRandomCockroach = createRandomCockroach;
window.initCockroachSystem = initCockroachSystem;
window.toggleCockroaches = toggleCockroaches;
window.createCockroachAt = createCockroachAt;
