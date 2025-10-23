<template>
  <q-layout view="hHh lpR fFf">
    <!-- HEADER -->
    <q-header elevated class="bg-dark-header text-white">
      <q-toolbar class="custom-toolbar">
        <div class="header-inner">
          <!-- LOGO -->
          <div class="row items-center">
            <img
              src="/logo.svg"
              alt="TicketPE - Eventos em Pernambuco"
              style="width: 220px"
              class="q-mr-sm"
            />
          </div>

          <!-- MENU DESKTOP -->
          <div class="row items-center gt-sm">
            <q-btn
              flat
              no-caps
              label="Filtros"
              class="text-white text-weight-bold filter-btn"
              :class="{ 'filter-btn--active': showCategories }"
              aria-label="Abrir filtros de eventos"
              @click="toggleCategories"
            >
              <template #prepend>
                <q-icon
                  name="img:/public/sliders-horizontal 2.svg"
                  size="20px"
                  class="text-white"
                  aria-hidden="true"
                />
              </template>
            </q-btn>
            <q-input
              class="search-pill q-my-xs"
              filled
              square-rounded
              bg-color="white"
              placeholder="Pesquisar eventos"
              v-model="search"
              aria-label="Campo de busca de eventos"
              role="searchbox"
            >
              <template #append>
                <q-icon name="search" aria-hidden="true" />
              </template>
            </q-input>
          </div>

          <!-- MENU MOBILE -->
          <q-btn
            class="lt-md"
            flat
            round
            dense
            icon="menu"
            aria-label="Abrir menu de navegação"
            @click="drawer = true"
          />
        </div>
      </q-toolbar>

      <!-- CATEGORIAS EXPANSÍVEIS -->
      <div class="categories-drawer" :class="{ 'categories-drawer--open': showCategories }">
        <div class="categories-content">
          <div class="categories-grid">
            <q-btn
              v-for="category in categories"
              :key="category.label"
              outline
              square-rounded
              no-caps
              class="category-btn"
              :class="{ 'category-btn--active': selectedCategory === category.label }"
              color="white"
              text-color="white"
              :icon="category.icon"
              :label="category.label"
              :aria-label="`Filtrar eventos de ${category.label}`"
              @click="selectCategory(category.label)"
            />
            <q-btn
              flat
              round
              dense
              icon="add"
              class="add-category-btn"
              color="white"
              aria-label="Adicionar mais categorias"
            />
          </div>
        </div>
      </div>
    </q-header>

    <!-- DRAWER MOBILE -->
    <q-drawer v-model="drawer" side="right" overlay>
      <q-list>
        <q-item clickable>
          <q-item-section>Blog</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- DRAWER DE FILTROS -->
    <q-drawer v-model="filterDrawer" side="right" overlay :width="400" class="filter-drawer">
      <div class="filter-drawer-content">
        <!-- Cabeçalho -->
        <div class="filter-drawer-header">
          <div class="filter-drawer-title">
            <q-icon name="tune" size="28px" color="primary" aria-hidden="true" />
            <span>Filtros</span>
          </div>
          <q-btn
            flat
            round
            dense
            icon="close"
            aria-label="Fechar filtros"
            @click="filterDrawer = false"
          />
        </div>

        <q-separator />

        <!-- Conteúdo dos filtros -->
        <div class="filter-drawer-body">
          <!-- Filtro de Categorias -->
          <CategoryFilter v-model="filters.categories" />

          <q-separator class="q-my-md" />

          <!-- Filtro de Data (Futuro) -->
          <div class="filter-section">
            <div class="filter-header">
              <q-icon name="event" size="20px" class="filter-header__icon" />
              <span class="filter-header__title">Data</span>
            </div>
            <div class="coming-soon">Em breve</div>
          </div>

          <q-separator class="q-my-md" />

          <!-- Filtro de Localização (Futuro) -->
          <div class="filter-section">
            <div class="filter-header">
              <q-icon name="place" size="20px" class="filter-header__icon" />
              <span class="filter-header__title">Localização</span>
            </div>
            <div class="coming-soon">Em breve</div>
          </div>
        </div>

        <!-- Footer com ações -->
        <div class="filter-drawer-footer">
          <q-btn
            flat
            no-caps
            label="Limpar tudo"
            color="grey-7"
            class="full-width q-mb-sm"
            aria-label="Limpar todos os filtros"
            @click="clearAllFilters"
          />
          <q-btn
            unelevated
            no-caps
            label="Aplicar filtros"
            color="primary"
            class="full-width"
            aria-label="Aplicar filtros selecionados"
            @click="applyFilters"
          />
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <div class="main-container">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CategoryFilter from 'src/components/CategoryFilter.vue'
import { useQuasar } from 'quasar'

const router = useRouter()
const route = useRoute()
const search = ref('')
const drawer = ref(false)
const filterDrawer = ref(false)
const $q = useQuasar()

// Estado das categorias expansíveis
const showCategories = ref(false)
const selectedCategory = ref(null)

// Categorias disponíveis
const categories = ref([
  { label: 'Carnaval', icon: 'celebration' },
  { label: 'Festivais', icon: 'park' },
  { label: 'Semana Santa', icon: 'holiday_village' },
  { label: 'Ano Novo', icon: 'auto_awesome' },
  { label: 'Boate', icon: 'nightlife' },
  { label: 'Calourada', icon: 'school' },
])

// Estado dos filtros
const filters = ref({
  categories: [],
  // Futuros filtros:
  // dateRange: null,
  // location: '',
})

// Debounce timer
let debounceTimer = null

// Função para alternar a exibição das categorias
function toggleCategories() {
  showCategories.value = !showCategories.value
}

// Função para selecionar uma categoria
function selectCategory(categoryLabel) {
  if (selectedCategory.value === categoryLabel) {
    // Se já está selecionada, deseleciona
    selectedCategory.value = null
  } else {
    // Seleciona nova categoria
    selectedCategory.value = categoryLabel
  }

  // Emite evento para a página atual
  window.dispatchEvent(
    new CustomEvent('categorySelected', {
      detail: { category: selectedCategory.value },
    }),
  )
}

// Provide para comunicação com páginas filhas
provide('selectedCategory', selectedCategory)
provide('selectCategory', selectCategory)

// Watch no campo de busca com debounce de 300ms
watch(search, (newValue) => {
  // Limpa o timer anterior
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // Se o campo estiver vazio, não faz nada
  if (!newValue || newValue.trim() === '') {
    return
  }

  // Cria novo timer de 300ms
  debounceTimer = setTimeout(() => {
    // Redireciona para a página de programação com query param
    router.push({
      path: '/programacao',
      query: {
        ...route.query,
        q: newValue.trim(),
      },
    })
  }, 300)
})

// Funções de filtro
function clearAllFilters() {
  const hadFilter = filters.value.categories.length > 0

  filters.value.categories = []

  if (hadFilter) {
    $q.notify({
      type: 'info',
      message: 'Todos os filtros foram removidos',
      position: 'top',
      timeout: 2000,
      icon: 'clear_all',
    })
  }
}

function applyFilters() {
  const query = { ...route.query }
  let activeFiltersCount = 0

  // Conta filtros ativos
  if (filters.value.categories.length > 0) {
    query.categories = filters.value.categories.join(',')
    activeFiltersCount += filters.value.categories.length
  } else {
    delete query.categories
  }

  router.push({
    path: '/programacao',
    query,
  })

  filterDrawer.value = false

  if (activeFiltersCount > 0) {
    $q.notify({
      type: 'positive',
      message: `${activeFiltersCount} ${activeFiltersCount === 1 ? 'filtro aplicado' : 'filtros aplicados'}`,
      position: 'top',
      timeout: 2000,
      icon: 'filter_alt',
    })
  } else {
    $q.notify({
      type: 'info',
      message: 'Mostrando todos os eventos',
      position: 'top',
      timeout: 2000,
    })
  }
}
</script>

<style>
.bg-dark-header {
  background-color: #161f2f !important;
}

/* HEADER: altura total = 26(top) + 48(input) + 26(bottom) = 100px */
.custom-toolbar {
  min-height: 48px;
  padding: 0;
}

/* container central com margens laterais responsivas */
.header-inner {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (min-width: 1600px) {
  .header-inner {
    max-width: 1600px;
  }
}

@media (min-width: 1920px) {
  .header-inner {
    max-width: 1800px;
  }
}

/* espaço entre Blog e o input */
.header-inner .gt-sm {
  column-gap: 26px;
}

/* input "pill" = 440px largura x 48px altura */
.search-pill {
  width: 440px;
  height: 48px;
}
.search-pill .q-field__control {
  border-radius: 8px !important;
  min-height: 48px;
}
.search-pill .q-field__native {
  padding: 10px 14px;
}
.search-pill input {
  color: #1f2937;
}
.search-pill ::placeholder {
  color: #6b7280;
}
.search-pill .q-field__append .q-icon {
  color: #64748b;
}

/* Estilo personalizado para o botão Filtros */
.filter-btn {
  transition: all 0.3s ease;
}

.filter-btn--active {
  background-color: transparent !important;
  color: #35c7ee !important;
}
.filter-btn--active .q-btn__content {
  color: #35c7ee !important;
}

.filter-btn .q-btn__content {
  font-family: 'Poppins', sans-serif !important;
  font-size: 16px !important;
  font-weight: 600 !important;
}
.filter-btn .q-btn__prepend {
  margin-right: 8px;
}

.filter-btn--active .q-icon {
  color: #35c7ee !important;
}
/* ==================== CATEGORIAS EXPANSÍVEIS ==================== */
.categories-drawer {
  background-color: #161f2f;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease-out;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.categories-drawer--open {
  max-height: 200px; /* Altura suficiente para as categorias */
}

.categories-content {
  padding: 20px 0;
}

.categories-grid {
  width: calc(100vw - 160px);
  max-width: 1760px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.category-btn {
  border-radius: 12px !important;
  height: 52px;
  min-width: 180px;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.category-btn:hover {
  background: #35c7ee !important;
  border-color: #35c7ee !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(53, 199, 238, 0.3);
}

.category-btn--active {
  background: linear-gradient(90deg, #008ec1 0%, #35c7ee 100%) !important;
  border-color: transparent !important;
  color: white !important;
}

.category-btn .q-btn__content {
  font-weight: 700;
  letter-spacing: 0.3px;
  color: white !important;
}

.category-btn .q-icon {
  margin-right: 8px;
  font-size: 20px;
}

.add-category-btn {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.add-category-btn:hover {
  background: linear-gradient(90deg, #008ec1 0%, #35c7ee 100%) !important;

  border-color: #35c7ee !important;
}

/* Responsividade para mobile */
@media (max-width: 768px) {
  .categories-grid {
    width: calc(100vw - 80px);
    padding: 0 40px;
    gap: 8px;
  }

  .category-btn {
    min-width: 140px;
    height: 48px;
    font-size: 14px;
  }

  .add-category-btn {
    width: 48px;
    height: 48px;
  }
}

/* fundo das áreas */
.q-page-container {
  background-color: #2a3447;
}
.q-drawer {
  background-color: #2a3447;
}

/* ==================== DRAWER DE FILTROS ==================== */
.filter-drawer {
  background-color: #ffffff !important;
}

.filter-drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.filter-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
}

.filter-drawer-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.filter-drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.filter-drawer-footer {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.filter-section {
  padding: 16px 0;
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding: 0 4px;
}

.filter-header__icon {
  color: #35c7ee;
}

.filter-header__title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.coming-soon {
  padding: 32px 20px;
  text-align: center;
  color: #9ca3af;
  font-style: italic;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px dashed #d1d5db;
}

/* ==================== PREVENÇÃO DE SCROLL HORIZONTAL ==================== */
html,
body {
  overflow-x: hidden;
  max-width: 100vw;
}

.q-layout {
  overflow-x: hidden;
}

/* ==================== CONTAINER RESPONSIVO ==================== */
.main-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (min-width: 1600px) {
  .main-container {
    max-width: 1600px;
    padding: 0 40px;
  }
}

@media (min-width: 1920px) {
  .main-container {
    max-width: 1800px;
    padding: 0 60px;
  }
}

/* ==================== ACESSIBILIDADE - FOCUS STATES ==================== */
.q-btn:focus-visible,
.q-btn:focus {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}

.q-input:focus-within .q-field__control {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}

.q-chip:focus-visible {
  outline: 2px solid #35c7ee;
  outline-offset: 2px;
}
</style>
