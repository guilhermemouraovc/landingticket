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
