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
              <div class="featured-grid rounded-borders overflow-hidden shadow-2">
                <!-- Imagem -->
                <div class="featured-img">
                  <q-img
                    :src="ev.image"
                    :alt="`Imagem do evento ${ev.title}`"
                    fit="cover"
                    class="full"
                    :ratio="16 / 9"
                    spinner-color="white"
                    loading="lazy"
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
            :class="{ 'cat-btn--active': selectedCategory === c.label }"
            color="white"
            text-color="white"
            :aria-label="`Filtrar eventos de ${c.label}`"
            @click="toggleCategory(c.label)"
          >
            <template #default>
              <span class="cat-btn-content">
                <PhosphorIcon 
                  v-if="typeof c.icon === 'object' && c.icon.type === 'phosphor'" 
                  :name="c.icon.name" 
                  :size="20" 
                  weight="fill"
                  color="white" 
                  class="cat-btn-icon"
                />
                <q-icon 
                  v-else-if="typeof c.icon === 'string'" 
                  :name="c.icon" 
                  class="cat-btn-icon"
                />
                <span class="cat-btn-label">{{ c.label }}</span>
              </span>
            </template>
          </q-btn>
          <!-- Botão para expandir categorias -->
          <q-btn
            v-if="!showAllCategories && categories.length > 9"
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

    <!-- BANNER CARD -->
    <BannerCard
      image="/semjuros_margemcorreta.png"
      cta-link="/programacao?q=Carvalheira na Ladeira"
    />

    <section class="event-groups">
      <!-- Skeletons para carrosséis -->
      <template v-if="loadingCarousels">
        <SkeletonLoader variant="carousel" :carousel-count="4" />
      </template>

      <!-- Eventos filtrados por categoria -->
      <template v-else-if="selectedCategory">
        <EventSectionCarousel
          :section-id="getSectionIdByLabel(selectedCategory)"
          :title="`Eventos de ${selectedCategory}`"
          :items="filteredEvents"
          :default-image="DEFAULT_IMAGE"
        />
      </template>

      <!-- Carrosséis normais -->
      <template v-else>
        <EventSectionCarousel
          section-id="reveillon"
          title="Réveillon"
          :items="reveillonEvents"
          see-all-label="Ver Tudo"
          :see-all-link="{ name: 'reveillon' }"
          :default-image="DEFAULT_IMAGE"
        />

        <EventSectionCarousel
          section-id="carnaval"
          title="Carnaval"
          :items="carnavalEvents"
          see-all-label="Ver Tudo"
          :see-all-link="{ name: 'carnaval' }"
          :default-image="DEFAULT_IMAGE"
        />

        <EventSectionCarousel
          section-id="festivais"
          title="Festivais"
          :items="saoJoaoEvents"
          see-all-label="Ver Tudo"
          :see-all-link="{ name: 'festivais' }"
          :default-image="DEFAULT_IMAGE"
        />

        <EventSectionCarousel
          section-id="programacao-completa"
          title="Programação completa"
          :items="allEvents"
          see-all-label="Ver Tudo"
          :see-all-link="{ name: 'programacao-completa' }"
          :default-image="DEFAULT_IMAGE"
        />
      </template>
    </section>

    <!-- FOOTER -->
    <footer class="footer" role="contentinfo">
      <div class="footer-wrap">
        <div class="footer-top row items-center justify-between q-mb-lg">
          <router-link to="/" class="footer-logo-container">
            <img
              src="/logo.svg"
              alt="TicketPE - Eventos em Pernambuco"
              style="width: 220px"
              loading="lazy"
            />
          </router-link>

          <div class="social-icons row q-gutter-md">
            <a href="#" class="social-link" aria-label="WhatsApp">
              <img src="/whatsapp.svg" alt="WhatsApp" class="social-icon" />
            </a>
            <a
              href="https://www.instagram.com/ticketpe"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              aria-label="Instagram"
            >
              <img src="/insta.svg" alt="Instagram" class="social-icon" />
            </a>
            <a
              href="https://www.tiktok.com/@ticketpe"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              aria-label="TikTok"
            >
              <img src="/tiktok.svg" alt="TikTok" class="social-icon" />
            </a>
          </div>
        </div>

        <q-separator dark />

        <div class="footer-links row justify-between q-mt-lg">
          <div class="footer-column">
            <div class="footer-title">Links Úteis</div>
            <div class="footer-link">Programação Completa</div>
          </div>

          <div class="footer-column">
            <div class="footer-title">Contato</div>
            <div class="footer-link">ajuda@ticketpe.com.br</div>
          </div>

          <div class="footer-column">
            <div class="footer-title">Suporte</div>
            <router-link to="/termos-de-uso" class="footer-link">Termos de Uso</router-link>
            <div class="footer-link">Política de Privacidade</div>
          </div>
        </div>

        <q-separator dark class="q-mt-lg" />

        <div class="footer-copyright">© 2025 ticketpe. Todos os direitos reservados.</div>
      </div>
    </footer>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import EventSectionCarousel from 'components/EventSectionCarousel.vue'
import SkeletonLoader from 'components/SkeletonLoader.vue'
import BannerCard from 'components/BannerCard.vue'
import PhosphorIcon from 'components/PhosphorIcon.vue'
import { useSupabaseEvents } from 'src/composables/useSupabaseEvents'
import { useSupabaseTags } from 'src/composables/useSupabaseTags'
import { DEFAULT_IMAGES } from 'src/constants/config'

const $q = useQuasar()

const DEFAULT_IMAGE = DEFAULT_IMAGES.eventPlaceholder

// Composable para gerenciar eventos (Supabase)
const {
  fetchFeaturedEvents,
  fetchEvents: fetchEventsSupabase,
  fetchEventsByTag: fetchEventsByTagSupabase,
  fetchAllEvents: fetchAllEventsSupabase,
} = useSupabaseEvents()

// Composable para gerenciar tags (categorias dinâmicas)
const { fetchTags, mapToCategoryButtons } = useSupabaseTags()

// refs que alimentam o carrossel hero
const activeSlide = ref(null)
const featured = ref([])

// seções adicionais
const reveillonEvents = ref([])
const carnavalEvents = ref([])
const saoJoaoEvents = ref([])
const allEvents = ref([])
const autoplayInterval = ref(3000) // em milissegundos

// Estados de loading
const loadingFeatured = ref(true)
const loadingCarousels = ref(true)

// Filtro por categoria (agora vem do header)
const selectedCategory = ref(null)
const filteredEvents = ref([])

// categorias dinâmicas do Supabase
const categories = ref([])

// Estado para controlar se mostra todas as categorias ou apenas 9
const showAllCategories = ref(false)

// Flag para evitar loop de eventos
const isInternalCategoryChange = ref(false)

// Computed para retornar apenas as primeiras 9 categorias ou todas
const visibleCategories = computed(() => {
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
  const c = categories.value.find((x) => x.label === label)
  return c?.tagName || null
}

// Helper para converter label de categoria em ID de seção
function getSectionIdByLabel(label) {
  // Mapeamento fixo dos carrosséis principais
  const fixedMap = {
    Réveillon: 'reveillon',
    Reveillon: 'reveillon',
    REVEILLONS: 'reveillon',
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
    } else {
      console.warn(`⚠️ Seção com ID "${sectionId}" não encontrada`)
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
  selectedCategory.value = category

  if (category) {
    const sectionId = getSectionIdByLabel(category)

    // Se é uma categoria fixa, usa os eventos pré-carregados
    if (fixedSectionIds.includes(sectionId)) {
      filteredEvents.value = getEventsForFixedCategory(sectionId)
      scrollToSection(sectionId).catch((err) => console.error('Erro ao fazer scroll:', err))
    } else {
      // Para categorias dinâmicas, filtra eventos
      filterEventsByCategory(category)
    }
  } else {
    // Se categoria foi desmarcada, volta aos carrosséis normais
    filteredEvents.value = []
  }
}

// boot das seções
onMounted(async () => {
  // Carrega tags dinâmicas do Supabase
  try {
    const tags = await fetchTags()
    categories.value = mapToCategoryButtons(tags)
  } catch (e) {
    console.error('❌ Erro ao carregar tags:', e)
    categories.value = []
  }

  // Adiciona listener para eventos do header
  window.addEventListener('categorySelected', handleCategorySelected)

  // Carrega featured separadamente para mostrar primeiro
  await loadFeatured()
  loadingFeatured.value = false

  // Carrega carrosséis em paralelo
  await Promise.all([loadReveillon(), loadCarnaval(), loadFestivais(), loadAllEvents()])
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
      console.log('🔄 Nenhum evento em destaque encontrado, buscando eventos recentes...')
      events = await fetchEventsSupabase({ limit: 25 })
    }

    featured.value = events
    activeSlide.value = events[0]?.id ?? null
  } catch (err) {
    console.error('Falha ao carregar eventos em destaque', err)
    featured.value = []
  }
}

async function loadReveillon() {
  try {
    console.log('🔍 Carregando eventos de Réveillon...')

    // Usar o mesmo método que na ReveillonPage e outras categorias
    reveillonEvents.value = await fetchEventsByTagSupabase('REVEILLONS', { limit: 100 })

    console.log('✅ Eventos de Réveillon carregados:', reveillonEvents.value.length)
  } catch (err) {
    console.error('❌ Falha ao carregar reveillon', err)
    reveillonEvents.value = []
  }
}

async function loadCarnaval() {
  try {
    console.log('🔍 Carregando eventos de Carnaval...')

    // Primeiro tenta buscar do Supabase usando a tag 'CARNAVAL' ou 'carnavais'
    let events = await fetchEventsByTagSupabase('CARNAVAL', { limit: 100 })

    // Se não encontrou eventos com 'CARNAVAL', tenta 'carnavais' (slug)
    if (!events.length) {
      console.log('🔄 Tentando com slug "carnavais"...')
      events = await fetchEventsByTagSupabase('carnavais', { limit: 100 })
    }

    carnavalEvents.value = events
    console.log('✅ Eventos de Carnaval carregados:', events.length)
  } catch (err) {
    console.error('❌ Falha ao carregar carnaval', err)
    carnavalEvents.value = []
  }
}

async function loadFestivais() {
  try {
    console.log('🔍 Carregando eventos de Festivais...')

    // Busca eventos do Supabase usando a tag correta 'FESTIVAIS'
    let events = await fetchEventsByTagSupabase('FESTIVAIS', { limit: 100 })
    console.log('📊 Eventos encontrados com "FESTIVAIS":', events.length)

    saoJoaoEvents.value = events
    console.log('✅ Total de eventos de Festivais carregados:', events.length)
  } catch (err) {
    console.error('❌ Falha ao carregar Festivais', err)
    saoJoaoEvents.value = []
  }
}

async function loadAllEvents() {
  try {
    allEvents.value = await fetchAllEventsSupabase(100)
    console.log('✅ Programação completa carregada:', allEvents.value.length)
  } catch (err) {
    console.error('❌ Falha ao carregar programação completa', err)
    allEvents.value = []
  }
}

// IDs das seções fixas que já existem como carrosséis
const fixedSectionIds = ['reveillon', 'carnaval', 'festivais', 'programacao-completa']

// Filtro por categoria
function toggleCategory(categoryLabel) {
  // Marca como mudança interna para evitar loop de eventos
  isInternalCategoryChange.value = true

  if (selectedCategory.value === categoryLabel) {
    // Se já está selecionada, deseleciona
    selectedCategory.value = null
    filteredEvents.value = []
  } else {
    const sectionId = getSectionIdByLabel(categoryLabel)

    // Seleciona a categoria (para todas, não apenas dinâmicas)
    selectedCategory.value = categoryLabel

    // Se é uma categoria fixa (já tem carrossel), usa os eventos pré-carregados
    if (fixedSectionIds.includes(sectionId)) {
      filteredEvents.value = getEventsForFixedCategory(sectionId)
      scrollToSection(sectionId).catch((err) => console.error('Erro ao fazer scroll:', err))
    } else {
      // Para outras categorias, filtra eventos

      // Faz scroll até o carrossel correspondente após filtrar
      filterEventsByCategory(categoryLabel).then(async () => {
        // Aguarda o DOM atualizar com os eventos filtrados antes de fazer scroll
        await scrollToSection(sectionId)
      })
    }
  }

  // Emite evento para sincronizar com o header (após um pequeno delay para garantir que o DOM foi atualizado)
  setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent('categorySelected', {
        detail: { category: selectedCategory.value },
      }),
    )
  }, 50)
}

async function filterEventsByCategory(categoryLabel) {
  loadingCarousels.value = true
  try {
    console.log('🔍 Filtrando eventos por categoria:', categoryLabel)

    // Usa mapeamento dinâmico das tags
    const tagName = getTagNameByLabel(categoryLabel)
    if (!tagName) {
      console.warn('⚠️ Categoria não mapeada:', categoryLabel)
      filteredEvents.value = []
      return Promise.resolve()
    }

    // Usar Supabase com tagName dinâmico
    filteredEvents.value = await fetchEventsByTagSupabase(tagName, { limit: 100 })
    console.log('✅ Eventos filtrados:', filteredEvents.value.length)
  } catch (err) {
    console.error('❌ Falha ao filtrar eventos por categoria:', err)
    filteredEvents.value = []
  } finally {
    loadingCarousels.value = false
  }

  // Retorna promise para permitir aguardar o carregamento
  return Promise.resolve()
}
</script>

<style scoped>
.event-groups {
  padding: 0 80px;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 100px;
}

/* Mobile */
@media (max-width: 599px) {
  .event-groups {
    padding: 0 16px;
    margin-bottom: 0;
  }
}

/* Tablet */
@media (min-width: 600px) and (max-width: 1023px) {
  .event-groups {
    padding: 0 40px;
  }
}
/* fundo */
.bg-landing {
  background-color: #2a3447;
}

/* ================= CARROSSEL ================= */
.destaque {
  background-color: #2a3447;
  padding: 40px 0;
}

/* Mobile: menos padding vertical */
@media (max-width: 599px) {
  .destaque {
    padding: 24px 0;
  }
}
.featured-carousel {
  background: transparent !important;
}

/* Esconde os controles nativos do Quasar carousel */
.featured-carousel :deep(.q-carousel__control) {
  display: none;
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

/* Mobile */
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

/* Tablet */
@media (min-width: 600px) and (max-width: 1023px) {
  .featured-wrap {
    padding: 0 40px;
    height: 400px;
  }
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

/* Mobile: layout em coluna (imagem em cima, info embaixo) com altura fixa */
@media (max-width: 599px) {
  .featured-grid {
    grid-template-columns: 1fr;
    grid-template-rows: 358px auto;
    height: auto;
    min-height: 568px;
    border-radius: 24px;
  }
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

/* Mobile: imagem com altura fixa e radius apenas no topo */
@media (max-width: 599px) {
  .featured-img {
    height: 358px;
    border-radius: 24px 24px 0 0;
  }

  .featured-img .full {
    height: 358px;
  }
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
  padding: 40px;
  width: 100%;
  min-height: 100%;
}

/* Mobile: padding ajustado e layout vertical com altura mínima fixa */
@media (max-width: 599px) {
  .panel-inner {
    padding: 8px 20px 24px 20px; /* Reduzido padding-top de 12px para 8px */
    gap: 6px; /* Reduzido gap de 12px para 6px */
    justify-content: flex-start;
    min-height: 210px;
  }

  /* Reduz espaçamento entre título e elementos abaixo */
  .panel-inner .event-title {
    margin-bottom: -3px !important;
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

/* Mobile: esconde a descrição para economizar espaço */
@media (max-width: 599px) {
  .featured-description {
    display: none;
  }
}
.featured-carousel {
  position: relative;
}
/* ==================== PAGINAÇÃO SEPARADA ==================== */
.pagination-dots {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 24px;
  padding: 0 20px;
}

.pagination-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.pagination-dot:hover {
  border-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.1);
}

.pagination-dot--active {
  background-color: white;
  border-color: white;
  transform: scale(1.2);
}

.pagination-dot:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}

/* Mobile: bolinhas minimalistas e próximas */
@media (max-width: 599px) {
  .pagination-dots {
    gap: 12px;
    margin-top: 24px;
    padding: 0;
    /* Remover height: 8px; que estava causando o problema */
    align-items: center; /* Centralizar verticalmente */
  }

  .pagination-dot {
    width: 12px;
    height: 12px;
    min-width: 8px; /* Garantir largura mínima */
    min-height: 8px; /* Garantir altura mínima */
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.4);
    background-color: transparent;
    border-radius: 50%; /* Forçar círculo perfeito */
    box-sizing: border-box; /* Bordas dentro do tamanho */
    flex-shrink: 0; /* Não comprimir */
    padding: 0; /* Resetar padding padrão do botão */
    line-height: 1; /* Resetar line-height */
    vertical-align: middle; /* Alinhamento vertical */
  }

  .pagination-dot--active {
    background-color: white;
    border-color: white;
    transform: none;
  }

  .pagination-dot:hover {
    transform: none;
    border-color: rgba(255, 255, 255, 0.6);
  }
}

/* ================= CATEGORIAS ================= */
.categories {
  background-color: #2a3447;
  margin-top: 30px;
  padding: 60px 0;
}

/* Mobile: menos espaçamento */
@media (max-width: 599px) {
  .categories {
    margin-top: 32px;
    padding: 40px 0;
  }

  /* Esconde a seção de categorias no mobile */
  .categories--hide-mobile {
    display: none !important;
  }
}
.categories-wrap {
  width: calc(100vw - 160px);
  max-width: 1760px;
  margin: 0 auto;
  padding: 0 80px;
}

/* Mobile */
@media (max-width: 599px) {
  .categories-wrap {
    padding: 0 16px;
    width: calc(100vw - 32px);
  }
}

/* Tablet */
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

/* Mobile: grid 2 colunas conforme protótipo */
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
    border-radius: 16px !important;
    border: 2px solid rgba(255, 255, 255, 0.25);
  }

  .cat-btn .q-icon {
    font-size: 22px;
    margin-right: 8px;
  }

  .cat-btn .q-btn__content {
    font-weight: 600;
    letter-spacing: 0.2px;
  }
}

/* Tablet */
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
.cat-btn {
  border-radius: 12px !important;
  height: 52px;
  min-width: 180px;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  outline: none !important;
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

/* Estilos para o conteúdo dos botões com ícones */
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

/* Estilos para ícones Phosphor dentro dos botões */
.cat-btn :deep(.phosphor-icon svg) {
  width: 20px;
  height: 20px;
  fill: currentColor;
  color: white;
}

/* Estado ativo da categoria */
.cat-btn--active {
  background: linear-gradient(90deg, #008ec1 0%, #35c7ee 100%) !important;
  border: none !important;
  color: white !important;
}

.cat-btn--active .q-btn__content {
  color: white !important;
}

/* Botão para expandir categorias */
.add-category-btn {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.add-category-btn:hover {
  background: linear-gradient(90deg, #008ec1 0%, #35c7ee 100%) !important;
  border-color: #35c7ee !important;
}

/* Mobile */
@media (max-width: 599px) {
  .add-category-btn {
    width: 48px;
    height: 48px;
  }
}

/* ================= HERO - TIPOGRAFIA E CORES ================= */
.featured-cta {
  width: 142px;
  height: 44px;
  border-radius: 8px;
  min-width: 142px;
  background-color: #ffe100 !important;
  color: #000 !important;
}

.featured-cta .q-btn__content {
  font-family: 'Poppins', sans-serif;
  font-weight: 600; /* semibold */
  font-size: 14px;
  color: #000 !important;
}

/* Mobile: botão full width */
@media (max-width: 599px) {
  .featured-cta {
    width: 100%;
    height: 48px;
    font-size: 16px;
    margin-top: 12px;
  }

  .featured-cta .q-btn__content {
    font-size: 16px;
    font-weight: 600;
  }
}

.event-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600; /* semibold */
  font-size: 36px;
  line-height: 1.2;
  color: #1f2937;
}

/* Mobile: título menor com altura fixa (2 linhas max) */
@media (max-width: 599px) {
  .event-title {
    font-size: 20px;
    line-height: 1.3;
    font-weight: 700;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 62px;
    margin-bottom: 0 !important; /* Removido espaçamento abaixo do título */
  }
}

.event-meta {
  font-family: 'Poppins', sans-serif;
  font-weight: 400; /* regular */
  font-size: 16px;
  color: #1f2937;
}

/* Mobile: meta menor com altura fixa */
@media (max-width: 599px) {
  .event-meta {
    font-size: 14px;
    min-height: 22px;
  }

  .event-meta .q-icon {
    font-size: 18px;
    color: #d907f2 !important;
  }

  .event-meta span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Mostra apenas cidade-estado no mobile - SEMPRE */
  .event-location-desktop {
    display: none !important;
  }

  .event-location-mobile {
    display: block !important;
  }
}

/* Desktop: mostra localização completa */
@media (min-width: 600px) {
  .event-location-desktop {
    display: block !important;
  }

  .event-location-mobile {
    display: none !important;
  }
}

.event-meta__icon {
  color: #d907f2 !important; /* roxo do protótipo */
}

/* Força a cor nos ícones do Quasar */
.event-meta .q-icon {
  color: #d907f2 !important;
}

/* ================= FOOTER ================= */
.footer {
  background-color: #1a202c;
  padding: 32px 0;
  color: white;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.footer-wrap {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 80px;
}

@media (min-width: 1600px) {
  .footer-wrap {
    max-width: 1600px;
  }
}

@media (min-width: 1920px) {
  .footer-wrap {
    max-width: 1800px;
    padding: 0 80px;
  }
}

.footer-logo-container {
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.footer-logo-container:hover {
  opacity: 0.9;
}

.social-icons {
  display: flex;
  gap: 8px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.social-link:hover {
  transform: translateY(-2px);
}

.social-icon {
  width: 55.8px;
  height: 55.8px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: white;
  margin-bottom: 8px;
}

.footer-link {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #d1d5db;
  cursor: pointer;
  transition: color 0.2s ease;
  text-decoration: none;
  display: block;
}

.footer-link:hover {
  color: #35c7ee;
}

a.footer-link {
  text-decoration: none;
}

a.footer-link:hover {
  text-decoration: none;
}

.footer-copyright {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #d1d5db;
  text-align: left;
  margin-top: 16px;
}

/* Telas grandes */
@media (min-width: 1200px) {
  .footer-links {
    gap: 60px;
  }
}

@media (min-width: 1600px) {
  .footer-links {
    gap: 80px;
  }
}

/* Mobile */
@media (max-width: 599px) {
  .footer-wrap {
    padding: 0 16px;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .footer-top {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }

  .social-icons {
    justify-content: center;
  }

  .footer {
    margin-bottom: 0;
    padding-bottom: env(safe-area-inset-bottom, 32px);
  }
}

/* Tablet */
@media (min-width: 600px) and (max-width: 768px) {
  .footer-wrap {
    padding: 0 40px;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .footer-top {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }

  .social-icons {
    justify-content: center;
  }
}

/* ==================== ACESSIBILIDADE - FOCUS STATES ==================== */
.q-btn:focus-visible,
.q-carousel__control button:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}

.social-icon:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
  border-radius: 50%;
}

.cat-btn:focus-visible {
  outline: 3px solid #35c7ee;
  outline-offset: 3px;
}
</style>
