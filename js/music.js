// Player de Música
const playlist = [
    {
        title: "Join Me In Death",
        artist: "HIM",
        file: `${CONFIG.PATHS.music}Join Me In Death.mp3`,
        duration: "4:34"
    },
    {
        title: "Lonely Day",
        artist: "System Of A Down",
        file: `${CONFIG.PATHS.music}System Of A Down - Lonely Day (Official HD Video) [DnGdoEa1tPg].mp3`,
        duration: "2:47"
    },
    {
        title: "Blue Jeans",
        artist: "Lana Del Rey",
        file: `${CONFIG.PATHS.music}Lana Del Rey - Blue Jeans - LanaDelReyVEVO (youtube).mp3`,
        duration: "3:29"
    },
    {
        title: "Tempo Perdido",
        artist: "Legião Urbana",
        file: `${CONFIG.PATHS.music}Legião Urbana · Tempo perdido [YPLQHeUSX2g].mp3`,
        duration: "5:20"
    },
    {
        title: "Lovesong",
        artist: "The Cure",
        file: `${CONFIG.PATHS.music}Lovesong (Remastered) [90A5Iys9u3w].mp3`,
        duration: "3:29"
    },
    {
        title: "God Is A Weapon",
        artist: "Falling In Reverse feat. Marilyn Manson",
        file: `${CONFIG.PATHS.music}Falling In Reverse - God Is A Weapon Feat. Marylin Manson (Legendado_Tradução) [LvieH9AUIgE].mp3`,
        duration: "3:45"
    },
    {
        title: "Mulher de Fases",
        artist: "Raimundos",
        file: `${CONFIG.PATHS.music}Raimundos - Mulher de Fases (Clipe Oficial) [FkXWfreN2QA].mp3`,
        duration: "3:15"
    }
];

// Música especial da Manuella
const manuellaMusic = {
    name: "Join Me In Death - HIM",
    file: `${CONFIG.PATHS.music}Join Me In Death.mp3`,
    startTime: CONFIG.AUDIO.manuellaMusicStartTime,
    volume: CONFIG.AUDIO.defaultVolume
};

// Música de Halloween (usada somente entre 27-31/10)
const halloweenMusic = {
    name: "Creepy Music Box (Dark Music)",
    file: `${CONFIG.PATHS.musicHalloween}Creepy Music Box (Dark Music) [XOc8GK0n1Y4].mp3`,
    startTime: CONFIG.AUDIO.halloweenMusicStartTime,
    volume: CONFIG.AUDIO.halloweenMusicVolume
};

// Música de Aniversário
const anniversaryMusic = {
    name: "I Was Made For Lovin' You",
    file: `${CONFIG.PATHS.musicAnniversary}Kiss - I Was Made For Lovin' You [ZhIsAZO5gl0].mp3`,
    startTime: CONFIG.AUDIO.anniversaryMusicStartTime,
    volume: CONFIG.AUDIO.anniversaryMusicVolume
};

// Música do Matinho da Manu
const forestMusic = {
    name: "Nature Background",
    file: `${CONFIG.PATHS.musicForest}1-Minute Nature Background Sound [DeHUFsrCYr0].mp3`,
    startTime: CONFIG.AUDIO.forestMusicStartTime,
    volume: CONFIG.AUDIO.forestMusicVolume || CONFIG.AUDIO.defaultVolume
};

// Playlist expandida com música de Halloween
const halloweenPlaylistItem = {
    title: "Creepy Music Box (Dark Music)",
    artist: "Halloween Theme",
    file: halloweenMusic.file,
    duration: "∞"
};

// Playlist expandida com música de Aniversário
const anniversaryPlaylistItem = {
    title: "I Was Made For Lovin' You",
    artist: "Kiss",
    file: anniversaryMusic.file,
    duration: "4:00"
};

// Playlist do Matinho da Manu
const forestPlaylistItem = {
    title: "Nature Background",
    artist: "Matinho da Manu",
    file: forestMusic.file,
    duration: "1:00"
};

// Função para obter a playlist baseada na data e tema
function getActivePlaylist() {
    const isMatinho = document.body.classList.contains('matinho');
    const isAnniversaryTheme = document.body.classList.contains('anniversary');
    const isHalloweenTheme = document.body.classList.contains('halloween');
    const isHalloweenScheduled = typeof isHalloweenDate === 'function' ? isHalloweenDate() : false;

    if (isMatinho) {
        return [forestPlaylistItem];
    }

    if (isAnniversaryTheme) {
        return [anniversaryPlaylistItem, ...playlist];
    }

    if (isHalloweenTheme || isHalloweenScheduled) {
        return [halloweenPlaylistItem, ...playlist];
    }

    return playlist;
}

let currentTrackIndex = 0;
let isPlaying = false;
let audio = null;

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
            // Erro ao reproduzir áudio
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
    const activePlaylist = getActivePlaylist();
    const track = activePlaylist[index];
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
    const activePlaylist = getActivePlaylist();
    currentTrackIndex = (currentTrackIndex + 1) % activePlaylist.length;
    selectTrack(currentTrackIndex);
}

function previousTrack() {
    const activePlaylist = getActivePlaylist();
    currentTrackIndex = (currentTrackIndex - 1 + activePlaylist.length) % activePlaylist.length;
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

function togglePlay() {
    if (!audio) {
        audio = document.getElementById("audio-player");
        audio.volume = manuellaMusic.volume;
        audio.currentTime = manuellaMusic.startTime;
    }

    if (!isPlaying) {
        audio.play().then(() => {
            isPlaying = true;
            startVisualEffect();
            updateFloatingButton();
        }).catch((error) => {
            document.addEventListener('click', () => {
                audio.play();
                isPlaying = true;
                startVisualEffect();
                updateFloatingButton();
            }, { once: true });
        });
    } else {
        audio.pause();
        isPlaying = false;
        stopVisualEffect();
        updateFloatingButton();
    }
}

function toggleFloatingMusic() {
    togglePlay();
}

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

function togglePlayer() {
    togglePlay();
}

// Função para renderizar a playlist dinamicamente
function renderPlaylist() {
    const activePlaylist = getActivePlaylist();
    const playlistContainer = document.querySelector('.playlist-items');

    if (!playlistContainer) return;

    // Limpar playlist atual
    playlistContainer.innerHTML = '';

    // Renderizar cada música
    activePlaylist.forEach((track, index) => {
        const playlistItem = document.createElement('div');
        playlistItem.className = 'playlist-item';
        playlistItem.setAttribute('data-index', index);
        playlistItem.onclick = () => selectTrack(index);

        const number = document.createElement('div');
        number.className = 'playlist-item-number';
        number.textContent = index + 1;

        const info = document.createElement('div');
        info.className = 'playlist-item-info';

        const title = document.createElement('div');
        title.className = 'playlist-item-title';
        title.textContent = track.title;

        info.appendChild(title);

        const duration = document.createElement('div');
        duration.className = 'playlist-item-duration';
        duration.textContent = track.duration;

        playlistItem.appendChild(number);
        playlistItem.appendChild(info);
        playlistItem.appendChild(duration);

        playlistContainer.appendChild(playlistItem);
    });

    // Não marcar nenhum item como ativo aqui - será feito pelo selectTrack()
}

// Exportar para uso global
window.playlist = playlist;
window.manuellaMusic = manuellaMusic;
window.halloweenMusic = halloweenMusic;
window.anniversaryMusic = anniversaryMusic;
window.forestMusic = forestMusic;
window.currentTrackIndex = currentTrackIndex;
window.isPlaying = isPlaying;
window.audio = audio;
window.toggleMainPlay = toggleMainPlay;
window.selectTrack = selectTrack;
window.loadTrack = loadTrack;
window.nextTrack = nextTrack;
window.previousTrack = previousTrack;
window.seekTrack = seekTrack;
window.changeVolume = changeVolume;
window.updateProgress = updateProgress;
window.togglePlay = togglePlay;
window.toggleFloatingMusic = toggleFloatingMusic;
window.updateFloatingButton = updateFloatingButton;
window.togglePlayer = togglePlayer;
window.getActivePlaylist = getActivePlaylist;
window.renderPlaylist = renderPlaylist;

