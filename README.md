# 🖤 Para Manuella - Meu Amor Eterno 🖤

Uma página web romântica especial criada com HTML, CSS e JavaScript.

## 📁 Estrutura do Projeto

```
Manuella/
├── index.html                 # Página principal (refatorada)
├── styles.css                 # Estilos da aplicação
├── js/                        # Código JavaScript modular
│   ├── config.js            # ⭐ Configuração centralizada
│   ├── utils.js              # Funções utilitárias
│   ├── theme.js              # Sistema de temas
│   ├── music.js              # Player de música
│   ├── effects.js            # Efeitos visuais
│   ├── gallery.js            # Galeria de fotos
│   ├── halloween.js          # Funcionalidades de Halloween
│   ├── cockroaches.js        # Sistema de baratinhas/morcegos
│   ├── main.js               # Inicialização principal
│   └── README.md             # Documentação dos módulos JS
├── music/                     # Músicas da playlist
├── music-halloween/           # Músicas de Halloween
├── photos/                    # Fotos da galeria
├── photos-cat/                # Fotos especiais (molduras)
└── photos-halloween/          # Imagens de personagens de Halloween

```

## 🎯 Funcionalidades

### 🎨 Temas
- **Clássico**: Tema romântico padrão com tons roxos e vermelhos
- **Halloween**: Tema especial para 27-31 de outubro com imagens de personagens assustadores

### 🎵 Player de Música
- Playlist com 7 músicas especiais
- Controles de play/pause, próxima/anterior
- Barra de progresso interativa
- Controle de volume
- Música de fundo automática

### 📸 Galeria de Fotos
- Carregamento dinâmico de imagens
- Lightbox para visualização ampliada
- Navegação por teclado (setas e ESC)
- Molduras especiais para fotos principais

### 🎃 Halloween
- Personagens flutuantes temáticos
- Elementos visuais especiais
- Música ambiente de Halloween
- Mensagem personalizada de Halloween

### 🪳 Baratinhas
- Baratinhas (ou morcegos no Halloween) caminhando juntas pela tela
- Ícones que mudam conforme o tema
- Animação suave e contínua

## 🔄 Refatoração Realizada

Este projeto foi completamente refatorado para melhor organização:

### Antes
- **JavaScript**: 1 arquivo monolítico (`script.js` com 844 linhas)
- **HTML**: 1 arquivo grande sem organização clara
- Difícil manutenção
- Código misturado sem separação clara
- Baixa produtividade para adicionar funcionalidades

### Depois
- **JavaScript**: 9 módulos especializados + config centralizado em `js/`
- **HTML**: Organizado com seções e comentários claros em `index.html`
- Código organizado por responsabilidade
- Fácil manutenção e expansão
- Estrutura altamente escalável

### Benefícios da Refatoração
✅ **Manutenibilidade**: Cada arquivo tem uma responsabilidade única  
✅ **Legibilidade**: Código mais limpo e organizado  
✅ **Escalabilidade**: Adicionar features é simples  
✅ **Debugging**: Erros localizados rapidamente  
✅ **Colaboração**: Múltiplos devs podem trabalhar simultaneamente  
✅ **Modularidade**: Componentes reutilizáveis e independentes  
✅ **Documentação**: READMEs explicativos em cada pasta  

## 🚀 Como Usar

Simplesmente abra `index.html` em qualquer navegador moderno.

A aplicação detecta automaticamente:
- Data atual para aplicar temas sazonais
- Preferências salvas do usuário
- Configurações de áudio do navegador

## 📝 Notas Técnicas

- **Compatibilidade**: Navegadores modernos (Chrome, Firefox, Edge, Safari)
- **Armazenamento**: LocalStorage para preferências de tema
- **Performance**: Carregamento otimizado e lazy loading de imagens
- **Responsivo**: Design adaptativo para mobile, tablet e desktop
- **Arquitetura**: Código modular com seções HTML organizadas e módulos JS separados
- **Extensibilidade**: Fácil adicionar novos componentes e funcionalidades

## 🎨 Tema Halloween

O tema Halloween é ativado automaticamente entre **27 e 31 de outubro**.

Durante este período:
- Personagens de terror flutuam pela tela
- Paleta de cores muda para laranja/roxo escuro
- Música ambiente especial
- Mensagem romântica de Halloween

## 💝 Sobre

Uma declaração de amor eterna em formato web, com funcionalidades interativas, efeitos visuais e playlist personalizada.

---

*Feito com amor e muito carinho ❤️*

