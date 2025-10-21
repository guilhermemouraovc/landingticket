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
 * Formata data completa (para detalhes)
 */
function formatRange(start, end) {
  if (!start && !end) return ''
  const s = new Date(start)
  const e = end ? new Date(end) : null
  const f = { day: '2-digit', month: '2-digit', year: 'numeric' }
  const sStr = s.toLocaleDateString('pt-BR', f)
  const eStr = e ? e.toLocaleDateString('pt-BR', f) : null
  return eStr && eStr !== sStr ? `${sStr} - ${eStr}` : sStr
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

export function toEventCardFromSb(row) {
  const priceInfo = formatPriceInfo(row)

  console.log('🔍 Mapeando evento:', {
    id: row.id,
    title: row.title,
    image_url: row.image_url,
    hasImageUrl: !!row.image_url,
  })

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: formatDateRange(row.start_date, row.end_date),
    location: [row.location, row.city, row.state].filter(Boolean).join(' - '),
    image: row.image_url || '/logo.svg',
    link: { name: 'event-detail', params: { id: row.id } },
    // Informações de preço
    ...priceInfo,
  }
}

export function toEventDetailFromSb(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    highlight: row.highlight,
    additional_info: row.additional_info,
    date: formatRange(row.start_date, row.end_date),
    location: [row.location, row.city, row.state].filter(Boolean).join(' - '),
    images: Array.isArray(row.images) ? row.images : [],
    tags: Array.isArray(row.tags) ? row.tags.map((t) => t.name) : [],
    whatsapp: row.whatsapp || null,
    whatsapp_message: row.whatsapp_message || null,
    share_url: row.share_url || null,
  }
}
