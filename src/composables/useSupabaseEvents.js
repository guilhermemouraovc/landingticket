import { ref } from 'vue'
import { supabase } from 'src/utils/supabase'
import { toEventCardFromSb, toEventDetailFromSb } from 'src/utils/supabaseEventMapper'

export function useSupabaseEvents() {
  const loading = ref(false)
  const error = ref(null)

  async function fetchEvents({ limit = 60 } = {}) {
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
      console.error('Erro ao buscar eventos:', err)
      error.value = 'Falha ao carregar eventos'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchEventsByTag(tagName, { limit = 60 } = {}) {
    loading.value = true
    error.value = null
    try {
      const { data: tagRows, error: e1 } = await supabase
        .from('view_events_by_tag')
        .select('event_id')
        .eq('tag_name', tagName)
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
      console.error('Erro ao filtrar eventos:', err)
      error.value = 'Falha ao filtrar eventos'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchEventById(id) {
    loading.value = true
    error.value = null
    try {
      const { data, error: e } = await supabase
        .from('view_event_detail')
        .select('*')
        .eq('id', id)
        .single()
      if (e) throw e
      return toEventDetailFromSb(data)
    } catch (err) {
      console.error('Erro ao buscar evento:', err)
      error.value = 'Evento não encontrado'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchFeaturedEvents({ limit = 25 } = {}) {
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
      console.error('Erro ao buscar eventos em destaque:', err)
      error.value = 'Falha ao carregar eventos em destaque'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchAllEvents(limit = 60) {
    return fetchEvents({ limit })
  }

  return {
    loading,
    error,
    fetchEvents,
    fetchEventsByTag,
    fetchEventById,
    fetchFeaturedEvents,
    fetchAllEvents,
  }
}
