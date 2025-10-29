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
        <div class="carousel-wrapper" ref="carouselRef" @scroll="updateScrollState">
          <div class="carousel-track">
            <div
              v-for="event in events"
              :key="event.id"
              class="carousel-item"
              @click="goToEvent(event)"
            >
              <q-card class="event-card" flat>
                <q-img
                  :src="event.image"
                  :alt="`Imagem do evento ${event.title}`"
                  height="215px"
                  ratio="16/9"
                  loading="lazy"
                />
                <q-card-section class="event-card__body">
                  <div class="event-card__title">{{ event.title }}</div>
                  <div class="event-card__meta">
                    <div class="meta-item">
                      <q-icon name="event" class="meta-icon" aria-hidden="true" />
                      <span>{{ event.date }}</span>
                    </div>
                    <div class="meta-item">
                      <q-icon name="place" class="meta-icon" aria-hidden="true" />
                      <span>{{ event.location }}</span>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from 'src/utils/supabase'
import { toEventCardFromSb } from 'src/utils/supabaseEventMapper'

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
    FESTIVAIS: 'FESTIVAISS',
    FESTIVAISS: 'FESTIVAISS',
    FESTIVAL: 'FESTIVAISS',
  }

  const mappedTag = categoryMap[tag] || 'REVEILLONS' // Default para REVEILLONS ao invés de retornar a tag desconhecida
  console.log(`🗺️ Mapeando "${tag}" → "${mappedTag}"`)
  return mappedTag
}

// Carrega eventos relacionados
async function loadRelatedEvents() {
  loading.value = true

  try {
    console.log('🔍 Carregando eventos relacionados...')
    console.log('📋 Tags recebidas:', props.eventTags)
    console.log('🆔 Evento atual:', props.currentEventId)

    if (!props.currentEventId) {
      console.warn('⚠️ ID do evento atual não fornecido')
      events.value = []
      return
    }

    // Determina a categoria/tag para buscar
    const categoryTag = getCategoryTag(props.eventTags)
    console.log('🏷️ Tag normalizada:', categoryTag)

    // Busca eventos pela tag usando view_events_by_tag
    const { data: tagRows, error: tagError } = await supabase
      .from('view_events_by_tag')
      .select('event_id')
      .eq('tag_name', categoryTag)
      .limit(50)

    if (tagError) {
      console.error('❌ Erro ao buscar tags:', tagError)
      console.error('Detalhes do erro:', tagError)
      throw tagError
    }

    console.log('📦 Dados brutos retornados:', tagRows)

    const eventIds = (tagRows || [])
      .map((row) => row.event_id)
      .filter((id) => id !== props.currentEventId) // Exclui evento atual

    console.log('🎯 IDs de eventos encontrados:', eventIds.length)
    console.log('🔢 IDs:', eventIds)

    if (eventIds.length === 0) {
      console.log('ℹ️ Nenhum evento relacionado encontrado')
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
      console.error('❌ Erro ao buscar eventos:', eventsError)
      throw eventsError
    }

    // Mapeia os eventos para o formato da UI
    events.value = (eventsData || []).map(toEventCardFromSb).slice(0, 6) // Limita a 6 eventos no carrossel

    console.log('✅ Eventos relacionados carregados:', events.value.length)
  } catch (error) {
    console.error('❌ Erro ao carregar eventos relacionados:', error)
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
  if (carouselRef.value) {
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.value
    isAtStart.value = scrollLeft <= 0
    isAtEnd.value = scrollLeft + clientWidth >= scrollWidth - 1
  }
}

// Reage a mudanças nas props
watch(
  () => [props.currentEventId, props.eventTags],
  () => {
    loadRelatedEvents()
  },
  { deep: true },
)

onMounted(() => {
  loadRelatedEvents()
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
}

.carousel-wrapper::-webkit-scrollbar {
  display: none; /* Esconde scrollbar no Chrome/Safari */
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

/* Event card styles */
.event-card {
  width: 400px;
  height: 395px;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 16px -12px rgba(15, 23, 42, 0.28);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  overflow: hidden;
  border: none;
  outline: none;
  position: relative; /* Permite que o hover saia dos limites */
  z-index: 1; /* Ficar sobre outros elementos */
}

.event-card:hover {
  transform: translateY(-8px); /* Subir mais */
  box-shadow: 0 24px 40px -12px rgba(15, 23, 42, 0.36);
  z-index: 10; /* Ficar por cima */
}

.event-card__body {
  flex: 1;
  padding: 16px 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.event-card__title {
  font-size: 1.05rem;
  line-height: 1.35;
  font-weight: 700;
  color: #1f2937;
}

.event-card__meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: #6b7280;
}

.meta-icon {
  color: #ec4899;
  font-size: 18px;
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

  .header-container {
    margin-bottom: 20px;
  }

  .related-events-title {
    font-size: 20px;
  }

  .navigation-arrows {
    gap: 8px;
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
  }

  .carousel-item {
    flex: 0 0 280px;
  }

  .event-card {
    width: 280px;
    height: 350px;
  }

  .event-card__body {
    padding: 12px 16px 16px;
  }
}
</style>
