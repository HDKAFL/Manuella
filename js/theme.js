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
    if (theme.addBodyClass) {
        document.body.classList.add('halloween');
    } else {
        document.body.classList.remove('halloween');
    }

    // UI dependente do tema
    const charactersContainer = document.getElementById('halloweenCharacters');
    if (charactersContainer) {
        if (theme.addBodyClass && floatingImagesEnabled) {
            createHalloweenCharacters();
            // NÃO focar automaticamente na aba Halloween - deixar usuário navegar
        } else {
            charactersContainer.innerHTML = '';
        }
    }

    const btn = document.getElementById('themeToggleBtn');
    if (btn) btn.textContent = theme.label;

    // Botão de imagens flutuantes apenas no Halloween
    const imagesBtn2 = document.getElementById('floatingImagesBtn');
    if (imagesBtn2) imagesBtn2.style.display = theme.addBodyClass ? 'inline-flex' : 'none';

    // Atualizar ícones/baratas
    if (typeof updateCockroachIcons === 'function') {
        updateCockroachIcons();
    }

    // Atualizar emojis estáticos conforme tema
    updateStaticGothicElements();

    // Re-renderizar playlist para incluir/remover música de Halloween
    if (typeof renderPlaylist === 'function') {
        renderPlaylist();
    }

    // Persistir
    if (!options.skipPersist) {
        try { localStorage.setItem('theme', theme.key); } catch (e) { }
    }
}

// Agenda de temas por datas (prioridade maior vence)
const themeSchedule = [
    { id: 'halloween', month: 10, dayStart: 31, dayEnd: 31, theme: 'halloween', priority: 90 }
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
    const next = (currentTheme === 'halloween') ? 'classic' : 'halloween';
    applyTheme(next);
    if (next === 'halloween') {
        for (let i = 0; i < 6; i++) setTimeout(() => createFloatingSpookyElement(), i * 250);
    }
}

// Atualiza os elementos góticos estáticos já presentes no HTML
function updateStaticGothicElements() {
    const isHalloweenTheme = document.body.classList.contains('halloween');
    const set = isHalloweenTheme ? CONFIG.ANIMATION.halloweenEmojis : CONFIG.ANIMATION.classicEmojis;
    const nodes = document.querySelectorAll('.gothic-element');
    nodes.forEach((el, idx) => {
        el.textContent = set[idx % set.length];
    });
}

// Exportar para uso global
window.themeRegistry = themeRegistry;
window.currentTheme = currentTheme;
window.applyTheme = applyTheme;
window.getScheduledThemeFor = getScheduledThemeFor;
window.toggleHalloweenTheme = toggleHalloweenTheme;
window.updateStaticGothicElements = updateStaticGothicElements;
window.isThemeDate = isThemeDate;
window.isAfterHalloween = isAfterHalloween;

