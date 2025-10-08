<template>
  <q-page class="bg-landing">
    <!-- EVENTOS EM DESTAQUE -->
    <section class="destaque">
      <q-carousel
        v-model="activeSlide"
        animated
        infinite
        swipeable
        autoplay
        height="440px"
        control-color="white"
        navigation
        navigation-position="bottom"
        transition-prev="slide-right"
        transition-next="slide-left"
        class="featured-carousel"
      >
        <q-carousel-slide v-for="ev in featured" :key="ev.id" :name="ev.id" class="q-pa-none">
          <div class="featured-wrap">
            <div class="featured-grid rounded-borders overflow-hidden shadow-2">
              <!-- Imagem -->
              <div class="featured-img">
                <q-img
                  :src="ev.image"
                  fit="cover"
                  class="full"
                  :ratio="16 / 9"
                  spinner-color="white"
                />
              </div>

              <!-- Painel -->
              <div class="featured-panel">
                <div class="panel-inner">
                  <div class="event-title q-mb-sm">{{ ev.title }}</div>

                  <div v-if="ev.description" class="featured-description text-body1 q-mt-xs">
                    {{ ev.description }}
                  </div>

                  <div class="q-mt-md q-gutter-sm">
                    <div class="row items-center event-meta">
                      <q-icon name="event" class="q-mr-sm event-meta__icon" />
                      <span>{{ ev.date }}</span>
                    </div>
                    <div class="row items-center event-meta">
                      <q-icon name="place" class="q-mr-sm event-meta__icon" />
                      <span>{{ ev.location }}</span>
                    </div>
                  </div>

                  <q-btn
                    class="q-mt-lg"
                    color="warning"
                    text-color="black"
                    unelevated
                    rounded
                    label="Ver Detalhes"
                    :to="ev.link || '#'"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </section>

    <!-- CATEGORIAS -->
    <section class="categories">
      <div class="categories-wrap">
        <div class="cat-grid">
          <q-btn
            v-for="c in categories"
            :key="c.label"
            outline
            square-rounded
            no-caps
            class="cat-btn"
            color="white"
            text-color="white"
            :icon="c.icon"
            :label="c.label"
          />
        </div>
      </div>
    </section>

    <section class="event-groups">
      <EventSectionCarousel
        title="Réveillon"
        :items="reveillonEvents"
        see-all-label="Ver Tudo"
        :default-image="DEFAULT_IMAGE"
      />

      <EventSectionCarousel
        title="Carnaval"
        :items="carnavalEvents"
        see-all-label="Ver Tudo"
        :default-image="DEFAULT_IMAGE"
      />

      <EventSectionCarousel
        title="São João"
        :items="saoJoaoEvents"
        see-all-label="Ver Tudo"
        :default-image="DEFAULT_IMAGE"
      />

      <EventSectionCarousel
        title="Programação completa"
        :items="allEvents"
        see-all-label="Ver Tudo"
        :default-image="DEFAULT_IMAGE"
      />
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer-wrap">
        <div class="footer-top row items-center justify-between q-mb-lg">
          <img src="/logo.svg" alt="Logo" class="footer-logo" />

          <div class="row q-gutter-md">
            <q-btn flat no-caps label="Compre Conosco" class="text-white" />
          </div>
        </div>

        <q-separator dark />

        <div class="footer-links row justify-between q-mt-lg">
          <div>
            <div class="text-subtitle2 q-bold q-mb-sm">Links Úteis</div>
            <div>Eventos em Destaque</div>
            <div>Próximos Eventos</div>
            <div>Blog</div>
            <div>Programação Completa</div>
          </div>

          <!-- Contato -->
          <div>
            <div class="text-subtitle2 text-bold q-mb-sm">Contato</div>
            <div>ajuda@ticketpe.com.br</div>
            <div class="row q-gutter-md q-mt-sm">
              <q-icon name="mdi-facebook" size="28px" />
              <q-icon name="mdi-instagram" size="28px" />
              <q-icon name="mdi-tiktok" size="28px" />
            </div>
          </div>

          <!-- Suporte -->
          <div>
            <div class="text-subtitle2 text-bold q-mb-sm">Suporte</div>
            <div>Termos de Uso</div>
            <div>Polí­tica de Privacidade</div>
          </div>
        </div>

        <q-separator dark class="q-mt-lg" />

        <div class="text-center q-mt-md">© 2025 Ticketpe. Todos os direitos reservados.</div>
      </div>
    </footer>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import EventSectionCarousel from 'components/EventSectionCarousel.vue'

const DEFAULT_IMAGE = 'https://i.postimg.cc/C59stMzr/Captura-de-tela-2025-10-01-130250.png'

// refs que alimentam o carrossel hero
const activeSlide = ref(null)
const featured = ref([])

// seções adicionais
const reveillonEvents = ref([])
const carnavalEvents = ref([])
const saoJoaoEvents = ref([])
const allEvents = ref([])

// categorias fixas usadas nos botoes tiles
const categories = ref([
  { label: 'Carnaval', icon: 'celebration' },
  { label: 'São João', icon: 'park' },
  { label: 'Semana Santa', icon: 'holiday_village' },
  { label: 'Ano Novo', icon: 'auto_awesome' },
  { label: 'Boate', icon: 'nightlife' },
  { label: 'Calourada', icon: 'school' },
])

// boot das seções
onMounted(() => {
  loadFeatured()
  loadReveillon()
  loadCarnaval()
  loadSaoJoao()
  loadAllEvents()
})

async function loadFeatured() {
  try {
    const response = await api.get('/festas', {
      params: {
        'pagination[pageSize]': 25,
        populate: '*',
      },
    })

    const festas = Array.isArray(response?.data?.data) ? response.data.data : []

    if (!festas.length) {
      featured.value = []
      activeSlide.value = null
      return
    }

    featured.value = festas.map(toFeaturedCard)
    activeSlide.value = featured.value[0]?.id ?? null
  } catch (err) {
    console.error('Falha ao carregar festas', err)
  }
}

async function loadReveillon() {
  try {
    const response = await api.get('/festas', {
      params: {
        'filters[$and][0][tag][tagname][$eqi]': 'REVEILLON',
        publicationState: 'live',
        'sort[0]': 'Data:asc',
        'pagination[pageSize]': 25,
        populate: '*',
      },
    })

    const festas = Array.isArray(response?.data?.data) ? response.data.data : []
    reveillonEvents.value = festas.map(toFeaturedCard)
  } catch (err) {
    console.error('Falha ao carregar reveillon', err)
    reveillonEvents.value = []
  }
}

// Carnaval ---------------------------------------------------------------
async function loadCarnaval() {
  try {
    const response = await api.get('/festas', {
      params: {
        'filters[$and][0][tag][tagname][$eqi]': 'CARNAVAIS',
        'filters[$and][1][tag][tagname][$ne]': 'REVEILLON',
        publicationState: 'live',
        'sort[0]': 'Data:asc',
        populate: '*',
      },
    })

    const festas = Array.isArray(response?.data?.data) ? response.data.data : []
    carnavalEvents.value = festas.map(toFeaturedCard)
  } catch (err) {
    console.error('Falha ao carregar carnaval', err)
    carnavalEvents.value = []
  }
}

// São João ---------------------------------------------------------------
async function loadSaoJoao() {
  try {
    const response = await api.get('/festas', {
      params: {
        'filters[$and][0][tag][tagname][$eqi]': 'SaoJoao',
        'filters[$and][1][tag][tagname][$ne]': 'CARNAVAIS',
        publicationState: 'live',
        'sort[0]': 'Data:asc',
        populate: '*',
      },
    })

    const festas = Array.isArray(response?.data?.data) ? response.data.data : []
    saoJoaoEvents.value = festas.map(toFeaturedCard)
  } catch (err) {
    console.error('Falha ao carregar São João', err)
    saoJoaoEvents.value = []
  }
}

// Programação completa ---------------------------------------------------------------
async function loadAllEvents() {
  try {
    const response = await api.get('/festas', {
      params: {
        'pagination[pageSize]': 60,
        publicationState: 'live',
        'sort[0]': 'Data:asc',
        populate: '*',
      },
    })

    const festas = Array.isArray(response?.data?.data) ? response.data.data : []
    allEvents.value = festas.map(toFeaturedCard)
  } catch (err) {
    console.error('Falha ao carregar programação completa', err)
    allEvents.value = []
  }
}

// transforma o payload do Strapi no objeto usado pelos cards
function toFeaturedCard(festa) {
  const record = festa?.attributes ?? festa ?? {}
  const baseId = festa?.id ?? record.id ?? record.UID ?? record.slug ?? record.documentId
  const cardId = String(baseId ?? Math.random().toString(36).slice(2))
  const documentId = record.documentId ?? String(baseId ?? cardId)

  // Busca o primeiro título preenchido, independente do formato vindo do CMS
  const title =
    firstNonEmptyString(
      record.Nome,
      record.nome,
      record.Titulo,
      record.titulo,
      record.Title,
      record.title,
    ) || 'Evento sem nome'

  const description = firstNonEmptyString(
    record.Descricao,
    record.descricao,
    record.description,
    record.Resumo,
    record.resumo,
  )

  const dateValue = firstNonEmptyString(
    record.Data,
    record.data,
    record.DataInicio,
    record.dataInicio,
    record.data_inicio,
    record.Inicio,
    record.inicio,
    record.startDate,
  )

  const city = firstNonEmptyString(
    record.Cidade,
    record.cidade,
    record.Localidade,
    record.local,
    record.city,
  )

  const state = firstNonEmptyString(
    record.Estado,
    record.estado,
    record.UF,
    record.uf,
    record.state,
  )

  return {
    id: cardId,
    title,
    description,
    date: formatDate(dateValue),
    location: formatLocation(city, state),
    image: resolveImage(record),
    link: { name: 'event-detail', params: { id: documentId } },
  }
}

// helpers de formato
function formatDate(value) {
  if (!value) return 'Data a definir'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Data a definir'
  return parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatLocation(city, state) {
  if (!city && !state) return 'Local a definir'
  if (!city) return state
  if (!state) return city
  return city + ' - ' + state
}

// busca a melhor festa entre as enviadas pelo strapi,
function resolveImage(festa) {
  const gallery = Array.isArray(festa?.FOTOSEVENTO) ? festa.FOTOSEVENTO : []
  const sources = [
    festa?.banner,
    festa?.capa,
    festa?.imagem,
    festa?.Imagem,
    festa?.imagemUrl,
    festa?.cover,
    festa?.capaPrincipal,
    ...gallery,
  ]

  for (const source of sources) {
    const url = extractMediaUrl(source)
    if (url) return prependHost(url)
  }

  return DEFAULT_IMAGE
}

function extractMediaUrl(media) {
  if (!media) return null
  if (typeof media === 'string') return media
  if (Array.isArray(media)) {
    for (const item of media) {
      const nested = extractMediaUrl(item)
      if (nested) return nested
    }
    return null
  }

  return (
    media?.url ??
    media?.attributes?.url ??
    media?.data?.attributes?.url ??
    media?.data?.url ??
    media?.formats?.medium?.url ??
    media?.formats?.large?.url ??
    media?.formats?.small?.url ??
    null
  )
}

function prependHost(url) {
  if (!url || typeof url !== 'string') return DEFAULT_IMAGE
  if (url.startsWith('http')) return url
  return 'http://localhost:1337' + url
}

// Retorna a primeira string não vazia encontrada nas opções pendentes
function firstNonEmptyString(...values) {
  for (const value of values) {
    if (typeof value !== 'string') continue
    const trimmed = value.trim()
    if (trimmed.length > 0) return trimmed
  }
  return ''
}

// Remove acentos e deixa minúsculo para comparações consistentes

// Gera cards fictícios para preencher seções que ainda não possuem dados reais
</script>

<style scoped>
.event-groups {
  padding: 0 80px;
  max-width: 1200px;
  margin: 0 auto;
}
/* fundo */
.bg-landing {
  background-color: #2a3447;
  min-height: 100vh;
}

/* ================= CARROSSEL ================= */
.destaque {
  background-color: #2a3447;
  padding: 40px 0;
}
.featured-carousel {
  background: transparent !important;
}
.featured-carousel .q-carousel__slide {
  display: flex;
  align-items: center;
}
.featured-wrap {
  width: 100%;
  max-width: 1760px;
  height: 440px;
  margin: 0 auto;
  padding: 0 80px;
  box-sizing: border-box;
}
.featured-grid {
  display: grid;
  grid-template-columns: 60% 40%;
  height: 100%;
  background: #fff;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.featured-img {
  overflow: hidden;
}
.featured-img .q-img__content img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.featured-img .full {
  width: 100%;
  height: 100%;
}
.featured-img .full img {
  object-fit: cover;
}
.featured-panel {
  background: #fff;
  color: #1f2937;
  display: flex;
}
.featured-panel,
.featured-panel * {
  color: #1f2937 !important;
}
.panel-inner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  width: 100%;
  min-height: 100%;
}
.featured-description {
  color: #4b5563;
  max-height: 84px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}
.featured-carousel {
  position: relative;
}
.featured-carousel .q-carousel__navigation {
  position: absolute;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}
.featured-carousel .q-carousel__navigation .q-btn {
  opacity: 0.85;
}

/* ================= CATEGORIAS ================= */
.categories {
  background-color: #2a3447;
  margin-top: 60px;
  padding: 60px 0;
}
.categories-wrap {
  width: calc(100vw - 160px);
  max-width: 1760px;
  margin: 0 auto;
  padding: 0 80px;
}
.cat-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  max-width: 1280px;
  margin: 0 auto;
}

/* Responsividade para dispositivos móveis */
@media (max-width: 768px) {
  .categories-wrap {
    padding: 0 40px;
  }

  .cat-grid {
    gap: 12px;
    justify-content: space-around;
  }

  .cat-btn {
    min-width: 140px;
    height: 48px;
    font-size: 14px;
  }

  .cat-btn .q-icon {
    font-size: 18px;
    margin-right: 6px;
  }
}
.cat-btn {
  border-radius: 12px !important;
  height: 52px;
  min-width: 180px;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}
.cat-btn:hover {
  background: #35c7ee !important;
  border-color: #35c7ee !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(53, 199, 238, 0.3);
}
.cat-btn .q-btn__content {
  font-weight: 700;
  letter-spacing: 0.3px;
  color: white !important;
}
.cat-btn:hover .q-btn__content {
  color: white !important;
}
.cat-btn .q-icon {
  margin-right: 8px;
  font-size: 20px;
}

/* ================= HERO - TIPOGRAFIA E CORES ================= */
.event-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600; /* semibold */
  font-size: 36px;
  line-height: 1.2;
  color: #1f2937;
}

.event-meta {
  font-family: 'Poppins', sans-serif;
  font-weight: 400; /* regular */
  font-size: 16px;
  color: #1f2937;
}

.event-meta__icon {
  color: #8b5cf6; /* roxo */
}

/* ================= FOOTER ================= */
.footer {
  background-color: #161f2f;
  padding: 32px 40px;
  color: white;
}
.footer-logo {
  height: 60px;
  width: auto;
  display: block;
  object-fit: contain;
}
.footer-links div {
  margin-bottom: 2px;
}
</style>
