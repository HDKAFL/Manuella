// Sistema de galeria de fotos dinâmica
let galleryImages = [];
let currentImageIndex = 0;

// Validação de assets - verifica se arquivo existe
function validateAsset(path, assetName, assetType = 'image') {
    return new Promise((resolve) => {
        if (assetType === 'image') {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = path;
        } else if (assetType === 'audio') {
            const audio = new Audio();
            audio.addEventListener('canplaythrough', () => resolve(true));
            audio.addEventListener('error', () => resolve(false));
            audio.src = path;
        } else {
            // Para outros tipos, assumir que existe
            resolve(true);
        }
    });
}

// Função para carregar dinamicamente as imagens (galeria principal)
async function loadGalleryImages() {
    const galleryContainer = document.getElementById('dynamic-gallery');
    galleryImages = [];
    let loadedCount = 0;

    // Validar e carregar cada imagem
    for (let index = 0; index < CONFIG.GALLERY.knownImages.length; index++) {
        const imageName = CONFIG.GALLERY.knownImages[index];
        const imagePath = `${CONFIG.PATHS.photos}${imageName}`;
        
        // Validar se a imagem existe
        const exists = await validateAsset(imagePath, imageName, 'image');
        
        if (exists) {
            galleryImages.push(imagePath);
            loadedCount++;

            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            photoItem.onclick = () => openLightbox(imagePath);

            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = `Moment ${loadedCount}`;
            img.loading = 'lazy';

            photoItem.appendChild(img);
            galleryContainer.appendChild(photoItem);
        } else {
            // Imagem não encontrada, pulando
        }
    }

    // Galeria carregada
}

// Auto-discovery de arquivos (preparado para expansão futura)
// NOTA: Funcionalidade limitada em ambientes locais. 
// Em servidor pode usar fetch API para listar diretórios.
async function discoverAssetsInPath(path, assetType = 'image') {
    // Por enquanto, retorna array vazio
    // Em ambiente de servidor: usar fetch() para listar diretório
    // Auto-discovery desabilitado em ambiente local
    return [];
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
    document.getElementById("lightbox-img").src = galleryImages[currentImageIndex];
}

function previousImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    document.getElementById("lightbox-img").src = galleryImages[currentImageIndex];
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

// Exportar para uso global
window.galleryImages = galleryImages;
window.currentImageIndex = currentImageIndex;
window.loadGalleryImages = loadGalleryImages;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.nextImage = nextImage;
window.previousImage = previousImage;
window.validateAsset = validateAsset;
window.discoverAssetsInPath = discoverAssetsInPath;

