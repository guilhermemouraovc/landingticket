<template>
  <q-page class="bg-landing">
    <div class="list-wrap">
      <!-- Header com título centralizado -->
      <PageHeader title="Carnaval" />

      <!-- Breadcrumbs -->
      <BreadcrumbNav :crumbs="breadcrumbItems" />

      <!-- Loading skeleton -->
      <div v-if="loading" class="cards-grid">
        <SkeletonLoader variant="list" :count="12" />
      </div>

      <!-- Mensagem de nenhum resultado -->
      <EmptyState
        v-else-if="items.length === 0"
        title="Nenhum evento de Carnaval encontrado"
        message="Não encontramos eventos de Carnaval no momento. Volte mais tarde!"
        icon="celebration"
        button-label="Ver todos os eventos"
        button-to="/programacao"
      />

      <!-- Grid de eventos -->
      <div v-else class="cards-grid" role="list" aria-label="Lista de eventos de Carnaval">
        <EventCard
          v-for="card in items"
          :key="card.id"
          :event="card"
          variant="grid"
          image-height="215px"
          :show-price="true"
          @click="goToEvent(card)"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabaseEvents } from 'src/composables/useSupabaseEvents'
import SkeletonLoader from 'src/components/SkeletonLoader.vue'
import BreadcrumbNav from 'src/components/BreadcrumbNav.vue'
import EventCard from 'src/components/EventCard.vue'
import PageHeader from 'src/components/PageHeader.vue'
import EmptyState from 'src/components/EmptyState.vue'

const router = useRouter()
const items = ref([])
const loading = ref(true)

// Composable para gerenciar eventos do Supabase
const { fetchEventsByTag } = useSupabaseEvents()

// Breadcrumbs
const breadcrumbItems = computed(() => [
  { label: 'Início', to: '/', icon: 'home' },
  { label: 'Carnaval', to: null },
])

onMounted(loadCarnavalEvents)

function goToEvent(card) {
  if (card?.link) {
    router.push(card.link)
  }
}

async function loadCarnavalEvents() {
  loading.value = true
  try {
    console.log('🔍 Carregando eventos de Carnaval...')

    // Tenta diferentes variações da tag
    let events = await fetchEventsByTag('CARNAVAL', { limit: 100 })

    if (!events.length) {
      console.log('🔄 Tentando com "carnavais" (slug)...')
      events = await fetchEventsByTag('carnavais', { limit: 100 })
    }

    if (!events.length) {
      console.log('🔄 Tentando com "CARNAVAIS" (plural)...')
      events = await fetchEventsByTag('CARNAVAIS', { limit: 100 })
    }

    items.value = events
    console.log('✅ Eventos de Carnaval carregados:', events.length)
  } catch (e) {
    console.error('❌ Falha ao carregar eventos de Carnaval', e)
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
  padding: 0 20px 64px;
  max-width: 1440px;
  margin: 0 auto;
}

/* Header agora é componente */

/* Esconder elementos antigos */
.list-header {
  display: none;
}

.list-title {
  display: none;
}

/* EmptyState agora é componente */

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 320px);
  gap: 40px;
  justify-content: center;
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
  border: none;
  outline: none;
}

.event-card:hover,
.event-card:focus-within {
  transform: translateY(-4px);
  box-shadow: 0 24px 40px -12px rgba(15, 23, 42, 0.36);
}

.event-card .q-card-section {
  flex: 1;
  padding: 16px 20px 18px;
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
    padding: 0 16px 40px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.q-btn:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}

.event-card:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px #35c7ee;
}
</style>
