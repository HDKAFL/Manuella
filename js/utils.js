// Funções utilitárias

let currentActiveTab = 'carta';

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Aplica tema visual apenas na aba (não altera tema global)
function applyTabVisualTheme(tabName) {
    // Remover classes de tema visual das abas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('visual-theme-halloween', 'visual-theme-anniversary', 'visual-theme-matinho');
    });

    // Aplicar tema visual baseado na aba
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        if (tabName === 'halloween') {
            selectedTab.classList.add('visual-theme-halloween');
        } else if (tabName === 'anniversary') {
            selectedTab.classList.add('visual-theme-anniversary');
        } else if (tabName === 'matinho') {
            selectedTab.classList.add('visual-theme-matinho');
        }
    }
}

// Função para mostrar/esconder abas
function showTab(tabName) {
    // Esconder todas as abas
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });

    // Remover classe active de todos os botões
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Mostrar aba selecionada
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Adicionar classe active ao botão correspondente
    const buttonId = 'tabBtn' + tabName.charAt(0).toUpperCase() + tabName.slice(1);
    const correspondingButton = document.getElementById(buttonId);
    if (correspondingButton) {
        correspondingButton.classList.add('active');
    } else {
        // Fallback: tentar adicionar ao botão clicado via evento
        const clickedButton = (typeof event !== 'undefined' && event && event.target && event.target.classList) ? event.target : null;
        if (clickedButton) {
            clickedButton.classList.add('active');
        }
    }

    // Aplicar tema visual apenas na aba (sem alterar tema global)
    applyTabVisualTheme(tabName);

    // Se for a aba de aniversário, atualizar estatísticas
    if (tabName === 'anniversary' && typeof updateAnniversaryStats === 'function') {
        updateAnniversaryStats();
    }

    handleTabThemeAndMusic(tabName);
    currentActiveTab = tabName;

}

function handleTabThemeAndMusic(tabName) {
    if (typeof applyTheme !== 'function') return;

    const themeByTab = {
        halloween: 'halloween',
        anniversary: 'anniversary',
        matinho: 'matinho',
        carta: 'classic',
        musicas: 'classic'
    };

    const targetTheme = themeByTab[tabName] || 'classic';
    const themeChanged = applyTheme(targetTheme, { skipPersist: true });

    if (themeChanged && typeof renderPlaylist === 'function') {
        renderPlaylist();
    }

    const musicConfig = resolveMusicForTheme(targetTheme);
    ensureMusicState(musicConfig, {
        themeChanged,
        preservePlaybackState: targetTheme === 'classic'
    });
}

function resolveMusicForTheme(themeKey) {
    switch (themeKey) {
        case 'halloween':
            return window.halloweenMusic || window.manuellaMusic;
        case 'anniversary':
            return window.anniversaryMusic || window.manuellaMusic;
        case 'matinho':
            return window.forestMusic || window.manuellaMusic;
        default:
            return window.manuellaMusic;
    }
}

function ensureMusicState(musicConfig, options = {}) {
    if (typeof getActivePlaylist !== 'function' || typeof loadTrack !== 'function') return;

    if (!window.audio) {
        window.audio = document.getElementById('audio-player');
    }

    const audioElement = window.audio;
    const audioSource = document.getElementById('audioSource');
    if (!audioElement || !audioSource) return;

    const wasPlaying = !!window.isPlaying;
    const targetFile = musicConfig.file;
    const currentSrc = audioSource.getAttribute('src') || '';
    const needsLoad = !currentSrc || !currentSrc.endsWith(targetFile);

    if (needsLoad) {
        const playlistItems = getActivePlaylist();
        let targetIndex = playlistItems.findIndex(track => track.file === targetFile);
        if (targetIndex === -1) {
            targetIndex = 0;
        }

        window.currentTrackIndex = targetIndex;
        loadTrack(targetIndex);
        markPlaylistActive(targetIndex);
    } else {
        markPlaylistActive(window.currentTrackIndex || 0);
    }

    if (typeof musicConfig.startTime === 'number' && musicConfig.startTime > 0 && audioElement.currentTime < musicConfig.startTime) {
        audioElement.currentTime = musicConfig.startTime;
    }

    if (typeof musicConfig.volume === 'number') {
        audioElement.volume = musicConfig.volume;
    }

    const shouldPreserve = options.preservePlaybackState;
    const shouldForcePlay = options.themeChanged && !shouldPreserve;
    let shouldPlay = wasPlaying;

    if (shouldForcePlay) {
        shouldPlay = true;
    }

    if (shouldPreserve && !wasPlaying) {
        shouldPlay = false;
    }

    if (shouldPlay) {
        audioElement.play().then(() => {
            window.isPlaying = true;
            const mainPlayBtn = document.getElementById('mainPlayBtn');
            if (mainPlayBtn) mainPlayBtn.innerHTML = "⏸️";
            if (typeof startVisualEffect === 'function') startVisualEffect();
            if (typeof updateFloatingButton === 'function') updateFloatingButton();
        }).catch(() => {
            // ignorar erros de autoplay
        });
    } else {
        window.isPlaying = wasPlaying;
        if (!wasPlaying && typeof stopVisualEffect === 'function') {
            stopVisualEffect();
        }
        if (typeof updateFloatingButton === 'function') updateFloatingButton();
    }
}

function markPlaylistActive(index) {
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Função de compatibilidade que usa a agenda centralizada de temas
function isHalloweenDate() {
    // Usa a agenda de temas como fonte única da verdade (qualquer ano)
    return isThemeDate('halloween');
}

// Função de compatibilidade que usa a agenda centralizada de temas
function isAfterHalloween2025() {
    // Usa a agenda de temas como fonte única da verdade
    return isAfterHalloween();
}

// Exportar para uso global
window.formatTime = formatTime;
window.showTab = showTab;
window.applyTabVisualTheme = applyTabVisualTheme;
window.isHalloweenDate = isHalloweenDate;
window.isAfterHalloween2025 = isAfterHalloween2025;

