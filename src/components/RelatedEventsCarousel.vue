<template>
  <div class="related-events-section">
    <div class="related-events-container">
      <h2 class="related-events-title">Veja também</h2>

      <div v-if="loading" class="carousel-loading">
        <q-skeleton type="rect" height="395px" width="100%" />
      </div>

      <div v-else-if="events.length === 0" class="no-events">
        <p class="no-events-text">Nenhum evento relacionado encontrado</p>
      </div>

      <div v-else class="carousel-container">
        <div class="carousel-wrapper" ref="carouselRef">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEvents } from 'src/composables/useEvents'

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
const { fetchEventsByTag } = useEvents()

const events = ref([])
const loading = ref(true)
const carouselRef = ref(null)

// Carrega eventos relacionados
async function loadRelatedEvents() {
  loading.value = true
  try {
    // Se não há tags, busca eventos de Réveillon por padrão
    const tagToSearch = props.eventTags.length > 0 ? props.eventTags[0] : 'REVEILLON'

    // Busca eventos com as mesmas tags, excluindo o evento atual
    const relatedEvents = await fetchEventsByTag(tagToSearch)

    // Filtra o evento atual e limita a 6 eventos
    events.value = relatedEvents.filter((event) => event.id !== props.currentEventId).slice(0, 6)
  } catch (error) {
    console.error('Erro ao carregar eventos relacionados:', error)
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

onMounted(() => {
  loadRelatedEvents()
})
</script>

<style scoped>
.related-events-section {
  background-color: #2a3447;
  padding: 80px 0;
  margin-top: 40px;
}

.related-events-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

.related-events-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600; /* semibold */
  font-size: 24px;
  color: #ffffff;
  margin-bottom: 24px;
  margin-left: 0;
}

.carousel-container {
  position: relative;
  width: 100%;
}

.carousel-wrapper {
  width: 100%;
  height: 395px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.carousel-wrapper::-webkit-scrollbar {
  height: 6px;
}

.carousel-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.carousel-wrapper::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.carousel-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
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
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 40px -12px rgba(15, 23, 42, 0.36);
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

  .related-events-title {
    font-size: 20px;
    margin-bottom: 20px;
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
