// Efeitos visuais e elementos flutuantes

function startVisualEffect() {
    // Criar mais elementos flutuantes durante a reprodução
    const effectInterval = setInterval(() => {
        if (isPlaying) {
            createFloatingGothicElement();
        } else {
            clearInterval(effectInterval);
        }
    }, CONFIG.ANIMATION.gothicInterval);
}

function stopVisualEffect() {
    // Parar efeitos visuais
}

// Adicionar mais elementos românticos flutuantes periodicamente
function createFloatingGothicElement() {
    if (!floatingImagesEnabled) return;
    const isHalloweenTheme = document.body.classList.contains('halloween');
    const halloweenEmojisExtended = ["🎃", "🦇", "👻", "🕷️", "🕯️", "🧛", "🧟", "🩸", "🪦"];
    const classicEmojisExtended = ["🌕", "❤️", "🖤", "🌙", "💕", "🌚", "💖", "🌗", "🌔"];
    const elements = isHalloweenTheme ? halloweenEmojisExtended : classicEmojisExtended;
    const randomElement = elements[Math.floor(Math.random() * elements.length)];

    const gothicElement = document.createElement("div");
    gothicElement.className = "gothic-element";
    gothicElement.innerHTML = randomElement;
    gothicElement.style.position = "fixed";
    gothicElement.style.fontSize = "25px";
    gothicElement.style.color = isHalloweenTheme ? "#ff6a00" : "#8b0000";
    gothicElement.style.pointerEvents = "none";
    gothicElement.style.zIndex = "1000";
    gothicElement.style.left = Math.random() * window.innerWidth + "px";
    gothicElement.style.top = window.innerHeight + "px";
    gothicElement.style.animation = "float 6s ease-out forwards";
    gothicElement.style.filter = isHalloweenTheme
        ? "drop-shadow(0 0 10px rgba(255, 106, 0, 0.6))"
        : "drop-shadow(0 0 10px rgba(139, 0, 0, 0.5))";

    document.body.appendChild(gothicElement);

    setTimeout(() => {
        gothicElement.remove();
    }, 6000);
}

// Criar estrelas para tela de entrada
function createEntryStars() {
    const starsContainer = document.getElementById("entryStars");

    for (let i = 0; i < CONFIG.STARS.entryCount; i++) {
        const star = document.createElement("div");
        star.className = "entry-star";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.width = Math.random() * CONFIG.STARS.maxSize + CONFIG.STARS.minSize + "px";
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * CONFIG.STARS.maxDelay + "s";
        star.style.animationDuration = Math.random() * (CONFIG.STARS.maxDuration - CONFIG.STARS.minDuration) + CONFIG.STARS.minDuration + "s";

        starsContainer.appendChild(star);
    }
}

// Criar estrelas de fundo
function createStars() {
    const starsContainer = document.getElementById("stars");

    for (let i = 0; i < CONFIG.STARS.mainCount; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.width = Math.random() * CONFIG.STARS.maxSize + CONFIG.STARS.minSize + "px";
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * CONFIG.STARS.maxDelay + "s";
        star.style.animationDuration = Math.random() * (CONFIG.STARS.maxDuration - CONFIG.STARS.minDuration) + CONFIG.STARS.minDuration + "s";

        starsContainer.appendChild(star);
    }
}

// Função para renderizar elementos góticos estáticos
function renderGothicElements() {
    const isHalloweenTheme = document.body.classList.contains('halloween');
    const emojis = isHalloweenTheme ? CONFIG.ANIMATION.gothicEmojis : CONFIG.ANIMATION.classicEmojis;
    const positions = CONFIG.ANIMATION.gothicPositions;
    
    // Renderizar elementos da entrada (entry-gothic-element)
    const entryContainer = document.querySelector('.entry-screen');
    if (entryContainer) {
        const entryElements = entryContainer.querySelectorAll('.entry-gothic-element');
        entryElements.forEach((el, idx) => {
            el.textContent = emojis[idx % emojis.length];
        });
    }
    
    // Renderizar elementos do conteúdo principal (gothic-element)
    const mainElements = document.querySelectorAll('.gothic-element');
    mainElements.forEach((el, idx) => {
        el.textContent = emojis[idx % emojis.length];
    });
}

// Exportar para uso global
window.startVisualEffect = startVisualEffect;
window.stopVisualEffect = stopVisualEffect;
window.createFloatingGothicElement = createFloatingGothicElement;
window.createEntryStars = createEntryStars;
window.createStars = createStars;
window.renderGothicElements = renderGothicElements;

