// Arquivo principal - inicialização da aplicação
let floatingImagesEnabled = true;
let allowPostHalloweenFeatures = false;

// Função para entrar na página principal
function enterPage() {
    // Esconder tela de entrada
    const entryScreen = document.getElementById("entryScreen");
    entryScreen.classList.add("hidden");

    // Mostrar conteúdo principal
    const mainContent = document.getElementById("mainContent");
    mainContent.style.display = "block";

    // Inicializar página principal
    setTimeout(() => {
        initMainPage();

        // Ativar música MP3 após inicializar
        setTimeout(() => {
            // Tocar primeira música da playlist (que inclui Halloween se for o caso)
            currentTrackIndex = 0;
            selectTrack(0);
            if (audio) {
                audio.play().then(() => {
                    isPlaying = true;
                    startVisualEffect();
                    updateFloatingButton();
                }).catch((error) => {
                    // Erro ao reproduzir áudio
                });
            }
        }, 500);
    }, 1000);
}

// Inicializar página principal
function initMainPage() {
    createStars();
    loadGalleryImages(); // Carregar galeria dinamicamente
    renderPlaylist(); // Renderizar playlist dinamicamente (com música de Halloween se aplicável)
    renderGothicElements(); // Renderizar emojis góticos baseado no tema
    updateStaticGothicElements();

    // Configurar audio element com event listeners
    if (!audio) {
        audio = document.getElementById("audio-player");
    }

    // Event listeners para o áudio
    audio.addEventListener("timeupdate", updateProgress);

    audio.addEventListener("ended", function () {
        // Quando a música termina, tocar a próxima
        nextTrack();
    });

    audio.addEventListener("error", function () {
        // Erro no áudio
    });

    // Player toca automaticamente sempre que a página carregar
    isPlaying = true;
    startVisualEffect();

    // Adicionar elementos góticos periodicamente (probabilidade 0.2, interval 3s)
    setInterval(() => {
        if (Math.random() < CONFIG.HALLOWEEN.floatingChance) {
            createFloatingGothicElement();
        }
    }, CONFIG.ANIMATION.gothicInterval);

    // Inicializar sistema de baratinhas/morcegos e garantir ícone correto
    initCockroachSystem();
    if (typeof updateCockroachIcons === 'function') {
        updateCockroachIcons();
    }

    // Atualizar progresso a cada segundo
    setInterval(updateProgress, CONFIG.CONSOLE.progressUpdateInterval);

    // Mensagem de boas-vindas gótica (apenas no console)
    // Removido para produção
}

// Inicializar página de entrada
document.addEventListener("DOMContentLoaded", function () {
    createEntryStars();
    renderGothicElements(); // Renderizar emojis góticos baseado no tema inicial

    const themeBtn = document.getElementById('themeToggleBtn');
    const imagesBtn = document.getElementById('floatingImagesBtn');
    const musicBtn = document.getElementById('floatingMusicBtn');
    const isHalloween = isHalloweenDate();
    const afterHalloween = isAfterHalloween2025();

    allowPostHalloweenFeatures = afterHalloween; // só depois de 31/10/2025

    if (musicBtn) musicBtn.style.display = 'inline-flex';

    // Buscar tema salvo no localStorage
    let savedTheme = null;
    try { savedTheme = localStorage.getItem('theme'); } catch (e) { }

    // Regras: agenda tem prioridade; senão, preferência salva; senão, fallback (classic)
    let initialTheme = 'classic';

    // Verificar se há tema agendado para hoje
    const scheduled = getScheduledThemeFor(new Date());
    if (scheduled && themeRegistry[scheduled]) {
        initialTheme = scheduled;
    } else if (savedTheme && themeRegistry[savedTheme]) {
        // Usar tema salvo apenas se não houver agenda ativa
        initialTheme = savedTheme;
    }

    // Mostrar/ocultar UI
    const tabHalloween = document.getElementById('tabBtnHalloween');
    // Aba Halloween: visível apenas DURANTE os dias do evento
    if (tabHalloween) tabHalloween.style.display = isHalloween ? 'inline-block' : 'none';
    // Botão de tema: oculto DURANTE Halloween, visível apenas APÓS
    if (themeBtn) themeBtn.style.display = afterHalloween ? 'inline-block' : 'none';

    applyTheme(initialTheme, { skipPersist: true });
    if (!themeRegistry[initialTheme].addBodyClass && imagesBtn) imagesBtn.style.display = 'none';
    
    // Se for Halloween, focar na aba Halloween automaticamente
    if (isHalloween) {
        showTab('halloween');
        const allBtns = document.querySelectorAll('.tab-btn');
        allBtns.forEach(btn => btn.classList.remove('active'));
        const halloweenBtn = document.getElementById('tabBtnHalloween');
        if (halloweenBtn) halloweenBtn.classList.add('active');
    }
});

// Exportar variáveis globais
window.floatingImagesEnabled = floatingImagesEnabled;
window.allowPostHalloweenFeatures = allowPostHalloweenFeatures;
window.enterPage = enterPage;
window.initMainPage = initMainPage;

