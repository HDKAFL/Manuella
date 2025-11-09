// Configuração centralizada da aplicação
// Todos os paths, constantes e configurações estão aqui

const CONFIG = {
    // ==========================================
    // PATHS - Caminhos de pastas
    // ==========================================
    PATHS: {
        photos: 'photos/',
        photosHalloween: 'photos-halloween/',
        photosCat: 'photos-cat/',
        music: 'music/',
        musicHalloween: 'music-halloween/',
        musicAnniversary: 'music-anniversary/',
        musicForest: 'music-florest/'
    },

    // ==========================================
    // AUDIO - Configurações de áudio
    // ==========================================
    AUDIO: {
        defaultVolume: 0.7,
        manuellaMusicStartTime: 0,
        halloweenMusicStartTime: 0,
        halloweenMusicVolume: 0.7,
        anniversaryMusicStartTime: 0,
        anniversaryMusicVolume: 0.7,
        forestMusicStartTime: 0,
        forestMusicVolume: 0.6
    },

    // ==========================================
    // ANIMATION - Configurações de animação
    // ==========================================
    ANIMATION: {
        characterDelay: 300,        // Delay entre cada personagem de Halloween (ms)
        moveInterval: 8000,          // Intervalo de movimento dos personagens (ms)
        fadeDuration: 500,           // Duração do fade (ms)
        gothicInterval: 3000,        // Intervalo para criar elementos góticos (ms)
        cockroachInterval: 2000,     // Intervalo para criar baratinhas (ms)

        // Posições de elementos góticos
        gothicPositions: [
            { top: '15%', left: '10%', delay: 0 },
            { top: '25%', left: '85%', delay: 1 },
            { top: '65%', left: '20%', delay: 2 },
            { top: '75%', left: '80%', delay: 3 },
            { top: '45%', left: '5%', delay: 4 },
            { top: '35%', left: '90%', delay: 5 }
        ],

        // Emojis góticos para tela de entrada e principal
        gothicEmojis: ['🦇', '🌙', '🖤', '🌹', '⚰️', '🔮'],
        classicEmojis: ['🌕', '❤️', '🖤', '🌙', '💕', '🌚'],
        halloweenEmojis: ['🎃', '🦇', '👻', '🕷️', '🕯️', '🪦'],
        anniversaryEmojis: ['💕', '💖', '💗', '🌹', '✨', '💝'],
        matinhoEmojis: ['🍃', '🌿', '🍀', '🪴', '🍄', '🦋', '🐸', '🦉']
    },

    // ==========================================
    // HALLOWEEN - Configurações Halloween
    // ==========================================
    HALLOWEEN: {
        characters: [
            'pngegg.png',  // Esqueleto - aparecerá 5 vezes
            'pngegg.png',
            'pngegg.png',
            'pngegg.png',
            'pngegg.png',
            'dada.png',
            'pngegg (1).png',
            'pngegg (2).png',
            'pngimg.com - jason_vorhees_PNG14.png',
            'pngimg.com - ghostface_PNG25.png',
            'chucky-jason-voorhees-tiffany-freddy-krueger-childs-play-chucky-png-photos-5eb4abeb1891c80399c203e9365ded0c.png',
            'pinhead-chucky-freddy-krueger-youtube-hellraiser-chucky-13bdcf975b69148f59ec87c735b7246b.png',
            'pngtree-black-and-white-high-contrast-jason-voorhees-portrait-with-machete-png-image_17014524.webp'
        ],

        // Probabilidade de criar elementos flutuantes (0.0 a 1.0)
        floatingChance: 0.2
    },

    // ==========================================
    // CONSOLE - Configurações de mensagens
    // ==========================================
    CONSOLE: {
        welcomeDelay: 2000,          // Delay para mensagens de boas-vindas (ms)
        progressUpdateInterval: 1000  // Intervalo para atualizar progresso (ms)
    },

    // ==========================================
    // STARS - Configurações de estrelas
    // ==========================================
    STARS: {
        entryCount: 80,              // Número de estrelas na tela de entrada
        mainCount: 100,              // Número de estrelas no conteúdo principal
        minDelay: 0,                 // Delay mínimo de animação (s)
        maxDelay: 3,                 // Delay máximo de animação (s)
        minDuration: 2,              // Duração mínima (s)
        maxDuration: 5,              // Duração máxima (s)
        minSize: 1,                  // Tamanho mínimo (px)
        maxSize: 3                   // Tamanho máximo (px)
    },

    // ==========================================
    // GALLERY - Configurações da galeria
    // ==========================================
    GALLERY: {
        knownImages: [
            "WhatsApp Image 2025-10-06 at 03.09.46.jpeg",
            "WhatsApp Image 2025-10-06 at 03.09.47.jpeg",
            "WhatsApp-Image-2025-10-06-at-03.09.46-_1_.png",
            "WhatsApp-Image-2025-10-06-at-03.09.46-_2_.png",
            "WhatsApp-Image-2025-10-06-at-03.09.46-_3_.png",
            "WhatsApp-Image-2025-10-06-at-03.09.46-_4_.png",
            "WhatsApp-Image-2025-10-06-at-03.09.46-_5_.png",
            "WhatsApp-Image-2025-10-06-at-03.09.46.png",
            "WhatsApp-Image-2025-10-06-at-03.09.47.png"
        ],

        catPhotos: [
            "WhatsApp Image 2025-10-06 at 05.24.18.jpeg",
            "WhatsApp Image 2025-10-04 at 21.40.25.jpeg"
        ]
    },

    // ==========================================
    // RANDOM - Configurações de valores aleatórios
    // ==========================================
    RANDOM: {
        positionMaxPercent: 85,      // Máximo percentual para posicionamento
        topPositionMaxPercent: 80,   // Máximo percentual para posição Y
        maxDuration: 4,              // Duração máxima de animação (s)
        minDuration: 8,              // Duração mínima de animação (s)
        maxDelay: 3,                 // Delay máximo de animação (s)

        cockroachInterval: 1500,     // Intervalo de movimento das baratinhas (ms)
        cockroachExtraChance: 0.1,   // Probabilidade de criar baratinha extra
        cockroachExtraInterval: 8000, // Intervalo para tentar criar extras (ms)

        cockroachOffsetX: 30,        // Offset horizontal entre baratinhas
        cockroachOffsetY: 15         // Offset vertical entre baratinhas
    }
};

// Exportar para uso global
window.CONFIG = CONFIG;

