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
  'tulio-cisneiro': 'Tulio Cisneiro',
  'clara-borba': 'Clara Borba',
  'maria-eloisa': 'Maria Eloisa',
  'brenda-neves': 'Brenda Neves',
  'ricardo-costa': 'Ricardo Costa',
  'diego-escorel': 'Diego Escorel',
  'carlos-oliveira': 'Carlos Oliveira',
  'giovanna-lucena': 'Giovanna Lucena',
  'guilherme-santana': 'Guilherme Santana',
  'luis-felipe': 'Luis Felipe',
  'eduardo-loyo': 'Eduardo Loyo',
  'jao': 'Jão',
  'samuel-brito': 'Samuel Brito',
  'larissa-balta': 'Larissa Balta',
  'luisa-oliveira': 'Luisa Oliveira',
  'bianka-alcantara': 'Bianka Alcantara',
  'eduarda-teixeira': 'Eduarda Teixeira',
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
  'Tulio Cisneiro': 'pelo',
  'Clara Borba': 'pela',
  'Maria Eloisa': 'pela',
  'Brenda Neves': 'pela',
  'Ricardo Costa': 'pelo',
  'Diego Escorel': 'pelo',
  'Carlos Oliveira': 'pelo',
  'Giovanna Lucena': 'pela',
  'Guilherme Santana': 'pelo',
  'Luis Felipe': 'pelo',
  'Eduardo Loyo': 'pelo',
  'Jão': 'pelo',
  'Samuel Brito': 'pelo',
  'Larissa Balta': 'pela',
  'Luisa Oliveira': 'pela',
  'Bianka Alcantara': 'pela',
  'Eduarda Teixeira': 'pela',
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
  // @param {string} eventTitle - Título do evento
  // @param {boolean} hasPrice - Se o evento tem preço (true = compra, false = participar)
  function getWhatsAppMessage(eventTitle, hasPrice = true) {
    if (!hasInfluencer() || !eventTitle) {
      return null
    }

    const article = INFLUENCER_GENDER[influencerName.value] || 'pela'
    const action = hasPrice ? 'finalizar a compra do' : 'participar do'
    return `Olá vim ${article} ${influencerName.value} e gostaria de ${action} ${eventTitle}`
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

