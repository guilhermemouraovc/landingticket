/**
 * Configurações centralizadas da aplicação
 */

// Configurações de API
export const API_CONFIG = {
  timeout: 15000, // 15 segundos
  pageSize: 25, // Número de itens por página
  popularEventsLimit: 10, // Limite de eventos populares
  carouselItemsPerPage: 4, // Itens por página no carousel
}

// Imagens padrão (placeholders)
export const DEFAULT_IMAGES = {
  eventPlaceholder: '/logo.svg',
  bannerPlaceholder: '/logo.svg',
  avatarPlaceholder: '/icons/favicon-128x128.png',
}

// Categorias de eventos com suas tags
export const CATEGORIES = [
  {
    id: 'shows',
    name: 'Shows',
    tags: ['show', 'música', 'música ao vivo', 'concerto'],
    icon: 'music_note',
    color: 'purple',
  },
  {
    id: 'teatro',
    name: 'Teatro',
    tags: ['teatro', 'peça', 'espetáculo', 'dramaturgia'],
    icon: 'theater_comedy',
    color: 'red',
  },
  {
    id: 'stand-up',
    name: 'Stand-Up',
    tags: ['stand-up', 'comédia', 'humor', 'standup'],
    icon: 'mic',
    color: 'orange',
  },
  {
    id: 'esportes',
    name: 'Esportes',
    tags: ['esporte', 'futebol', 'jogo', 'campeonato', 'partida'],
    icon: 'sports_soccer',
    color: 'green',
  },
  {
    id: 'infantil',
    name: 'Infantil',
    tags: ['infantil', 'criança', 'kids', 'família'],
    icon: 'child_care',
    color: 'pink',
  },
  {
    id: 'festa',
    name: 'Festas',
    tags: ['festa', 'balada', 'night', 'dj', 'eletrônica'],
    icon: 'celebration',
    color: 'indigo',
  },
  {
    id: 'cultura',
    name: 'Cultura',
    tags: ['cultura', 'exposição', 'arte', 'museu', 'cultural'],
    icon: 'palette',
    color: 'teal',
  },
  {
    id: 'gastronomia',
    name: 'Gastronomia',
    tags: ['gastronomia', 'food', 'culinária', 'restaurante'],
    icon: 'restaurant',
    color: 'amber',
  },
]

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
  networkError: 'Erro de conexão. Verifique sua internet e tente novamente.',
  notFound: 'Conteúdo não encontrado.',
  serverError: 'Erro no servidor. Tente novamente mais tarde.',
  unauthorized: 'Acesso não autorizado.',
  timeout: 'A requisição demorou muito. Tente novamente.',
  generic: 'Ocorreu um erro. Tente novamente.',
}

// Configurações de formatação
export const FORMAT_CONFIG = {
  dateFormat: 'DD/MM/YYYY',
  timeFormat: 'HH:mm',
  dateTimeFormat: 'DD/MM/YYYY [às] HH:mm',
  locale: 'pt-BR',
}
