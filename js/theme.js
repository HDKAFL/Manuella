// Sistema de temas (registry e aplicação)
const themeRegistry = {
    classic: {
        key: 'classic',
        label: '🌙 Tema Clássico',
        dataTheme: '',
        addBodyClass: false
    },
    halloween: {
        key: 'halloween',
        label: '🎃 Tema de Halloween',
        dataTheme: 'halloween',
        addBodyClass: true
    },
    anniversary: {
        key: 'anniversary',
        label: '💕 Tema de 1 Mês',
        dataTheme: 'anniversary',
        addBodyClass: true,
        anniversaryClass: 'anniversary'
    }
};

let currentTheme = 'classic';

function applyTheme(themeName, options = {}) {
    const theme = themeRegistry[themeName] || themeRegistry.classic;
    currentTheme = theme.key;

    // data-theme para CSS por variáveis
    if (theme.dataTheme) {
        document.body.setAttribute('data-theme', theme.dataTheme);
    } else {
        document.body.removeAttribute('data-theme');
    }

    // Compat: classe .halloween já usada nos estilos existentes
    // Remover todas as classes de tema primeiro
    document.body.classList.remove('halloween', 'anniversary');

    if (theme.addBodyClass) {
        if (theme.anniversaryClass) {
            document.body.classList.add('anniversary');
        } else {
            document.body.classList.add('halloween');
        }
    }

    // UI dependente do tema
    const charactersContainer = document.getElementById('halloweenCharacters');
    if (charactersContainer) {
        if (theme.key === 'halloween' && theme.addBodyClass && floatingImagesEnabled) {
            createHalloweenCharacters();
            // NÃO focar automaticamente na aba Halloween - deixar usuário navegar
        } else {
            charactersContainer.innerHTML = '';
        }
    }

    // Limpar elementos de aniversário quando não for tema anniversary
    const anniversaryContainer = document.getElementById('anniversaryElements');
    if (anniversaryContainer && theme.key !== 'anniversary') {
        anniversaryContainer.innerHTML = '';
    }

    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
        btn.textContent = theme.label;
        // Ocultar botão em datas comemorativas (Halloween e Aniversário)
        const isCommemorativeDate = (theme.key === 'halloween' || theme.key === 'anniversary');
        btn.style.display = isCommemorativeDate ? 'none' : 'inline-block';
    }

    // Botão de imagens flutuantes apenas no Halloween (não no aniversário)
    const imagesBtn2 = document.getElementById('floatingImagesBtn');
    if (imagesBtn2) {
        // Mostrar apenas no tema Halloween, não no aniversário
        imagesBtn2.style.display = (theme.key === 'halloween') ? 'inline-flex' : 'none';
    }

    // Atualizar ícones/baratas
    if (typeof updateCockroachIcons === 'function') {
        updateCockroachIcons();
    }

    // Atualizar emojis estáticos conforme tema
    updateStaticGothicElements();

    // Atualizar elementos de aniversário
    updateAnniversaryElements();

    // Re-renderizar playlist para incluir/remover música de Halloween/Aniversário
    if (typeof renderPlaylist === 'function') {
        renderPlaylist();
    }

    // Se for tema de aniversário e a música estiver disponível, tocar automaticamente
    if (theme.key === 'anniversary' && typeof selectTrack === 'function') {
        // Resetar índice para a primeira música (que será a de aniversário na playlist)
        setTimeout(() => {
            if (typeof getActivePlaylist === 'function') {
                const activePlaylist = getActivePlaylist();
                // A primeira música sempre será a de aniversário quando o tema estiver ativo
                if (activePlaylist.length > 0 && activePlaylist[0].title === "I Was Made For Lovin' You") {
                    // Resetar o índice de track para 0 (música de aniversário)
                    if (typeof window !== 'undefined') {
                        window.currentTrackIndex = 0;
                    }
                    selectTrack(0);
                    // Tentar tocar automaticamente após carregar a track
                    setTimeout(() => {
                        if (typeof window !== 'undefined' && window.audio) {
                            window.audio.play().then(() => {
                                if (typeof window !== 'undefined') {
                                    window.isPlaying = true;
                                    if (typeof updateFloatingButton === 'function') {
                                        updateFloatingButton();
                                    }
                                }
                            }).catch(() => {
                                // Ignorar erro se não conseguir tocar automaticamente (autoplay policy)
                            });
                        }
                    }, 800);
                }
            }
        }, 500);
    }

    // Persistir
    if (!options.skipPersist) {
        try { localStorage.setItem('theme', theme.key); } catch (e) { }
    }
}

// Agenda de temas por datas (prioridade maior vence)
const themeSchedule = [
    { id: 'halloween', month: 10, dayStart: 31, dayEnd: 31, theme: 'halloween', priority: 90 },
    // Tema de aniversário no dia 3 de todo mês
    { id: 'anniversary-jan', month: 1, dayStart: 3, dayEnd: 3, theme: 'anniversary', priority: 95 },
    { id: 'anniversary-feb', month: 2, dayStart: 3, dayEnd: 3, theme: 'anniversary', priority: 95 },
    { id: 'anniversary-mar', month: 3, dayStart: 3, dayEnd: 3, theme: 'anniversary', priority: 95 },
    { id: 'anniversary-apr', month: 4, dayStart: 3, dayEnd: 3, theme: 'anniversary', priority: 95 },
    { id: 'anniversary-may', month: 5, dayStart: 3, dayEnd: 3, theme: 'anniversary', priority: 95 },
    { id: 'anniversary-jun', month: 6, dayStart: 3, dayEnd: 3, theme: 'anniversary', priority: 95 },
    { id: 'anniversary-jul', month: 7, dayStart: 3, dayEnd: 3, theme: 'anniversary', priority: 95 },
    { id: 'anniversary-aug', month: 8, dayStart: 3, dayEnd: 3, theme: 'anniversary', priority: 95 },
    { id: 'anniversary-sep', month: 9, dayStart: 3, dayEnd: 3, theme: 'anniversary', priority: 95 },
    { id: 'anniversary-oct', month: 10, dayStart: 3, dayEnd: 3, theme: 'anniversary', priority: 95 },
    { id: 'anniversary-nov', month: 11, dayStart: 3, dayEnd: 3, theme: 'anniversary', priority: 95 },
    { id: 'anniversary-dec', month: 12, dayStart: 3, dayEnd: 3, theme: 'anniversary', priority: 95 }
];

function getScheduledThemeFor(date) {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const matches = themeSchedule.filter(r => {
        if (r.year && r.year !== y) return false;
        if (r.month !== m) return false;
        return d >= r.dayStart && d <= r.dayEnd;
    });
    if (!matches.length) return null;
    matches.sort((a, b) => b.priority - a.priority);
    return matches[0].theme;
}

// Verificar se uma data específica corresponde a um tema específico
function isThemeDate(themeName, date = new Date()) {
    const scheduledTheme = getScheduledThemeFor(date);
    return scheduledTheme === themeName;
}

// Verificar se já passou do Halloween (baseado na agenda)
function isAfterHalloween() {
    const today = new Date();
    const halloweenRule = themeSchedule.find(r => r.id === 'halloween');
    if (!halloweenRule) return false;

    const month = today.getMonth() + 1;
    const day = today.getDate();

    // Se passou do último dia do Halloween
    if (month === halloweenRule.month && day > halloweenRule.dayEnd) {
        return true;
    }
    // Se passou de outubro
    if (month > halloweenRule.month) {
        return true;
    }
    return false;
}

// Alternância do Tema de Halloween
function toggleHalloweenTheme() {
    const themes = ['classic', 'halloween', 'anniversary'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const next = themes[nextIndex];
    applyTheme(next);
    if (next === 'halloween') {
        for (let i = 0; i < 6; i++) setTimeout(() => createFloatingSpookyElement(), i * 250);
    } else if (next === 'anniversary') {
        // Criar elementos especiais de aniversário
        updateAnniversaryElements();
    }
}

// Alternância entre temas (versão melhorada)
function toggleTheme() {
    toggleHalloweenTheme();
}

// Atualiza os elementos góticos estáticos já presentes no HTML
function updateStaticGothicElements() {
    const isHalloweenTheme = document.body.classList.contains('halloween');
    const isAnniversaryTheme = document.body.classList.contains('anniversary');

    let set;
    if (isHalloweenTheme) {
        set = CONFIG.ANIMATION.halloweenEmojis;
    } else if (isAnniversaryTheme) {
        set = CONFIG.ANIMATION.anniversaryEmojis || CONFIG.ANIMATION.classicEmojis;
    } else {
        set = CONFIG.ANIMATION.classicEmojis;
    }

    const nodes = document.querySelectorAll('.gothic-element');
    nodes.forEach((el, idx) => {
        el.textContent = set[idx % set.length];
    });
}

// Calcula quantos meses de namoro já se passaram desde 03/10/2025
function calculateMonthsOfRelationship() {
    const startDate = new Date(2025, 9, 3); // 03 de outubro de 2025 (mês 9 = outubro)
    const today = new Date();

    // Ajustar para meia-noite para cálculo mais preciso
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Calcular diferença em meses
    const yearsDiff = today.getFullYear() - startDate.getFullYear();
    const monthsDiff = today.getMonth() - startDate.getMonth();

    let totalMonths = yearsDiff * 12 + monthsDiff;

    // Se o dia atual é menor que o dia de início no mês atual, não completou o mês ainda
    if (today.getDate() < startDate.getDate()) {
        totalMonths = Math.max(0, totalMonths - 1);
    }

    // Garantir que seja pelo menos 1 mês (já que começaram em outubro/2025)
    return Math.max(1, totalMonths);
}

// Atualiza elementos específicos do tema de aniversário
function updateAnniversaryElements() {
    if (document.body.classList.contains('anniversary')) {
        // Criar elementos flutuantes especiais de aniversário
        const anniversaryContainer = document.getElementById('anniversaryElements');
        if (anniversaryContainer) {
            anniversaryContainer.innerHTML = '';
            // Criar corações e elementos românticos flutuantes
            for (let i = 0; i < 8; i++) {
                const heart = document.createElement('div');
                heart.className = 'anniversary-heart';
                heart.textContent = ['💕', '💖', '💗', '💓', '💝', '🌹', '✨', '💫'][i % 8];
                heart.style.left = Math.random() * 85 + '%';
                heart.style.top = Math.random() * 85 + '%';
                heart.style.animationDelay = (i * 0.5) + 's';
                heart.style.animationDuration = (3 + Math.random() * 2) + 's';
                anniversaryContainer.appendChild(heart);
            }
        }

        // Atualizar estatísticas dinamicamente
        updateAnniversaryStats();
    }
}

// Atualiza as estatísticas de aniversário com os meses calculados
function updateAnniversaryStats() {
    const months = calculateMonthsOfRelationship();

    // Atualizar número de meses (primeiro stat-item)
    const statItems = document.querySelectorAll('.anniversary-stats .stat-item');
    if (statItems.length > 0) {
        const firstStatNumber = statItems[0].querySelector('.stat-number');
        const firstStatLabel = statItems[0].querySelector('.stat-label');

        if (firstStatNumber) {
            firstStatNumber.textContent = months;
        }

        if (firstStatLabel && (firstStatLabel.textContent.includes('Mês') || firstStatLabel.textContent.includes('Meses'))) {
            firstStatLabel.textContent = months === 1 ? 'Mês' : 'Meses';
        }
    }

    // Atualizar badge de dias
    const daysSinceStart = Math.floor((new Date() - new Date(2025, 9, 3)) / (1000 * 60 * 60 * 24));
    const badge = document.querySelector('.anniversary-badge');
    if (badge) {
        badge.textContent = `${daysSinceStart} dias`;
    }

    // Atualizar título da página dinamicamente
    const title = document.querySelector('.anniversary-title');
    if (title) {
        let titleText = title.innerHTML;
        // Substituir qualquer número de meses ou "Um Mês" pelo número atual
        titleText = titleText.replace(/\d+\s*Meses?/gi, `${months} ${months === 1 ? 'Mês' : 'Meses'}`);
        titleText = titleText.replace(/Um\s*Mês/gi, `${months} ${months === 1 ? 'Mês' : 'Meses'}`);
        title.innerHTML = titleText;
    }

    // Atualizar texto do botão da aba dinamicamente
    const tabButton = document.getElementById('tabBtnAnniversary');
    const tabTextSpan = document.getElementById('anniversaryTabText');
    if (tabButton && tabTextSpan) {
        tabTextSpan.textContent = `${months} ${months === 1 ? 'Mês' : 'Meses'}`;
    } else if (tabButton) {
        // Fallback se o span não existir
        tabButton.textContent = `💕 ${months} ${months === 1 ? 'Mês' : 'Meses'} 💕`;
    }
}

// Exportar para uso global
window.themeRegistry = themeRegistry;
window.currentTheme = currentTheme;
window.applyTheme = applyTheme;
window.getScheduledThemeFor = getScheduledThemeFor;
window.toggleHalloweenTheme = toggleHalloweenTheme;
window.toggleTheme = toggleTheme;
window.updateStaticGothicElements = updateStaticGothicElements;
window.updateAnniversaryElements = updateAnniversaryElements;
window.updateAnniversaryStats = updateAnniversaryStats;
window.calculateMonthsOfRelationship = calculateMonthsOfRelationship;
window.isThemeDate = isThemeDate;
window.isAfterHalloween = isAfterHalloween;

