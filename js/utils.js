// Funções utilitárias

// Variável para rastrear se a música estava tocando antes de entrar na aba de vídeos
let wasPlayingBeforeVideos = false;

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
        tab.classList.remove('visual-theme-halloween', 'visual-theme-anniversary');
    });

    // Aplicar tema visual baseado na aba
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        if (tabName === 'halloween') {
            selectedTab.classList.add('visual-theme-halloween');
        } else if (tabName === 'anniversary') {
            selectedTab.classList.add('visual-theme-anniversary');
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

}

// Função para pausar música quando a aba de vídeos for aberta
function pauseMusicForVideos() {
    // Buscar o elemento de áudio diretamente do DOM
    const audioElement = document.getElementById("audio-player");
    
    // Verificar se estava tocando antes de pausar
    wasPlayingBeforeVideos = false;
    
    // Verificar se o audio está disponível e está tocando
    if (audioElement && !audioElement.paused) {
        wasPlayingBeforeVideos = true;
        audioElement.pause();
        
        // Atualizar estado de reprodução
        if (typeof window.isPlaying !== 'undefined') {
            window.isPlaying = false;
        }
        
        // Atualizar variável global se existir
        if (window.audio) {
            window.audio.pause();
        }
        
        // Atualizar botão flutuante
        if (typeof window.updateFloatingButton === 'function') {
            window.updateFloatingButton();
        }
        
        // Atualizar botão principal de play
        const mainPlayBtn = document.getElementById("mainPlayBtn");
        if (mainPlayBtn) {
            mainPlayBtn.innerHTML = "▶️";
        }
        
        // Parar efeitos visuais
        if (typeof window.stopVisualEffect === 'function') {
            window.stopVisualEffect();
        }
    } else if (window.audio && !window.audio.paused) {
        // Fallback: tentar usar window.audio se disponível
        wasPlayingBeforeVideos = true;
        window.audio.pause();
        
        if (typeof window.isPlaying !== 'undefined') {
            window.isPlaying = false;
        }
        
        if (typeof window.updateFloatingButton === 'function') {
            window.updateFloatingButton();
        }
        
        const mainPlayBtn = document.getElementById("mainPlayBtn");
        if (mainPlayBtn) {
            mainPlayBtn.innerHTML = "▶️";
        }
        
        if (typeof window.stopVisualEffect === 'function') {
            window.stopVisualEffect();
        }
    }
}

// Função para retomar música quando sair da aba de vídeos
function resumeMusicAfterVideos() {
    // Se a música estava tocando antes de entrar na aba de vídeos, retomar
    if (wasPlayingBeforeVideos) {
        const audioElement = document.getElementById("audio-player");
        
        if (audioElement) {
            audioElement.play().then(() => {
                // Atualizar estado de reprodução
                if (typeof window.isPlaying !== 'undefined') {
                    window.isPlaying = true;
                }
                
                // Atualizar variável global se existir
                if (window.audio) {
                    window.audio.play();
                }
                
                // Atualizar botão flutuante
                if (typeof window.updateFloatingButton === 'function') {
                    window.updateFloatingButton();
                }
                
                // Atualizar botão principal de play
                const mainPlayBtn = document.getElementById("mainPlayBtn");
                if (mainPlayBtn) {
                    mainPlayBtn.innerHTML = "⏸️";
                }
                
                // Retomar efeitos visuais
                if (typeof window.startVisualEffect === 'function') {
                    window.startVisualEffect();
                }
                
                wasPlayingBeforeVideos = false;
            }).catch((error) => {
                // Se não conseguir tocar (pode ser bloqueio do navegador), apenas resetar a flag
                wasPlayingBeforeVideos = false;
            });
        } else if (window.audio) {
            window.audio.play().then(() => {
                if (typeof window.isPlaying !== 'undefined') {
                    window.isPlaying = true;
                }
                
                if (typeof window.updateFloatingButton === 'function') {
                    window.updateFloatingButton();
                }
                
                const mainPlayBtn = document.getElementById("mainPlayBtn");
                if (mainPlayBtn) {
                    mainPlayBtn.innerHTML = "⏸️";
                }
                
                if (typeof window.startVisualEffect === 'function') {
                    window.startVisualEffect();
                }
                
                wasPlayingBeforeVideos = false;
            }).catch((error) => {
                wasPlayingBeforeVideos = false;
            });
        }
    }
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

