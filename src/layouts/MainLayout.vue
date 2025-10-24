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
            <!-- Container de filtros unificado -->
            <div
              class="filter-container"
              :class="{ 'filter-container--active': showCategories }"
              @click="toggleCategories"
              aria-label="Abrir filtros de eventos"
              role="button"
              tabindex="0"
              @keydown.enter="toggleCategories"
              @keydown.space="toggleCategories"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="filter-icon"
                aria-hidden="true"
              >
                <path
                  d="M5 11.0078H9.125C9.3453 11.8683 9.8457 12.6309 10.5473 13.1755C11.2489 13.7201 12.1118 14.0157 13 14.0157C13.8882 14.0157 14.7511 13.7201 15.4527 13.1755C16.1543 12.6309 16.6547 11.8683 16.875 11.0078H27C27.2652 11.0078 27.5196 10.9025 27.7071 10.715C27.8946 10.5274 28 10.2731 28 10.0078C28 9.74263 27.8946 9.48827 27.7071 9.30074C27.5196 9.1132 27.2652 9.00784 27 9.00784H16.875C16.6547 8.14743 16.1543 7.38481 15.4527 6.8402C14.7511 6.2956 13.8882 6 13 6C12.1118 6 11.2489 6.2956 10.5473 6.8402C9.8457 7.38481 9.3453 8.14743 9.125 9.00784H5C4.73478 9.00784 4.48043 9.1132 4.29289 9.30074C4.10536 9.48827 4 9.74263 4 10.0078C4 10.2731 4.10536 10.5274 4.29289 10.715C4.48043 10.9025 4.73478 11.0078 5 11.0078ZM13 8.00784C13.3956 8.00784 13.7822 8.12514 14.1111 8.3449C14.44 8.56467 14.6964 8.87702 14.8478 9.24248C14.9991 9.60793 15.0387 10.0101 14.9616 10.398C14.8844 10.786 14.6939 11.1424 14.4142 11.4221C14.1345 11.7018 13.7781 11.8922 13.3902 11.9694C13.0022 12.0466 12.6001 12.007 12.2346 11.8556C11.8692 11.7042 11.5568 11.4479 11.3371 11.119C11.1173 10.7901 11 10.4034 11 10.0078C11 9.47741 11.2107 8.9687 11.5858 8.59363C11.9609 8.21856 12.4696 8.00784 13 8.00784ZM27 21.0078H24.875C24.6547 20.1474 24.1543 19.3848 23.4527 18.8402C22.7511 18.2956 21.8882 18 21 18C20.1118 18 19.2489 18.2956 18.5473 18.8402C17.8457 19.3848 17.3453 20.1474 17.125 21.0078H5C4.73478 21.0078 4.48043 21.1132 4.29289 21.3007C4.10536 21.4883 4 21.7426 4 22.0078C4 22.2731 4.10536 22.5274 4.29289 22.715C4.48043 22.9025 4.73478 23.0078 5 23.0078H17.125C17.3453 23.8683 17.8457 24.6309 18.5473 25.1755C19.2489 25.7201 20.1118 26.0157 21 26.0157C21.8882 26.0157 22.7511 25.7201 23.4527 25.1755C24.1543 24.6309 24.6547 23.8683 24.875 23.0078H27C27.2652 23.0078 27.5196 22.9025 27.7071 22.715C27.8946 22.5274 28 22.2731 28 22.0078C28 21.7426 27.8946 21.4883 27.7071 21.3007C27.5196 21.1132 27.2652 21.0078 27 21.0078ZM21 24.0078C20.6044 24.0078 20.2178 23.8905 19.8889 23.6708C19.56 23.451 19.3036 23.1387 19.1522 22.7732C19.0009 22.4078 18.9613 22.0056 19.0384 21.6177C19.1156 21.2297 19.3061 20.8733 19.5858 20.5936C19.8655 20.3139 20.2219 20.1234 20.6098 20.0463C20.9978 19.9691 21.3999 20.0087 21.7654 20.1601C22.1308 20.3115 22.4432 20.5678 22.6629 20.8967C22.8827 21.2256 23 21.6123 23 22.0078C23 22.5383 22.7893 23.047 22.4142 23.4221C22.0391 23.7971 21.5304 24.0078 21 24.0078Z"
                  fill="white"
                />
              </svg>
              <span class="filter-text">Filtros</span>
            </div>
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

/* espaço entre elementos da header */
.header-inner .gt-sm {
  column-gap: 26px;
}

/* ==================== CONTAINER DE FILTROS UNIFICADO ==================== */
.filter-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.filter-container--active {
  background-color: transparent;
}

.filter-container--active .filter-icon path,
.filter-container--active .filter-text {
  color: #35c7ee !important;
  fill: #35c7ee !important;
}

.filter-container:hover .filter-icon path,
.filter-container:hover .filter-text {
  color: #35c7ee !important;
  fill: #35c7ee !important;
}

.filter-text {
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.filter-icon {
  transition: fill 0.3s ease;
}

.filter-icon path {
  transition: fill 0.3s ease;
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
