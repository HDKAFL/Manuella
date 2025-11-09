// Funcionalidades de Halloween

let halloweenCharacterTimeouts = [];
let halloweenCharacterIntervals = [];

function clearHalloweenCharacters() {
    halloweenCharacterTimeouts.forEach(clearTimeout);
    halloweenCharacterIntervals.forEach(clearInterval);
    halloweenCharacterTimeouts = [];
    halloweenCharacterIntervals = [];

    const container = document.getElementById('halloweenCharacters');
    if (container) {
        container.innerHTML = '';
    }
}

// Criar personagens de Halloween flutuando
async function createHalloweenCharacters() {
    const container = document.getElementById('halloweenCharacters');
    if (!container) return;

    clearHalloweenCharacters();

    if (!floatingImagesEnabled) {
        return;
    }

    // Validar e adicionar TODAS as imagens (não mais aleatórias)
    for (let index = 0; index < CONFIG.HALLOWEEN.characters.length; index++) {
        const char = CONFIG.HALLOWEEN.characters[index];
        const charPath = `${CONFIG.PATHS.photosHalloween}${char}`;
        
        const timeoutId = setTimeout(async () => {
            // Validar se personagem existe
            const exists = await validateAsset(charPath, char, 'image');
            
            if (exists) {
                const img = document.createElement('img');
                img.src = charPath;
                img.className = 'halloween-character';
                img.alt = 'Halloween Character';

                // Posição inicial aleatória (85% max, 80% max)
                img.style.left = Math.random() * CONFIG.RANDOM.positionMaxPercent + '%';
                img.style.top = Math.random() * CONFIG.RANDOM.topPositionMaxPercent + '%';
                img.style.animationDelay = Math.random() * CONFIG.RANDOM.maxDelay + 's';
                img.style.animationDuration = (Math.random() * CONFIG.RANDOM.maxDuration + CONFIG.RANDOM.minDuration) + 's';

                container.appendChild(img);

                // Fazer personagens se moverem pela tela
                moveHalloweenCharacter(img);
                const intervalId = setInterval(() => moveHalloweenCharacter(img), CONFIG.ANIMATION.moveInterval);
                halloweenCharacterIntervals.push(intervalId);
            } else {
                // Personagem Halloween não encontrado, pulando
            }
        }, index * CONFIG.ANIMATION.characterDelay);

        halloweenCharacterTimeouts.push(timeoutId);
    }
}

// Fazer personagens se moverem pela tela
function moveHalloweenCharacter(element) {
    const randomX = Math.random() * 90;
    const randomY = Math.random() * 90;
    element.style.transition = 'all 8s ease-in-out';
    element.style.left = randomX + '%';
    element.style.top = randomY + '%';
}

// Elementos flutuantes temáticos de Halloween
function createFloatingSpookyElement() {
    const icons = ["🎃", "🦇", "🕯️", "🕷️", "🧛", "🧟", "👻"];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    const el = document.createElement('div');
    el.className = 'gothic-element';
    el.innerHTML = icon;
    el.style.position = 'fixed';
    el.style.fontSize = (Math.random() * 14 + 18) + 'px';
    el.style.left = Math.random() * window.innerWidth + 'px';
    el.style.top = window.innerHeight + 'px';
    el.style.color = '#ff6a00';
    el.style.animation = 'float 6s ease-out forwards';
    el.style.opacity = '0.7';
    el.style.filter = 'drop-shadow(0 0 10px rgba(255,106,0,.5))';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 6500);
}

// Ativar/Desativar imagens flutuantes (personagens e ícones)
function toggleFloatingImages() {
    floatingImagesEnabled = !floatingImagesEnabled;
    const btn = document.getElementById('floatingImagesBtn');
    if (btn) {
        if (floatingImagesEnabled) {
            btn.classList.remove('paused');
            btn.textContent = '👻';
            if (document.body.classList.contains('halloween')) {
                createHalloweenCharacters();
            }
        } else {
            btn.classList.add('paused');
            btn.textContent = '🚫';
            clearHalloweenCharacters();
        }
    }
}

// Exportar para uso global
window.createHalloweenCharacters = createHalloweenCharacters;
window.moveHalloweenCharacter = moveHalloweenCharacter;
window.createFloatingSpookyElement = createFloatingSpookyElement;
window.toggleFloatingImages = toggleFloatingImages;
window.clearHalloweenCharacters = clearHalloweenCharacters;

