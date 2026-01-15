import { ref } from 'vue'
import { supabase } from 'src/utils/supabase'
import { toEventCardFromSb, toEventDetailFromSb } from 'src/utils/supabaseEventMapper'
import { generateSlug } from 'src/utils/stringUtils'
import { sortEventsByPriorityAndDate } from 'src/utils/eventSorting'

export function useSupabaseEvents() {
  const loading = ref(false)
  const error = ref(null)

  async function fetchEvents({ limit = 200 } = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: e } = await supabase.from('view_event_cards').select('*').limit(limit)
      if (e) throw e
      const mappedEvents = (data || []).map(toEventCardFromSb)
      return sortEventsByPriorityAndDate(mappedEvents)
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Erro ao buscar eventos:', err)
      }
      error.value = 'Falha ao carregar eventos'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchEventsByTag(tagName, { limit = 200 } = {}) {
    loading.value = true
    error.value = null
    try {
      // Busca event_ids mantendo a ordem de priority_in_tag da view
      const { data: tagRows, error: e1 } = await supabase
        .from('view_events_by_tag')
        .select('event_id, priority_in_tag')
        .eq('tag_name', tagName)
        .order('priority_in_tag', { ascending: true })
        .limit(1000)

      if (e1) throw e1
      const ids = (tagRows || []).map((r) => r.event_id)

      // Cria um mapa de prioridades para preservar ordem após buscar detalhes
      const priorityMap = new Map()
      tagRows?.forEach((row, index) => {
        priorityMap.set(row.event_id, { priority: row.priority_in_tag, index })
      })

      if (!ids.length) return []

      const { data, error: e2 } = await supabase
        .from('view_event_cards')
        .select('*')
        .in('id', ids)
        .limit(limit)

      if (e2) throw e2
      const mappedEvents = (data || []).map(toEventCardFromSb)

      // Ordena pelos eventos mantendo a ordem de priority_in_tag
      return mappedEvents.sort((a, b) => {
        const aPrio = priorityMap.get(a.id)
        const bPrio = priorityMap.get(b.id)

        if (aPrio && bPrio) {
          return aPrio.index - bPrio.index
        }

        // Fallback para ordenação padrão se não encontrar prioridade
        return sortEventsByPriorityAndDate([a, b])[0]?.id === a.id ? -1 : 1
      })
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('❌ Erro ao filtrar eventos:', err)
      }
      error.value = 'Falha ao filtrar eventos'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchEventById(idOrSlug) {
    loading.value = true
    error.value = null
    try {
      // Verifica se é um UUID (formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrSlug,
      )

      if (isUUID) {
        // Se for UUID, busca por ID (compatibilidade com URLs antigas)
        const { data, error: e } = await supabase
          .from('view_event_detail')
          .select('*')
          .eq('id', idOrSlug)
          .single()
        if (e) throw e

        // Busca dias do evento
        const { data: days } = await supabase
          .from('event_days')
          .select('*')
          .eq('event_id', data.id)
          .eq('is_active', true)
          .order('date', { ascending: true })

        return toEventDetailFromSb({ ...data, days })
      } else {
        // Se for slug, busca por título normalizado
        const { data: allEvents, error: e1 } = await supabase.from('view_event_detail').select('*')

        if (e1) throw e1

        // Gera slug de todos os eventos e compara
        const event = allEvents.find((e) => generateSlug(e.title) === idOrSlug)

        if (!event) {
          throw new Error('Evento não encontrado')
        }

        // Busca dias do evento
        const { data: days } = await supabase
          .from('event_days')
          .select('*')
          .eq('event_id', event.id)
          .eq('is_active', true)
          .order('date', { ascending: true })

        return toEventDetailFromSb({ ...event, days })
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Erro ao buscar evento:', err)
      }
      error.value = 'Evento não encontrado'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchFeaturedEvents({ limit = 50 } = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: e } = await supabase
        .from('view_event_cards')
        .select('*')
        .or('highlight.eq.sim,highlight.eq.SIM,highlight.eq.true,highlight.eq.1')
        .limit(limit)
      if (e) throw e
      const mappedEvents = (data || []).map(toEventCardFromSb)
      return sortEventsByPriorityAndDate(mappedEvents)
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Erro ao buscar eventos em destaque:', err)
      }
      error.value = 'Falha ao carregar eventos em destaque'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Wrapper para compatibilidade - mantido para não quebrar código existente
  async function fetchAllEvents(limit = 200) {
    return fetchEvents({ limit })
  }

  async function fetchUpcomingEvents({ limit = 100 } = {}) {
    loading.value = true
    error.value = null
    try {
      // Busca eventos com data de início >= hoje, ordenados por data crescente
      const today = new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD

      const { data, error: e } = await supabase
        .from('view_event_cards')
        .select('*')
        .gte('start_date', today) // start_date >= hoje
        .limit(limit)

      if (e) throw e
      const mappedEvents = (data || []).map(toEventCardFromSb)
      return sortEventsByPriorityAndDate(mappedEvents)
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Erro ao buscar eventos próximos:', err)
      }
      error.value = 'Falha ao carregar eventos próximos'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Busca eventos que têm TODAS as tags especificadas (AND lógico)
   * @param {string[]} tagNames - Array de nomes de tags
   * @param {Object} options - Opções de busca
   * @param {number} options.limit - Limite de resultados
   * @returns {Promise<Array>} Array de eventos que têm todas as tags
   */
  async function fetchEventsByMultipleTags(tagNames, { limit = 200 } = {}) {
    loading.value = true
    error.value = null
    try {
      // Se não há tags, retorna array vazio
      if (!tagNames || tagNames.length === 0) {
        return []
      }

      // Se há apenas uma tag, usa a função existente
      if (tagNames.length === 1) {
        return fetchEventsByTag(tagNames[0], { limit })
      }

      // Para múltiplas tags, busca IDs de eventos para cada tag
      const eventIdsByTag = []

      for (const tagName of tagNames) {
        const { data: tagRows, error: e1 } = await supabase
          .from('view_events_by_tag')
          .select('event_id')
          .eq('tag_name', tagName)
          .limit(1000)

        if (e1) throw e1
        const ids = (tagRows || []).map((r) => r.event_id)
        eventIdsByTag.push(new Set(ids)) // Usa Set para busca mais rápida
      }

      // Encontra a interseção (eventos que têm TODAS as tags)
      let intersection = eventIdsByTag[0]

      for (let i = 1; i < eventIdsByTag.length; i++) {
        intersection = new Set([...intersection].filter((id) => eventIdsByTag[i].has(id)))
      }

      const commonIds = Array.from(intersection)

      if (!commonIds.length) return []

      // Busca os eventos com os IDs comuns
      const { data, error: e2 } = await supabase
        .from('view_event_cards')
        .select('*')
        .in('id', commonIds)
        .limit(limit)

      if (e2) throw e2
      const mappedEvents = (data || []).map(toEventCardFromSb)
      return sortEventsByPriorityAndDate(mappedEvents)
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('❌ Erro ao filtrar eventos por múltiplas tags:', err)
      }
      error.value = 'Falha ao filtrar eventos'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchEvents,
    fetchEventsByTag,
    fetchEventsByMultipleTags,
    fetchEventById,
    fetchFeaturedEvents,
    fetchAllEvents,
    fetchUpcomingEvents,
  }
}
