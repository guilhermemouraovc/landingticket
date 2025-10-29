import { ref } from 'vue'
import { supabase } from 'src/utils/supabase'

export function useSupabaseTags() {
  const loading = ref(false)
  const error = ref(null)

  async function fetchTags() {
    loading.value = true
    error.value = null
    try {
      const { data, error: e } = await supabase
        .from('tags')
        .select('id,name,slug')
        .order('name', { ascending: true })
      if (e) throw e
      return data || []
    } catch (err) {
      console.error('Erro ao carregar tags:', err)
      error.value = 'Falha ao carregar tags'
      return []
    } finally {
      loading.value = false
    }
  }

  // Mapeia para os botões/Chips mantendo o visual atual
  function mapToCategoryButtons(tags) {
    const iconMap = {
      carnaval: 'celebration',
      carnavais: 'celebration',
      reveillon: 'auto_awesome',
      reveillons: 'auto_awesome',
      festivais: 'park',
      festivaiss: 'park',
      open: 'nightlife',
      'open-bar': 'nightlife',
      saojoao: 'holiday_village',
      'sao-joao': 'holiday_village',
      'semana-santa': 'holiday_village',
      boate: 'nightlife',
      calourada: 'school',
    }
    return tags.map(t => ({
      id: t.slug || t.id,               // usado pelo CategoryFilter
      label: toTitleCase(t.name),       // usado nos botões grandes
      icon: iconMap[(t.slug || '').toLowerCase()] || 'sell',
      tagName: t.name,                  // exatamente como salvo no banco (ex.: REVEILLONS)
      slug: t.slug,
    }))
  }

  function mapToCategoryChips(tags) {
    const palette = ['purple', 'red', 'orange', 'green', 'pink', 'indigo', 'teal', 'amber']
    const buttons = mapToCategoryButtons(tags)
    return buttons.map((b, i) => ({
      id: b.id,
      name: b.label,
      icon: b.icon,
      color: palette[i % palette.length],
      tagName: b.tagName,
      slug: b.slug,
    }))
  }

  function toTitleCase(str) {
    return (str || '')
      .toLowerCase()
      .replace(/\b\p{L}/gu, ch => ch.toUpperCase())
  }

  return { loading, error, fetchTags, mapToCategoryButtons, mapToCategoryChips }
}

