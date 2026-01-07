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
      if (import.meta.env.DEV) {
        console.error('Erro ao carregar tags:', err)
      }
      error.value = 'Falha ao carregar tags'
      return []
    } finally {
      loading.value = false
    }
  }

  // Mapeia para os botões/Chips mantendo o visual atual
  function mapToCategoryButtons(tags) {
    const iconMap = {
      carnaval: { type: 'phosphor', name: 'confetti' },
      carnavais: { type: 'phosphor', name: 'confetti' },
      'previas-carnaval': { type: 'phosphor', name: 'confetti' },
      reveillon: { type: 'phosphor', name: 'cheers' },
      reveillons: { type: 'phosphor', name: 'cheers' },
      festivais: 'park',
      festivaiss: 'park',
      open: { type: 'phosphor', name: 'beer-stein' }, // OPEN BAR usa slug 'open'
      'open-bar': { type: 'phosphor', name: 'beer-stein' },
      openfood: { type: 'phosphor', name: 'hamburger' }, // Open Food usa slug 'openfood'
      'open-food': { type: 'phosphor', name: 'hamburger' },
      saojoao: { type: 'phosphor', name: 'campfire' },
      'sao-joao': { type: 'phosphor', name: 'campfire' },
      'semana-santa': { type: 'phosphor', name: 'star' },
      vaquejadas: { type: 'phosphor', name: 'cow' },
      balada: { type: 'phosphor', name: 'speaker-hifi' },
      rap: { type: 'phosphor', name: 'microphone-stage' },
      trap: { type: 'phosphor', name: 'microphone-stage' },
      mpb: { type: 'phosphor', name: 'guitar' },
      eletronica: { type: 'phosphor', name: 'disc' },
      samba: { type: 'phosphor', name: 'music-notes' },
      forro: { type: 'phosphor', name: 'piano-keys' },
      forró: { type: 'phosphor', name: 'piano-keys' },
      sertanejo: { type: 'phosphor', name: 'cowboy-hat' },
      boate: 'nightlife',
      calourada: 'school',
    }

    const labelMap = {
      'previas-carnaval': 'Prévias de Carnaval',
    }

    return tags.map((t) => {
      const slug = (t.slug || '').toLowerCase()
      const iconConfig = iconMap[slug] || 'sell'

      // Se for um objeto com type: 'phosphor', retorna o objeto
      // Se for string, retorna como antes para compatibilidade
      const icon = typeof iconConfig === 'object' ? iconConfig : iconConfig

      return {
        id: String(t.slug || t.id), // Garante que id seja sempre string
        label: labelMap[slug] || t.name, // Usa label customizado se existir, senão usa o nome do banco
        icon: icon,
        tagName: t.name,
        slug: t.slug,
      }
    })
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

  return { loading, error, fetchTags, mapToCategoryButtons, mapToCategoryChips }
}
