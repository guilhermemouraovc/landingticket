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
            color="white"
            text-color="white"
            :icon="c.icon"
            :label="c.label"
            :aria-label="`Filtrar eventos de ${c.label}`"
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
        <SkeletonLoader variant="carousel" :carousel-count="4" />
        <SkeletonLoader variant="carousel" :carousel-count="4" />
        <SkeletonLoader variant="carousel" :carousel-count="4" />
      </template>

      <!-- Carrosséis reais -->
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
          title="São João"
          :items="saoJoaoEvents"
          see-all-label="Ver Tudo"
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
          <img
            src="/logo.svg"
            alt="TicketPE - Eventos em Pernambuco"
            class="footer-logo"
            loading="lazy"
          />

          <div class="row q-gutter-md">
            <q-btn
              flat
              no-caps
              label="Compre Conosco"
              class="text-white"
              aria-label="Comprar ingressos conosco"
            />
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
            <div class="row q-gutter-md q-mt-sm" role="list" aria-label="Redes sociais">
              <q-btn
                flat
                round
                dense
                icon="mdi-facebook"
                size="md"
                class="social-icon"
                aria-label="Seguir no Facebook"
              />
              <q-btn
                flat
                round
                dense
                icon="mdi-instagram"
                size="md"
                class="social-icon"
                aria-label="Seguir no Instagram"
              />
              <q-btn
                flat
                round
                dense
                icon="mdi-tiktok"
                size="md"
                class="social-icon"
                aria-label="Seguir no TikTok"
              />
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
import EventSectionCarousel from 'components/EventSectionCarousel.vue'
import SkeletonLoader from 'components/SkeletonLoader.vue'
import BannerCard from 'components/BannerCard.vue'
import { useEvents } from 'src/composables/useEvents'
import { DEFAULT_IMAGES } from 'src/constants/config'

const DEFAULT_IMAGE = DEFAULT_IMAGES.eventPlaceholder

// Composable para gerenciar eventos
const { fetchEvents, fetchEventsByTag, fetchAllEvents } = useEvents()

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
onMounted(async () => {
  // Carrega featured separadamente para mostrar primeiro
  await loadFeatured()
  loadingFeatured.value = false

  // Carrega carrosséis em paralelo
  await Promise.all([loadReveillon(), loadCarnaval(), loadSaoJoao(), loadAllEvents()])
  loadingCarousels.value = false
})

async function loadFeatured() {
  try {
    const events = await fetchEvents({ 'pagination[pageSize]': 25 })
    featured.value = events
    activeSlide.value = events[0]?.id ?? null
  } catch (err) {
    console.error('Falha ao carregar festas', err)
    featured.value = []
  }
}

async function loadReveillon() {
  try {
    reveillonEvents.value = await fetchEventsByTag('REVEILLON')
  } catch (err) {
    console.error('Falha ao carregar reveillon', err)
    reveillonEvents.value = []
  }
}

async function loadCarnaval() {
  try {
    carnavalEvents.value = await fetchEventsByTag('CARNAVAIS', {
      'filters[$and][1][tag][tagname][$ne]': 'REVEILLON',
    })
  } catch (err) {
    console.error('Falha ao carregar carnaval', err)
    carnavalEvents.value = []
  }
}

async function loadSaoJoao() {
  try {
    saoJoaoEvents.value = await fetchEventsByTag('SaoJoao', {
      'filters[$and][1][tag][tagname][$ne]': 'CARNAVAIS',
    })
  } catch (err) {
    console.error('Falha ao carregar São João', err)
    saoJoaoEvents.value = []
  }
}

async function loadAllEvents() {
  try {
    allEvents.value = await fetchAllEvents(60)
  } catch (err) {
    console.error('Falha ao carregar programação completa', err)
    allEvents.value = []
  }
}
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
