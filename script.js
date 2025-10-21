// Array de músicas
const playlist = [
    {
        title: "Join Me In Death",
        artist: "HIM",
        file: "music/Join Me In Death.mp3",
        duration: "4:34"
    },
    {
        title: "Lonely Day",
        artist: "System Of A Down",
        file: "music/System Of A Down - Lonely Day (Official HD Video) [DnGdoEa1tPg].mp3",
        duration: "2:47"
    },
    {
        title: "Blue Jeans",
        artist: "Lana Del Rey",
        file: "music/Lana Del Rey - Blue Jeans - LanaDelReyVEVO (youtube).mp3",
        duration: "3:29"
    },
    {
        title: "Tempo Perdido",
        artist: "Legião Urbana",
        file: "music/Legião Urbana · Tempo perdido [YPLQHeUSX2g].mp3",
        duration: "5:20"
    },
    {
        title: "Lovesong",
        artist: "The Cure",
        file: "music/Lovesong (Remastered) [90A5Iys9u3w].mp3",
        duration: "3:29"
    },
    {
        title: "God Is A Weapon",
        artist: "Falling In Reverse feat. Marilyn Manson",
        file: "music/Falling In Reverse - God Is A Weapon Feat. Marylin Manson (Legendado_Tradução) [LvieH9AUIgE].mp3",
        duration: "3:45"
    },
    {
        title: "Mulher de Fases",
        artist: "Raimundos",
        file: "music/Raimundos - Mulher de Fases (Clipe Oficial) [FkXWfreN2QA].mp3",
        duration: "3:15"
    }
];

let currentTrackIndex = 0;

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

    // Adicionar classe active ao botão clicado
    const clickedButton = event.target;
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
}

// Funções do Player de Música
function toggleMainPlay() {
    if (!audio) {
        audio = document.getElementById("audio-player");
        audio.volume = 1.0;
    }

    const mainPlayBtn = document.getElementById("mainPlayBtn");

    if (!isPlaying) {
        audio.play().then(() => {
            isPlaying = true;
            mainPlayBtn.innerHTML = "⏸️";
            updateFloatingButton();
            startVisualEffect();
        }).catch((error) => {
            console.log("Erro ao reproduzir áudio:", error);
        });
    } else {
        audio.pause();
        isPlaying = false;
        mainPlayBtn.innerHTML = "▶️";
        updateFloatingButton();
        stopVisualEffect();
    }
}

function selectTrack(index) {
    currentTrackIndex = index;
    loadTrack(index);

    // Atualizar visual da playlist
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Tocar automaticamente
    if (audio) {
        audio.play().then(() => {
            isPlaying = true;
            updateFloatingButton();
            const mainPlayBtn = document.getElementById("mainPlayBtn");
            if (mainPlayBtn) mainPlayBtn.innerHTML = "⏸️";
        });
    }
}

function loadTrack(index) {
    const track = playlist[index];
    if (!audio) {
        audio = document.getElementById("audio-player");
    }

    // Atualizar source do áudio
    const audioSource = document.getElementById("audioSource");
    audioSource.src = track.file;
    audio.load();

    // Atualizar informações da música
    const trackTitle = document.getElementById("trackTitle");
    const trackArtist = document.getElementById("trackArtist");

    if (trackTitle) trackTitle.textContent = track.title;
    if (trackArtist) trackArtist.textContent = track.artist;
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    selectTrack(currentTrackIndex);
}

function previousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    selectTrack(currentTrackIndex);
}

function seekTrack() {
    const progressBar = document.getElementById("progressBar");
    if (audio && audio.duration) {
        const seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    }
}

function changeVolume() {
    const volumeSlider = document.getElementById("volumeSlider");
    if (audio) {
        audio.volume = volumeSlider.value / 100;
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateProgress() {
    if (!audio) return;

    const progressBar = document.getElementById("progressBar");
    const currentTime = document.getElementById("currentTime");
    const duration = document.getElementById("duration");

    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        if (progressBar) progressBar.value = progress;
        if (currentTime) currentTime.textContent = formatTime(audio.currentTime);
        if (duration) duration.textContent = formatTime(audio.duration);
    }
}

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
            if (!audio) {
                audio = document.getElementById("audio-player");
                audio.volume = manuellaMusic.volume;
                audio.currentTime = manuellaMusic.startTime;
            }

            // Tocar música automaticamente
            audio.play().then(() => {
                isPlaying = true;
                startVisualEffect();
                updateFloatingButton();
            }).catch((error) => {
                console.log("Erro ao reproduzir áudio:", error);
                // Se falhar, o usuário pode clicar no botão flutuante
            });
        }, 500);
    }, 1000);
}

// Criar estrelas para tela de entrada
function createEntryStars() {
    const starsContainer = document.getElementById("entryStars");
    const numberOfStars = 80;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement("div");
        star.className = "entry-star";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.width = Math.random() * 3 + 1 + "px";
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 3 + "s";
        star.style.animationDuration = Math.random() * 3 + 2 + "s";

        starsContainer.appendChild(star);
    }
}

// Criar estrelas de fundo
function createStars() {
    const starsContainer = document.getElementById("stars");
    const numberOfStars = 100;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.width = Math.random() * 3 + 1 + "px";
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 3 + "s";
        star.style.animationDuration = Math.random() * 3 + 2 + "s";

        starsContainer.appendChild(star);
    }
}

// Adicionar mais elementos românticos flutuantes periodicamente
function createFloatingGothicElement() {
    const elements = ["🌕", "❤️", "🖤", "🌙", "💕", "🌚", "💖", "🌗", "🌔"];
    const randomElement =
        elements[Math.floor(Math.random() * elements.length)];

    const gothicElement = document.createElement("div");
    gothicElement.className = "gothic-element";
    gothicElement.innerHTML = randomElement;
    gothicElement.style.position = "fixed";
    gothicElement.style.fontSize = "25px";
    gothicElement.style.color = "#8b0000";
    gothicElement.style.pointerEvents = "none";
    gothicElement.style.zIndex = "1000";
    gothicElement.style.left = Math.random() * window.innerWidth + "px";
    gothicElement.style.top = window.innerHeight + "px";
    gothicElement.style.animation = "float 6s ease-out forwards";
    gothicElement.style.filter =
        "drop-shadow(0 0 10px rgba(139, 0, 0, 0.5))";

    document.body.appendChild(gothicElement);

    setTimeout(() => {
        gothicElement.remove();
    }, 6000);
}

// Música especial da Manuella
const manuellaMusic = {
    name: "Join Me In Death - HIM",
    file: "music/Join Me In Death.mp3",
    startTime: 50, // Começar no segundo 50
    volume: 1    // Volume 70%
};

let isPlaying = false;
let audio = null;

function togglePlay() {
    if (!audio) {
        audio = document.getElementById("audio-player");
        audio.volume = manuellaMusic.volume;
        audio.currentTime = manuellaMusic.startTime;
    }

    if (!isPlaying) {
        // Tocar música
        audio.play().then(() => {
            isPlaying = true;
            startVisualEffect();
            updateFloatingButton();
        }).catch((error) => {
            console.log("Erro ao reproduzir áudio:", error);
            // Tentar ativar com interação do usuário
            document.addEventListener('click', () => {
                audio.play();
                isPlaying = true;
                startVisualEffect();
                updateFloatingButton();
            }, { once: true });
        });
    } else {
        // Pausar música
        audio.pause();
        isPlaying = false;
        stopVisualEffect();
        updateFloatingButton();
    }
}

// Função para controlar música pelo botão flutuante
function toggleFloatingMusic() {
    togglePlay();
}

// Função para atualizar o estado do botão flutuante
function updateFloatingButton() {
    const floatingBtn = document.getElementById("floatingMusicBtn");

    if (isPlaying) {
        floatingBtn.innerHTML = "⏸️";
        floatingBtn.classList.remove("paused");
    } else {
        floatingBtn.innerHTML = "▶️";
        floatingBtn.classList.add("paused");
    }
}

// Função para mostrar/esconder o player (chamada quando clicar no título ou área do player)
function togglePlayer() {
    togglePlay();
}

// Sistema de galeria de fotos dinâmica
let galleryImages = [];
let currentImageIndex = 0;

// Lista de imagens conhecidas (você pode adicionar mais aqui)
const knownImages = [
    "WhatsApp Image 2025-10-06 at 03.09.46.jpeg",
    "WhatsApp Image 2025-10-06 at 03.09.47.jpeg",
    "WhatsApp-Image-2025-10-06-at-03.09.46-_1_.png",
    "WhatsApp-Image-2025-10-06-at-03.09.46-_2_.png",
    "WhatsApp-Image-2025-10-06-at-03.09.46-_3_.png",
    "WhatsApp-Image-2025-10-06-at-03.09.46-_4_.png",
    "WhatsApp-Image-2025-10-06-at-03.09.46-_5_.png",
    "WhatsApp-Image-2025-10-06-at-03.09.46.png",
    "WhatsApp-Image-2025-10-06-at-03.09.47.png"
];

// Função para carregar dinamicamente as imagens (galeria principal)
function loadGalleryImages() {
    const galleryContainer = document.getElementById('dynamic-gallery');
    galleryImages = [];

    knownImages.forEach((imageName, index) => {
        const imagePath = `photos/${imageName}`;
        galleryImages.push(imagePath);

        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.onclick = () => openLightbox(imagePath);

        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Moment ${index + 1}`;
        img.loading = 'lazy';

        // Adicionar evento de erro para tentar extensões alternativas
        img.onerror = function () {
            // Tentar com extensão diferente se falhar
            const nameWithoutExt = imageName.replace(/\.(png|jpeg|jpg)$/i, '');
            const altPath = `photos/${nameWithoutExt}.jpg`;
            img.src = altPath;
            img.onerror = function () {
                console.log(`Imagem não encontrada: ${imageName}`);
            };
        };

        photoItem.appendChild(img);
        galleryContainer.appendChild(photoItem);
    });

    console.log(`${galleryImages.length} imagens carregadas na galeria`);
}


function openLightbox(imageSrc) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    currentImageIndex = galleryImages.indexOf(imageSrc);
    lightboxImg.src = imageSrc;
    lightbox.style.display = "block";

    // Adicionar efeito de fade in
    setTimeout(() => {
        lightbox.style.opacity = "1";
    }, 10);

    // Prevenir scroll do body
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    lightbox.style.opacity = "0";

    setTimeout(() => {
        lightbox.style.display = "none";
        document.body.style.overflow = "auto";
    }, 300);
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    document.getElementById("lightbox-img").src =
        galleryImages[currentImageIndex];
}

function previousImage() {
    currentImageIndex =
        (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    document.getElementById("lightbox-img").src =
        galleryImages[currentImageIndex];
}


// Navegação com teclado
document.addEventListener("keydown", function (event) {
    const lightbox = document.getElementById("lightbox");

    if (lightbox.style.display === "block") {
        switch (event.key) {
            case "Escape":
                closeLightbox();
                break;
            case "ArrowRight":
                nextImage();
                break;
            case "ArrowLeft":
                previousImage();
                break;
        }
    }
});

function startVisualEffect() {
    // Criar mais elementos flutuantes durante a reprodução
    const effectInterval = setInterval(() => {
        if (isPlaying) {
            createFloatingGothicElement();
        } else {
            clearInterval(effectInterval);
        }
    }, 1000);
}

function stopVisualEffect() {
    // Parar efeitos visuais
}



// Inicializar página principal
function initMainPage() {
    createStars();
    loadGalleryImages(); // Carregar galeria dinamicamente

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
        console.log("Erro no áudio");
    });

    // Player já está tocando automaticamente no HTML
    isPlaying = true;
    startVisualEffect();

    // Adicionar elementos góticos periodicamente
    setInterval(() => {
        if (Math.random() < 0.2) {
            createFloatingGothicElement();
        }
    }, 3000);

    // Inicializar sistema de baratinhas
    initCockroachSystem();

    // Atualizar progresso a cada segundo
    setInterval(updateProgress, 1000);

    // Mensagem de boas-vindas gótica (apenas no console)
    setTimeout(() => {
        console.log(
            "🖤 Bem-vinda à sua carta de amor eterna, Manuella! Você é a minha obsessão mais bela! 🖤"
        );
        console.log("🪳 As baratinhas estão andando juntinhas por você! 🪳");
    }, 2000);
}

// Inicializar página de entrada
document.addEventListener("DOMContentLoaded", function () {
    createEntryStars();
});
