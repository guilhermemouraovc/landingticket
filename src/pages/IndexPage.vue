<template>
  <q-page class="bg-landing">
    <!-- EVENTOS EM DESTAQUE -->
    <section class="destaque">
      <!-- Skeleton para featured -->
      <div v-if="loadingFeatured" class="featured-wrap">
        <SkeletonLoader variant="hero" />
      </div>

      <!-- Carousel real -->
      <q-carousel
        v-else
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
                    color="warning"
                    text-color="black"
                    unelevated
                    no-caps
                    label="Ver detalhes"
                    :aria-label="`Ver detalhes do evento ${ev.title}`"
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
          <div class="footer-logo-container">
            <img
              src="/ticketpe.svg"
              alt="TicketPE - Eventos em Pernambuco"
              class="footer-logo"
              loading="lazy"
            />
          </div>

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
            <div class="footer-link">Termos de Uso</div>
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
import EventSectionCarousel from 'components/EventSectionCarousel.vue'
import SkeletonLoader from 'components/SkeletonLoader.vue'
import BannerCard from 'components/BannerCard.vue'
import { useEvents } from 'src/composables/useEvents'
import { useSupabaseEvents } from 'src/composables/useSupabaseEvents'
import { supabase } from 'src/utils/supabase'
import { DEFAULT_IMAGES } from 'src/constants/config'

const DEFAULT_IMAGE = DEFAULT_IMAGES.eventPlaceholder

// Composable para gerenciar eventos (Strapi - legado)
const { fetchEvents, fetchEventsByTag } = useEvents()

// Composable para gerenciar eventos (Supabase - novo)
const {
  fetchFeaturedEvents,
  fetchEvents: fetchEventsSupabase,
  fetchEventsByTag: fetchEventsByTagSupabase,
  fetchAllEvents: fetchAllEventsSupabase,
} = useSupabaseEvents()

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

// categorias fixas usadas nos botoes tiles
const categories = ref([
  { label: 'Carnaval', icon: 'celebration' },
  { label: 'Festivais', icon: 'park' },
  { label: 'Semana Santa', icon: 'holiday_village' },
  { label: 'Ano Novo', icon: 'auto_awesome' },
  { label: 'Boate', icon: 'nightlife' },
  { label: 'Calourada', icon: 'school' },
])

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

    // Se ainda não há eventos do Supabase, usa fallback do Strapi
    if (!events.length) {
      console.log('🔄 Fallback para Strapi...')
      events = await fetchEvents({ 'pagination[pageSize]': 25 })
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
    console.log('🔍 Testando view_event_cards diretamente...')

    // Teste simples: buscar todos os eventos da view
    const { data: allEventsFromView, error: viewError } = await supabase
      .from('view_event_cards')
      .select('*')
      .limit(5)

    console.log('📊 Todos os eventos da view_event_cards:', allEventsFromView)
    console.log('❌ Erro da view:', viewError)

    if (viewError) {
      console.error('❌ Erro na view_event_cards:', viewError)
      // Fallback: usar método direto
      await loadReveillonFallback()
      return
    }

    // Se a view funcionou, filtrar por tag
    const { data: eventTags, error: tagsError } = await supabase
      .from('event_tags')
      .select(
        `
        event_id,
        tags!inner(slug)
      `,
      )
      .eq('tags.slug', 'reveillon')

    console.log('📊 Event tags para reveillon:', eventTags)

    if (tagsError) {
      console.error('❌ Erro nas tags:', tagsError)
      await loadReveillonFallback()
      return
    }

    const reveillonEventIds = eventTags?.map((et) => et.event_id) || []
    console.log('🎯 IDs dos eventos de Reveillon:', reveillonEventIds)

    const reveillonEventsFiltered =
      allEventsFromView?.filter((event) => reveillonEventIds.includes(event.id)) || []

    console.log('🎯 Eventos filtrados:', reveillonEventsFiltered)

    // Mapear os eventos
    const { toEventCardFromSb } = await import('src/utils/supabaseEventMapper')
    reveillonEvents.value = reveillonEventsFiltered.map(toEventCardFromSb)

    console.log('✅ Eventos mapeados:', reveillonEvents.value.length)
    if (reveillonEvents.value[0]) {
      console.log('🖼️ Primeiro evento - imagem:', reveillonEvents.value[0].image)
    }
  } catch (err) {
    console.error('❌ Falha ao carregar reveillon', err)
    await loadReveillonFallback()
  }
}

async function loadReveillonFallback() {
  try {
    console.log('🔄 Usando método fallback...')

    // Método fallback: buscar diretamente das tabelas
    const { data: events, error } = await supabase
      .from('events')
      .select(
        `
        *,
        event_tags!inner(
          tags!inner(
            slug
          )
        )
      `,
      )
      .eq('event_tags.tags.slug', 'reveillon')
      .limit(20)

    console.log('📊 Eventos do fallback:', events)

    if (error) {
      throw error
    }

    // Mapear os eventos
    const { toEventCardFromSb } = await import('src/utils/supabaseEventMapper')
    reveillonEvents.value = (events || []).map(toEventCardFromSb)

    console.log('✅ Eventos mapeados (fallback):', reveillonEvents.value.length)
  } catch (err) {
    console.error('❌ Falha no fallback:', err)
    reveillonEvents.value = []
  }
}

async function loadCarnaval() {
  try {
    // Primeiro tenta buscar do Supabase usando a tag 'CARNAVAL' ou 'carnavais'
    let events = await fetchEventsByTagSupabase('CARNAVAL', { limit: 60 })

    // Se não encontrou eventos com 'CARNAVAL', tenta 'carnavais' (slug)
    if (!events.length) {
      console.log('🔄 Tentando com slug "carnavais"...')
      events = await fetchEventsByTagSupabase('carnavais', { limit: 60 })
    }

    // Fallback para Strapi se não encontrou no Supabase
    if (!events.length) {
      console.log('🔄 Fallback para Strapi (Carnaval)...')
      events = await fetchEventsByTag('CARNAVAIS', {
        'filters[$and][1][tag][tagname][$ne]': 'REVEILLON',
      })
    }

    carnavalEvents.value = events
  } catch (err) {
    console.error('Falha ao carregar carnaval', err)
    carnavalEvents.value = []
  }
}

async function loadFestivais() {
  try {
    console.log('🔍 Carregando eventos de Festivais...')

    // Primeiro tenta buscar do Supabase usando a tag correta 'FESTIVAISS'
    let events = await fetchEventsByTagSupabase('FESTIVAISS', { limit: 60 })
    console.log('📊 Eventos encontrados com "FESTIVAISS":', events.length)

    // Fallback para Strapi se não encontrou no Supabase
    if (!events.length) {
      console.log('🔄 Fallback para Strapi (Festivais)...')
      events = await fetchEventsByTag('FESTIVAISS', {
        'filters[$and][1][tag][tagname][$ne]': 'CARNAVAIS',
      })
      console.log('📊 Eventos encontrados no Strapi:', events.length)
    }

    saoJoaoEvents.value = events
    console.log('✅ Total de eventos de Festivais carregados:', events.length)
  } catch (err) {
    console.error('❌ Falha ao carregar Festivais', err)
    saoJoaoEvents.value = []
  }
}

async function loadAllEvents() {
  try {
    allEvents.value = await fetchAllEventsSupabase(60)
  } catch (err) {
    console.error('Falha ao carregar programação completa', err)
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
    // Mapeamento de categorias para tags da API
    const categoryMap = {
      Carnaval: 'CARNAVAIS',
      Festivais: 'FESTIVAISS',
      'Ano Novo': 'REVEILLON',
      'Semana Santa': 'SemanaSanta',
      Boate: 'Boate',
      Calourada: 'Calourada',
    }

    const tagName = categoryMap[categoryLabel]
    if (tagName) {
      filteredEvents.value = await fetchEventsByTag(tagName)
    } else {
      filteredEvents.value = []
    }
  } catch (err) {
    console.error('Falha ao filtrar eventos', err)
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
  margin-bottom: 100px; /* Adiciona gap de 250px entre o carrossel e o footer */
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
  margin-top: 30px;
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

/* Estado ativo da categoria */
.cat-btn--active {
  background: linear-gradient(90deg, #008ec1 0%, #35c7ee 100%) !important;
  border-color: transparent !important;
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
}
.featured-cta .q-btn__content {
  font-family: 'Poppins', sans-serif;
  font-weight: 600; /* semibold */
  font-size: 14px;
}

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
}

.footer-link:hover {
  color: #35c7ee;
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

/* Telas pequenas */
@media (max-width: 768px) {
  .footer-wrap {
    padding: 0 20px;
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
