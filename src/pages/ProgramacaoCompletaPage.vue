<template>
  <q-page class="bg-landing">
    <div class="list-wrap">
      <div class="list-header">
        <q-btn flat round icon="arrow_back" to="/" class="q-mr-md" />
        <div class="list-title">Programação completa</div>
      </div>

      <!-- Mensagem de busca -->
      <div v-if="searchQuery" class="search-info">
        <div class="search-result-text">
          <q-icon name="search" size="20px" class="q-mr-sm" />
          <span class="result-count"
            >{{ filteredItems.length }} resultado{{ filteredItems.length !== 1 ? 's' : '' }}</span
          >
          <span class="search-term">para "{{ searchQuery }}"</span>
        </div>
        <q-btn
          flat
          dense
          no-caps
          label="Limpar busca"
          icon="close"
          color="white"
          class="clear-search-btn"
          @click="clearSearch"
        />
      </div>

      <!-- Mensagem de nenhum resultado -->
      <div v-if="searchQuery && filteredItems.length === 0" class="no-results">
        <q-icon name="search_off" size="64px" color="grey-6" />
        <div class="no-results-title">Nenhum evento encontrado</div>
        <div class="no-results-text">Não encontramos eventos para "{{ searchQuery }}"</div>
        <q-btn
          color="primary"
          label="Ver todos os eventos"
          no-caps
          unelevated
          @click="clearSearch"
          class="q-mt-md"
        />
      </div>

      <div v-else class="cards-grid">
        <q-card
          v-for="card in filteredItems"
          :key="card.id"
          flat
          bordered
          clickable
          v-ripple
          @click="goToEvent(card)"
          class="event-card"
        >
          <q-img :src="card.image" ratio="16/9" height="180px" />
          <q-card-section>
            <div class="event-title q-mb-xs">{{ card.title }}</div>
            <div class="row items-center event-meta q-mt-xs">
              <q-icon name="event" class="q-mr-sm event-meta__icon" />
              <span>{{ card.date }}</span>
            </div>
            <div class="row items-center event-meta q-mt-xs">
              <q-icon name="place" class="q-mr-sm event-meta__icon" />
              <span>{{ card.location }}</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEvents } from 'src/composables/useEvents'
import { normalizeString } from 'src/utils/eventMapper'

const router = useRouter()
const route = useRoute()
const items = ref([])

// Query param de busca
const searchQuery = computed(() => route.query.q || '')

// Composable para gerenciar eventos
const { fetchAllEvents } = useEvents()

// Eventos filtrados baseado na busca
const filteredItems = computed(() => {
  const query = searchQuery.value.trim()

  // Se não há busca, retorna todos
  if (!query) {
    return items.value
  }

  // Normaliza o termo de busca (remove acentos, lowercase)
  const normalizedQuery = normalizeString(query)

  // Filtra por título OU localização
  return items.value.filter((event) => {
    const title = normalizeString(event.title || '')
    const location = normalizeString(event.location || '')

    return title.includes(normalizedQuery) || location.includes(normalizedQuery)
  })
})

onMounted(loadAll)

// Recarrega eventos se a query mudar
watch(
  () => route.query.q,
  () => {
    // Se não há eventos carregados, carrega
    if (items.value.length === 0) {
      loadAll()
    }
  },
)

function goToEvent(card) {
  if (card?.link) {
    router.push(card.link)
  }
}

async function loadAll() {
  try {
    // Busca eventos com formato de data numérico
    items.value = await fetchAllEvents(120, {
      transformOptions: { dateFormat: 'numeric' },
    })
  } catch (e) {
    console.error('Falha ao carregar programação completa', e)
    items.value = []
  }
}

function clearSearch() {
  // Remove o query param e volta para programação completa
  router.push({ path: '/programacao' })
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

/* ==================== BUSCA ==================== */
.search-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.05);
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.search-result-text {
  display: flex;
  align-items: center;
  color: #e5e7eb;
  font-size: 1rem;
}

.result-count {
  font-weight: 700;
  color: #35c7ee;
  margin-right: 6px;
}

.search-term {
  color: #9ca3af;
  font-style: italic;
}

.clear-search-btn {
  font-weight: 600;
}

.clear-search-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Mensagem de nenhum resultado */
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

/* Cards com mesma formatação do carrossel */
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

/* Responsividade */
@media (max-width: 768px) {
  .list-wrap {
    padding: 0 40px 40px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
