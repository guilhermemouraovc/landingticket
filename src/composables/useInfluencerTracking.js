import { ref, onMounted } from 'vue'

const INFLUENCER_STORAGE_KEY = 'landingticket_influencer'
const INFLUENCER_PHONE = '5581998471385'

// Mapeamento de slugs para nomes formatados e gênero
export const INFLUENCER_NAMES = {
  'camila-carvalho': 'Camila Carvalho',
  'julia-souto': 'Julia Souto',
  'joao-clericuzzi': 'João Clericuzzi',
  lauany: 'Lauany',
  catalogo: 'Rapha',
  'netinho-soares': 'Netinho Soares',
  'cadu-alencar': 'Cadu Alencar',
  'tallita-manta': 'Tallita Manta',
  hypepe: 'Hype PE',
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
  'guilherme-mourao': 'Guilherme Mourão',
  'luis-felipe': 'Luis Felipe',
  'eduardo-loyo': 'Eduardo Loyo',
  jao: 'Jão',
  'samuel-brito': 'Samuel Brito',
  'larissa-balta': 'Larissa Balta',
  'luiza-oliveira': 'Luiza Oliveira',
  'bianka-alcantara': 'Bianka Alcantara',
  'eduarda-teixeira': 'Eduarda Teixeira',
  'eduardo-franca': 'Eduardo França',
  'helena-avelar': 'Helena Avelar',
  'marcelo-farias': 'Marcelo Farias',
  ralph: 'Ralph',
  'mariana-moreira': 'Mariana Moreira',
  'lucas-emery': 'Lucas Emery',
  eli: 'Eli',
  julinha: 'Julinha',
  'elielton-fontes': 'Elielton Fontes',
  leite: 'Leite',
  'gabriela-siqueira': 'Gabriela Siqueira',
  tonin: 'Tonin',
  'fabio-daniel': 'Fabio Daniel',
  'anny-acioli': 'Anny Acioli',
  hugo: 'Hugo',
  'bruno-neves': 'Bruno Neves',
  'ana-clara': 'Ana Clara',
  jurandir: 'Jurandir',
  luna: 'Luna',
  'medicina-fps-21': 'Turma FPS 21',
  'medicina-nassau-15': 'Turma Medicina Nassau 15',
  'medicina-fits-vi': 'Turma Medicina FITS VI',
  'medicina-unicap-13': 'Turma Medicina UNICAP 13',
  'medicina-ufpe-150': 'Turma Medicina UFPE 150',
  'medicina-upe-116': 'Turma Medicina UPE 116',
  'medicina-ufal-2026-2': 'Turma Medicina UFAL 2026.2',
  'medicina-fps-20': 'Turma Medicina FPS 20',
  'medicina-nassau-16': 'Turma Medicina Nassau 16',
  'medicina-univasf-m7': 'Turma Medicina UNIVASF M7',
  'medicina-upe-117': 'Turma Medicina UPE 117',
  'medicina-nassau-17': 'Turma Medicina Nassau 17',
  'medicina-fps-22': 'Turma Medicina FPS 22',
  'medicina-upe-118': 'Turma Medicina UPE 118',
  'medicina-nassau-18': 'Turma Medicina Nassau 18',
  'medicina-fps-23': 'Turma Medicina FPS 23',
  'medicina-nassau-19': 'Turma Medicina Nassau 19',
  'medicina-upe-12-gus': 'Turma Medicina UPE 12 GUS',
  'medicina-nassau-20': 'Turma Medicina Nassau 20',
  'medicina-ufpe-154': 'Turma Medicina UFPE 154',
  'medicina-fps-25': 'Turma Medicina FPS 25',
  'medicina-unicap-19': 'Turma Medicina UNICAP 19',
  'medicina-afya-gus-04': 'Turma Medicina AFYA GUS 04',
  'medicina-fps-26': 'Turma Medicina FPS 26',
  'medicina-asces-unita-01': 'Turma Medicina ASCES Unita 01',
  'medicina-fps-27': 'Turma Medicina FPS 27',
  'medicina-nassau-23': 'Turma Medicina Nassau 23',
  'medicina-fps-28': 'Turma Medicina FPS 28',
  'medicina-upe-124': 'Turma Medicina UPE 124',
  mafe: 'Mafe',
  karla: 'Karla',
  ondetempe: 'página Onde Tem PE',
  'eduarda-figueredo': 'Eduarda Figueredo',
  'fernanda-houly': 'Fernanda Houly',
  ggnutri: 'página GGNutri',
  raufa: 'Raufa',
  'leandro-camara': 'Leandro Camara',
  godoy: 'Godoy',
  larah: 'Larah',
  Centralanittarecife: 'página Central Anitta Recife',
  nanda: 'Nanda',
  anittafortal: 'página Anitta Fortal',
  anittasergipe: 'página Anitta Sergipe',
  ray: 'Ray',
  ary: 'Ary',
}

// Mapeamento de gênero para usar o artigo correto
const INFLUENCER_GENDER = {
  'João Clericuzzi': 'pelo',
  'Camila Carvalho': 'pela',
  'Julia Souto': 'pela',
  Lauany: 'pela',
  Rapha: 'pelo',
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
  'Guilherme Mourão': 'pelo',
  'Luis Felipe': 'pelo',
  'Eduardo Loyo': 'pelo',
  Jão: 'pelo',
  'Samuel Brito': 'pelo',
  'Larissa Balta': 'pela',
  'Luiza Oliveira': 'pela',
  'Bianka Alcantara': 'pela',
  'Eduarda Teixeira': 'pela',
  'Eduardo França': 'pelo',
  'Helena Avelar': 'pela',
  'Marcelo Farias': 'pelo',
  Ralph: 'pelo',
  'Mariana Moreira': 'pela',
  'Lucas Emery': 'pelo',
  Eli: 'pelo',
  Julinha: 'pela',
  'Elielton Fontes': 'pelo',
  Leite: 'pelo',
  'Gabriela Siqueira': 'pela',
  Tonin: 'pelo',
  'Fabio Daniel': 'pelo',
  'Anny Acioli': 'pela',
  Hugo: 'pelo',
  'Bruno Neves': 'pelo',
  'Ana Clara': 'pela',
  Jurandir: 'pelo',
  Luna: 'pelo',
  'Turma FPS 21': 'pela',
  'Turma Medicina Nassau 15': 'pela',
  'Turma Medicina FITS VI': 'pela',
  'Turma Medicina UNICAP 13': 'pela',
  'Turma Medicina UFPE 150': 'pela',
  'Turma Medicina UPE 116': 'pela',
  'Turma Medicina UFAL 2026.2': 'pela',
  'Turma Medicina FPS 20': 'pela',
  'Turma Medicina Nassau 16': 'pela',
  'Turma Medicina UNIVASF M7': 'pela',
  'Turma Medicina UPE 117': 'pela',
  'Turma Medicina Nassau 17': 'pela',
  'Turma Medicina FPS 22': 'pela',
  'Turma Medicina UPE 118': 'pela',
  'Turma Medicina Nassau 18': 'pela',
  'Turma Medicina FPS 23': 'pela',
  'Turma Medicina Nassau 19': 'pela',
  'Turma Medicina UPE 12 GUS': 'pela',
  'Turma Medicina Nassau 20': 'pela',
  'Turma Medicina UFPE 154': 'pela',
  'Turma Medicina FPS 25': 'pela',
  'Turma Medicina UNICAP 19': 'pela',
  'Turma Medicina AFYA GUS 04': 'pela',
  'Turma Medicina FPS 26': 'pela',
  'Turma Medicina ASCES Unita 01': 'pela',
  'Turma Medicina FPS 27': 'pela',
  'Turma Medicina Nassau 23': 'pela',
  'Turma Medicina FPS 28': 'pela',
  'Turma Medicina UPE 124': 'pela',
  Mafe: 'pela',
  Karla: 'pela',
  'Onde Tem PE': 'pela',
  'Eduarda Figueiredo': 'pela',
  'Fernanda Houly': 'pela',
  GGNutri: 'pela',
  Raufa: 'pelo',
  'Leandro Camara': 'pelo',
  Godoy: 'pela',
  Larah: 'pela',
  'Central Anitta Recife': 'pela', 
  Nanda: 'pela',
  'Anitta Fortal': 'pela',
  'Anitta Sergipe': 'pela',
  Ray: 'pela',
  Ary: 'pelo',
}

// Set of valid influencer slugs for route validation
export const INFLUENCER_SLUGS = new Set(Object.keys(INFLUENCER_NAMES))

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
