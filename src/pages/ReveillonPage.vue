<template>
  <q-page class="bg-landing">
    <div class="list-wrap">
      <!-- Header com título centralizado -->
      <div class="page-header">
        <div class="back-button-container" @click="goBack">
          <div class="back-icon">
            <q-icon name="arrow_back" size="24px" class="back-arrow-icon" />
          </div>
          <span class="back-text">Voltar</span>
        </div>

        <!-- Título centralizado -->
        <div class="page-title">Réveillon</div>

        <!-- Linha divisória -->
        <div class="title-divider"></div>
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

const router = useRouter()
const items = ref([])
const loading = ref(true)

// Composable para gerenciar eventos do Supabase
const { fetchEventsByTag } = useSupabaseEvents()

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
    // Busca eventos com a tag "reveillon" (case-insensitive no Supabase)
    items.value = await fetchEventsByTag('reveillon', { limit: 50 })
  } catch (e) {
    console.error('Falha ao carregar eventos de Réveillon', e)
    items.value = []
  } finally {
    loading.value = false
  }
}

// Adicionar esta função
function goBack() {
  router.push('/')
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

/* Novo header da página */
.page-header {
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* Título da página */
.page-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600; /* semibold */
  font-size: 32px;
  color: #fff;
  text-align: center;
}

/* Linha divisória */
.title-divider {
  width: 100%;
  max-width: 1440px;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 0 auto;
}

/* Botão de voltar customizado */
.back-button-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  align-self: flex-start; /* Posiciona à esquerda */
}

.back-button-container:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.back-icon {
  width: 56px;
  height: 56px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.back-text {
  color: white;
  font-weight: 600;
  font-size: 16px;
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    sans-serif;
}

.back-button-container:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 4px;
  border-radius: 8px;
}

.back-arrow-icon {
  color: #35c7ee !important;
}

.back-arrow-icon .q-icon {
  color: #35c7ee !important;
}

.back-icon .q-icon {
  color: #35c7ee !important;
}

.back-icon svg {
  width: 24px;
  height: 24px;
}

/* Esconder elementos antigos */
.list-header {
  display: none;
}

.list-title {
  display: none;
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
  grid-template-columns: repeat(auto-fill, 320px);
  gap: 40px;
  justify-content: center;
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

/* Adicionar estes estilos do botão customizado */
.back-button-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.back-button-container:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.back-icon {
  width: 56px;
  height: 56px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.back-text {
  color: white;
  font-weight: 600;
  font-size: 16px;
  font-family:
    'Poppins',
    system-ui,
    -apple-system,
    sans-serif;
}

.back-button-container:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 4px;
  border-radius: 8px;
}

.back-arrow-icon {
  color: #35c7ee !important;
}

.back-arrow-icon .q-icon {
  color: #35c7ee !important;
}

.back-icon .q-icon {
  color: #35c7ee !important;
}

.back-icon svg {
  width: 24px;
  height: 24px;
}
</style>
