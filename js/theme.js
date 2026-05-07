// Sistema de temas (registry e aplicação)
const themeRegistry = {
    classic: {
        key: 'classic',
        label: '🌙 Tema Clássico',
        dataTheme: '',
        addBodyClass: false,
        bodyClass: ''
    },
    halloween: {
        key: 'halloween',
        label: '🎃 Tema de Halloween',
        dataTheme: 'halloween',
        addBodyClass: true,
        bodyClass: 'halloween'
    },
    anniversary: {
        key: 'anniversary',
        label: '💕 Tema de 1 Mês',
        dataTheme: 'anniversary',
        addBodyClass: true,
        bodyClass: 'anniversary'
    },
    matinho: {
        key: 'matinho',
        label: '🌿🍃 Matinho Encantado 🍃🌿',
        dataTheme: 'matinho',
        addBodyClass: true,
        bodyClass: 'matinho'
    },
    birthday: {
        key: 'birthday',
        label: '🎂 Aniversário da Manu',
        dataTheme: 'birthday',
        addBodyClass: true,
        bodyClass: 'birthday'
    }
};

let currentTheme = 'classic';

function applyTheme(themeName, options = {}) {
    const theme = themeRegistry[themeName] || themeRegistry.classic;
    const previousTheme = currentTheme;
    const shouldUpdate = options.force || previousTheme !== theme.key;

    if (!shouldUpdate) {
        return false;
    }

    currentTheme = theme.key;

    // data-theme para CSS por variáveis
    if (theme.dataTheme) {
        document.body.setAttribute('data-theme', theme.dataTheme);
    } else {
        document.body.removeAttribute('data-theme');
    }

    // Compat: classe .halloween já usada nos estilos existentes
    // Remover todas as classes de tema primeiro
    document.body.classList.remove('halloween', 'anniversary', 'matinho', 'birthday');

    if (theme.addBodyClass && theme.bodyClass) {
        document.body.classList.add(theme.bodyClass);
    }

    // UI dependente do tema
    const charactersContainer = document.getElementById('halloweenCharacters');
    if (charactersContainer) {
        if (theme.key === 'halloween' && theme.addBodyClass && floatingImagesEnabled) {
            createHalloweenCharacters();
            // NÃO focar automaticamente na aba Halloween - deixar usuário navegar
        } else {
            if (typeof clearHalloweenCharacters === 'function') {
                clearHalloweenCharacters();
            } else {
                charactersContainer.innerHTML = '';
            }
        }
    }

    // Limpar elementos de aniversário de namoro quando não for tema anniversary
    const anniversaryContainer = document.getElementById('anniversaryElements');
    if (anniversaryContainer && theme.key !== 'anniversary') {
        anniversaryContainer.innerHTML = '';
    }

    const birthdayContainer = document.getElementById('birthdayElements');
    if (birthdayContainer && theme.key !== 'birthday') {
        birthdayContainer.innerHTML = '';
    }

    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
        btn.textContent = theme.label;
        btn.classList.remove('matinho-active');

        if (theme.key === 'matinho') {
            btn.classList.add('matinho-active');
        }

        // Ocultar botão apenas quando estivermos na data de um evento agendado
        const today = new Date();
        const isCommemorativeDateActive = isThemeDate('halloween', today)
            || isThemeDate('anniversary', today)
            || isThemeDate('matinho', today)
            || isThemeDate('birthday', today);
        btn.style.display = isCommemorativeDateActive ? 'none' : 'inline-block';
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

    // Atualizar elementos de aniversário de namoro
    updateAnniversaryElements();

    updateBirthdayElements();

    // Persistir
    if (!options.skipPersist) {
        try { localStorage.setItem('theme', theme.key); } catch (e) { }
    }

    return true;
}

// Agenda de temas por datas (prioridade maior vence)
const themeSchedule = [
    { id: 'halloween', month: 10, dayStart: 31, dayEnd: 31, theme: 'halloween', priority: 90 },
    { id: 'matinho-nov', month: 11, dayStart: 1, dayEnd: 30, theme: 'matinho', priority: 80 },
    // 06/05 a 15/05: aba especial de "4 meses" (usa o tema anniversary)
    { id: 'anniversary-4months-may6-15', month: 5, dayStart: 6, dayEnd: 15, theme: 'anniversary', priority: 96 },
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

(function registerBirthdayFromConfig() {
    if (typeof CONFIG !== 'undefined' && CONFIG.BIRTHDAY && CONFIG.BIRTHDAY.month && CONFIG.BIRTHDAY.day) {
        themeSchedule.push({
            id: 'birthday-manuella',
            month: CONFIG.BIRTHDAY.month,
            dayStart: CONFIG.BIRTHDAY.day,
            dayEnd: CONFIG.BIRTHDAY.day,
            theme: 'birthday',
            priority: 100
        });
    }
})();

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
    const themes = ['classic', 'halloween', 'anniversary', 'birthday', 'matinho'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const next = themes[nextIndex];
    const changed = applyTheme(next);
    if (changed && typeof renderPlaylist === 'function') {
        renderPlaylist();
    }
    if (next === 'halloween') {
        for (let i = 0; i < 6; i++) setTimeout(() => createFloatingSpookyElement(), i * 250);
    } else if (next === 'anniversary') {
        updateAnniversaryElements();
    } else if (next === 'birthday') {
        updateBirthdayElements();
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
    const isMatinhoTheme = document.body.classList.contains('matinho');
    const isBirthdayTheme = document.body.classList.contains('birthday');

    let set;
    if (isHalloweenTheme) {
        set = CONFIG.ANIMATION.halloweenEmojis;
    } else if (isMatinhoTheme) {
        set = CONFIG.ANIMATION.matinhoEmojis || CONFIG.ANIMATION.classicEmojis;
    } else if (isBirthdayTheme) {
        set = CONFIG.ANIMATION.birthdayEmojis || CONFIG.ANIMATION.classicEmojis;
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

// Atualiza as estatísticas de aniversário (fixo: 3 meses de namoro)
function updateAnniversaryStats() {
    const monthsCount = 3;
    const monthsTitlePhrase = `${monthsCount} Meses de Namoro`;
    const tabMonthsLabel = '3 meses de namoro';

    const anniversaryTab = document.getElementById('anniversary');
    if (!anniversaryTab) {
        return;
    }

    // Atualizar número de meses (primeiro stat-item)
    const statItems = anniversaryTab.querySelectorAll('.anniversary-stats .stat-item');
    if (statItems.length > 0) {
        const firstStatNumber = statItems[0].querySelector('.stat-number');
        const firstStatLabel = statItems[0].querySelector('.stat-label');

        if (firstStatNumber) {
            firstStatNumber.textContent = String(monthsCount);
        }

        if (firstStatLabel && (firstStatLabel.textContent.includes('Mês') || firstStatLabel.textContent.includes('Meses'))) {
            firstStatLabel.textContent = 'Meses';
        }
    }

    // Atualizar badge de dias
    const daysSinceStart = Math.floor((new Date() - new Date(2025, 9, 3)) / (1000 * 60 * 60 * 24));
    const badge = anniversaryTab.querySelector('.anniversary-badge');
    if (badge) {
        badge.textContent = `${daysSinceStart} dias`;
    }

    const title = anniversaryTab.querySelector('.anniversary-title');
    if (title) {
        let titleText = title.innerHTML;
        titleText = titleText.replace(/\d+\s*Meses?\s*(?:de\s*Namoro)?/gi, monthsTitlePhrase);
        titleText = titleText.replace(/Um\s*Mês\s*(?:de\s*Namoro)?/gi, monthsTitlePhrase);
        title.innerHTML = titleText;
    }

    const tabButton = document.getElementById('tabBtnAnniversary');
    const tabTextSpan = document.getElementById('anniversaryTabText');
    if (tabButton && tabTextSpan) {
        tabTextSpan.textContent = tabMonthsLabel;
    } else if (tabButton) {
        tabButton.textContent = `💕 ${tabMonthsLabel} 💕`;
    }
}

function updateBirthdayElements() {
    if (!document.body.classList.contains('birthday')) {
        return;
    }

    const birthdayContainer = document.getElementById('birthdayElements');
    if (!birthdayContainer || typeof CONFIG === 'undefined') {
        return;
    }

    birthdayContainer.innerHTML = '';
    const emojis = CONFIG.ANIMATION.birthdayEmojis || ['🎂', '🎈', '🎁'];
    for (let i = 0; i < 8; i++) {
        const el = document.createElement('div');
        el.className = 'birthday-float';
        el.textContent = emojis[i % emojis.length];
        el.style.left = Math.random() * 88 + '%';
        el.style.top = Math.random() * 88 + '%';
        el.style.animationDelay = (i * 0.35) + 's';
        el.style.animationDuration = (3.5 + Math.random() * 2.5) + 's';
        birthdayContainer.appendChild(el);
    }

    updateBirthdayStats();
}

function updateBirthdayStats() {
    const line = document.getElementById('birthdayAgeLine');
    if (!line || typeof CONFIG === 'undefined' || !CONFIG.BIRTHDAY) {
        return;
    }

    const y = CONFIG.BIRTHDAY.yearOfBirth;
    if (typeof y !== 'number' || isNaN(y)) {
        line.textContent = '';
        line.hidden = true;
        return;
    }

    line.hidden = false;

    const today = new Date();
    const month = CONFIG.BIRTHDAY.month - 1;
    const day = CONFIG.BIRTHDAY.day;
    let age = today.getFullYear() - y;
    if (today.getMonth() < month || (today.getMonth() === month && today.getDate() < day)) {
        age--;
    }
    line.textContent = `Hoje você faz ${age} anos.`;
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
window.updateBirthdayElements = updateBirthdayElements;
window.updateBirthdayStats = updateBirthdayStats;
window.calculateMonthsOfRelationship = calculateMonthsOfRelationship;
window.isThemeDate = isThemeDate;
window.isAfterHalloween = isAfterHalloween;

