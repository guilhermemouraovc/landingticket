/**
 * Sorts events by display priority and start date.
 *
 * Events with a non-null `display_priority` appear before events without priority; among those,
 * events are ordered by ascending `display_priority`. Within the same priority (or when both events
 * lack priority), events are ordered by ascending `start_date`. Events missing `start_date` are
 * treated as occurring after dated events. The function returns the input unchanged if it is
 * falsy or an empty array and otherwise returns a new, shallow-copied array sorted as described.
 *
 * @param {Array} events - Array of event objects to sort. Each event may include `display_priority` and `start_date`.
 * @returns {Array} A new array of events sorted by priority and date, or the original input if it was falsy or empty.
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
 * Sorts events by the priority value stored in a specified tag, using start_date as a tiebreaker.
 *
 * @param {Array} events - Array of event objects to sort.
 * @param {string} tagName - Tag name whose `priority_in_tag` value determines ordering.
 * @returns {Array} A new array of events sorted by `priority_in_tag` (lower numbers come first). Events that lack the specified tag or have no tags are treated with priority `999`. If priorities are equal, events are ordered by `start_date` ascending; events without a date are placed after dated events.
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