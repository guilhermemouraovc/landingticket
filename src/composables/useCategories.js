import { ref, readonly } from 'vue'
import { useSupabaseTags } from './useSupabaseTags'

const categoriesCache = ref(null)
const loading = ref(false)
const error = ref(null)

export function useCategories() {
  const { fetchTags, mapToCategoryButtons } = useSupabaseTags()

  async function loadCategories() {
    // Retorna cache se já existe
    if (categoriesCache.value) {
      return categoriesCache.value
    }

    loading.value = true
    error.value = null
    try {
      const tags = await fetchTags()
      categoriesCache.value = mapToCategoryButtons(tags)
      return categoriesCache.value
    } catch (e) {
      console.error('❌ Erro ao carregar categorias:', e)
      error.value = 'Falha ao carregar categorias'
      categoriesCache.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  function clearCache() {
    categoriesCache.value = null
  }

  return {
    categories: readonly(categoriesCache),
    loading: readonly(loading),
    error: readonly(error),
    loadCategories,
    clearCache,
  }
}

