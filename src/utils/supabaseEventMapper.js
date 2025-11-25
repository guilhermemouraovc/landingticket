import { generateSlug } from './stringUtils'

/**
 * Formata data no estilo "14 FEV > 17 FEV"
 */
function formatDateRange(start, end) {
  if (!start && !end) return ''

  const s = new Date(start)
  const e = end ? new Date(end) : null

  const months = [
    'JAN',
    'FEV',
    'MAR',
    'ABR',
    'MAI',
    'JUN',
    'JUL',
    'AGO',
    'SET',
    'OUT',
    'NOV',
    'DEZ',
  ]

  const sDay = s.getDate()
  const sMonth = months[s.getMonth()]
  const startStr = `${sDay} ${sMonth}`

  if (!e || s.toDateString() === e.toDateString()) {
    return startStr
  }

  const eDay = e.getDate()
  const eMonth = months[e.getMonth()]
  const endStr = `${eDay} ${eMonth}`

  return `${startStr} > ${endStr}`
}

/**
 * Formata preço em Real brasileiro
 */
function formatPrice(value) {
  if (!value || value <= 0) return null
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Calcula e formata informações de preço
 */
function formatPriceInfo(row) {
  if (!row.price || row.price <= 0) {
    return {
      hasPrice: false,
      fullPrice: null,
      installments: null,
      installmentValue: null,
      formattedFullPrice: null,
      formattedInstallmentValue: null,
    }
  }

  const fullPrice = row.price
  const installments = row.price_installments || null
  const installmentValue = row.installment_value || null

  return {
    hasPrice: true,
    fullPrice,
    installments,
    installmentValue,
    formattedFullPrice: formatPrice(fullPrice),
    formattedInstallmentValue: installmentValue ? formatPrice(installmentValue) : null,
  }
}

/**
 * Formata cidade e estado
 */
function formatCityStateSimple(city, state) {
  if (!city && !state) return 'Local a definir'
  if (!state) return city
  if (!city) return state
  return city + ' - ' + state
}

export function toEventCardFromSb(row) {
  const priceInfo = formatPriceInfo(row)
  const slug = generateSlug(row.title)

  // Tenta usar image_url da view, se não existir, resolve do array images com context='card'
  let cardImage = row.image_url || '/semfoto.webp'
  
  // Se há array de imagens, usa resolveImage com context 'card' para respeitar image_type
  if (row.images && Array.isArray(row.images) && row.images.length > 0) {
    cardImage = resolveImage(row, 'card')
  }

  return {
    id: row.id,
    slug, // Adiciona o slug
    title: row.title,
    description: row.description,
    date: formatDateRange(row.start_date, row.end_date),
    location: [row.location, row.city, row.state].filter(Boolean).join(' - '),
    cityState: formatCityStateSimple(row.city, row.state), // city - state apenas
    image: cardImage,
    link: { name: 'event-detail', params: { slug } }, // Usa slug ao invés de id
    // Informações de preço
    ...priceInfo,
  }
}

/**
 * Parse de string de data para objeto Date
 */
function parseDate(value) {
  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime()) ? date : null
}

/**
 * Formata data completa (dia da semana, DD de mês de YYYY)
 */
function formatDateLabel(date) {
  if (!date) return 'Data a definir'
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Formata horário (HH:mm BRT)
 */
function formatTimeLabel(date) {
  if (!date) return ''
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${time} BRT`
}

/**
 * Cria badge de data (mês abreviado + dia)
 */
function buildDateBadge(date) {
  if (!date) {
    return { month: '--', day: '--', code: Math.random().toString(36).slice(2) }
  }

  const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
  const day = date.toLocaleDateString('pt-BR', { day: '2-digit' })

  return { month, day, code: (month + '-' + day).toLowerCase() }
}

/**
 * Formata cidade e estado
 */
function formatCityState(city, state) {
  if (!city && !state) return 'Local a definir'
  if (!state) return city
  if (!city) return state
  return city + ' - ' + state
}

/**
 * Resolve a melhor imagem disponível para o evento
 * @param {Object} row - Dados do evento do Supabase
 * @param {string} context - Contexto de uso: 'card' (carrossel) ou 'detail' (página de detalhes)
 * @returns {string} URL da imagem ou imagem padrão
 */
function resolveImage(row, context = 'detail') {
  if (!row.images || !Array.isArray(row.images) || row.images.length === 0) {
    return '/semfoto.webp'
  }

  // Filtra imagens por contexto:
  // - Se context='card': busca imagens com image_type='card' ou 'both' ou null (compatibilidade)
  // - Se context='detail': busca imagens com image_type='detail' ou 'both' ou null (compatibilidade)
  const contextImages = row.images.filter((img) => {
    if (!img.image_type || img.image_type === 'both') return true
    return img.image_type === context
  })

  // Se não há imagens do contexto específico, usa todas (fallback)
  const imagesToSearch = contextImages.length > 0 ? contextImages : row.images

  // Busca a imagem primária primeiro
  const primaryImage = imagesToSearch.find((img) => img.is_primary === true)
  if (primaryImage && primaryImage.url) {
    return primaryImage.url
  }

  // Se não há primária, pega a primeira disponível
  const firstImage = imagesToSearch.find((img) => img.url)
  if (firstImage && firstImage.url) {
    return firstImage.url
  }

  return '/semfoto.webp'
}

export function toEventDetailFromSb(row) {
  const parsedDate = parseDate(row.start_date)
  const dateBadge = buildDateBadge(parsedDate)
  // Usa context='detail' para buscar imagem específica da página de detalhes
  const image = resolveImage(row, 'detail')
  const priceInfo = formatPriceInfo(row)
  const slug = generateSlug(row.title)

  return {
    id: row.id,
    slug, // Adiciona o slug
    title: row.title,
    highlight: row.highlight,
    description: row.description || 'Sem descrição disponível no momento.',
    additionalInfo: row.additional_info || '',
    image: image,
    dateBadge,
    dateLabel: formatDateLabel(parsedDate),
    timeLabel: formatTimeLabel(parsedDate),
    location: row.location || 'Local a definir',
    cityState: formatCityState(row.city, row.state),
    whatsapp: row.whatsapp || null,
    whatsappMessage: row.whatsapp_message || 'Olá! Tenho interesse no evento.',
    shareUrl: row.share_url || null,
    // Informações de preço
    ...priceInfo,
    // Campos adicionais para compatibilidade
    tags: Array.isArray(row.tags) ? row.tags.map((t) => t.name) : [],
    images: Array.isArray(row.images) ? row.images : [],
  }
}
