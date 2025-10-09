/**
 * Utilitários para transformação e formatação de eventos do Strapi
 */

import { DEFAULT_IMAGES } from 'src/constants/config'

const DEFAULT_HOST = 'http://localhost:1337'

// ============================================================================
// TRANSFORMAÇÃO PRINCIPAL
// ============================================================================

/**
 * Transforma um evento do Strapi em um objeto padronizado para cards
 * @param {Object} festa - Objeto do evento vindo do Strapi
 * @param {Object} options - Opções adicionais
 * @param {string} options.dateFormat - Formato de data: 'short' (padrão) ou 'numeric'
 * @returns {Object} Evento formatado
 */
export function toEventCard(festa, options = {}) {
  const record = festa?.attributes ?? festa ?? {}
  const baseId = festa?.id ?? record.id ?? record.UID ?? record.slug ?? record.documentId
  const cardId = String(baseId ?? Math.random().toString(36).slice(2))
  const documentId = record.documentId ?? String(baseId ?? cardId)

  const title = extractTitle(record)
  const description = extractDescription(record)
  const dateValue = extractDate(record)
  const city = extractCity(record)
  const state = extractState(record)

  // Escolhe o formato de data baseado nas opções
  const formattedDate =
    options.dateFormat === 'numeric' ? formatDateNumeric(dateValue) : formatDate(dateValue)

  return {
    id: cardId,
    title,
    description,
    date: formattedDate,
    location: formatLocation(city, state),
    image: resolveImage(record),
    link: { name: 'event-detail', params: { id: documentId } },
    ...options,
  }
}

/**
 * Transforma um evento do Strapi em um objeto detalhado para página de detalhes
 * @param {Object} payload - Payload do Strapi
 * @returns {Object} Evento detalhado
 */
export function toEventDetail(payload) {
  const record = payload?.attributes ?? payload ?? {}
  const parsedDate = parseDate(record.Data)
  const dateBadge = buildDateBadge(parsedDate)
  const whatsapp = extractWhatsapp(record)

  return {
    id: String(payload?.id ?? record.documentId ?? dateBadge.code),
    title: record.Nome ?? record.title ?? 'Evento sem nome',
    highlight: record.gatilho ?? record.subtitulo ?? '',
    description:
      record.Descricao ??
      record.descricao ??
      record.description ??
      'Sem descrição disponível no momento.',
    additionalInfo: record.observacoes ?? record.observacao ?? record.Observacao ?? '',
    image: resolveImage(record),
    dateBadge,
    dateLabel: formatDateLabel(parsedDate),
    timeLabel: formatTimeLabel(parsedDate),
    location:
      record.Local ?? record.local ?? record.Localizacao ?? record.Cidade ?? 'Local a definir',
    cityState: formatCityState(record.Cidade, record.Estado),
    whatsapp,
    whatsappMessage:
      record.mensagemWhatsapp ?? record.mensagem ?? 'Olá! Tenho interesse no evento.',
    shareUrl: record.link ?? record.url ?? record.site ?? '',
  }
}

// ============================================================================
// EXTRAÇÃO DE CAMPOS
// ============================================================================

/**
 * Extrai o título do evento de múltiplos campos possíveis
 */
function extractTitle(record) {
  return (
    firstNonEmptyString(
      record.Nome,
      record.nome,
      record.Titulo,
      record.titulo,
      record.Title,
      record.title,
    ) || 'Evento sem nome'
  )
}

/**
 * Extrai a descrição do evento
 */
function extractDescription(record) {
  return firstNonEmptyString(
    record.Descricao,
    record.descricao,
    record.description,
    record.Resumo,
    record.resumo,
  )
}

/**
 * Extrai a data do evento
 */
function extractDate(record) {
  return firstNonEmptyString(
    record.Data,
    record.data,
    record.DataInicio,
    record.dataInicio,
    record.data_inicio,
    record.Inicio,
    record.inicio,
    record.startDate,
  )
}

/**
 * Extrai a cidade do evento
 */
function extractCity(record) {
  return firstNonEmptyString(
    record.Cidade,
    record.cidade,
    record.Localidade,
    record.local,
    record.city,
  )
}

/**
 * Extrai o estado do evento
 */
function extractState(record) {
  return firstNonEmptyString(record.Estado, record.estado, record.UF, record.uf, record.state)
}

/**
 * Extrai WhatsApp do evento
 */
function extractWhatsapp(record) {
  const candidate =
    record.whatsapp ??
    record.Whatsapp ??
    record.whatsApp ??
    record.contatoWhatsapp ??
    record.whatsappNumber ??
    record.linkWhatsapp ??
    null

  if (!candidate || typeof candidate !== 'string') return null
  const digits = candidate.replace(/\D/g, '')
  return digits.length >= 10 ? digits : null
}

// ============================================================================
// FORMATAÇÃO DE DATAS
// ============================================================================

/**
 * Formata uma data para exibição simples (DD/MM/AAAA)
 * @param {string|Date} value - Valor da data
 * @returns {string} Data formatada
 */
export function formatDate(value) {
  if (!value) return 'Data a definir'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Data a definir'
  return parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

/**
 * Formata data para formato DD/MM/YYYY
 */
export function formatDateNumeric(value) {
  if (!value) return 'Data a definir'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Data a definir'
  return parsed.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Formata data completa (dia da semana, DD de mês de YYYY)
 */
export function formatDateLabel(date) {
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
export function formatTimeLabel(date) {
  if (!date) return ''
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${time} BRT`
}

/**
 * Parse de string de data para objeto Date
 */
export function parseDate(value) {
  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime()) ? date : null
}

/**
 * Cria badge de data (mês abreviado + dia)
 */
export function buildDateBadge(date) {
  if (!date) {
    return { month: '--', day: '--', code: Math.random().toString(36).slice(2) }
  }

  const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
  const day = date.toLocaleDateString('pt-BR', { day: '2-digit' })

  return { month, day, code: (month + '-' + day).toLowerCase() }
}

// ============================================================================
// FORMATAÇÃO DE LOCALIZAÇÃO
// ============================================================================

/**
 * Formata localização (Cidade - Estado)
 * @param {string} city - Cidade
 * @param {string} state - Estado
 * @returns {string} Localização formatada
 */
export function formatLocation(city, state) {
  if (!city && !state) return 'Local a definir'
  if (!city) return state
  if (!state) return city
  return city + ' - ' + state
}

/**
 * Formata cidade e estado
 */
export function formatCityState(city, state) {
  if (!city && !state) return 'Local a definir'
  if (!state) return city
  if (!city) return state
  return city + ' - ' + state
}

// ============================================================================
// RESOLUÇÃO DE IMAGENS
// ============================================================================

/**
 * Resolve a melhor imagem disponível para o evento
 * @param {Object} record - Registro do evento
 * @returns {string} URL da imagem
 */
export function resolveImage(record) {
  const gallery = Array.isArray(record?.FOTOSEVENTO) ? record.FOTOSEVENTO : []
  const sources = [
    record?.banner,
    record?.capa,
    record?.imagem,
    record?.Imagem,
    record?.imagemUrl,
    record?.cover,
    record?.capaPrincipal,
    ...gallery,
  ]

  for (const source of sources) {
    const url = extractMediaUrl(source)
    if (url) return prependHost(url)
  }

  return DEFAULT_IMAGES.eventPlaceholder
}

/**
 * Extrai URL de um objeto de mídia do Strapi
 * @param {*} media - Objeto de mídia
 * @returns {string|null} URL extraída
 */
export function extractMediaUrl(media) {
  if (!media) return null
  if (typeof media === 'string') return media
  if (Array.isArray(media)) {
    for (const item of media) {
      const nested = extractMediaUrl(item)
      if (nested) return nested
    }
    return null
  }

  return (
    media?.url ??
    media?.attributes?.url ??
    media?.data?.attributes?.url ??
    media?.data?.url ??
    media?.formats?.medium?.url ??
    media?.formats?.large?.url ??
    media?.formats?.small?.url ??
    null
  )
}

/**
 * Adiciona host à URL se necessário
 * @param {string} url - URL relativa ou absoluta
 * @returns {string} URL completa
 */
export function prependHost(url) {
  if (!url || typeof url !== 'string') return DEFAULT_IMAGES.eventPlaceholder
  if (url.startsWith('http')) return url
  return DEFAULT_HOST + url
}

// ============================================================================
// HELPERS AUXILIARES
// ============================================================================

/**
 * Retorna a primeira string não vazia encontrada
 * @param {...*} values - Valores para verificar
 * @returns {string} Primeira string não vazia ou string vazia
 */
function firstNonEmptyString(...values) {
  for (const value of values) {
    if (typeof value !== 'string') continue
    const trimmed = value.trim()
    if (trimmed.length > 0) return trimmed
  }
  return ''
}

/**
 * Remove acentos e normaliza string
 * @param {string} str - String para normalizar
 * @returns {string} String normalizada
 */
export function normalizeString(str) {
  if (!str || typeof str !== 'string') return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
