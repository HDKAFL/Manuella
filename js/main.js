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

    // No dia do aniversário: tema dark + aba Aniversário já como primeira tela
    if (typeof isThemeDate === 'function' && isThemeDate('birthday', new Date())) {
        if (typeof applyTheme === 'function') {
            applyTheme('birthday', { skipPersist: true });
        }
        if (typeof showTab === 'function') {
            showTab('aniversario');
        }
    }

    // Inicializar página principal
    setTimeout(() => {
        initMainPage();

        setTimeout(() => {
            const onBirthdayTab = document.getElementById('aniversario') && document.getElementById('aniversario').classList.contains('active');
            if (onBirthdayTab && typeof pauseMusicForBirthdayTab === 'function') {
                pauseMusicForBirthdayTab();
                return;
            }
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

    // Atualizar estatísticas de aniversário se estiver na aba correta
    if (document.getElementById('anniversary') && document.getElementById('anniversary').classList.contains('active')) {
        if (typeof updateAnniversaryStats === 'function') {
            updateAnniversaryStats();
        }
    }
    if (document.getElementById('aniversario') && document.getElementById('aniversario').classList.contains('active')) {
        if (typeof updateBirthdayStats === 'function') {
            updateBirthdayStats();
        }
    }

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

    const onBirthdayTab = document.getElementById('aniversario') && document.getElementById('aniversario').classList.contains('active');
    if (!onBirthdayTab) {
        isPlaying = true;
        startVisualEffect();
    } else {
        isPlaying = false;
    }

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

    const themeBtn = document.getElementById('themeToggleBtn');
    const imagesBtn = document.getElementById('floatingImagesBtn');
    const musicBtn = document.getElementById('floatingMusicBtn');
    const isHalloween = isHalloweenDate();
    const today = new Date();
    const isBirthdayToday = isThemeDate('birthday', today);
    const isAnniversary = isThemeDate('anniversary', today);
    const isMatinho = isThemeDate('matinho', today);
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
    // Aba Halloween: sempre visível (usuário pode acessar pelo botão de tema)
    if (tabHalloween) tabHalloween.style.display = 'inline-block';
    // Botão de tema: oculto em datas comemorativas (será controlado pelo applyTheme)
    // Não definir aqui, deixar o applyTheme controlar

    applyTheme(initialTheme, { skipPersist: true });
    renderGothicElements();

    if (!themeRegistry[initialTheme].addBodyClass && imagesBtn) imagesBtn.style.display = 'none';

    // Atualizar título do botão da aba de aniversário sempre que a página carrega
    if (typeof updateAnniversaryStats === 'function') {
        updateAnniversaryStats();
    }

    if (typeof updateBirthdayStats === 'function') {
        updateBirthdayStats();
    }

    if ((initialTheme === 'anniversary' || initialTheme === 'birthday') && typeof renderPlaylist === 'function') {
        renderPlaylist();
    }

    // Por enquanto: aba "4 meses" como padrão, independente da data
    if (typeof applyTheme === 'function') {
        const themeChanged = applyTheme('anniversary', { skipPersist: true });
        if (themeChanged && typeof renderPlaylist === 'function') {
            renderPlaylist();
        }
    }
    showTab('anniversary4');
});

// Exportar variáveis globais
window.floatingImagesEnabled = floatingImagesEnabled;
window.allowPostHalloweenFeatures = allowPostHalloweenFeatures;
window.enterPage = enterPage;
window.initMainPage = initMainPage;

