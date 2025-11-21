import { ref, onMounted } from 'vue'

const INFLUENCER_STORAGE_KEY = 'landingticket_influencer'
const INFLUENCER_PHONE = '5581998471385'

// Mapeamento de slugs para nomes formatados e gênero
const INFLUENCER_NAMES = {
  'camila-carvalho': 'Camila Carvalho',
  'julia-souto': 'Julia Souto',
  'joao-clericuzzi': 'João Clericuzzi',
  'lauany': 'Lauany',
  'catalogo': 'Rapha',
  'netinho-soares': 'Netinho Soares',
  'cadu-alencar': 'Cadu Alencar',
  'tallita-manta': 'Tallita Manta',
  'hypepe': 'Hype PE',
  'mariana-almeida': 'Mariana Almeida',
}

// Mapeamento de gênero para usar o artigo correto
const INFLUENCER_GENDER = {
  'João Clericuzzi': 'pelo',
  'Camila Carvalho': 'pela',
  'Julia Souto': 'pela',
  'Lauany': 'pela',
  'Rapha': 'pelo',
  'Netinho Soares': 'pelo',
  'Cadu Alencar': 'pelo',
  'Tallita Manta': 'pela',
  'Hype PE': 'pela',
  'Mariana Almeida': 'pela',
}

export function useInfluencerTracking() {
  const influencerName = ref(null)

  // Carrega influenciadora do localStorage
  function loadInfluencer() {
    if (typeof window === 'undefined') return null

    const stored = localStorage.getItem(INFLUENCER_STORAGE_KEY)
    if (stored) {
      influencerName.value = stored
      return stored
    }
    return null
  }

  // Salva influenciadora no localStorage
  function saveInfluencer(name) {
    if (typeof window === 'undefined') return

    if (name && INFLUENCER_NAMES[name]) {
      const formattedName = INFLUENCER_NAMES[name]
      localStorage.setItem(INFLUENCER_STORAGE_KEY, formattedName)
      influencerName.value = formattedName
    }
  }

  // Limpa tracking (útil para testes)
  function clearInfluencer() {
    if (typeof window === 'undefined') return

    localStorage.removeItem(INFLUENCER_STORAGE_KEY)
    influencerName.value = null
  }

  // Verifica se há influenciadora ativa
  function hasInfluencer() {
    return influencerName.value !== null
  }

  // Gera mensagem personalizada para WhatsApp
  function getWhatsAppMessage(eventTitle) {
    if (!hasInfluencer() || !eventTitle) {
      return null
    }

    const article = INFLUENCER_GENDER[influencerName.value] || 'pela'
    return `Olá vim ${article} ${influencerName.value} e gostaria de finalizar a compra do ${eventTitle}`
  }

  // Retorna o número do WhatsApp para influenciadoras
  function getInfluencerPhone() {
    return INFLUENCER_PHONE
  }

  // Inicializa tracking ao montar
  onMounted(() => {
    loadInfluencer()
  })

  return {
    influencerName,
    loadInfluencer,
    saveInfluencer,
    clearInfluencer,
    hasInfluencer,
    getWhatsAppMessage,
    getInfluencerPhone,
  }
}

