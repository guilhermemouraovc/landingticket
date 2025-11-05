import { ref } from 'vue'
import { supabase } from 'src/utils/supabase'
import { toEventCardFromSb, toEventDetailFromSb } from 'src/utils/supabaseEventMapper'
import { generateSlug } from 'src/utils/stringUtils'

export function useSupabaseEvents() {
  const loading = ref(false)
  const error = ref(null)

  async function fetchEvents({ limit = 200 } = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: e } = await supabase
        .from('view_event_cards')
        .select('*')
        .order('start_date', { ascending: true })
        .limit(limit)
      if (e) throw e
      return (data || []).map(toEventCardFromSb)
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
      const { data: tagRows, error: e1 } = await supabase
        .from('view_events_by_tag')
        .select('event_id')
        .eq('tag_name', tagName)
        .limit(1000) // Aumentar limite da view também

      if (e1) throw e1
      const ids = (tagRows || []).map((r) => r.event_id)

      if (!ids.length) return []

      const { data, error: e2 } = await supabase
        .from('view_event_cards')
        .select('*')
        .in('id', ids)
        .order('start_date', { ascending: true })
        .limit(limit)

      if (e2) throw e2
      return (data || []).map(toEventCardFromSb)
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
        return toEventDetailFromSb(data)
      } else {
        // Se for slug, busca por título normalizado
        const { data: allEvents, error: e1 } = await supabase.from('view_event_detail').select('*')

        if (e1) throw e1

        // Gera slug de todos os eventos e compara
        const event = allEvents.find((e) => generateSlug(e.title) === idOrSlug)

        if (!event) {
          throw new Error('Evento não encontrado')
        }

        return toEventDetailFromSb(event)
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
        .order('start_date', { ascending: true })
        .limit(limit)
      if (e) throw e
      return (data || []).map(toEventCardFromSb)
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
        .order('start_date', { ascending: true })
        .limit(limit)
      
      if (e) throw e
      return (data || []).map(toEventCardFromSb)
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

  return {
    loading,
    error,
    fetchEvents,
    fetchEventsByTag,
    fetchEventById,
    fetchFeaturedEvents,
    fetchAllEvents,
    fetchUpcomingEvents,
  }
}
