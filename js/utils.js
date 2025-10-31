// Funções utilitárias

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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

    // Adicionar classe active ao botão clicado (se houver evento de clique)
    const clickedButton = (typeof event !== 'undefined' && event && event.target && event.target.classList) ? event.target : null;
    if (clickedButton) {
        clickedButton.classList.add('active');
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
window.isHalloweenDate = isHalloweenDate;
window.isAfterHalloween2025 = isAfterHalloween2025;

