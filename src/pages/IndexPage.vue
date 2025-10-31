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
                        <q-icon name="event" class="q-mr-sm event-meta__icon" aria-hidden="true" />
                        <span>{{ ev.date }}</span>
                      </div>
                      <div class="row items-center event-meta">
                        <q-icon name="place" class="q-mr-sm event-meta__icon" aria-hidden="true" />
                        <span>{{ ev.location }}</span>
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
    <section class="categories" aria-label="Categorias de eventos">
      <div class="categories-wrap">
        <div class="cat-grid">
          <q-btn
            v-for="c in categories"
            :key="c.label"
            outline
            square-rounded
            no-caps
            class="cat-btn"
            :class="{ 'cat-btn--active': selectedCategory === c.label }"
            color="white"
            text-color="white"
            :icon="c.icon"
            :label="c.label"
            :aria-label="`Filtrar eventos de ${c.label}`"
            @click="toggleCategory(c.label)"
          />
        </div>
      </div>
    </section>

    <!-- BANNER CARD -->
    <BannerCard
      image="https://i.postimg.cc/BvKKyNgG/carva-sem-taxa-200px-3.png"
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
          :title="`Eventos de ${selectedCategory}`"
          :items="filteredEvents"
          :default-image="DEFAULT_IMAGE"
        />
      </template>

      <!-- Carrosséis normais -->
      <template v-else>
        <EventSectionCarousel
          title="Réveillon"
          :items="reveillonEvents"
          see-all-label="Ver Tudo"
          :see-all-link="{ name: 'reveillon' }"
          :default-image="DEFAULT_IMAGE"
        />

        <EventSectionCarousel
          title="Carnaval"
          :items="carnavalEvents"
          see-all-label="Ver Tudo"
          :see-all-link="{ name: 'carnaval' }"
          :default-image="DEFAULT_IMAGE"
        />

        <EventSectionCarousel
          title="Festivais"
          :items="saoJoaoEvents"
          see-all-label="Ver Tudo"
          :see-all-link="{ name: 'festivais' }"
          :default-image="DEFAULT_IMAGE"
        />

        <EventSectionCarousel
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
              src="/ticketpe.svg"
              alt="TicketPE - Eventos em Pernambuco"
              class="footer-logo"
              loading="lazy"
            />
          </router-link>

          <div class="social-icons row q-gutter-md">
            <a href="#" class="social-link" aria-label="WhatsApp">
              <img src="/whatsapp.svg" alt="WhatsApp" class="social-icon" />
            </a>
            <a href="#" class="social-link" aria-label="Instagram">
              <img src="/insta.svg" alt="Instagram" class="social-icon" />
            </a>
            <a href="#" class="social-link" aria-label="TikTok">
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import EventSectionCarousel from 'components/EventSectionCarousel.vue'
import SkeletonLoader from 'components/SkeletonLoader.vue'
import BannerCard from 'components/BannerCard.vue'
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

// Estados de loading
const loadingFeatured = ref(true)
const loadingCarousels = ref(true)

// Filtro por categoria (agora vem do header)
const selectedCategory = ref(null)
const filteredEvents = ref([])

// categorias dinâmicas do Supabase
const categories = ref([])

// Helper para obter tagName a partir do label
function getTagNameByLabel(label) {
  const c = categories.value.find((x) => x.label === label)
  return c?.tagName || null
}

// Escuta eventos do header
function handleCategorySelected(event) {
  const category = event.detail.category
  selectedCategory.value = category

  if (category) {
    filterEventsByCategory(category)
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
    console.log('✅ Tags carregadas:', categories.value.length)
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

    // Busca eventos do Supabase usando a tag correta 'FESTIVAISS'
    let events = await fetchEventsByTagSupabase('FESTIVAISS', { limit: 100 })
    console.log('📊 Eventos encontrados com "FESTIVAISS":', events.length)

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

// Filtro por categoria
function toggleCategory(categoryLabel) {
  if (selectedCategory.value === categoryLabel) {
    // Se já está selecionada, deseleciona
    selectedCategory.value = null
    filteredEvents.value = []
  } else {
    // Seleciona nova categoria e filtra eventos
    selectedCategory.value = categoryLabel
    filterEventsByCategory(categoryLabel)
  }
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
      return
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
  min-height: 100vh;
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
    padding: 24px 20px;
    gap: 16px;
    justify-content: flex-start;
    min-height: 210px;
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

/* Mobile: bolinhas conforme protótipo com borda mais grossa */
@media (max-width: 599px) {
  .pagination-dots {
    gap: 16px;
    margin-top: 24px;
    padding: 0;
    height: 14px;
  }

  .pagination-dot {
    width: 14px;
    height: 14px;
    border-width: 2.5px;
    border-color: rgba(255, 255, 255, 0.35);
  }

  .pagination-dot--active {
    background-color: white;
    border-color: white;
    transform: scale(1);
  }

  .pagination-dot:hover {
    transform: scale(1);
    border-color: rgba(255, 255, 255, 0.5);
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

/* Estado ativo da categoria */
.cat-btn--active {
  background: linear-gradient(90deg, #008ec1 0%, #35c7ee 100%) !important;
  border: none !important;
  color: white !important;
}

.cat-btn--active .q-btn__content {
  color: white !important;
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
    margin-top: 8px;
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
    font-size: 24px;
    line-height: 1.3;
    font-weight: 700;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 62px;
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
  }

  .event-meta span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.event-meta__icon {
  color: #8b5cf6; /* roxo */
}

/* Mobile: ajuste de ícone */
@media (max-width: 599px) {
  .event-meta__icon {
    color: #ec4899; /* rosa/pink como no protótipo */
  }
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
  padding: 0 40px;
}

@media (min-width: 1600px) {
  .footer-wrap {
    max-width: 1600px;
    padding: 0 60px;
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

.footer-logo {
  height: 60.26px;
  width: 240px;
  display: block;
  object-fit: contain;
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
