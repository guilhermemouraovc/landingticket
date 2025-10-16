import { ref } from 'vue'
import { supabase } from 'src/utils/supabase'

export function useSupabaseEvents() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Busca eventos genérica
   */
  async function fetchEvents(filters = {}) {
    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('events')
        .select(
          `
          *,
          event_images(*),
          event_tags(tags(*))
        `,
        )
        .order('start_date', { ascending: true })

      // Aplicar filtros
      if (filters.tag) {
        query = query.eq('event_tags.tags.name', filters.tag)
      }
      if (filters.city) {
        query = query.eq('city', filters.city)
      }
      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError
      return data || []
    } catch (err) {
      console.error('Erro ao buscar eventos:', err)
      error.value = 'Falha ao carregar eventos'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Busca evento por ID
   */
  async function fetchEventById(id) {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('events')
        .select(
          `
          *,
          event_images(*),
          event_tags(tags(*))
        `,
        )
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError
      return data
    } catch (err) {
      console.error('Erro ao buscar evento:', err)
      error.value = 'Evento não encontrado'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Busca eventos por tag
   */
  async function fetchEventsByTag(tagName) {
    return fetchEvents({ tag: tagName })
  }

  /**
   * Busca todos os eventos
   */
  async function fetchAllEvents(limit = 60) {
    return fetchEvents({ limit })
  }

  return {
    loading,
    error,
    fetchEvents,
    fetchEventById,
    fetchEventsByTag,
    fetchAllEvents,
  }
}
