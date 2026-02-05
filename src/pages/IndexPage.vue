<template>
  <q-page class="bg-landing">
    <!-- EVENTOS EM DESTAQUE -->
    <section class="destaque">
      <!-- Skeleton para featured -->
      <div v-if="loadingFeatured" class="featured-wrap">
        <SkeletonLoader variant="hero" />
      </div>

      <!-- Carousel real -->
      <div v-else class="carousel-container">
        <q-carousel
          v-model="activeSlide"
          animated
          infinite
          swipeable
          autoplay
          :autoplay-interval="autoplayInterval"
          :height="$q.screen.lt.sm ? 'auto' : '440px'"
          control-color="transparent"
          navigation-position="bottom"
          transition-prev="slide-right"
          transition-next="slide-left"
          class="featured-carousel"
        >
          <q-carousel-slide v-for="ev in featured" :key="ev.id" :name="ev.id" class="q-pa-none">
            <div class="featured-wrap">
              <div
                class="featured-grid rounded-borders overflow-hidden shadow-2"
                :class="{ 'featured-grid--clickable': $q.screen.lt.sm }"
                @click="$q.screen.lt.sm ? $router.push(ev.link || '#') : null"
              >
                <!-- Imagem -->
                <q-img
                  :src="ev.image"
                  :alt="`Imagem do evento ${ev.title}`"
                  fit="cover"
                  class="featured-img"
                  :ratio="16 / 9"
                  spinner-color="white"
                  loading="lazy"
                >
                  <!-- Badge "Últimos ingressos!" -->
                  <div v-if="ev.showLastTickets" class="featured-badge">Últimos ingressos!</div>
                </q-img>

                <!-- Painel -->
                <div class="featured-panel">
                  <div class="panel-inner">
                    <div class="event-title q-mb-sm">{{ ev.title }}</div>

                    <div v-if="ev.description" class="featured-description text-body1 q-mt-xs">
                      {{ ev.description }}
                    </div>

                    <div class="q-mt-md q-gutter-sm">
                      <div class="row items-center event-meta">
                        <q-icon
                          name="event"
                          class="q-mr-sm event-meta__icon"
                          color="purple-7"
                          aria-hidden="true"
                        />
                        <span>{{ ev.date }}</span>
                      </div>
                      <div class="row items-center event-meta">
                        <q-icon
                          name="place"
                          class="q-mr-sm event-meta__icon"
                          color="purple-7"
                          aria-hidden="true"
                        />
                        <span class="event-location-desktop">{{ ev.location }}</span>
                        <span class="event-location-mobile">{{
                          ev.cityState || ev.location || 'Local a definir'
                        }}</span>
                      </div>
                    </div>

                    <q-btn
                      class="q-mt-lg featured-cta"
                      unelevated
                      no-caps
                      label="Ver Detalhes"
                      :aria-label="`Ver detalhes do evento ${ev.title}`"
                      :to="ev.link || '#'"
                    />
                  </div>
                </div>
              </div>
            </div>
          </q-carousel-slide>
        </q-carousel>

        <!-- Paginação separada -->
        <div class="pagination-dots">
          <button
            v-for="(event, index) in featured"
            :key="event.id"
            :class="['pagination-dot', { 'pagination-dot--active': activeSlide === event.id }]"
            :aria-label="`Ir para slide ${index + 1}`"
            @click="activeSlide = event.id"
          />
        </div>
      </div>
    </section>

    <!-- CATEGORIAS -->
    <section class="categories categories--hide-mobile" aria-label="Categorias de eventos">
      <div class="categories-wrap">
        <div class="cat-grid">
          <q-btn
            v-for="c in visibleCategories"
            :key="c.label"
            outline
            square-rounded
            no-caps
            class="cat-btn"
            :class="{ 'cat-btn--active': selectedCategories.includes(c.label) }"
            color="white"
            text-color="white"
            :aria-label="`Filtrar eventos de ${c.label}`"
            @click="toggleCategory(c.label)"
          >
            <template #default>
              <span class="cat-btn-content">
                <CategoryIcon :icon="c.icon" :size="20" color="white" icon-class="cat-btn-icon" />
                <span class="cat-btn-label">{{ c.label }}</span>
              </span>
            </template>
          </q-btn>
          <!-- Botão para expandir categorias -->
          <q-btn
            v-if="!showAllCategories && categories && categories.length > 9"
            flat
            round
            dense
            icon="add"
            class="add-category-btn"
            color="white"
            aria-label="Mostrar mais categorias"
            @click="toggleShowAllCategories"
          />
        </div>
      </div>
    </section>

    <!-- VIDEO BANNER -->
    <VideoBanner
      video="/banner_ticketpe.webm"
      link="https://chat.whatsapp.com/HLtVXbX4PbO1RVW317mLlB"
    />

    <section class="event-groups">
      <!-- Skeletons para carrosséis -->
      <template v-if="loadingCarousels">
        <SkeletonLoader variant="carousel" :carousel-count="5" />
      </template>

      <!-- Eventos filtrados por categoria -->
      <template v-else-if="selectedCategories.length > 0">
        <!-- Mostra mensagem quando não há eventos -->
        <template v-if="filteredEvents.length === 0">
          <div class="empty-category-message">
            <div class="sad-face">:(</div>
            <div class="empty-category-title">
              Ops! Nada de <span class="category-name">{{ selectedCategories[0] }}</span> por
              enquanto.
            </div>
            <div class="empty-category-subtitle">
              Que tal explorar
              <a href="#" class="explore-link" @click.prevent="clearCategories">outra categoria</a>?
            </div>
          </div>
        </template>
        <!-- Mostra carrossel quando há eventos -->
        <EventSectionCarousel
          v-else
          :section-id="getCombinedSectionId()"
          :title="getFilterTitle()"
          :items="filteredEvents"
          :default-image="DEFAULT_IMAGE"
        />
      </template>

      <!-- Carrosséis normais -->
      <template v-else>
        <EventSectionCarousel
          section-id="eventos-a-seguir"
          title="Eventos à seguir"
          :items="upcomingEvents"
          see-all-label="Ver Tudo"
          :see-all-link="{ name: 'programacao-completa' }"
          :default-image="DEFAULT_IMAGE"
        />

        <EventSectionCarousel
          section-id="previas-carnaval"
          title="Prévias de Carnaval"
          :items="previasCarnavalEvents"
          see-all-label="Ver Tudo"
          :see-all-link="{ name: 'previas-carnaval' }"
          :default-image="DEFAULT_IMAGE"
          :editable="isAdmin"
          :tag-id="previasCarnavalTagId"
          :tag-name="previasCarnavalTagName"
        />

        <EventSectionCarousel
          section-id="carnaval"
          title="Carnaval"
          :items="carnavalEvents"
          see-all-label="Ver Tudo"
          :see-all-link="{ name: 'carnaval' }"
          :default-image="DEFAULT_IMAGE"
          :editable="isAdmin"
          :tag-id="carnavalTagId"
          :tag-name="carnavalTagName"
        />

        <EventSectionCarousel
          section-id="festivais"
          title="Festivais"
          :items="saoJoaoEvents"
          see-all-label="Ver Tudo"
          :see-all-link="{ name: 'festivais' }"
          :default-image="DEFAULT_IMAGE"
          :editable="isAdmin"
          :tag-id="festivaisTagId"
          :tag-name="festivaisTagName"
        />

        <EventSectionCarousel
          section-id="programacao-completa"
          title="Programação completa"
          :items="allEvents"
          see-all-label="Ver Tudo"
          :see-all-link="{ name: 'programacao-completa' }"
          :default-image="DEFAULT_IMAGE"
        />

        <EventSectionCarousel
          section-id="reveillon"
          title="Réveillon"
          :items="reveillonEvents"
          see-all-label="Ver Tudo"
          :see-all-link="{ name: 'reveillon' }"
          :default-image="DEFAULT_IMAGE"
          :editable="isAdmin"
          :tag-id="reveillonTagId"
          :tag-name="reveillonTagName"
        />
      </template>
    </section>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import EventSectionCarousel from 'components/EventSectionCarousel.vue'
import SkeletonLoader from 'components/SkeletonLoader.vue'
import VideoBanner from 'components/VideoBanner.vue'
import CategoryIcon from 'components/CategoryIcon.vue'
import { useSupabaseEvents } from 'src/composables/useSupabaseEvents'
import { useCategories } from 'src/composables/useCategories'
import { useAuth } from 'src/composables/useAuth'
import { DEFAULT_IMAGES } from 'src/constants/config'
import { generateSlug } from 'src/utils/stringUtils'

const $q = useQuasar()

const DEFAULT_IMAGE = DEFAULT_IMAGES.eventPlaceholder

// Composable para gerenciar eventos (Supabase)
const {
  fetchFeaturedEvents,
  fetchEvents: fetchEventsSupabase,
  fetchEventsByTag: fetchEventsByTagSupabase,
  fetchEventsByMultipleTags: fetchEventsByMultipleTagsSupabase,
  fetchAllEvents: fetchAllEventsSupabase,
  fetchUpcomingEvents: fetchUpcomingEventsSupabase,
} = useSupabaseEvents()

// Composable para gerenciar categorias (com cache)
const { categories, loadCategories } = useCategories()

// Composable para autenticação e admin
const { isAdmin } = useAuth()

// refs que alimentam o carrossel hero
const activeSlide = ref(null)
const featured = ref([])

// seções adicionais
const upcomingEvents = ref([])
const previasCarnavalEvents = ref([])
const reveillonEvents = ref([])
const carnavalEvents = ref([])
const saoJoaoEvents = ref([])
const allEvents = ref([])
const autoplayInterval = ref(3000) // em milissegundos

// Tag IDs e nomes para drag-and-drop (admin edição de ordem)
const previasCarnavalTagId = ref(null)
const previasCarnavalTagName = ref(null)
const carnavalTagId = ref(null)
const carnavalTagName = ref(null)
const festivaisTagId = ref(null)
const festivaisTagName = ref(null)
const reveillonTagId = ref(null)
const reveillonTagName = ref(null)

// Estados de loading
const loadingFeatured = ref(true)
const loadingCarousels = ref(true)

// Filtro por categoria (agora suporta múltiplas seleções)
const selectedCategories = ref([]) // Array de labels de categorias
const filteredEvents = ref([])

// Categorias serão carregadas via composable useCategories

// Estado para controlar se mostra todas as categorias ou apenas 9
const showAllCategories = ref(false)

// Flag para evitar loop de eventos
const isInternalCategoryChange = ref(false)

// Computed para retornar apenas as primeiras 9 categorias ou todas
const visibleCategories = computed(() => {
  if (!categories.value) return []
  if (showAllCategories.value) {
    return categories.value
  }
  return categories.value.slice(0, 9)
})

// Função para alternar a exibição de todas as categorias
function toggleShowAllCategories() {
  showAllCategories.value = !showAllCategories.value
}

// Helper para obter tagName a partir do label
function getTagNameByLabel(label) {
  if (!categories.value) return null
  const c = categories.value.find((x) => x.label === label)
  return c?.tagName || null
}

// Helper para converter label de categoria em ID de seção
function getSectionIdByLabel(label) {
  // Mapeamento fixo dos carrosséis principais
  const fixedMap = {
    Réveillon: 'reveillon',
    Reveillon: 'reveillon',
    Reveillons: 'reveillon', // Plural atualizado
    REVEILLONS: 'reveillon',
    REVEILLON: 'reveillon',
    Carnaval: 'carnaval',
    CARNAVAL: 'carnaval',
    Carnavais: 'carnaval',
    Festivais: 'festivais',
    FESTIVAIS: 'festivais',
    FESTIVAISS: 'festivais', // Compatibilidade com código antigo
    'Programação completa': 'programacao-completa',
    'Programação Completa': 'programacao-completa',
  }

  // Se já está mapeado, retorna
  if (fixedMap[label]) {
    return fixedMap[label]
  }

  // Caso contrário, converte o label para slug
  // Remove acentos e caracteres especiais, converte para minúsculas
  return label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Espaços viram hífens
}

const CARNAVAL_PINNED_SLUGS = ['carvalheira-na-ladeira']

function getEventSlug(event) {
  if (!event) return ''
  return event.slug || (event.title ? generateSlug(event.title) : '')
}

function getPriorityIndex(event, prioritySlugs) {
  const slug = getEventSlug(event)
  for (let i = 0; i < prioritySlugs.length; i += 1) {
    const target = prioritySlugs[i]
    if (slug === target || slug.startsWith(`${target}-`)) {
      return i
    }
  }
  return -1
}

function prioritizeEvents(events, prioritySlugs) {
  if (!events?.length || !prioritySlugs?.length) return events
  const buckets = prioritySlugs.map(() => [])
  const rest = []

  for (const ev of events) {
    const index = getPriorityIndex(ev, prioritySlugs)
    if (index >= 0) {
      buckets[index].push(ev)
    } else {
      rest.push(ev)
    }
  }

  return [...buckets.flat(), ...rest]
}

// Helper para obter eventos de categorias fixas
function getEventsForFixedCategory(sectionId) {
  const fixedCategoriesMap = {
    reveillon: reveillonEvents.value,
    carnaval: carnavalEvents.value,
    festivais: saoJoaoEvents.value,
    'programacao-completa': allEvents.value,
  }
  return fixedCategoriesMap[sectionId] || []
}

// Função para fazer scroll suave até uma seção
async function scrollToSection(sectionId) {
  if (!sectionId) return

  // Aguarda o próximo ciclo de atualização do Vue para garantir que o DOM foi atualizado
  await nextTick()

  // Aguarda um pouco mais para garantir que os elementos foram renderizados
  setTimeout(() => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 120 // Offset para não colar no topo (header fixo)
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }, 150)
}

// Escuta eventos do header
function handleCategorySelected(event) {
  // Se a mudança é interna, ignora o evento para evitar loop
  if (isInternalCategoryChange.value) {
    isInternalCategoryChange.value = false
    return
  }

  const category = event.detail.category
  const categories = event.detail.categories || (category ? [category] : [])

  selectedCategories.value = categories

  if (categories.length > 0) {
    // Se há múltiplas categorias, sempre filtra via API
    if (categories.length > 1 || !isFixedCategory(categories[0])) {
      filterEventsByCategories(categories)
    } else {
      // Se há apenas uma categoria e é fixa, usa eventos pré-carregados
      const sectionId = getSectionIdByLabel(categories[0])
      if (fixedSectionIds.includes(sectionId)) {
        filteredEvents.value = getEventsForFixedCategory(sectionId)
        scrollToSection(sectionId).catch((err) => console.error('Erro ao fazer scroll:', err))
      } else {
        filterEventsByCategories(categories)
      }
    }
  } else {
    // Se categorias foram desmarcadas, volta aos carrosséis normais
    filteredEvents.value = []
  }
}

// Verifica se uma categoria é fixa (já tem carrossel)
function isFixedCategory(categoryLabel) {
  const sectionId = getSectionIdByLabel(categoryLabel)
  return fixedSectionIds.includes(sectionId)
}

// boot das seções
onMounted(async () => {
  // Carrega categorias usando cache
  await loadCategories()

  // Adiciona listener para eventos do header
  window.addEventListener('categorySelected', handleCategorySelected)

  // Carrega featured separadamente para mostrar primeiro
  await loadFeatured()
  loadingFeatured.value = false

  // Carrega carrosséis em paralelo
  await Promise.all([
    loadUpcomingEvents(),
    loadPreviasCarnaval(),
    loadReveillon(),
    loadCarnaval(),
    loadFestivais(),
    loadAllEvents(),
  ])
  loadingCarousels.value = false
})

onUnmounted(() => {
  // Remove listener quando componente é desmontado
  window.removeEventListener('categorySelected', handleCategorySelected)
})

async function loadFeatured() {
  try {
    // Primeiro tenta buscar eventos em destaque do Supabase
    let events = await fetchFeaturedEvents({ limit: 25 })

    // Se não há eventos em destaque, busca eventos recentes do Supabase
    if (!events.length) {
      events = await fetchEventsSupabase({ limit: 25 })
    }

    featured.value = events
    activeSlide.value = events[0]?.id ?? null
  } catch {
    featured.value = []
  }
}

async function loadUpcomingEvents() {
  try {
    // Busca eventos com data >= hoje, ordenados por data crescente
    upcomingEvents.value = await fetchUpcomingEventsSupabase({ limit: 100 })
  } catch {
    upcomingEvents.value = []
  }
}

async function loadPreviasCarnaval() {
  try {
    // Busca o nome correto da tag a partir das categorias carregadas
    let tagName = 'Prévias de Carnaval' // Nome padrão
    let tagId = null

    if (categories.value) {
      const previasCategory = categories.value.find(
        (c) => c.label === 'Prévias de Carnaval' || c.slug === 'previas-carnaval',
      )
      if (previasCategory?.tagName) {
        tagName = previasCategory.tagName
      }
      if (previasCategory?.id) {
        tagId = previasCategory.id
      }
    }

    // Tenta diferentes variações para compatibilidade
    let events = await fetchEventsByTagSupabase(tagName, { limit: 100 })

    if (!events.length) {
      events = await fetchEventsByTagSupabase('Prévias de Carnaval', { limit: 100 })
    }

    if (!events.length) {
      events = await fetchEventsByTagSupabase('previas-carnaval', { limit: 100 })
    }

    previasCarnavalEvents.value = events
    previasCarnavalTagName.value = tagName
    previasCarnavalTagId.value = tagId
  } catch {
    previasCarnavalEvents.value = []
  }
}

async function loadReveillon() {
  try {
    // Busca o nome correto da tag a partir das categorias carregadas
    let tagName = 'Reveillons' // Nome padrão atualizado
    let tagId = null

    if (categories.value) {
      const reveillonCategory = categories.value.find(
        (c) =>
          c.label === 'Réveillon' ||
          c.label === 'Reveillons' ||
          c.label === 'REVEILLONS' ||
          c.slug === 'reveillon' ||
          c.slug === 'reveillons',
      )
      if (reveillonCategory?.tagName) {
        tagName = reveillonCategory.tagName
      }
      if (reveillonCategory?.id) {
        tagId = reveillonCategory.id
      }
    }

    // Tenta diferentes variações para compatibilidade
    let events = await fetchEventsByTagSupabase(tagName, { limit: 100 })

    if (!events.length) {
      events = await fetchEventsByTagSupabase('Reveillons', { limit: 100 })
    }

    if (!events.length) {
      events = await fetchEventsByTagSupabase('REVEILLONS', { limit: 100 })
    }

    if (!events.length) {
      events = await fetchEventsByTagSupabase('reveillon', { limit: 100 })
    }

    reveillonEvents.value = events
    reveillonTagName.value = tagName
    reveillonTagId.value = tagId
  } catch {
    reveillonEvents.value = []
  }
}

async function loadCarnaval() {
  try {
    // Busca o nome correto da tag a partir das categorias carregadas
    let tagName = 'Carnaval' // Nome padrão atualizado
    let tagId = null

    if (categories.value) {
      const carnavalCategory = categories.value.find(
        (c) =>
          c.label === 'Carnaval' ||
          c.label === 'CARNAVAL' ||
          c.label === 'Carnavais' ||
          c.slug === 'carnaval' ||
          c.slug === 'carnavais',
      )
      if (carnavalCategory?.tagName) {
        tagName = carnavalCategory.tagName
      }
      if (carnavalCategory?.id) {
        tagId = carnavalCategory.id
      }
    }

    // Tenta diferentes variações para compatibilidade
    let events = await fetchEventsByTagSupabase(tagName, { limit: 100 })

    if (!events.length) {
      events = await fetchEventsByTagSupabase('Carnaval', { limit: 100 })
    }

    if (!events.length) {
      events = await fetchEventsByTagSupabase('CARNAVAL', { limit: 100 })
    }

    if (!events.length) {
      events = await fetchEventsByTagSupabase('carnavais', { limit: 100 })
    }

    carnavalEvents.value = prioritizeEvents(events, CARNAVAL_PINNED_SLUGS)
    carnavalTagName.value = tagName
    carnavalTagId.value = tagId
  } catch {
    carnavalEvents.value = []
  }
}

async function loadFestivais() {
  try {
    // Busca o nome correto da tag a partir das categorias carregadas
    let tagName = 'Festivais' // Nome padrão atualizado
    let tagId = null

    if (categories.value) {
      const festivaisCategory = categories.value.find(
        (c) => c.label === 'Festivais' || c.label === 'FESTIVAIS' || c.slug === 'festivais',
      )
      if (festivaisCategory?.tagName) {
        tagName = festivaisCategory.tagName
      }
      if (festivaisCategory?.id) {
        tagId = festivaisCategory.id
      }
    }

    // Tenta diferentes variações para compatibilidade
    let events = await fetchEventsByTagSupabase(tagName, { limit: 100 })

    if (!events.length) {
      events = await fetchEventsByTagSupabase('Festivais', { limit: 100 })
    }

    if (!events.length) {
      events = await fetchEventsByTagSupabase('FESTIVAIS', { limit: 100 })
    }

    saoJoaoEvents.value = events
    festivaisTagName.value = tagName
    festivaisTagId.value = tagId
  } catch {
    saoJoaoEvents.value = []
  }
}

async function loadAllEvents() {
  try {
    allEvents.value = await fetchAllEventsSupabase(100)
  } catch {
    allEvents.value = []
  }
}

// IDs das seções fixas que já existem como carrosséis
const fixedSectionIds = ['reveillon', 'carnaval', 'festivais', 'programacao-completa']

// Filtro por categoria (agora suporta múltiplas seleções)
function toggleCategory(categoryLabel) {
  // Marca como mudança interna para evitar loop de eventos
  isInternalCategoryChange.value = true

  const currentIndex = selectedCategories.value.indexOf(categoryLabel)

  if (currentIndex > -1) {
    // Se já está selecionada, remove
    selectedCategories.value.splice(currentIndex, 1)
  } else {
    // Adiciona à lista de categorias selecionadas
    selectedCategories.value.push(categoryLabel)
  }

  // Se não há categorias selecionadas, limpa os eventos filtrados
  if (selectedCategories.value.length === 0) {
    filteredEvents.value = []
  } else {
    // Filtra eventos pelas categorias selecionadas
    filterEventsByCategories(selectedCategories.value)
  }

  // Emite evento para sincronizar com o header (após um pequeno delay para garantir que o DOM foi atualizado)
  setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent('categorySelected', {
        detail: {
          category: selectedCategories.value.length === 1 ? selectedCategories.value[0] : null,
          categories: selectedCategories.value,
        },
      }),
    )
  }, 50)
}

// Função auxiliar para obter título do filtro
function getFilterTitle() {
  if (selectedCategories.value.length === 0) {
    return 'Eventos'
  } else if (selectedCategories.value.length === 1) {
    return `Eventos de ${selectedCategories.value[0]}`
  } else {
    return `Eventos: ${selectedCategories.value.join(' + ')}`
  }
}

// Função auxiliar para obter ID de seção combinado
function getCombinedSectionId() {
  if (selectedCategories.value.length === 0) {
    return 'eventos-filtrados'
  } else if (selectedCategories.value.length === 1) {
    return getSectionIdByLabel(selectedCategories.value[0])
  } else {
    // Gera um ID baseado nas categorias selecionadas
    return selectedCategories.value.map((cat) => getSectionIdByLabel(cat)).join('-')
  }
}

// Função para limpar categorias selecionadas
function clearCategories() {
  selectedCategories.value = []
  filteredEvents.value = []

  // Marca como mudança interna para evitar loop
  isInternalCategoryChange.value = true

  // Emite evento para sincronizar com o header
  setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent('categorySelected', {
        detail: {
          category: null,
          categories: [],
        },
      }),
    )

    // Faz scroll suave até o topo do header
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, 50)
}

async function filterEventsByCategories(categoryLabels) {
  loadingCarousels.value = true
  try {
    // Converte labels para tagNames
    const tagNames = categoryLabels
      .map((label) => getTagNameByLabel(label))
      .filter((tagName) => tagName !== null)

    if (tagNames.length === 0) {
      filteredEvents.value = []
      return Promise.resolve()
    }

    // Usa função para buscar eventos com múltiplas tags (AND lógico)
    filteredEvents.value = await fetchEventsByMultipleTagsSupabase(tagNames, { limit: 100 })

    // Faz scroll até a seção de eventos filtrados
    const sectionId = getCombinedSectionId()
    await scrollToSection(sectionId)
  } catch {
    filteredEvents.value = []
  } finally {
    loadingCarousels.value = false
  }

  // Retorna promise para permitir aguardar o carregamento
  return Promise.resolve()
}
</script>

<style scoped>
/* ==================== BRUTAL DESIGN SYSTEM ==================== */
/* Cores brutalistas */
:root {
  --brutal-yellow: #FFE500;
  --brutal-black: #1a1a1a;
  --brutal-white: #fafafa;
  --brand-cyan: #35c7ee;
  --brand-blue: #008ec1;
  --brand-dark: #2a3447;
  --brand-darker: #1a202c;
  --brutal-purple: #d446e4;
}

/* ==================== LAYOUT BASE ==================== */
.event-groups {
  padding: 0 80px;
  max-width: 80%;
  margin: 0 auto;
  margin-bottom: 100px;
}

@media (max-width: 599px) {
  .event-groups {
    padding: 0 16px;
    max-width: 100%;
    margin-bottom: 80px;
  }
}

@media (min-width: 600px) and (max-width: 1023px) {
  .event-groups {
    padding: 0 40px;
  }
}

/* Fundo brutalista */
.bg-landing {
  background-color: #2a3447;
}

/* ==================== CARROSSEL HERO - BRUTAL ==================== */
.destaque {
  background-color: #2a3447;
  padding: 40px 0;
}

@media (max-width: 599px) {
  .destaque {
    padding: 24px 0;
  }
}

.featured-carousel {
  background: transparent !important;
  position: relative;
}

.featured-carousel :deep(.q-carousel__control) {
  display: none;
}

.featured-carousel .q-carousel__slide {
  display: flex;
  align-items: center;
}

.featured-wrap {
  width: 100%;
  max-width: 100%;
  height: 440px;
  margin: 0 auto;
  padding: 0 80px;
  box-sizing: border-box;
}

@media (max-width: 599px) {
  .featured-wrap {
    padding: 0 16px;
    height: auto;
  }

  .featured-carousel {
    height: auto !important;
  }

  .featured-carousel .q-carousel__slide {
    padding: 0 !important;
  }
}

@media (min-width: 600px) and (max-width: 1023px) {
  .featured-wrap {
    padding: 0 40px;
    height: 400px;
  }
}

/* Grid do featured - BRUTAL */
.featured-grid {
  display: grid;
  grid-template-columns: 60% 40%;
  height: 100%;
  background: transparent;
  border: 3px solid #1a1a1a;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 8px 8px 0px #1a1a1a;
  transform: translateZ(0);
}

@media (max-width: 599px) {
  .featured-grid {
    grid-template-columns: 1fr;
    grid-template-rows: 358px auto;
    height: auto;
    min-height: 568px;
    border-radius: 0;
    box-shadow: 6px 6px 0px #1a1a1a;
  }

  .featured-grid--clickable {
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
  }
}

/* Imagem - BRUTAL */
.featured-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
  display: block;
  flex-shrink: 0;
  background-color: transparent !important;

  :deep(.q-img__container) {
    border-radius: 0;
    background-color: transparent !important;
  }

  :deep(.q-img__image) {
    border-radius: 0;
    background-color: transparent !important;
  }

  :deep(img) {
    border-radius: 0;
    display: block;
    transform: scale(1.01);
    backface-visibility: hidden;
  }
}

@media (max-width: 599px) {
  .featured-img {
    height: 358px !important;
    border-radius: 0;
  }

  .featured-img :deep(.q-img__container),
  .featured-img :deep(.q-img__image),
  .featured-img :deep(img) {
    border-radius: 0;
  }
}

/* Painel de info - BRUTAL */
.featured-panel {
  background: #fafafa;
  color: #1a1a1a;
  display: flex;
  border-radius: 0;
  border-left: 3px solid #1a1a1a;
}

@media (max-width: 599px) {
  .featured-panel {
    border-radius: 0;
    border-left: none;
    border-top: 3px solid #1a1a1a;
  }
}

.featured-panel,
.featured-panel * {
  color: #1a1a1a !important;
}

.panel-inner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  padding: 40px;
  width: 100%;
  min-height: 100%;
}

@media (max-width: 599px) {
  .panel-inner {
    padding: 16px 20px 24px 20px;
    gap: 8px;
    justify-content: flex-start;
    min-height: 210px;
  }

  .panel-inner .event-title {
    margin-top: 6px !important;
    margin-bottom: -27px !important;
  }

  .panel-inner .q-mt-md {
    margin-top: -5px !important;
  }
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

@media (max-width: 599px) {
  .featured-description {
    display: none;
  }
}

/* ==================== PAGINAÇÃO - BRUTAL ==================== */
.pagination-dots {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  padding: 0 20px;
}

.pagination-dot {
  width: 16px;
  height: 16px;
  border-radius: 0;
  border: 3px solid #fafafa;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.pagination-dot:hover {
  background-color: #FFE500;
  border-color: #FFE500;
  transform: translate(-2px, -2px);
  box-shadow: 2px 2px 0px #1a1a1a;
}

.pagination-dot--active {
  background-color: #FFE500;
  border-color: #1a1a1a;
  box-shadow: 3px 3px 0px #1a1a1a;
}

.pagination-dot:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}

@media (max-width: 599px) {
  .pagination-dots {
    gap: 12px;
    margin-top: 24px;
    padding: 0;
    align-items: center;
  }

  .pagination-dot {
    width: 12px;
    height: 12px;
    border-width: 2px;
  }

  .pagination-dot--active {
    transform: none;
    box-shadow: 2px 2px 0px #1a1a1a;
  }

  .pagination-dot:hover {
    transform: none;
  }
}

/* ==================== CATEGORIAS - BRUTAL ==================== */
.categories {
  background-color: #1a202c;
  margin-top: 30px;
  padding: 60px 0;
  border-top: 3px solid #1a1a1a;
  border-bottom: 3px solid #1a1a1a;
}

@media (max-width: 599px) {
  .categories {
    margin-top: 32px;
    padding: 40px 0;
  }

  .categories--hide-mobile {
    display: none !important;
  }
}

.categories-wrap {
  width: calc(100vw - 160px);
  max-width: 100%;
  margin: 0 auto;
  padding: 0 80px;
}

@media (max-width: 599px) {
  .categories-wrap {
    padding: 0 16px;
    width: calc(100vw - 32px);
  }
}

@media (min-width: 600px) and (max-width: 1023px) {
  .categories-wrap {
    padding: 0 40px;
    width: calc(100vw - 80px);
  }
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

@media (max-width: 599px) {
  .cat-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    justify-content: stretch;
    max-width: 100%;
  }

  .cat-btn {
    min-width: auto;
    width: 100%;
    height: 56px;
    font-size: 15px;
  }

  .cat-btn .q-icon {
    font-size: 22px;
    margin-right: 8px;
  }

  .cat-btn .q-btn__content {
    font-weight: 700;
    letter-spacing: 0.2px;
  }
}

@media (min-width: 600px) and (max-width: 1023px) {
  .cat-grid {
    gap: 12px;
    justify-content: center;
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

/* Botão de categoria - BRUTAL */
.cat-btn {
  border-radius: 0 !important;
  height: 52px;
  min-width: 180px;
  font-weight: 700;
  border: 3px solid #fafafa !important;
  background: transparent !important;
  transition: all 0.15s ease;
  outline: none !important;
  box-shadow: 4px 4px 0px #1a1a1a;
}

.cat-btn:hover {
  background: #FFE500 !important;
  border-color: #1a1a1a !important;
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #1a1a1a;
}

.cat-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1a1a1a;
}

.cat-btn .q-btn__content {
  font-weight: 700;
  letter-spacing: 0.3px;
  color: white !important;
}

.cat-btn:hover .q-btn__content {
  color: #1a1a1a !important;
}

.cat-btn .q-icon {
  margin-right: 8px;
  font-size: 20px;
}

.cat-btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cat-btn-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.cat-btn :deep(.phosphor-icon svg) {
  width: 20px;
  height: 20px;
  fill: currentColor;
  color: white;
}

/* Estado ativo - BRUTAL */
.cat-btn--active {
  background: #FFE500 !important;
  border: 3px solid #1a1a1a !important;
  color: #1a1a1a !important;
  box-shadow: 4px 4px 0px #1a1a1a;
}

.cat-btn--active .q-btn__content {
  color: #1a1a1a !important;
}

.cat-btn--active:hover {
  background: #35c7ee !important;
}

/* Botão expandir - BRUTAL */
.add-category-btn {
  width: 52px;
  height: 52px;
  border-radius: 0 !important;
  border: 3px solid #fafafa !important;
  transition: all 0.15s ease;
  box-shadow: 4px 4px 0px #1a1a1a;
}

.add-category-btn:hover {
  background: #FFE500 !important;
  border-color: #1a1a1a !important;
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #1a1a1a;
}

@media (max-width: 599px) {
  .add-category-btn {
    width: 48px;
    height: 48px;
  }
}

/* ==================== CTA BOTÃO - BRUTAL ==================== */
.featured-cta {
  width: 160px;
  height: 48px;
  border-radius: 0 !important;
  min-width: 160px;
  background-color: #FFE500 !important;
  color: #1a1a1a !important;
  border: 3px solid #1a1a1a !important;
  box-shadow: 4px 4px 0px #1a1a1a;
  transition: all 0.15s ease;
}

.featured-cta:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #1a1a1a;
}

.featured-cta:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1a1a1a;
}

.featured-cta .q-btn__content {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #1a1a1a !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 599px) {
  .featured-cta {
    width: 100%;
    height: 52px;
    font-size: 16px;
    margin-top: 12px;
  }

  .featured-cta .q-btn__content {
    font-size: 16px;
    font-weight: 700;
  }
}

/* ==================== TIPOGRAFIA - BRUTAL ==================== */
.event-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  font-size: 32px;
  line-height: 1.1;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: -0.5px;
}

@media (max-width: 599px) {
  .event-title {
    font-size: 20px;
    line-height: 1.2;
    font-weight: 800;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 52px;
    margin-bottom: 0 !important;
  }
}

.event-meta {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #1a1a1a;
}

@media (max-width: 599px) {
  .event-meta {
    font-size: 14px;
    min-height: 22px;
  }

  .event-meta .q-icon {
    font-size: 18px;
    color: #d446e4 !important;
  }

  .event-meta span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .event-location-desktop {
    display: none !important;
  }

  .event-location-mobile {
    display: block !important;
  }
}

@media (min-width: 600px) {
  .event-location-desktop {
    display: block !important;
  }

  .event-location-mobile {
    display: none !important;
  }
}

.event-meta__icon {
  color: #d446e4 !important;
}

.event-meta .q-icon {
  color: #d446e4 !important;
}

/* ==================== ACESSIBILIDADE ==================== */
.q-btn:focus-visible,
.q-carousel__control button:focus-visible {
  outline: 3px solid #FFE500;
  outline-offset: 2px;
}

.cat-btn:focus-visible {
  outline: 3px solid #FFE500;
  outline-offset: 3px;
}

/* ==================== MENSAGEM VAZIA - BRUTAL ==================== */
.empty-category-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  min-height: 300px;
  background: #1a202c;
  border: 3px solid #1a1a1a;
  box-shadow: 8px 8px 0px #1a1a1a;
  margin: 40px;
}

.sad-face {
  font-family: 'Poppins', sans-serif;
  font-size: 6rem;
  font-weight: 900;
  color: #FFE500;
  margin-bottom: 24px;
  line-height: 1;
  user-select: none;
}

.empty-category-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #fafafa;
  margin-bottom: 16px;
  line-height: 1.4;
  text-transform: uppercase;
}

.empty-category-subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  color: #9ca3af;
  line-height: 1.6;
}

.category-name {
  color: #35c7ee;
  text-transform: uppercase;
  font-weight: 700;
}

.explore-link {
  color: #FFE500;
  text-decoration: none;
  font-weight: 700;
  border-bottom: 3px solid #FFE500;
  transition: all 0.15s ease;
  cursor: pointer;
}

.explore-link:hover {
  color: #35c7ee;
  border-color: #35c7ee;
}

@media (max-width: 599px) {
  .empty-category-message {
    padding: 60px 16px;
    min-height: 250px;
    margin: 20px 16px;
  }

  .sad-face {
    font-size: 4rem;
    margin-bottom: 20px;
  }

  .empty-category-title {
    font-size: 1.25rem;
  }

  .empty-category-subtitle {
    font-size: 0.9rem;
  }
}

/* ==================== BADGE - BRUTAL ==================== */
.featured-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: #FFE500;
  color: #1a1a1a;
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  font-size: 14px;
  padding: 8px 16px;
  border: 3px solid #1a1a1a;
  border-radius: 0;
  z-index: 5;
  box-shadow: 4px 4px 0px #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 599px) {
  .featured-badge {
    top: 12px;
    left: 12px;
    font-size: 12px;
    padding: 6px 12px;
    box-shadow: 3px 3px 0px #1a1a1a;
  }
}
</style>
