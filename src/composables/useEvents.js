/**
 * Composable para gerenciar eventos
 * Fornece funções de fetch, cache e estados reativos
 */

import { ref } from 'vue'
import { api } from 'boot/axios'
import { toEventCard, toEventDetail } from 'src/utils/eventMapper'
import { API_CONFIG } from 'src/constants/config'

// Cache simples em memória (compartilhado entre todas as instâncias)
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

/**
 * Composable principal para gerenciar eventos
 */
export function useEvents() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Busca eventos genérica com opções customizáveis
   * @param {Object} params - Parâmetros de query para a API
   * @param {Object} options - Opções adicionais (useCache, transform, transformOptions)
   * @returns {Promise<Array>} Lista de eventos
   */
  async function fetchEvents(params = {}, options = {}) {
    const { useCache = true, transformOptions = {} } = options
    const cacheKey = JSON.stringify({ endpoint: '/festas', params, transformOptions })

    // Verifica cache
    if (useCache && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data
      }
      cache.delete(cacheKey)
    }

    loading.value = true
    error.value = null

    try {
      const defaultParams = {
        'pagination[pageSize]': API_CONFIG.pageSize,
        populate: '*',
        publicationState: 'live',
        ...params,
      }

      const response = await api.get('/festas', { params: defaultParams })
      const festas = Array.isArray(response?.data?.data) ? response.data.data : []
      const transformed = festas.map((festa) => toEventCard(festa, transformOptions))

      // Salva no cache
      if (useCache) {
        cache.set(cacheKey, {
          data: transformed,
          timestamp: Date.now(),
        })
      }

      return transformed
    } catch (err) {
      console.error('Erro ao buscar eventos:', err)
      error.value = 'Falha ao carregar eventos'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Busca eventos por tag
   * @param {string} tagName - Nome da tag
   * @param {Object} additionalParams - Parâmetros adicionais
   * @returns {Promise<Array>} Lista de eventos
   */
  async function fetchEventsByTag(tagName, additionalParams = {}) {
    const params = {
      'filters[$and][0][tag][tagname][$eqi]': tagName,
      'sort[0]': 'Data:asc',
      ...additionalParams,
    }

    return fetchEvents(params)
  }

  /**
   * Busca múltiplas tags em paralelo (ex: Réveillon, Carnaval, São João)
   * @param {Array<string>} tags - Lista de tags
   * @returns {Promise<Object>} Objeto com eventos por tag
   */
  async function fetchEventsByMultipleTags(tags) {
    const promises = tags.map((tag) => fetchEventsByTag(tag))
    const results = await Promise.all(promises)

    return tags.reduce((acc, tag, index) => {
      acc[tag.toLowerCase()] = results[index]
      return acc
    }, {})
  }

  /**
   * Busca evento por ID (documentId, id numérico, etc)
   * @param {string|number} idParam - ID do evento
   * @returns {Promise<Object|null>} Evento detalhado ou null
   */
  async function fetchEventById(idParam) {
    if (!idParam) return null

    loading.value = true
    error.value = null

    try {
      // Tenta buscar diretamente
      const direct = await tryFetchSingle(idParam)
      if (direct) {
        return toEventDetail(direct)
      }

      // Se for numérico, tenta novamente como número
      if (/^\d+$/.test(String(idParam))) {
        const numeric = await tryFetchSingle(Number(idParam))
        if (numeric) {
          return toEventDetail(numeric)
        }
      }

      // Fallback: busca por documentId
      const response = await api.get('/festas', {
        params: {
          populate: '*',
          'filters[documentId][$eq]': idParam,
          'pagination[pageSize]': 1,
        },
      })

      const items = Array.isArray(response?.data?.data) ? response.data.data : []
      if (items[0]) {
        return toEventDetail(items[0])
      }

      error.value = 'Evento não encontrado'
      return null
    } catch (err) {
      console.error('Erro ao buscar evento por ID:', err)
      error.value = 'Não foi possível carregar os detalhes do evento'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Tenta buscar um único evento pela rota /festas/:id
   * @param {string|number} idValue - ID do evento
   * @returns {Promise<Object|null>} Dados do evento ou null
   */
  async function tryFetchSingle(idValue) {
    try {
      const response = await api.get(`/festas/${encodeURIComponent(idValue)}`, {
        params: { populate: '*' },
      })
      return response?.data?.data ?? null
    } catch (err) {
      if (err?.response?.status === 404) {
        return null
      }
      throw err
    }
  }

  /**
   * Busca todos os eventos (programação completa)
   * @param {number} pageSize - Tamanho da página
   * @param {Object} options - Opções adicionais (transformOptions, etc)
   * @returns {Promise<Array>} Lista de eventos
   */
  async function fetchAllEvents(pageSize = 60, options = {}) {
    return fetchEvents(
      {
        'pagination[pageSize]': pageSize,
        'sort[0]': 'Data:asc',
      },
      options,
    )
  }

  /**
   * Limpa o cache
   */
  function clearCache() {
    cache.clear()
  }

  /**
   * Limpa cache de uma chave específica
   * @param {string} key - Chave do cache
   */
  function clearCacheKey(key) {
    cache.delete(key)
  }

  return {
    // Estados reativos
    loading,
    error,

    // Métodos de fetch
    fetchEvents,
    fetchEventsByTag,
    fetchEventsByMultipleTags,
    fetchEventById,
    fetchAllEvents,

    // Métodos de cache
    clearCache,
    clearCacheKey,
  }
}
