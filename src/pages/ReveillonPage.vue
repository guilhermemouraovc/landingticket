<template>
  <q-page class="bg-landing">
    <div class="list-wrap">
      <div class="list-header">
        <q-btn
          flat
          round
          icon="arrow_back"
          to="/"
          class="q-mr-md"
          aria-label="Voltar para página inicial"
        />
        <div class="list-title">Réveillon</div>
      </div>

      <!-- Breadcrumbs -->
      <BreadcrumbNav :crumbs="breadcrumbItems" />

      <!-- Loading skeleton -->
      <div v-if="loading" class="cards-grid">
        <SkeletonLoader variant="list" :count="12" />
      </div>

      <!-- Mensagem de nenhum resultado -->
      <div v-else-if="items.length === 0" class="no-results" role="status">
        <q-icon name="celebration" size="64px" color="grey-6" aria-hidden="true" />
        <div class="no-results-title">Nenhum evento de Réveillon encontrado</div>
        <div class="no-results-text">
          Não encontramos eventos de Réveillon no momento. Volte mais tarde!
        </div>
        <q-btn
          color="primary"
          label="Ver todos os eventos"
          no-caps
          unelevated
          to="/programacao"
          class="q-mt-md"
        />
      </div>

      <!-- Grid de eventos -->
      <div v-else class="cards-grid" role="list" aria-label="Lista de eventos de Réveillon">
        <q-card
          v-for="card in items"
          :key="card.id"
          flat
          bordered
          clickable
          v-ripple
          @click="goToEvent(card)"
          class="event-card"
          role="listitem"
          :aria-label="`Evento: ${card.title}. ${card.date}. ${card.location}`"
          tabindex="0"
          @keydown.enter="goToEvent(card)"
          @keydown.space.prevent="goToEvent(card)"
        >
          <q-img
            :src="card.image"
            :alt="`Imagem do evento ${card.title}`"
            ratio="16/9"
            height="180px"
            loading="lazy"
          />
          <q-card-section>
            <div class="event-title q-mb-xs">{{ card.title }}</div>
            <div class="row items-center event-meta q-mt-xs">
              <q-icon name="event" class="q-mr-sm event-meta__icon" aria-hidden="true" />
              <span>{{ card.date }}</span>
            </div>
            <div class="row items-center event-meta q-mt-xs">
              <q-icon name="place" class="q-mr-sm event-meta__icon" aria-hidden="true" />
              <span>{{ card.location }}</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEvents } from 'src/composables/useEvents'
import SkeletonLoader from 'src/components/SkeletonLoader.vue'
import BreadcrumbNav from 'src/components/BreadcrumbNav.vue'

const router = useRouter()
const items = ref([])
const loading = ref(true)

// Composable para gerenciar eventos
const { fetchEventsByTag } = useEvents()

// Breadcrumbs
const breadcrumbItems = computed(() => [
  { label: 'Início', to: '/', icon: 'home' },
  { label: 'Réveillon', to: null },
])

onMounted(loadReveillonEvents)

function goToEvent(card) {
  if (card?.link) {
    router.push(card.link)
  }
}

async function loadReveillonEvents() {
  loading.value = true
  try {
    items.value = await fetchEventsByTag('REVEILLON')
  } catch (e) {
    console.error('Falha ao carregar eventos de Réveillon', e)
    items.value = []
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-landing {
  background-color: #2a3447;
  min-height: 100vh;
}

.list-wrap {
  padding: 0 80px 64px;
  max-width: 1200px;
  margin: 0 auto;
}

.list-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 0;
}

.list-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #fff;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.no-results-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-top: 24px;
  margin-bottom: 8px;
}

.no-results-text {
  font-size: 1rem;
  color: #9ca3af;
  max-width: 400px;
  line-height: 1.6;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.event-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 16px -12px rgba(15, 23, 42, 0.28);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  overflow: hidden;
}

.event-card:hover,
.event-card:focus-within {
  transform: translateY(-4px);
  box-shadow: 0 24px 40px -12px rgba(15, 23, 42, 0.36);
}

.event-card .q-card-section {
  flex: 1;
  padding: 20px 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.event-title {
  font-size: 1.05rem;
  line-height: 1.35;
  font-weight: 700;
  color: #1f2937;
}

.event-meta {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: #6b7280;
}

.event-meta__icon {
  color: #ec4899;
  font-size: 18px;
}

@media (max-width: 768px) {
  .list-wrap {
    padding: 0 40px 40px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }
}

.q-btn:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}

.event-card:focus-visible {
  outline: 3px solid #35c7ee;
  outline-offset: 3px;
}
</style>
