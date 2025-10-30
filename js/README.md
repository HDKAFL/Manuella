# Estrutura Modular da Aplicação

Esta pasta contém os arquivos JavaScript da aplicação, organizados por funcionalidade.

## Arquivos e Responsabilidades

### `config.js` ⭐ NOVO
**Configuração centralizada de toda a aplicação:**
- `PATHS` - Caminhos de todas as pastas (photos, music, etc.)
- `AUDIO` - Configurações de volume, start time, etc.
- `ANIMATION` - Delays, intervals, positions
- `HALLOWEEN` - Personagens, floating chance
- `CONSOLE` - Mensagens e delays
- `STARS` - Configurações de estrelas
- `GALLERY` - Listas de imagens
- `RANDOM` - Valores para cálculos aleatórios
- **FONTE ÚNICA** de configuração - muda aqui, propaga automaticamente

### `utils.js`
Funções utilitárias gerais:
- `formatTime()` - Formata tempo em mm:ss
- `showTab()` - Controla navegação entre abas
- `isHalloweenDate()` - Verifica se a data atual é Halloween (usa agenda centralizada)
- `isAfterHalloween2025()` - Verifica se já passou do Halloween

### `theme.js`
Sistema de temas da aplicação:
- Registry de temas (classic, halloween)
- Agenda centralizada de datas (`themeSchedule`) - FONTE ÚNICA DA VERDADE
- `applyTheme()` - Aplica tema selecionado
- `getScheduledThemeFor()` - Obtém tema para uma data específica
- `isThemeDate()` - Verifica se uma data corresponde a um tema
- `toggleHalloweenTheme()` - Alterna entre tema clássico e Halloween
- `updateStaticGothicElements()` - Atualiza emojis estáticos conforme tema

### `music.js`
Player de música e controle de playlist:
- Array de playlist com 7 músicas
- Configurações de música (manuellaMusic, halloweenMusic)
- Controles: play, pause, next, previous, volume
- Funções de progresso e seek

### `effects.js`
Efeitos visuais da página:
- `createStars()` - Cria estrelas de fundo
- `createEntryStars()` - Cria estrelas da tela de entrada
- `createFloatingGothicElement()` - Elementos flutuantes temáticos
- `startVisualEffect()` / `stopVisualEffect()` - Controla efeitos durante música

### `gallery.js`
Sistema de galeria de fotos:
- `loadGalleryImages()` - Carrega imagens dinamicamente
- Lightbox para visualização ampliada
- Navegação por teclado (Esc, setas)
- Próxima/anterior

### `halloween.js`
Funcionalidades específicas de Halloween:
- `createHalloweenCharacters()` - Personagens flutuantes de Halloween
- `moveHalloweenCharacter()` - Animação de movimento dos personagens
- `toggleFloatingImages()` - Liga/desliga imagens flutuantes
- `createFloatingSpookyElement()` - Elementos temáticos especiais

### `cockroaches.js`
Sistema de baratinhas/morcegos:
- `initCockroachSystem()` - Inicializa o sistema
- `createRandomCockroachMovement()` - Movimento aleatório
- `updateCockroachIcons()` - Atualiza ícones conforme tema (🪳 ou 🦇)
- Criação de baratinhas aleatórias extras

### `main.js`
Arquivo principal de inicialização:
- `enterPage()` - Transição tela de entrada → conteúdo principal
- `initMainPage()` - Configura toda a página
- DOMContentLoaded - Inicializa aplicação completa
- Coordena todas as funcionalidades

## Ordem de Carregamento

Os arquivos devem ser carregados nesta ordem no HTML:

1. `config.js` ⭐ - **PRIMEIRO!** Configurações centralizadas
2. `theme.js` - Sistema de temas
3. `utils.js` - Funções básicas
4. `music.js` - Player e controle de áudio
5. `effects.js` - Efeitos visuais
6. `gallery.js` - Galeria de fotos
7. `halloween.js` - Funcionalidades de Halloween
8. `cockroaches.js` - Sistema de baratinhas
9. `main.js` - Inicialização final

## Variáveis Globais

Principais variáveis globais compartilhadas entre módulos:

- `audio` - Elemento de áudio HTML
- `isPlaying` - Estado de reprodução
- `currentTrackIndex` - Índice da música atual
- `galleryImages` - Array de imagens da galeria
- `currentImageIndex` - Índice da imagem atual
- `floatingImagesEnabled` - Estado das imagens flutuantes
- `currentTheme` - Tema atual
- `themeRegistry` - Registry de temas disponíveis

## Melhorias Aplicadas

Esta refatoração transformou um arquivo monolítico de 844 linhas em 9 módulos especializados + configuração centralizada, melhorando:

- **Manutenibilidade**: Cada arquivo tem uma responsabilidade única
- **Legibilidade**: Código mais organizado e fácil de navegar
- **Escalabilidade**: Adicionar novas funcionalidades é mais simples
- **Debugging**: Erros são mais fáceis de localizar
- **Colaboração**: Múltiplos desenvolvedores podem trabalhar simultaneamente

