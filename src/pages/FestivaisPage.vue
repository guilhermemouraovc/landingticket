<template>
  <q-page class="bg-landing">
    <div class="list-wrap">
      <!-- Header com título centralizado -->
      <PageHeader title="Festivais" />

      <!-- Breadcrumbs -->
      <BreadcrumbNav :crumbs="breadcrumbItems" />

      <!-- Loading skeleton -->
      <div v-if="loading" class="cards-grid">
        <SkeletonLoader variant="list" :count="12" />
      </div>

      <!-- Mensagem de nenhum resultado -->
      <EmptyState
        v-else-if="items.length === 0"
        title="Nenhum evento de Festivais encontrado"
        message="Não encontramos eventos de Festivais no momento. Volte mais tarde!"
        icon="celebration"
        button-label="Ver todos os eventos"
        button-to="/programacao"
      />

      <!-- Grid de eventos -->
      <div v-else class="cards-grid" role="list" aria-label="Lista de eventos de Festivais">
        <q-card
          v-for="card in items"
          :key="card.id"
          flat
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
            height="215px"
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
import { useSupabaseEvents } from 'src/composables/useSupabaseEvents'
import SkeletonLoader from 'src/components/SkeletonLoader.vue'
import BreadcrumbNav from 'src/components/BreadcrumbNav.vue'
import PageHeader from 'src/components/PageHeader.vue'
import EmptyState from 'src/components/EmptyState.vue'

const router = useRouter()
const items = ref([])
const loading = ref(true)

// Composable para gerenciar eventos
const { fetchEventsByTag: fetchEventsByTagSupabase } = useSupabaseEvents()

// Breadcrumbs
const breadcrumbItems = computed(() => [
  { label: 'Início', to: '/', icon: 'home' },
  { label: 'Festivais', to: null },
])

onMounted(loadFestivaisEvents)

function goToEvent(card) {
  if (card?.link) {
    router.push(card.link)
  }
}

async function loadFestivaisEvents() {
  loading.value = true
  try {
    console.log('🔍 Carregando eventos de Festivais...')

    // Busca eventos do Supabase usando a tag correta 'FESTIVAIS'
    let events = await fetchEventsByTagSupabase('FESTIVAIS', { limit: 100 })
    console.log('📊 Eventos encontrados com "FESTIVAIS":', events.length)

    items.value = events
    console.log('✅ Total de eventos de Festivais carregados:', events.length)
  } catch (e) {
    console.error('❌ Falha ao carregar eventos de Festivais', e)
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
/* EmptyState agora é componente */

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 400px);
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
