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
        <div class="page-title">Programação completa</div>

        <!-- Linha divisória -->
        <div class="title-divider"></div>
      </div>

      <!-- Breadcrumbs -->
      <BreadcrumbNav :crumbs="breadcrumbItems" />

      <!-- Mensagem de busca -->
      <div v-if="searchQuery" class="search-info" role="status" aria-live="polite">
        <div class="search-result-text">
          <q-icon name="search" size="20px" class="q-mr-sm" aria-hidden="true" />
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
          aria-label="Limpar busca e mostrar todos os eventos"
          @click="clearSearch"
        />
      </div>

      <!-- Filtros ativos -->
      <div
        v-if="activeFilters.length > 0"
        class="active-filters"
        role="region"
        aria-label="Filtros ativos"
      >
        <div class="active-filters__header">
          <q-icon name="filter_list" size="18px" class="q-mr-sm" aria-hidden="true" />
          <span>Filtros ativos:</span>
        </div>
        <div class="active-filters__chips">
          <q-chip
            v-for="filter in activeFilters"
            :key="filter.id"
            removable
            :color="filter.color"
            text-color="white"
            :icon="filter.icon"
            :aria-label="`Remover filtro ${filter.name}`"
            @remove="removeFilter(filter.id)"
          >
            {{ filter.name }}
          </q-chip>
          <q-btn
            flat
            dense
            no-caps
            size="sm"
            label="Limpar tudo"
            color="grey-7"
            aria-label="Limpar todos os filtros"
            @click="clearAllFilters"
          />
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="cards-grid">
        <SkeletonLoader variant="list" :count="12" />
      </div>

      <!-- Mensagem de nenhum resultado -->
      <div v-else-if="filteredItems.length === 0" class="no-results" role="status">
        <q-icon name="search_off" size="64px" color="grey-6" aria-hidden="true" />
        <div class="no-results-title">Nenhum evento encontrado</div>
        <div class="no-results-text">
          {{
            searchQuery
              ? `Não encontramos eventos para "${searchQuery}"`
              : 'Não encontramos eventos com os filtros selecionados'
          }}
        </div>
        <q-btn
          color="primary"
          label="Ver todos os eventos"
          no-caps
          unelevated
          aria-label="Limpar filtros e ver todos os eventos"
          @click="clearAllFilters"
          class="q-mt-md"
        />
      </div>

      <!-- Grid de eventos -->
      <div v-else class="cards-grid" role="list" aria-label="Lista de eventos">
        <q-card
          v-for="card in filteredItems"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSupabaseEvents } from 'src/composables/useSupabaseEvents'
import { normalizeString } from 'src/utils/stringUtils'
import { CATEGORIES } from 'src/constants/config'
import SkeletonLoader from 'src/components/SkeletonLoader.vue'
import BreadcrumbNav from 'src/components/BreadcrumbNav.vue'

const router = useRouter()
const route = useRoute()
const items = ref([])
const loading = ref(true)

// Query params
const searchQuery = computed(() => route.query.q || '')
const categoryFilters = computed(() => {
  const cats = route.query.categories || ''
  return cats ? cats.split(',').filter(Boolean) : []
})

// Composable para gerenciar eventos do Supabase
const { fetchAllEvents } = useSupabaseEvents()

// Filtros ativos exibidos como chips
const activeFilters = computed(() => {
  return categoryFilters.value
    .map((catId) => {
      const category = CATEGORIES.find((c) => c.id === catId)
      return category
        ? {
            id: catId,
            name: category.name,
            icon: category.icon,
            color: category.color,
          }
        : null
    })
    .filter(Boolean)
})

// Breadcrumbs dinâmicos
const breadcrumbItems = computed(() => {
  const crumbs = [{ label: 'Início', to: '/', icon: 'home' }]

  if (searchQuery.value) {
    crumbs.push({
      label: `Busca: "${searchQuery.value}"`,
      to: null,
    })
  } else if (activeFilters.value.length > 0) {
    crumbs.push({
      label: `${activeFilters.value.length} filtro${activeFilters.value.length !== 1 ? 's' : ''} ativo${activeFilters.value.length !== 1 ? 's' : ''}`,
      to: null,
    })
  } else {
    crumbs.push({
      label: 'Todos os eventos',
      to: null,
    })
  }

  return crumbs
})

// Eventos filtrados
const filteredItems = computed(() => {
  let result = items.value

  // Filtro por busca (título ou localização)
  const query = searchQuery.value.trim()
  if (query) {
    const normalizedQuery = normalizeString(query)
    result = result.filter((event) => {
      const title = normalizeString(event.title || '')
      const location = normalizeString(event.location || '')
      return title.includes(normalizedQuery) || location.includes(normalizedQuery)
    })
  }

  // Filtro por categorias
  if (categoryFilters.value.length > 0) {
    result = result.filter((event) => {
      // Normaliza as tags do evento
      const eventTags = normalizeString(event.tags || '').toLowerCase()

      // Verifica se alguma categoria selecionada corresponde
      return categoryFilters.value.some((catId) => {
        const category = CATEGORIES.find((c) => c.id === catId)
        if (!category) return false

        // Verifica se alguma tag da categoria está nas tags do evento
        return category.tags.some((tag) => eventTags.includes(normalizeString(tag).toLowerCase()))
      })
    })
  }

  return result
})

onMounted(loadAll)

// Recarrega eventos se a query mudar
watch(
  () => route.query,
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
  loading.value = true
  try {
    // Busca eventos do Supabase
    items.value = await fetchAllEvents(120)
  } catch (e) {
    console.error('Falha ao carregar programação completa', e)
    items.value = []
  } finally {
    loading.value = false
  }
}

function clearSearch() {
  const query = { ...route.query }
  delete query.q
  router.push({ path: '/programacao', query })
}

function removeFilter(categoryId) {
  const current = categoryFilters.value.filter((id) => id !== categoryId)
  const query = { ...route.query }

  if (current.length > 0) {
    query.categories = current.join(',')
  } else {
    delete query.categories
  }

  router.push({ path: '/programacao', query })
}

function clearAllFilters() {
  router.push({ path: '/programacao' })
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

/* ==================== FILTROS ATIVOS ==================== */
.active-filters {
  background: rgba(53, 199, 238, 0.1);
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid rgba(53, 199, 238, 0.3);
}

.active-filters__header {
  display: flex;
  align-items: center;
  color: #35c7ee;
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.active-filters__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
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
  grid-template-columns: repeat(auto-fill, 400px);
  gap: 40px;
  justify-content: center;
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

/* Responsividade */
@media (max-width: 768px) {
  .list-wrap {
    padding: 0 16px 40px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

/* Mobile: ícones roxos conforme protótipo */
@media (max-width: 599px) {
  .event-meta__icon {
    color: #d907f2 !important;
  }

  .event-meta:first-of-type {
    color: #d907f2;
    font-weight: 600;
  }

  .event-meta:first-of-type span {
    color: #d907f2;
  }
}

/* ==================== ACESSIBILIDADE - FOCUS STATES ==================== */
.q-btn:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}

.event-card:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px #35c7ee;
}

.q-chip:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}

/* Remover estilos antigos do header */
.list-header {
  display: none; /* Esconder o header antigo */
}

.list-title {
  display: none; /* Esconder o título antigo */
}
</style>
