<template>
  <div class="related-events-section">
    <div class="related-events-container">
      <div class="header-container">
        <h2 class="related-events-title">Veja também</h2>
        <div v-if="!loading && events.length > 0" class="navigation-arrows">
          <button
            class="nav-button"
            @click="scrollLeft"
            :disabled="isAtStart"
            aria-label="Evento anterior"
          >
            <img src="/LEFT.svg" alt="Anterior" />
          </button>
          <button
            class="nav-button"
            @click="scrollRight"
            :disabled="isAtEnd"
            aria-label="Próximo evento"
          >
            <img src="/RIGHT.svg" alt="Próximo" />
          </button>
        </div>
      </div>

      <div v-if="loading" class="carousel-loading">
        <q-skeleton type="rect" height="395px" width="100%" />
      </div>

      <div v-else-if="events.length === 0" class="no-events">
        <p class="no-events-text">Sem eventos relacionados para esta categoria.</p>
      </div>

      <div v-else class="carousel-container">
        <div
          class="carousel-wrapper"
          ref="carouselRef"
          @scroll="updateScrollState"
          :class="{
            'fade-right': showRightFade,
            'fade-left': showLeftFade,
          }"
        >
          <div class="carousel-track">
            <EventCard
              v-for="event in events"
              :key="event.id"
              :event="event"
              variant="grid"
              class="carousel-item"
              image-height="215px"
              @click="goToEvent(event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from 'src/utils/supabase'
import { toEventCardFromSb } from 'src/utils/supabaseEventMapper'
import EventCard from 'src/components/EventCard.vue'

const props = defineProps({
  currentEventId: {
    type: String,
    required: true,
  },
  eventTags: {
    type: Array,
    default: () => [],
  },
})

const router = useRouter()
const events = ref([])
const loading = ref(true)
const carouselRef = ref(null)
const isAtStart = ref(true)
const isAtEnd = ref(false)
const showRightFade = ref(true)
const showLeftFade = ref(false)
const FADE_SHOW_AT = 24
const FADE_HIDE_AT = 40

/**
 * Mapeia variações de categoria para tag padrão
 */
function getCategoryTag(tags) {
  if (!tags || tags.length === 0) return 'REVEILLONS'

  const tag = tags[0].toUpperCase()

  // Mapeamento de categorias
  const categoryMap = {
    REVEILLON: 'REVEILLONS',
    REVEILLONS: 'REVEILLONS',
    'ANO NOVO': 'REVEILLONS',
    'OPEN BAR': 'REVEILLONS', // Tags adicionais que podem estar relacionadas
    CARNAVAL: 'CARNAVAL',
    CARNAVAIS: 'CARNAVAL',
    FESTIVAIS: 'FESTIVAIS',
    FESTIVAISS: 'FESTIVAIS', // Compatibilidade com código antigo
    FESTIVAL: 'FESTIVAIS',
  }

  const mappedTag = categoryMap[tag] || 'REVEILLONS' // Default para REVEILLONS ao invés de retornar a tag desconhecida
  return mappedTag
}

// Carrega eventos relacionados
async function loadRelatedEvents() {
  loading.value = true

  try {
    if (!props.currentEventId) {
      events.value = []
      return
    }

    // Determina a categoria/tag para buscar
    const categoryTag = getCategoryTag(props.eventTags)
    
    // Busca eventos pela tag usando view_events_by_tag
    // Usa ilike para busca case-insensitive
    const { data: tagRows, error: tagError } = await supabase
      .from('view_events_by_tag')
      .select('event_id')
      .ilike('tag_name', categoryTag)
      .limit(50)

    if (tagError) {
      if (import.meta.env.DEV) {
        console.error('❌ Erro ao buscar tags:', tagError)
      }
      throw tagError
    }

    const eventIds = (tagRows || [])
      .map((row) => row.event_id)
      .filter((id) => id !== props.currentEventId) // Exclui evento atual

    if (eventIds.length === 0) {
      events.value = []
      return
    }

    // Busca os dados completos dos eventos
    const { data: eventsData, error: eventsError } = await supabase
      .from('view_event_cards')
      .select('*')
      .in('id', eventIds)
      .order('start_date', { ascending: true })
      .limit(12)

    if (eventsError) {
      if (import.meta.env.DEV) {
        console.error('❌ Erro ao buscar eventos:', eventsError)
      }
      throw eventsError
    }

    // Mapeia os eventos para o formato da UI
    events.value = (eventsData || []).map(toEventCardFromSb).slice(0, 6) // Limita a 6 eventos no carrossel
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('❌ Erro ao carregar eventos relacionados:', error)
    }
    events.value = []
  } finally {
    loading.value = false
  }
}

function goToEvent(event) {
  if (event.link) {
    router.push(event.link)
  }
}

// Funções de navegação do carrossel
function scrollLeft() {
  if (carouselRef.value) {
    const scrollAmount = 440 // largura do card (400px) + gap (40px)
    carouselRef.value.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth',
    })
  }
}

function scrollRight() {
  if (carouselRef.value) {
    const scrollAmount = 440 // largura do card (400px) + gap (40px)
    carouselRef.value.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    })
  }
}

function updateScrollState() {
  if (!carouselRef.value) return

  const el = carouselRef.value
  const { scrollLeft, scrollWidth, clientWidth } = el

  isAtStart.value = scrollLeft <= 0
  isAtEnd.value = scrollLeft + clientWidth >= scrollWidth - 1

  // Controla fade direito
  if (showRightFade.value) {
    if (scrollLeft >= FADE_HIDE_AT) showRightFade.value = false
  } else {
    if (scrollLeft <= FADE_SHOW_AT) showRightFade.value = true
  }

  // Controla fade esquerdo (aparece quando há scroll para a esquerda)
  if (scrollLeft > FADE_HIDE_AT) {
    showLeftFade.value = true
  } else {
    showLeftFade.value = false
  }
}

// Reage a mudanças nas props
watch(
  () => [props.currentEventId, props.eventTags],
  async () => {
    await loadRelatedEvents()
    await nextTick()
    updateScrollState()
  },
  { deep: true },
)

onMounted(async () => {
  await loadRelatedEvents()
  await nextTick()
  updateScrollState()
})
</script>

<style scoped>
.related-events-section {
  background-color: #2a3447;
  padding: 80px 0;
  margin-top: 50px;
}

.related-events-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 36px;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.related-events-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600; /* semibold */
  font-size: 24px;
  color: #ffffff;
  margin: 0;
}

.navigation-arrows {
  display: flex;
  gap: 16px;
}

.nav-button {
  width: 44px;
  height: 44px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s ease;
  padding: 0;
}

.nav-button:hover:not(:disabled) {
  opacity: 0.7;
}

.nav-button:active:not(:disabled) {
  /* Sem efeito visual */
}

.nav-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-button img {
  width: 44px;
  height: 44px;
  display: block;
}

.carousel-container {
  position: relative;
  width: 100%;
}

.carousel-wrapper {
  overflow-x: auto;
  overflow-y: visible; /* Permite hover expandir verticalmente */
  position: relative;
  scrollbar-width: none; /* Esconde scrollbar no Firefox */
  padding-top: 10px;
  padding-bottom: 20px; /* Espaço para hover não cortar */
  --fade: 28px; /* largura do fade */
  scroll-padding-right: 200px;
}

.carousel-wrapper::-webkit-scrollbar {
  display: none; /* Esconde scrollbar no Chrome/Safari */
}

/* Efeito de fade direito */
.carousel-wrapper.fade-right {
  mask-image: linear-gradient(to right, #000 calc(100% - var(--fade)), transparent 100%);
  mask-repeat: no-repeat;
}

/* Efeito de fade esquerdo */
.carousel-wrapper.fade-left {
  mask-image: linear-gradient(to right, transparent 0, #000 var(--fade));
  mask-repeat: no-repeat;
}

/* Efeito de fade em ambos os lados */
.carousel-wrapper.fade-left.fade-right {
  mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 var(--fade),
    #000 calc(100% - var(--fade)),
    transparent 100%
  );
  mask-repeat: no-repeat;
}

.carousel-track {
  display: flex;
  height: 100%;
  gap: 40px;
}

.carousel-item {
  flex: 0 0 400px;
  cursor: pointer;
}

/* Ajustes específicos para o carrossel */
.carousel-item :deep(.event-card) {
  width: 400px;
  height: 395px;
}

/* Loading and empty states */
.carousel-loading {
  height: 395px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-events {
  height: 395px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-events-text {
  color: #9ca3af;
  font-size: 1rem;
}

/* Responsive adjustments */
@media (max-width: 1440px) {
  .related-events-container {
    padding: 0 16px;
  }
}

@media (max-width: 768px) {
  .related-events-section {
    padding: 40px 0;
  }

  .related-events-container {
    padding: 0 16px;
  }

  .header-container {
    margin-bottom: 20px;
  }

  .related-events-title {
    font-size: 20px;
  }

  .navigation-arrows {
    display: none; /* Esconde as setinhas no mobile */
  }

  .nav-button {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .nav-button img {
    width: 20px;
    height: 20px;
  }

  .carousel-wrapper {
    height: 350px;
    margin-left: -16px; /* Permite que os cards estourem um pouco à esquerda */
    margin-right: -16px;
    padding-left: 0; /* Mantém o primeiro card alinhado */
    padding-right: 0; /* Espaço no final para indicar scroll */
    --fade: 24px; /* fade no mobile */
    scroll-padding-right: 0;
  }

  /* Remove o fade no mobile */
  .carousel-wrapper.fade-right,
  .carousel-wrapper.fade-left,
  .carousel-wrapper.fade-left.fade-right {
    mask-image: none;
  }

  .carousel-track {
    gap: 16px; /* Reduzido de 40px para 16px no mobile */
    padding-left: 16px; /* primeiro card alinhado */
    padding-right: 16px; /* espaço do último card até a borda */
  }

  .carousel-item {
    flex: 0 0 280px;
  }

  .carousel-item :deep(.event-card) {
    width: 280px;
    height: 350px;
  }
}
</style>
