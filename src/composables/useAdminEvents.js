import { ref } from 'vue'
import { supabase } from 'src/utils/supabase'
import { useQuasar } from 'quasar'

export function useAdminEvents() {
  const $q = useQuasar()
  const loading = ref(false)
  const error = ref(null)

  // Busca todos os eventos (para admin)
  async function fetchAllEvents() {
    loading.value = true
    error.value = null
    try {
      // Verifica se está autenticado
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Usuário não autenticado. Faça login novamente.')
      }

      console.log('🔍 Tentando buscar eventos...')
      
      // Primeiro, tenta uma query simples sem relacionamentos
      const { data: simpleData, error: simpleError } = await supabase
        .from('events')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      if (simpleError) {
        console.error('❌ Erro na query simples:', simpleError)
        throw new Error(simpleError.message || 'Erro ao carregar eventos do banco de dados')
      }

      console.log('✅ Query simples funcionou! Eventos encontrados:', simpleData?.length || 0)

      // Agora tenta a query completa com relacionamentos
      const { data, error: e } = await supabase
        .from('events')
        .select(`
          *,
          event_tags (
            tag_id,
            tags (
              id,
              name,
              slug
            )
          ),
          event_images (
            id,
            url,
            alt_text,
            is_primary,
            order_index,
            image_type
          )
        `)
        .order('created_at', { ascending: false })

      if (e) {
        console.error('❌ Erro do Supabase na query completa:', e)
        console.error('❌ Código:', e.code)
        console.error('❌ Detalhes:', e.details)
        console.error('❌ Hint:', e.hint)
        
        // Se a query completa falhar, tenta sem relacionamentos
        console.log('⚠️ Tentando buscar sem relacionamentos...')
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false })

        if (fallbackError) {
          throw new Error(fallbackError.message || 'Erro ao carregar eventos do banco de dados')
        }

        console.log('✅ Query sem relacionamentos funcionou!')
        return fallbackData || []
      }
      
      console.log('✅ Query completa funcionou! Eventos:', data?.length || 0)
      return data || []
    } catch (err) {
      const errorMessage = err.message || 'Erro ao carregar eventos'
      error.value = errorMessage
      console.error('❌ Erro ao buscar eventos:', err)
      $q.notify({
        type: 'negative',
        message: errorMessage,
        position: 'top',
        timeout: 5000,
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  // Busca um evento por ID
  async function fetchEventById(id) {
    loading.value = true
    error.value = null
    try {
      const { data, error: e } = await supabase
        .from('events')
        .select(`
          *,
          event_tags (
            tag_id,
            tags (
              id,
              name,
              slug
            )
          ),
          event_images (
            id,
            url,
            alt_text,
            is_primary,
            order_index,
            image_type
          )
        `)
        .eq('id', id)
        .single()

      if (e) throw e
      return data
    } catch (err) {
      error.value = 'Erro ao carregar evento'
      $q.notify({
        type: 'negative',
        message: error.value,
        position: 'top',
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  // Cria um novo evento
  async function createEvent(eventData) {
    loading.value = true
    error.value = null
    try {
      // Prepara os dados do evento
      const eventPayload = {
        title: eventData.title,
        description: eventData.description || null,
        highlight: eventData.highlight || null,
        additional_info: eventData.additional_info || null,
        start_date: eventData.start_date || null,
        end_date: eventData.end_date || null,
        location: eventData.location || null,
        city: eventData.city || null,
        state: eventData.state || null,
        whatsapp: eventData.whatsapp || '+5581998471385',
        whatsapp_message: eventData.whatsapp_message || null,
        share_url: eventData.share_url || null,
        price: eventData.price || null,
        price_installments: eventData.price_installments || null,
        installment_value: eventData.installment_value || null,
        currency: eventData.currency || 'BRL',
      }

      // Cria o evento
      const { data: event, error: e1 } = await supabase
        .from('events')
        .insert(eventPayload)
        .select()
        .single()

      if (e1) throw e1

      // Adiciona tags se houver
      if (eventData.tagIds && eventData.tagIds.length > 0) {
        const tagRelations = eventData.tagIds.map(tagId => ({
          event_id: event.id,
          tag_id: tagId,
        }))

        const { error: e2 } = await supabase
          .from('event_tags')
          .insert(tagRelations)

        if (e2) throw e2
      }

      // Adiciona imagens se houver
      if (eventData.images && eventData.images.length > 0) {
        const imageRecords = eventData.images.map((img, index) => ({
          event_id: event.id,
          url: img.url,
          alt_text: img.alt_text || eventData.title,
          is_primary: img.is_primary || (index === 0),
          order_index: img.order_index || index,
          image_type: img.image_type || 'both',
        }))

        const { error: e3 } = await supabase
          .from('event_images')
          .insert(imageRecords)

        if (e3) throw e3
      }

      $q.notify({
        type: 'positive',
        message: 'Evento criado com sucesso!',
        position: 'top',
      })

      return event
    } catch (err) {
      error.value = err.message || 'Erro ao criar evento'
      $q.notify({
        type: 'negative',
        message: error.value,
        position: 'top',
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  // Atualiza um evento
  async function updateEvent(id, eventData) {
    loading.value = true
    error.value = null
    try {
      // Atualiza os dados do evento
      const eventPayload = {
        title: eventData.title,
        description: eventData.description || null,
        highlight: eventData.highlight || null,
        additional_info: eventData.additional_info || null,
        start_date: eventData.start_date || null,
        end_date: eventData.end_date || null,
        location: eventData.location || null,
        city: eventData.city || null,
        state: eventData.state || null,
        whatsapp: eventData.whatsapp || '+5581998471385',
        whatsapp_message: eventData.whatsapp_message || null,
        share_url: eventData.share_url || null,
        price: eventData.price || null,
        price_installments: eventData.price_installments || null,
        installment_value: eventData.installment_value || null,
        currency: eventData.currency || 'BRL',
        updated_at: new Date().toISOString(),
      }

      const { error: e1 } = await supabase
        .from('events')
        .update(eventPayload)
        .eq('id', id)

      if (e1) throw e1

      // Remove todas as tags existentes
      const { error: e2 } = await supabase
        .from('event_tags')
        .delete()
        .eq('event_id', id)

      if (e2) throw e2

      // Adiciona as novas tags
      if (eventData.tagIds && eventData.tagIds.length > 0) {
        const tagRelations = eventData.tagIds.map(tagId => ({
          event_id: id,
          tag_id: tagId,
        }))

        const { error: e3 } = await supabase
          .from('event_tags')
          .insert(tagRelations)

        if (e3) throw e3
      }

      // Remove imagens antigas se necessário
      if (eventData.removeImageIds && eventData.removeImageIds.length > 0) {
        const { error: e4 } = await supabase
          .from('event_images')
          .delete()
          .in('id', eventData.removeImageIds)

        if (e4) throw e4
      }

      // Atualiza imagens existentes (is_primary, alt_text, image_type, order_index)
      if (eventData.images && eventData.images.length > 0) {
        for (const img of eventData.images) {
          if (img.id) {
            const { error: e5 } = await supabase
              .from('event_images')
              .update({
                url: img.url,
                alt_text: img.alt_text || eventData.title,
                is_primary: img.is_primary || false,
                order_index: img.order_index,
                image_type: img.image_type || 'both',
              })
              .eq('id', img.id)

            if (e5) throw e5
          }
        }
      }

      // Adiciona novas imagens
      if (eventData.newImages && eventData.newImages.length > 0) {
        const imageRecords = eventData.newImages.map((img, index) => ({
          event_id: id,
          url: img.url,
          alt_text: img.alt_text || eventData.title,
          is_primary: img.is_primary || false,
          order_index: img.order_index || index,
          image_type: img.image_type || 'both',
        }))

        const { error: e6 } = await supabase
          .from('event_images')
          .insert(imageRecords)

        if (e6) throw e6
      }

      $q.notify({
        type: 'positive',
        message: 'Evento atualizado com sucesso!',
        position: 'top',
      })

      return true
    } catch (err) {
      error.value = err.message || 'Erro ao atualizar evento'
      $q.notify({
        type: 'negative',
        message: error.value,
        position: 'top',
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  // Deleta um evento
  async function deleteEvent(id) {
    loading.value = true
    error.value = null
    try {
      // Deleta imagens primeiro (devido a foreign key)
      const { error: e1 } = await supabase
        .from('event_images')
        .delete()
        .eq('event_id', id)

      if (e1) throw e1

      // Deleta tags
      const { error: e2 } = await supabase
        .from('event_tags')
        .delete()
        .eq('event_id', id)

      if (e2) throw e2

      // Deleta o evento
      const { error: e3 } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (e3) throw e3

      $q.notify({
        type: 'positive',
        message: 'Evento deletado com sucesso!',
        position: 'top',
      })

      return true
    } catch (err) {
      error.value = err.message || 'Erro ao deletar evento'
      $q.notify({
        type: 'negative',
        message: error.value,
        position: 'top',
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  // Atualiza apenas campos específicos de um evento (mais leve e seguro para edições rápidas)
  async function patchEvent(id, fields) {
    loading.value = true
    error.value = null
    try {
      const { error: e } = await supabase
        .from('events')
        .update({
          ...fields,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (e) throw e

      $q.notify({
        type: 'positive',
        message: 'Evento atualizado com sucesso!',
        position: 'top',
        timeout: 1000,
      })

      return true
    } catch (err) {
      error.value = err.message || 'Erro ao atualizar evento'
      $q.notify({
        type: 'negative',
        message: error.value,
        position: 'top',
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchAllEvents,
    fetchEventById,
    createEvent,
    updateEvent,
    patchEvent,
    deleteEvent,
  }
}
