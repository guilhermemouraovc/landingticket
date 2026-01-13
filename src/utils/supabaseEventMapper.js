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
 * Inclui lógica para determinar se deve mostrar parcelas baseado no valor do ingresso
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
      shouldShowInstallments: false,
    }
  }

  const fullPrice = row.price
  const installments = row.price_installments || null
  const installmentValue = row.installment_value || null

  // Não mostra parcelas se:
  // - Preço for baixo (menor que R$100) - não faz sentido mostrar parcelas para valores baixos
  // - Número de parcelas for 1 ou menos (não faz sentido mostrar "1x")
  const PRICE_THRESHOLD = 100
  const shouldShowInstallments =
    fullPrice >= PRICE_THRESHOLD && installments && installments > 1 && installmentValue

  return {
    hasPrice: true,
    fullPrice,
    installments,
    installmentValue,
    formattedFullPrice: formatPrice(fullPrice),
    formattedInstallmentValue: installmentValue ? formatPrice(installmentValue) : null,
    shouldShowInstallments,
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
    start_date: row.start_date, // Mantém para ordenação
    location: [row.location, row.city, row.state].filter(Boolean).join(' - '),
    cityState: formatCityStateSimple(row.city, row.state), // city - state apenas
    image: cardImage,
    link: { name: 'event-detail', params: { slug } }, // Usa slug ao invés de id
    display_priority: row.display_priority || null, // Prioridade para ordenação
    showLastTickets: row.show_last_tickets || false, // Badge "Últimos ingressos!"
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

/**
 * Formata os dias do evento
 */
function formatEventDays(days) {
  if (!days || !Array.isArray(days) || days.length === 0) return []

  return days.map((day) => {
    let dateLabel = ''
    let dateBadge = { day: '', month: '' }
    let formattedDateShort = ''

    if (day.date) {
      // Cria data garantindo que não haja problema de timezone (adiciona hora meio dia)
      const dateObj = new Date(`${day.date}T12:00:00`)

      if (!Number.isNaN(dateObj.getTime())) {
        // Formato: "14/02 Sábado"
        const dayStr = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        const weekStr = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' })
        // Capitaliza primeira letra
        const weekStrCap = weekStr.charAt(0).toUpperCase() + weekStr.slice(1)

        dateLabel = `${dayStr} ${weekStrCap}`

        // Formato curto: "14 FEV" (para fallback)
        const dayNum = dateObj.getDate()
        const monthShort = dateObj
          .toLocaleDateString('pt-BR', { month: 'short' })
          .replace('.', '')
          .toUpperCase()
        formattedDateShort = `${dayNum} ${monthShort}`

        // Badge info
        dateBadge = {
          day: dateObj.getDate().toString().padStart(2, '0'),
          month: monthShort,
        }
      }
    }

    const priceInfo = formatPriceInfo({
      price: day.price,
      price_installments: day.price_installments,
      installment_value: day.installment_value,
    })

    return {
      id: day.id,
      date: day.date,
      title: day.title, // Ex: "Dia 1", "Sábado"
      label: dateLabel, // Ex: "14/02 Sábado"
      formattedDateShort, // Ex: "14 FEV"
      description: day.description,
      ticketUrl: day.ticket_url,
      dateBadge,
      ...priceInfo,
    }
  })
}

export function toEventDetailFromSb(row) {
  const parsedDate = parseDate(row.start_date)
  const dateBadge = buildDateBadge(parsedDate)
  // Usa context='detail' para buscar imagem específica da página de detalhes
  const image = resolveImage(row, 'detail')
  const priceInfo = formatPriceInfo(row)
  const slug = generateSlug(row.title)
  const days = formatEventDays(row.days)

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
    whatsappMessage: row.whatsapp_message || null,
    shareUrl: row.share_url || null,
    // Datas raw para verificação de expiração
    start_date: row.start_date,
    end_date: row.end_date,
    // Informações de preço
    ...priceInfo,
    days, // Lista de dias formatada
    // Campos adicionais para compatibilidade
    tags: Array.isArray(row.tags) ? row.tags.map((t) => t.name) : [],
    images: Array.isArray(row.images) ? row.images : [],
  }
}
