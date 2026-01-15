/**
 * Ordena eventos por prioridade e data
 *
 * Eventos com prioridade (display_priority não-null) aparecem primeiro, ordenados por prioridade crescente.
 * Dentro de cada grupo de prioridade, ordena por data crescente.
 * Eventos sem prioridade aparecem depois, ordenados apenas por data crescente.
 *
 * @param {Array} events - Lista de eventos a ordenar
 * @returns {Array} Eventos ordenados por prioridade e data
 */
export function sortEventsByPriorityAndDate(events) {
  if (!events || events.length === 0) return events

  return [...events].sort((a, b) => {
    const aPriority = a.display_priority ?? null
    const bPriority = b.display_priority ?? null
    const aDate = a.start_date ? new Date(a.start_date).getTime() : Infinity
    const bDate = b.start_date ? new Date(b.start_date).getTime() : Infinity

    if (aPriority !== null && bPriority !== null) {
      if (aPriority !== bPriority) {
        return aPriority - bPriority
      }
      return aDate - bDate
    }

    if (aPriority !== null && bPriority === null) {
      return -1
    }

    if (aPriority === null && bPriority !== null) {
      return 1
    }

    return aDate - bDate
  })
}

/**
 * Ordena eventos por prioridade dentro de uma tag específica
 *
 * Usa priority_in_tag do objeto de tags do evento para ordenar.
 * Se um evento tem múltiplas tags, usa a prioridade da tag especificada.
 *
 * @param {Array} events - Lista de eventos a ordenar
 * @param {string} tagName - Nome da tag para usar como referência de prioridade
 * @returns {Array} Eventos ordenados por priority_in_tag
 */
export function sortEventsByTagPriority(events, tagName) {
  if (!events || events.length === 0) return events

  return [...events].sort((a, b) => {
    // Busca a prioridade em cada tag do evento
    const getTagPriority = (event) => {
      if (!event.tags || !Array.isArray(event.tags)) return 999
      const tag = event.tags.find((t) => t.name === tagName)
      return tag?.priority_in_tag ?? 999
    }

    const aPrio = getTagPriority(a)
    const bPrio = getTagPriority(b)

    // Ordena por priority_in_tag (menor número = maior prioridade)
    if (aPrio !== bPrio) {
      return aPrio - bPrio
    }

    // Se mesma prioridade, ordena por data
    const aDate = a.start_date ? new Date(a.start_date).getTime() : Infinity
    const bDate = b.start_date ? new Date(b.start_date).getTime() : Infinity
    return aDate - bDate
  })
}
